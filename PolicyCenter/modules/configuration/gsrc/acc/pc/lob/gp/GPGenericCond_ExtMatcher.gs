package acc.pc.lob.gp
uses gw.lob.common.AbstractConditionMatcher
uses gw.entity.ILinkPropertyInfo

class GPGenericCond_ExtMatcher extends AbstractConditionMatcher<GPGenericCond_Ext> {
  construct(owner : GPGenericCond_Ext) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return GPGenericCond_Ext.Type.TypeInfo.getProperty("GPGeneric") as ILinkPropertyInfo
  }

}
