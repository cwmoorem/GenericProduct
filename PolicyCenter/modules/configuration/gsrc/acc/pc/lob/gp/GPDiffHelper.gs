package acc.pc.lob.gp
uses gw.api.diff.DiffItem
uses gw.plugin.diff.impl.DiffHelper

class GPDiffHelper extends DiffHelper<entity.GPGenericLine_Ext>{

  construct(reason : DiffReason, polLine1 : entity.GPGenericLine_Ext, polLine2 : entity.GPGenericLine_Ext) {
    super(reason, polLine1, polLine2)
  }

  /**
   * Should be used to add diff items that apply to this LOB, e.g. line-level coverages
   * @param diffItems - list of diff items to add to
   * @return List<DiffItem> - returns the list of diff items that we've modified
   */
  override function addDiffItems(diffItems : List<DiffItem>) : List<DiffItem> {
    diffItems = super.addDiffItems(diffItems)
    
    // Add line-specific data model items to the comparison set, such as line-level coverages, coverables, line-specific Cost entities, etc.
    
    return diffItems 
  }

  /**
   * Filters diff items that apply to this LOB
   * @param diffItems - list of diff items to filter
   * @return List<DiffItem> - returns the list of diff items that we've modified
   */   
  override function filterDiffItems(diffItems : List<DiffItem>) : List<DiffItem> {
    diffItems = super.filterDiffItems(diffItems)

    // Add line-specific filtering logic here
    
    return diffItems
  }
}
