package acc.pc.lob.gp
uses gw.api.domain.RateFactorAdapter

@Export
class GPLineRateFactorAdapter implements RateFactorAdapter
{
  var _owner : GPLineRF_Ext
  
  construct(rateFactor : GPLineRF_Ext) {
    _owner = rateFactor
  }

  override property get Modifier() : Modifier {
    return _owner.GPLineModifier
  }
}
