package gw.webservice.pc.pc800.ccintegration.lob
uses gw.webservice.pc.pc800.ccintegration.CCBasePolicyLineMapper
uses gw.webservice.pc.pc800.ccintegration.CCPolicyGenerator
uses gw.webservice.pc.pc800.ccintegration.entities.types.complex.CCLocationMiscRU
uses gw.webservice.pc.pc800.ccintegration.entities.types.complex.CCPropertyCoverage
uses gw.webservice.pc.pc800.ccintegration.entities.anonymous.elements.CCPolicy_RiskUnits
uses gw.webservice.pc.pc800.ccintegration.entities.anonymous.elements.CCRiskUnit_Coverages
uses java.lang.Integer
uses acc.pc.lob.gp.financials.GPQuoteDisplayUtil

class CCGPPolicyLineMapper extends CCBasePolicyLineMapper {

  var _gpLine : GPGenericLine_Ext
  var _RUCount : Integer
  var _skipCount : Integer;
  
  construct(line : PolicyLine, policyGen : CCPolicyGenerator) {
    super(line, policyGen)
    _gpLine = line as GPGenericLine_Ext
  }

  override function getLineCoverages() : List<entity.Coverage> {
    return _gpLine.GPLineCoverages as List<entity.Coverage>
  }
  
  override function createRiskUnits() {
    // Keep a count as we add risk units.  This may start > 0 if other lines have been processed first.
    _RUCount = _ccPolicy.RiskUnits.Count;
    var startingCount = _RUCount
    _skipCount = 0;


    addToPropertiesCount(_RUCount - startingCount + _skipCount)
  }
  
}
