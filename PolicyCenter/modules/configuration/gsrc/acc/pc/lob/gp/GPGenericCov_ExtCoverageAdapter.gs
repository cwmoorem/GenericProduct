package acc.pc.lob.gp
uses gw.coverage.CoverageAdapterBase
uses gw.api.reinsurance.ReinsurableCoverable
uses gw.api.util.JurisdictionMappingUtil

@Export
class GPGenericCov_ExtCoverageAdapter extends CoverageAdapterBase
{
  var _owner : GPGenericCov_Ext  
  
  construct(owner : GPGenericCov_Ext)
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

  override function addToCoverageArray( p0: Coverage ) : void
  {
    _owner.GPGeneric.addToCoverages( p0 as GPGenericCov_Ext )
  }

  override function removeFromParent() : void
  {
    _owner.GPGeneric.removeFromCoverages( _owner )
  }

  override property get ReinsurableCoverable() : ReinsurableCoverable {
    return(_owner.BranchValue)
  }
}
