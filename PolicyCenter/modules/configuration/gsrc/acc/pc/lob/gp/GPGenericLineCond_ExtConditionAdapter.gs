package acc.pc.lob.gp
uses gw.coverage.ConditionAdapterBase
uses gw.api.util.JurisdictionMappingUtil

@Export
class GPGenericLineCond_ExtConditionAdapter extends ConditionAdapterBase
{
  var _owner : GPGenericLineCond_Ext  
  
  construct(owner : GPGenericLineCond_Ext)
  {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction
  {
    return(_owner.GPGenericLine_Ext.Branch.BaseState)
  }

  override property get PolicyLine() : PolicyLine
  {
    return(_owner.GPGenericLine_Ext)
  }

  override property get OwningCoverable() : Coverable
  {
    return(_owner.GPGenericLine_Ext)
  }

  override function addToConditionArray( p0: PolicyCondition ) : void
  {
    _owner.GPGenericLine_Ext.addToGPLineConditions( p0 as GPGenericLineCond_Ext )
  }

  override function removeFromParent() : void
  {
    _owner.GPGenericLine_Ext.removeFromGPLineConditions( _owner )
  }

}
