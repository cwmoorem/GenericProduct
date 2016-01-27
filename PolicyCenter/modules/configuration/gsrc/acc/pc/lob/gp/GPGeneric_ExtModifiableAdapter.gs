package acc.pc.lob.gp
uses gw.api.domain.ModifiableAdapter
uses java.util.Date
uses gw.api.util.JurisdictionMappingUtil

@Export
class GPGeneric_ExtModifiableAdapter implements ModifiableAdapter {
  var _owner : GPGeneric_Ext
  
  construct(owner : GPGeneric_Ext) {
    _owner = owner
  }

  override property get AllModifiers() : Modifier[] {
    return _owner.GPGenericMod_Exts
  }

  override property get PolicyLine() : PolicyLine {
    return _owner.GPLine
  }

  override property get PolicyPeriod() : PolicyPeriod {
    return _owner.Branch
  }

  override property get State() : Jurisdiction{
    return _owner.GPLine.Branch.BaseState
  }

  override function addToModifiers(p0 : Modifier) {
    _owner.addToGPGenericMod_Exts(p0 as GPGenericMod_Ext)
  }

  override function removeFromModifiers(p0 : Modifier) {
    _owner.removeFromGPGenericMod_Exts(p0 as GPGenericMod_Ext)
  }

  override function createRawModifier() : Modifier {
    return new GPGenericMod_Ext(_owner.Branch)
  }

  override function postUpdateModifiers() {
  }

  override property get ReferenceDateInternal() : Date {
    return _owner.ReferenceDateInternal
  }

  override property set ReferenceDateInternal(date : Date) {
    _owner.ReferenceDateInternal = date
  }
}
