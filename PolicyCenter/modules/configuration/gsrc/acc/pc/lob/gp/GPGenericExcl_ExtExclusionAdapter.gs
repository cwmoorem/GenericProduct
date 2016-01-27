package acc.pc.lob.gp
uses gw.coverage.ExclusionAdapterBase
uses gw.api.util.JurisdictionMappingUtil

@Export
class GPGenericExcl_ExtExclusionAdapter extends ExclusionAdapterBase
{
  var _owner : GPGenericExcl_Ext  
  
  construct(owner : GPGenericExcl_Ext)
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

  override function addToExclusionArray( p0: Exclusion ) : void
  {
    _owner.GPGeneric.addToExclusions( p0 as GPGenericExcl_Ext )
  }

  override function removeFromParent() : void
  {
    _owner.GPGeneric.removeFromExclusions( _owner )
  }

}
