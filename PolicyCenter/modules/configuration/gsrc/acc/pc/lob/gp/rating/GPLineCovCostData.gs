package acc.pc.lob.gp.rating
uses gw.financials.PolicyPeriodFXRateCache
uses gw.api.effdate.EffDatedUtil
uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses entity.windowed.GPGenericLineCov_ExtVersionList
uses entity.windowed.GPLineCovCost_ExtVersionList

class GPLineCovCostData extends GPCostData<GPLineCovCost_Ext> {
  var _coverageID : Key

  construct(effDate : DateTime, expDate : DateTime, c : Currency, rateCache : PolicyPeriodFXRateCache, coverageID : Key) {
    super(effDate, expDate, c, rateCache)
    init(coverageID)
  }

  construct(effDate : DateTime, expDate : DateTime, coverageID : Key) {
    super(effDate, expDate)
    init(coverageID)
  }

  private function init(coverageID : Key) {
    assertKeyType(coverageID, GPGenericLineCov_Ext)
    _coverageID = coverageID
  }

  construct(cost : GPLineCovCost_Ext) {
    super(cost)
    _coverageID = cost.Coverage.FixedId
  }

  construct(cost : GPLineCovCost_Ext, rateCache : PolicyPeriodFXRateCache) {
    super(cost, rateCache)
    _coverageID = cost.Coverage.FixedId
  }

  override function setSpecificFieldsOnCost(line : GPGenericLine_Ext, costEntity: GPLineCovCost_Ext ) : void {
    super.setSpecificFieldsOnCost(line, costEntity)
    costEntity.setFieldValue("GPGenericLineCov", _coverageID)
  }

  override function getVersionedCosts(line : GPGenericLine_Ext) : List<EffDatedVersionList> {
    var coverageVL = EffDatedUtil.createVersionList( line.Branch, _coverageID ) as GPGenericLineCov_ExtVersionList
    return coverageVL.GPLineCovCosts.where( \ costVL -> isCostVersionListForThisCostData(costVL) ) 
  }

  private function isCostVersionListForThisCostData(costVL : GPLineCovCost_ExtVersionList) : boolean {
    var v1 = costVL.AllVersions.first()
    return (true)  
    // If matching logic is more complex, you can add that here.
  }

  override function toString() : String {
    return "Coverage: ${_coverageID}"
  }

  protected override property get KeyValues() : List<Object> {
    var result : List<Object> = {_coverageID}
    result.addAll(super.KeyValues)
    return result
  }
}
