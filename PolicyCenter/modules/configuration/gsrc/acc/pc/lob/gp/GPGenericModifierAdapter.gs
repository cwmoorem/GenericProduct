package acc.pc.lob.gp
uses gw.api.domain.ModifierAdapter

@Export
class GPGenericModifierAdapter implements ModifierAdapter {
  var _owner : GPGenericMod_Ext
  construct(owner : GPGenericMod_Ext) {
    _owner = owner
  }

  override property get OwningModifiable() : Modifiable {
    return _owner.GPGeneric
  }

  override property get RateFactors() : RateFactor[] {
    return _owner.GPGenericRateFactors
  }

  override function addToRateFactors(p0 : RateFactor) {
    _owner.addToGPGenericRateFactors(p0 as GPGenericRF_Ext)
  }

  override function createRawRateFactor() : RateFactor {
    return new GPGenericRF_Ext(_owner.Branch)
  }

  override function removeFromRateFactors(p0 : RateFactor) {
    _owner.removeFromGPGenericRateFactors(p0 as GPGenericRF_Ext)
  }

}
