package acc.pc.lob.gp
uses gw.coverage.AbstractCoverageMatcher
uses gw.entity.ILinkPropertyInfo

class GPGenericCov_ExtMatcher extends AbstractCoverageMatcher<GPGenericCov_Ext> {
  construct(owner : GPGenericCov_Ext) {
    super(owner)
  }

  override property get CoverableColumns() : List<ILinkPropertyInfo> {
    return {GPGenericCov_Ext.Type.TypeInfo.getProperty("GPGeneric") as ILinkPropertyInfo}
  }

}
