package acc.pc.lob.gp.rating
uses gw.rating.CostData
uses gw.rating.AbstractRatingEngine
uses gw.rating.RateFlowLogger
uses java.util.Date
uses java.math.BigDecimal
uses gw.job.RenewalProcess
uses java.lang.Iterable
uses java.math.RoundingMode
uses java.lang.IllegalArgumentException
uses java.util.Map
uses java.lang.Exception

class GPRatingEngine extends AbstractRatingEngine<GPGenericLine_Ext> {

  static var _rfLogger = RateFlowLogger.Logger
  var _minimumRatingLevel  : RateBookStatus
  var _baseRatingDate      : Date
  var _uwCompanyRateFactor : BigDecimal
  var _jurisdiction        : Jurisdiction
  var _renewal             : boolean
  var _linePatternCode     : String
  var _offeringCode        : String
  var _rateBook            : RateBook          as readonly RateBook

  construct(line : GPGenericLine_Ext) {
    this(line, RateBookStatus.TC_DRAFT)
  }

  construct(line : GPGenericLine_Ext, minimumRatingLevel : RateBookStatus) {
    super(line)
    _jurisdiction = line.Branch.BaseState
    _baseRatingDate = line.Branch.RateAsOfDate
    _uwCompanyRateFactor = line.Branch.getUWCompanyRateFactor(_baseRatingDate, _jurisdiction)
    _minimumRatingLevel = minimumRatingLevel
    _renewal = line.Branch.JobProcess typeis RenewalProcess
    _linePatternCode = line.PatternCode
    var offering = line.Branch.Offering
    if (offering!=null) {
      _offeringCode = offering.PublicID
    }
    // Get the ratebook only once; personal lines are rated with the same
    // ratebook throughout the policy term
    _rateBook = getRateBook(line.Branch.PeriodStart, line.Branch.Policy.GenericProduct)
  }
  
  override protected function rateSlice(lineVersion : GPGenericLine_Ext) {
    assertSliceMode(lineVersion)  

    if (lineVersion.Branch.isCanceledSlice()) {
       // Do nothing if this is a canceled slice  
    } else {
      var sliceStart = lineVersion.SliceDate
      var sliceEnd = getNextSliceDateAfter(sliceStart)
      for(generic in lineVersion.GPGenerics){
        generic.Coverages.each( \ elt -> {
          rateGenericCoverage(elt)
        })
      }

        /***********
        * 
        * Rating logic for rating 1 slice of the line goes here
        *
        ***********/ 

    }

  }

  /****** 
    This default version of this method will not create any costs for the entire period.  Instead, it assumes that all costs are created
    as part of calculating the pro rata premium for each slice of effective time.  If a policy does need to create Costs for the entire 
    period (such as a cancellation short rate penalty or a non-linear premium discount), then this method should be overridden to implement 
    that logic. 
  ******/
  override protected function rateWindow(line : GPGenericLine_Ext) {
  }

  // Used by the extractCostDatasFromExistingCosts method.  Must be implemented if that method is going to be called
  override protected function createCostDataForCost(c : Cost) : CostData {
    var cd : CostData
    
    switch(typeof c) {
      // Each Cost subtype should be listed here, creating a corresponding CostData subtype.  For example...
      // case XXXCost:  
      //   cd = new PSL3LocThingCovCostData(c, RateCache)
      //   break
      case GPLineCovCost_Ext:
        cd = new GPLineCovCostData(c, RateCache)
        break
      case GPGenericCovCost_Ext:
        cd = new GPGenericCovCostData(c, RateCache)
        break

      default: throw "Unexpected cost type ${c.DisplayName}"
    }
    return cd
  } 

  /****** 
    This default version of this method will return all of the Costs on a policy for the slice's effective date.  If some of the 
    costs on a policy are created as part of the "rate window" portion of the rating algorithm (that is, they are created at the
    end for the entire period rather than created as part of rating each slice in time), then these costs should be excluded 
    from what is returned by this method.  Override this method to return only the types of costs that would be created during the 
    rateSlice portion of the algorithm in that case.
  ******/
  override protected function existingSliceModeCosts() : Iterable<Cost> {
    return PolicyLine.Costs  
  }

  protected property get RoundingLevel() : int {
    return PolicyLine.Branch.Policy.Product.QuoteRoundingLevel
  }

  protected property get RoundingMode() : RoundingMode {
    return PolicyLine.Branch.Policy.Product.QuoteRoundingMode
  }

  private function getRateBook( refDate : Date , inGenericProduct : GenericProduct_Ext) : RateBook {
    var rateBook : RateBook
    try{
      rateBook = RateBook.selectRateBook( refDate, _baseRatingDate, _linePatternCode, _jurisdiction, _minimumRatingLevel, _renewal, _offeringCode, null, inGenericProduct.ProductCode  )
    } catch (e : Exception){

    }
    return rateBook
  }

  private function rateGenericCoverage(cov: GPGenericCov_Ext) {
    assertSliceMode(cov)
    if (cov == null) {
      throw new IllegalArgumentException("Failed to rate.  Coverage was null")
    }

    var start = cov.SliceDate
    var end = getNextSliceDateAfter(start)
    var data = new GPGenericCovCostData(start, end, cov.Currency, RateCache, cov.FixedId, cov.GPGeneric.FixedId)
    data.init(cov.GPGeneric.GPLine)
    data.RateBook = RateBook
    data.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
    data.Basis = 1

    var params = new GPRatingParam(cov)

    var rateRoutineParameterMap : Map<CalcRoutineParamName, Object> =
        {TC_GENERICPRODUCTPARAMETER         -> params,
         TC_POLICYLINE                      -> PolicyLine}

    //
    // If we have a rate routine name then try and execute that rate routine otherwise
    // we will assume a zero cost
    //
    if(params.coverageMapping.RateRoutine != null){
      RateBook.executeCalcRoutine(params.coverageMapping.RateRoutine, data, data, rateRoutineParameterMap)
    } else {
      data.StandardBaseRate = 0
      data.StandardAdjRate = 0
      data.StandardTermAmount = 0
    }

    if (_rfLogger.DebugEnabled) {
      _rfLogger.debug("Rate Generic Coverage")
      _rfLogger.debug("   Standard Base Rate:     ${data.StandardBaseRate}")
      _rfLogger.debug("   Standard Adjusted Rate: ${data.StandardAdjRate}")
      _rfLogger.debug("   Standard Term Amount:   ${data.StandardTermAmount}")
    }

    data.copyStandardColumnsToActualColumns()
    if (data.OverrideTermAmount != null and data.OverrideTermAmount != data.StandardTermAmount) {
      data.ActualTermAmount = data.OverrideTermAmount
    } else {
      data.OverrideTermAmount = null
      data.OverrideReason = null
      data.OverrideSource = TC_MANUAL
      // not allowed to be null
    }

    // call addCost() to add the new cost to the collection
    addCost(data)
  }

}
