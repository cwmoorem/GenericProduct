package acc.pc.lob.gp
uses gw.coverage.AbstractCoverageMatcher
uses gw.entity.ILinkPropertyInfo

class GPGenericLineCov_ExtMatcher extends AbstractCoverageMatcher<GPGenericLineCov_Ext> {
  construct(owner : GPGenericLineCov_Ext) {
    super(owner)
  }

  override property get CoverableColumns() : List<ILinkPropertyInfo> {
    return {GPGenericLineCov_Ext.Type.TypeInfo.getProperty("GPGenericLine_Ext") as ILinkPropertyInfo}
  }

}
