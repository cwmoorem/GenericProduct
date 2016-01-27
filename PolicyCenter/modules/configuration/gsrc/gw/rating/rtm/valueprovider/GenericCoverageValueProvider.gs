package gw.rating.rtm.valueprovider

uses gw.api.productmodel.PolicyLinePattern
uses java.util.Collections
uses java.util.LinkedHashMap
uses java.util.Map
uses gw.api.database.Query

class GenericCoverageValueProvider  extends RateTableCellValueProvider  {

  protected var _cache : Map<String, String>

  construct(column : RateTableColumn) {
    super(column)
    _cache = new LinkedHashMap<String, String>()
  }

  /**
   * Returns an array of coverage codes for a particular policy line.
   *
   * @param bean  is not used
   * @returns an array of all coverage codes (both available and not) for a policy line.
   */
  override function getValues(bean : KeyableBean) : String[] {
    return getValueMap(super.Arguments).Keys.toTypedArray()
  }

  /**
   * Returns a displayable label for a coverage code. The label is defined in
   * <code>Web.Rating.CoverageValueProvider.DisplayLabel</code> display key and consists of
   * coverage category name and coverage name.
   *
   * @param bean  is not used
   * @param code  a string code, one of the codes returned by {@link #getValues getValues} method.
   * @returns a displayable string.
   */
  override function valueByCode(bean : KeyableBean, code : String) : String {
    if (!_cache.containsKey(code)) {
      getValues(bean)
    }
    return _cache.get(code)
  }

  override function getDependentValues(dependencies : String[]) : Map<String, String> {
    return {}
  }


  override function getValueMap(args : String[]) : Map<String, String> {
    var genericProductCode : String
    var genericSubProductCode : String
    genericProductCode = args[0]
    if(args.Count == 2){
      genericSubProductCode = args[1]
    }
    if (_cache.Empty) {
      var query = Query.make(GenericProduct_Ext).compare("ProductCode",Equals, genericProductCode.toLowerCase()).select()
      var genericProduct = query.first()
      var genericSubProducts = genericProduct.GenericSubProducts
      if(genericSubProductCode != null){
        genericSubProducts = genericSubProducts.where( \ elt -> elt.SubProductCode == genericProductCode)
      }
      for(subProduct in genericSubProducts){
        for(coverage in subProduct.GenericClauseMappings.where( \ elt -> elt.GenericClauseType == GenericClauseType_Ext.TC_COVERAGE)){
          _cache.put(coverage.Code, coverage.Name)
        }
      }
    }
    return _cache
  }


  override property get ArgumentsHelpText() : String {
    return "Enter Generic Product Code and optionaly the Generic Subproduct Code"
  }

}