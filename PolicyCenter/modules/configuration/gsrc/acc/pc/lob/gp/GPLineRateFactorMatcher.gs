package acc.pc.lob.gp
uses gw.lob.common.AbstractRateFactorMatcher
uses java.lang.Iterable
uses gw.entity.ILinkPropertyInfo

@Export
class GPLineRateFactorMatcher extends AbstractRateFactorMatcher<GPLineRF_Ext> {

  construct(owner : GPLineRF_Ext) {
    super(owner)
  }

  override property get ParentColumns() : Iterable<ILinkPropertyInfo> {
    return {GPLineRF_Ext.Type.TypeInfo.getProperty("GPLineModifier") as ILinkPropertyInfo};
  }

}
