package acc.pc.lob.gp.rating
uses gw.financials.PolicyPeriodFXRateCache
uses gw.api.effdate.EffDatedUtil
uses gw.pl.persistence.core.effdate.EffDatedVersionList
uses entity.windowed.GPGeneric_ExtVersionList
uses entity.windowed.GPGenericCovCost_ExtVersionList

class GPGenericCovCostData extends GPCostData<GPGenericCovCost_Ext> {
  var _coverageID : Key
  var _coveredItemID : Key

  construct(effDate : DateTime, expDate : DateTime, c : Currency, rateCache : PolicyPeriodFXRateCache, coverageID : Key, coveredItemID : Key) {
    super(effDate, expDate, c, rateCache)
    init(coverageID, coveredItemID)
  }

  construct(effDate : DateTime, expDate : DateTime, coverageID : Key, coveredItemID : Key) {
    super(effDate, expDate)
    init(coverageID, coveredItemID)
  }

  private function init(coverageID : Key, coveredItemID : Key) {
    assertKeyType(coverageID, GPGenericCov_Ext)
    assertKeyType(coveredItemID, GPGeneric_Ext)
    _coverageID = coverageID
    _coveredItemID = coveredItemID
  }

  construct(cost : GPGenericCovCost_Ext) {
    super(cost)
    _coverageID = cost.Coverage.FixedId
    _coveredItemID = cost.GPGeneric.FixedId
  }

  construct(cost : GPGenericCovCost_Ext, rateCache : PolicyPeriodFXRateCache) {
    super(cost, rateCache)
    _coverageID = cost.Coverage.FixedId
    _coveredItemID = cost.GPGeneric.FixedId
  }

  override function setSpecificFieldsOnCost(line : GPGenericLine_Ext, costEntity: GPGenericCovCost_Ext ) : void {
    super.setSpecificFieldsOnCost(line, costEntity)
    costEntity.setFieldValue("GPGenericCov", _coverageID)
    costEntity.setFieldValue("GPGeneric", _coveredItemID)
  }

  override function getVersionedCosts(line : GPGenericLine_Ext) : List<EffDatedVersionList> {
    var coveredItemVL = EffDatedUtil.createVersionList( line.Branch, _coveredItemID ) as GPGeneric_ExtVersionList
    return coveredItemVL.GPGenericCovCosts.where( \ costVL -> isCostVersionListForThisCostData(costVL) ) 
  }

  private function isCostVersionListForThisCostData(costVL : GPGenericCovCost_ExtVersionList) : boolean {
    var v1 = costVL.AllVersions.first()
    return (v1.GPGenericCov.FixedId == _coverageID) 
  }

  override function toString() : String {
    return "Coverage: ${_coverageID} Covered Item: ${_coveredItemID} "
  }

  protected override property get KeyValues() : List<Object> {
    var result : List<Object> = {_coveredItemID, _coverageID}
    result.addAll(super.KeyValues)
    return result
  }
  
}
