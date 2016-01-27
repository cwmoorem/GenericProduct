package acc.pc.lob.gp
uses gw.lob.common.AbstractRateFactorMatcher
uses java.lang.Iterable
uses gw.entity.ILinkPropertyInfo

@Export
class GPGenericRateFactorMatcher extends AbstractRateFactorMatcher<GPGenericRF_Ext> {

  construct(owner : GPGenericRF_Ext) {
    super(owner)
  }

  override property get ParentColumns() : Iterable<ILinkPropertyInfo> {
    return {GPGenericRF_Ext.Type.TypeInfo.getProperty("GPGenericModifier") as ILinkPropertyInfo};
  }

}
