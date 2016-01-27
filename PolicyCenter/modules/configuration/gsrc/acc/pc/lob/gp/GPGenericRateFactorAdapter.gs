package acc.pc.lob.gp
uses gw.api.domain.RateFactorAdapter

@Export
class GPGenericRateFactorAdapter implements RateFactorAdapter
{
  var _owner : GPGenericRF_Ext
  
  construct(rateFactor : GPGenericRF_Ext) {
    _owner = rateFactor
  }

  override property get Modifier() : Modifier {
    return _owner.GPGenericModifier
  }
}
