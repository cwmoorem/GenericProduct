package acc.pc.lob.gp
uses gw.api.domain.ModifierAdapter

@Export
class GPLineModifierAdapter implements ModifierAdapter {
  var _owner : GPLineMod_Ext
  construct(owner : GPLineMod_Ext) {
    _owner = owner
  }

  override property get OwningModifiable() : Modifiable {
    return _owner.GPGenericLine_Ext
  }

  override property get RateFactors() : RateFactor[] {
    return _owner.GPLineRateFactors
  }

  override function addToRateFactors(p0 : RateFactor) {
    _owner.addToGPLineRateFactors(p0 as GPLineRF_Ext)
  }

  override function createRawRateFactor() : RateFactor {
    return new GPLineRF_Ext(_owner.Branch)
  }

  override function removeFromRateFactors(p0 : RateFactor) {
    _owner.removeFromGPLineRateFactors(p0 as GPLineRF_Ext)
  }

}
