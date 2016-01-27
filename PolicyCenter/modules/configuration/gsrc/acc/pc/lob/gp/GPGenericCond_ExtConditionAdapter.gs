package acc.pc.lob.gp
uses gw.coverage.ConditionAdapterBase
uses gw.api.util.JurisdictionMappingUtil

@Export
class GPGenericCond_ExtConditionAdapter extends ConditionAdapterBase
{
  var _owner : GPGenericCond_Ext  
  
  construct(owner : GPGenericCond_Ext)
  {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction
  {
    return(_owner.GPGeneric.GPLine.Branch.BaseState)
  }

  override property get PolicyLine() : PolicyLine
  {
    return(_owner.GPGeneric.GPLine)
  }

  override property get OwningCoverable() : Coverable
  {
    return(_owner.GPGeneric)
  }

  override function addToConditionArray( p0: PolicyCondition ) : void
  {
    _owner.GPGeneric.addToConditions( p0 as GPGenericCond_Ext )
  }

  override function removeFromParent() : void
  {
    _owner.GPGeneric.removeFromConditions( _owner )
  }

}
