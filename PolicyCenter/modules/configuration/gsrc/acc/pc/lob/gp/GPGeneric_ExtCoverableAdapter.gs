package acc.pc.lob.gp
uses gw.api.domain.CoverableAdapter
uses java.util.Date
uses gw.api.util.JurisdictionMappingUtil
uses gw.policy.PolicyLineConfiguration

@Export
class GPGeneric_ExtCoverableAdapter implements CoverableAdapter {
  var _owner : GPGeneric_Ext
  
  construct(owner : GPGeneric_Ext) {
    _owner = owner
  }

  override property get PolicyLine() : PolicyLine {
    return _owner.GPLine
  }

  override property get PolicyLocations() : PolicyLocation[] {
    return (null)
  }

  override property get State() : Jurisdiction{
    return (_owner.GPLine.Branch.BaseState)
  }

  override property get AllCoverages() : Coverage[] {
    return _owner.Coverages
  }

  override function addCoverage( p0: Coverage ) : void {
    _owner.addToCoverages( p0 as GPGenericCov_Ext )
  }

  override function removeCoverage( p0: Coverage ) : void {
    _owner.removeFromCoverages( p0 as GPGenericCov_Ext )
  }

  override property get AllExclusions() : Exclusion[] {
    return _owner.Exclusions
  }

  override function addExclusion( p0: Exclusion ) : void {
    _owner.addToExclusions( p0 as GPGenericExcl_Ext )
  }

  override function removeExclusion( p0: Exclusion ) : void {
    _owner.removeFromExclusions( p0 as GPGenericExcl_Ext )
  }
  override property get AllConditions() : PolicyCondition[] {
    return _owner.Conditions
  }

  override function addCondition( p0: PolicyCondition ) : void {
    _owner.addToConditions( p0 as GPGenericCond_Ext )
  }

  override function removeCondition( p0: PolicyCondition ) : void {
    _owner.removeFromConditions( p0 as GPGenericCond_Ext )
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
