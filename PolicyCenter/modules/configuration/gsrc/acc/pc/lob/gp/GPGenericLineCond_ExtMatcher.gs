package acc.pc.lob.gp
uses gw.lob.common.AbstractConditionMatcher
uses gw.entity.ILinkPropertyInfo

class GPGenericLineCond_ExtMatcher extends AbstractConditionMatcher<GPGenericLineCond_Ext> {
  construct(owner : GPGenericLineCond_Ext) {
    super(owner)
  }

  override property get Parent() : ILinkPropertyInfo {
    return GPGenericLineCond_Ext.Type.TypeInfo.getProperty("GPGenericLine_Ext") as ILinkPropertyInfo
  }

}
