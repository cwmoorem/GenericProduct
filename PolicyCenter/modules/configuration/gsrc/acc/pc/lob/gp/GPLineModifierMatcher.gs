package acc.pc.lob.gp
uses gw.lob.common.AbstractModifierMatcher
uses java.lang.Iterable
uses gw.entity.ILinkPropertyInfo

@Export
class GPLineModifierMatcher extends AbstractModifierMatcher<GPLineMod_Ext> {
  construct(owner : GPLineMod_Ext) {
    super(owner)
  }
  
  override property get ParentColumns() : Iterable<ILinkPropertyInfo> {
    return {GPLineMod_Ext.Type.TypeInfo.getProperty("GPGenericLine_Ext") as ILinkPropertyInfo}
  }
}
