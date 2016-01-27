package acc.pc.lob.gp
uses gw.api.domain.ModifiableAdapter
uses java.util.Date
uses gw.api.util.JurisdictionMappingUtil

@Export
class GPGenericLine_ExtModifiableAdapter implements ModifiableAdapter {
  var _owner : GPGenericLine_Ext
  
  construct(owner : GPGenericLine_Ext) {
    _owner = owner
  }

  override property get AllModifiers() : Modifier[] {
    return _owner.GPLineModifiers
  }

  override property get PolicyLine() : PolicyLine {
    return _owner
  }

  override property get PolicyPeriod() : PolicyPeriod {
    return _owner.Branch
  }

  override property get State() : Jurisdiction{
    return _owner.Branch.BaseState
  }

  override function addToModifiers(p0 : Modifier) {
    _owner.addToGPLineModifiers(p0 as GPLineMod_Ext)
  }

  override function removeFromModifiers(p0 : Modifier) {
    _owner.removeFromGPLineModifiers(p0 as GPLineMod_Ext)
  }

  override function createRawModifier() : Modifier {
    return new GPLineMod_Ext(_owner.Branch)
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
