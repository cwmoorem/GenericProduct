package acc.pc.lob.gp
uses gw.coverage.ExclusionAdapterBase
uses gw.api.util.JurisdictionMappingUtil

@Export
class GPGenericLineExcl_ExtExclusionAdapter extends ExclusionAdapterBase
{
  var _owner : GPGenericLineExcl_Ext  
  
  construct(owner : GPGenericLineExcl_Ext)
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

  override function addToExclusionArray( p0: Exclusion ) : void
  {
    _owner.GPGenericLine_Ext.addToGPLineExclusions( p0 as GPGenericLineExcl_Ext )
  }

  override function removeFromParent() : void
  {
    _owner.GPGenericLine_Ext.removeFromGPLineExclusions( _owner )
  }

}
