package acc.pc.lob.gp.financials
uses gw.api.util.JurisdictionMappingUtil

@Export
class GPLineCovCost_ExtMethodsImpl extends GenericGPCostMethodsImpl<GPLineCovCost_Ext>
{
  construct( owner : GPLineCovCost_Ext )
  {
    super( owner )
  }
  
  override property get Coverage() : Coverage
  {
    return _owner.GPGenericLineCov
  }

  override property get OwningCoverable() : GPGenericLine_Ext
  {
    return _owner.GPGenericLine_Ext
  }

  override property get Jurisdiction() : Jurisdiction
  {
    return _owner.GPGenericLineCov.GPGenericLine_Ext.Branch.BaseState
  }

}
