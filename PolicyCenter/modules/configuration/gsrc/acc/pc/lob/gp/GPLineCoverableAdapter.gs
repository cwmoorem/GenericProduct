package acc.pc.lob.gp

uses gw.api.domain.CoverableAdapter
uses java.util.Date
uses java.util.HashSet
uses gw.policy.PolicyLineConfiguration

@Export
class GPLineCoverableAdapter implements CoverableAdapter {
  
  var _owner : GPGenericLine_Ext
  
  construct(owner : GPGenericLine_Ext) {
    _owner = owner
  }

  override property get PolicyLine() : PolicyLine {
    return _owner
  }

  override property get State() : Jurisdiction {
    return _owner.Branch.BaseState
  }

  override property get PolicyLocations() : PolicyLocation[] {
    var locs = new HashSet<PolicyLocation>()

    return locs.toTypedArray()
  }

  override property get AllCoverages() : Coverage[] {
    return _owner.GPLineCoverages
  }

  override function addCoverage( p0: Coverage ) : void {
    _owner.addToGPLineCoverages( p0 as GPGenericLineCov_Ext )
  }

  override function removeCoverage( p0: Coverage ) : void {
    _owner.removeFromGPLineCoverages( p0 as GPGenericLineCov_Ext )
  }

  override property get AllExclusions() : Exclusion[] {
    return _owner.GPLineExclusions
  }

  override function addExclusion( p0: Exclusion ) : void {
    _owner.addToGPLineExclusions( p0 as GPGenericLineExcl_Ext )
  }

  override function removeExclusion( p0: Exclusion ) : void {
    _owner.removeFromGPLineExclusions( p0 as GPGenericLineExcl_Ext )
  }
  override property get AllConditions() : PolicyCondition[] {
    return _owner.GPLineConditions
  }

  override function addCondition( p0: PolicyCondition ) : void {
    _owner.addToGPLineConditions( p0 as GPGenericLineCond_Ext )
  }

  override function removeCondition( p0: PolicyCondition ) : void {
    _owner.removeFromGPLineConditions( p0 as GPGenericLineCond_Ext )
  }

  override property get ReferenceDateInternal() : Date {
    return _owner.ReferenceDateInternal
  }
  
  override property set ReferenceDateInternal( date : Date )  {
    _owner.ReferenceDateInternal = date
  }

  override property get DefaultCurrency() : Currency {
    return _owner.Branch.PreferredCoverageCurrency
  }

  override property get AllowedCurrencies() : List<Currency> {
    return PolicyLineConfiguration.getByLine(InstalledPolicyLine.TC_GP).AllowedCurrencies
  }
}
