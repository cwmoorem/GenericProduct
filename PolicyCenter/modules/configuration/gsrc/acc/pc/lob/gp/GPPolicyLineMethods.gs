package acc.pc.lob.gp

uses java.util.ArrayList
uses java.util.HashSet
uses java.util.Map
uses java.util.Set
uses java.math.BigDecimal
uses java.lang.Iterable
uses gw.api.policy.AbstractPolicyLineMethodsImpl
uses gw.api.productmodel.CoveragePattern
uses entity.windowed.GPCost_ExtVersionList
uses gw.validation.PCValidationContext
uses gw.policy.PolicyLineValidation
uses gw.rating.worksheet.treenode.WorksheetTreeNodeUtil
uses gw.rating.worksheet.treenode.WorksheetTreeNodeContainer
uses gw.api.tree.RowTreeRootNode
uses acc.pc.lob.gp.financials.GPQuoteDisplayUtil
uses gw.rating.AbstractRatingEngine
uses acc.pc.lob.gp.rating.GPRatingEngine
uses acc.pc.lob.gp.validation.GPLineValidation
uses gw.policy.PolicyEvalContext
uses gw.lob.common.UnderwriterEvaluator

@Export
class GPPolicyLineMethods extends AbstractPolicyLineMethodsImpl {
  var _line : entity.GPGenericLine_Ext

  construct(line : entity.GPGenericLine_Ext) {
    super(line)
    _line = line
  }

  override property get CoveredStates() : Jurisdiction[] {
    var states = new HashSet<Jurisdiction>()
    if (_line.Branch.BaseState != null) {
      states.add(_line.Branch.BaseState)
    }
    for (n in _line.GPGenerics) {
      states.add(n.GPLine.Branch.BaseState)
    }

    return states.toTypedArray()
  }

  override property get AllCoverables() : Coverable[] {
    var list : ArrayList<Coverable> = {_line}
    list.addAll(_line.GPGenerics.toList())

    return list.toTypedArray()
  }

  override property get AllCoverages() : Coverage[] {
    var list = new ArrayList<Coverage>()
    for (cb in AllCoverables) {
      list.addAll(cb.CoveragesFromCoverable.toList())
    }
    return list as Coverage[]
  }

  override property get AllExclusions() : Exclusion[] {
    var list : ArrayList<Exclusion> 
    for (cb in AllCoverables) {
      list.addAll(cb.ExclusionsFromCoverable.toList())
    }
    return list.toTypedArray()
  }

  override property get AllConditions() : PolicyCondition[] {
    var list : ArrayList<PolicyCondition> 
    for (cb in AllCoverables) {
      list.addAll(cb.ConditionsFromCoverable.toList())
    }
    return list.toTypedArray()
  }

  override property get AllModifiables() : Modifiable[] {
    var list : ArrayList<Modifiable> = {_line}
    list.addAll(_line.GPGenerics.toList())

    return list.toTypedArray()
  }

  /**
   * All costs across the term, in window mode.
   */
  override property get CostVLs() : Iterable<GPCost_ExtVersionList> {
    return _line.VersionList.GPCosts
  }

  override property get Transactions() : Set<Transaction> {
    var branch = _line.Branch
    return branch.getSlice(branch.PeriodStart).GPTransactions.toSet()
  }

  override property get SupportsRatingOverrides() : boolean {
    return true
  }

  override function getCostForCoverage(covered : Coverable, covPat : CoveragePattern) : Cost {
    return _line.Branch.AllCosts.firstWhere(\ cost -> {
      return cost typeis GPCost_Ext and
             cost.Coverage != null and
             cost.Coverage.Pattern.PublicID.equals(covPat.PublicID) and
             cost.Coverage.OwningCoverable == covered
    }) as GPCost_Ext
  }

  override function getAllCostsForCoverage(covered : Coverable, covPat : CoveragePattern) : List<Cost> {
    return _line.Branch.AllCosts.where(\ cost -> {
      return cost typeis GPCost_Ext and
             cost.Coverage != null and
             cost.Coverage.Pattern.PublicID.equals(covPat.PublicID) and
             cost.Coverage.OwningCoverable == covered
    })
  }

  override function createPolicyLineValidation(validationContext : PCValidationContext) : PolicyLineValidation<entity.GPGenericLine_Ext> {
    return new GPLineValidation(validationContext, _line)
  }

  override function createPolicyLineDiffHelper(reason : DiffReason, policyLine : PolicyLine) : GPDiffHelper {
    return new GPDiffHelper(reason, this._line, policyLine as entity.GPGenericLine_Ext)
  }

  override function initialize() {
  }
  
  override function resetAutoNumberSequences() {
    renumberAllAutoSequences()
  }

  override function cloneAutoNumberSequences() {
  }

  override function bindAutoNumberSequences() {
    renumberAllAutoSequences()
  }

  override function renumberAutoNumberSequences() {
  }

  private function renumberAllAutoSequences() {
  }

  override function getWorksheetRootNode(showConditionals : boolean) : RowTreeRootNode {
    var treeNodes : List<WorksheetTreeNodeContainer> = {}

    var util = new GPQuoteDisplayUtil(_line, true)
    var cblsByType = util.getCoverablesWithCostsByType()
    var costsByCbl = util.getCostsByCoverable()
    var lineLevelCosts = costsByCbl.get(_line)
    
    // All but the line-level costs
    for (ctype in cblsByType.Keys.where( \ t -> t != typeof(_line))) {
      var ctypeContainer = new WorksheetTreeNodeContainer(ctype.toString()) 
      ctypeContainer.ExpandByDefault = true
      treeNodes.add(ctypeContainer)
      for (cbl in cblsByType.get(ctype)) {
        var cblContainer = new WorksheetTreeNodeContainer(GPQuoteDisplayUtil.CoverableDisplayName(cbl))
        cblContainer.ExpandByDefault = true
        ctypeContainer.addChild(cblContainer)
        for (c in costsByCbl.get(cbl)) {
          var costContainer = new WorksheetTreeNodeContainer(GPQuoteDisplayUtil.CostDisplayName(c))
          cblContainer.addChild(costContainer)
          costContainer.addChildren(WorksheetTreeNodeUtil.buildTreeNodes(c, showConditionals))
        }
      }
    }
    
    // Line-level costs
    var lineContainer = new WorksheetTreeNodeContainer("Line-level")
    lineContainer.ExpandByDefault = true
    treeNodes.add(lineContainer)
    for (c in lineLevelCosts) {
      var costContainer = new WorksheetTreeNodeContainer(GPQuoteDisplayUtil.CostDisplayName(c))
      lineContainer.addChild(costContainer)
      costContainer.addChildren(WorksheetTreeNodeUtil.buildTreeNodes(c, showConditionals))
    }
    
    return WorksheetTreeNodeUtil.buildRootNode(treeNodes)
  }

  /***
   * This function is used by the system to determine whether any locations are unused and can be removed automatically at the 
   * time of quoting (in order to clean-up the data by getting rid of locations with no coverables, coverages, etc.)
   * This default implementation will prevent any locations from being removed automatically, even if they are really unused.
   * It will often be good to modify this to identify locations that can be safely removed.
   */
  override function checkLocationInUse(location : PolicyLocation) : boolean {
    return true
  }

  /***
   * This function decides whether to allow a location to be removed in the UI.
   * This default implementation is provided simply as a reminder that you are likely to want to override default behavior here, too.
   */
  override function canSafelyDeleteLocation( location: PolicyLocation ) : String {
    var notSafeReason = super.canSafelyDeleteLocation(location)
    
    if (notSafeReason.equalsIgnoreCase("")) {
      // Put line-specific reasons why a location cannot safely be deleted here.
    }
    
    return notSafeReason
  }

  override function doGetTIVForCoverage(cov : Coverage) : BigDecimal {
    switch (cov.FixedId.Type) {
      // Enter case statements for each type of coverage here
    }
    return BigDecimal.ZERO
  }

  override function createRatingEngine(method : RateMethod, parameters : Map<RateEngineParameter, Object>) : AbstractRatingEngine<GPGenericLine_Ext> {
//    return new GPRatingEngine(_line as productmodel.GPLine, parameters[RateEngineParameter.TC_RATEBOOKSTATUS] as RateBookStatus)
    return new GPRatingEngine(_line as productmodel.GPLine)
  }

  override property get BaseStateRequired() : boolean {
    // Change this if you want to force a base state to be set for this line of business.
    return false
  }

  override function createUnderwriterEvaluator(context : PolicyEvalContext) : UnderwriterEvaluator {
    return new GPUnderwriterEvaluator (context)
  }
}
