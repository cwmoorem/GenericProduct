package acc.pc.lob.gp.financials

@Export
class GPCostMethodsImpl extends GenericGPCostMethodsImpl<GPCost_Ext>
{
  construct( owner : GPCost_Ext)
  {
    super( owner )
  }

  override property get Jurisdiction() : Jurisdiction  {
    return _owner.GPGenericLine_Ext.Branch.BaseState
  }

}
