package acc.pc.lob.gp
uses gw.lob.common.AbstractExclusionMatcher
uses gw.entity.ILinkPropertyInfo

class GPGenericExcl_ExtMatcher extends AbstractExclusionMatcher<GPGenericExcl_Ext> {
  construct(owner : GPGenericExcl_Ext) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return GPGenericExcl_Ext.Type.TypeInfo.getProperty("GPGeneric") as ILinkPropertyInfo
  }

}
