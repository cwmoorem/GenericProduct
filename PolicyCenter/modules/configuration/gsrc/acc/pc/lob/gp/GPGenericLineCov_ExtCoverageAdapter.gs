package acc.pc.lob.gp
uses gw.coverage.CoverageAdapterBase
uses gw.api.reinsurance.ReinsurableCoverable
uses gw.api.util.JurisdictionMappingUtil

@Export
class GPGenericLineCov_ExtCoverageAdapter extends CoverageAdapterBase
{
  var _owner : GPGenericLineCov_Ext  
  
  construct(owner : GPGenericLineCov_Ext)
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

  override function addToCoverageArray( p0: Coverage ) : void
  {
    _owner.GPGenericLine_Ext.addToGPLineCoverages( p0 as GPGenericLineCov_Ext )
  }

  override function removeFromParent() : void
  {
    _owner.GPGenericLine_Ext.removeFromGPLineCoverages( _owner )
  }

  override property get ReinsurableCoverable() : ReinsurableCoverable {
    return(_owner.BranchValue)
  }
}
