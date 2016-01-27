package gw.lob.gp

uses gw.policy.PolicyLineConfiguration
uses gw.plugin.rateflow.IRateRoutineConfig
uses acc.pc.lob.gp.rating.GPRateRoutineConfig
uses gw.api.productmodel.PolicyLinePatternLookup

class GPConfiguration extends PolicyLineConfiguration{

  override property get RateRoutineConfig() : IRateRoutineConfig {
    return new GPRateRoutineConfig()
  }

  override property get AllowedCurrencies() : List<Currency>  {
    var pattern = PolicyLinePatternLookup.getByPublicID(InstalledPolicyLine.TC_GP.UnlocalizedName)
    return pattern.AvailableCurrenciesByPriority
  }

}
