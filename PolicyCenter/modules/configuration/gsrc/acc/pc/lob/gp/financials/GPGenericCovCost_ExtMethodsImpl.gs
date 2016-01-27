package acc.pc.lob.gp.financials

@Export
class GPGenericCovCost_ExtMethodsImpl extends GenericGPCostMethodsImpl<GPGenericCovCost_Ext>
{
  construct( owner : GPGenericCovCost_Ext )
  {
    super( owner )
  }
  
  override property get Coverage() : Coverage
  {
    return _owner.GPGenericCov
  }

  override property get OwningCoverable() : GPGeneric_Ext
  {
    return _owner.GPGeneric
  }

  override property get Jurisdiction() : Jurisdiction
  {
    return _owner.GPGeneric.GPLine.Branch.BaseState
  }

}
