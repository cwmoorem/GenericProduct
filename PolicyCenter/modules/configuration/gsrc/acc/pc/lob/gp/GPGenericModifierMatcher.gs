package acc.pc.lob.gp
uses gw.lob.common.AbstractModifierMatcher
uses java.lang.Iterable
uses gw.entity.ILinkPropertyInfo

@Export
class GPGenericModifierMatcher extends AbstractModifierMatcher<GPGenericMod_Ext> {
  construct(owner : GPGenericMod_Ext) {
    super(owner)
  }
  
  override property get ParentColumns() : Iterable<ILinkPropertyInfo> {
    return {GPGenericMod_Ext.Type.TypeInfo.getProperty("GPGeneric") as ILinkPropertyInfo}
  }
}
