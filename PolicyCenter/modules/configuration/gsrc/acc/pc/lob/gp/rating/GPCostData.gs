package acc.pc.lob.gp.rating
uses gw.rating.CostDataWithOverrideSupport
uses gw.financials.PolicyPeriodFXRateCache
uses java.util.Date

abstract class GPCostData<R extends GPCost_Ext> extends CostDataWithOverrideSupport<R, GPGenericLine_Ext> {
  
  construct(effDate : Date, expDate : Date) {
    super(effDate, expDate)
  }

  construct(effDate : DateTime, expDate : DateTime, c : Currency, rateCache : PolicyPeriodFXRateCache) {
    super(effDate, expDate, c, rateCache)
  }

  construct(c : R) {
    super(c)  
  }
  
  construct(cost : R, rateCache : PolicyPeriodFXRateCache) {
    super(cost, rateCache)
  }

  override function setSpecificFieldsOnCost(line : GPGenericLine_Ext, cost : R) {
    cost.setFieldValue("GPGenericLine_Ext", line.FixedId)
  }

  protected override property get KeyValues() : List<Object> {
    return { }  // Return an empty list
  }

}
