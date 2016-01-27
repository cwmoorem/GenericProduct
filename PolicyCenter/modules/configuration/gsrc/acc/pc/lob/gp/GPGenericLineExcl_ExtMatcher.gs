package acc.pc.lob.gp
uses gw.lob.common.AbstractExclusionMatcher
uses gw.entity.ILinkPropertyInfo

class GPGenericLineExcl_ExtMatcher extends AbstractExclusionMatcher<GPGenericLineExcl_Ext> {
  construct(owner : GPGenericLineExcl_Ext) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return GPGenericLineExcl_Ext.Type.TypeInfo.getProperty("GPGenericLine_Ext") as ILinkPropertyInfo
  }

}
