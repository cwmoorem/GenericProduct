package acc.pc.lob.gp.pageprocess

uses java.util.ArrayList
uses com.guidewire.pl.web.navigation.Location
uses java.lang.Exception

class GPGenericScreen {
  
  var _policyPeriod    : PolicyPeriod                     as policyPeriod
  var _line            : GPLine                           as line
  var _subProducts     : GenericSubProduct_Ext[]          as subProducts
  var _attributes      : List<attributeGeneric>           as attributes
  var _currentLocation : Location  
  
  class attributeGeneric {
    private var _genericAttributeMap    : GenericAttributeMap_Ext    as genericAttributeMap
    private var _keyCode                : String                     as keyCode
    private var _subtype                : String                     as subtype
    private var _priority               : int                        as priority
  }
  
  class clauseWrapper {
    private var _priority        : int                                 as priority
    private var _coveragePattern : gw.api.productmodel.CoveragePattern as coveragePattern
  }
  
  construct(inPolicyPeriod : PolicyPeriod, inCurrentLocation : Location) {
    init(inPolicyPeriod, inCurrentLocation)
  }
  
  private function init(inPolicyPeriod : PolicyPeriod, inCurrentLocation : Location){
    _policyPeriod = inPolicyPeriod
    _currentLocation = inCurrentLocation
    _attributes = new ArrayList<attributeGeneric>()
    if(_policyPeriod.GPLineExists){
      _line = _policyPeriod.GPLine
    }
    if(_policyPeriod.Policy.GenericProduct != null){
      _subProducts = _policyPeriod.Policy.GenericProduct.GenericSubProducts
      genericAttributes(_policyPeriod.Policy.GenericProduct)
    }
  }
  
  private function genericAttributes(inGeneric : GenericProduct_Ext){
    if(inGeneric != null){
      for(subProduct in inGeneric.GenericSubProducts){
        for(attMap in subProduct.GenericAttributeMappings){
          if(!attMap.Retired){
            var newAttributeGeneric = new attributeGeneric()
            newAttributeGeneric.genericAttributeMap = attMap
            newAttributeGeneric.keyCode = attMap.Code
            newAttributeGeneric.subtype = subProduct.SubProductCode
            newAttributeGeneric.priority = attMap.Priority
            _attributes.add(newAttributeGeneric)
          }
        }
      }
    } 
  }
  
  public function attributeItterator(inGeneric : GPGeneric_Ext, inputColumn : int) : List<attributeGeneric>{
    var retVal = new ArrayList<attributeGeneric>()
    if(inputColumn == null or inputColumn == 1){
      retVal.addAll(_attributes.where(\ a -> a.subtype == inGeneric.GenericSubproduct.SubProductCode and
                                            (a._genericAttributeMap.InputColumn == 1 or a._genericAttributeMap.InputColumn == null)).orderBy(\ a -> a.priority))
    } else {
      retVal.addAll(_attributes.where(\ a -> a.subtype == inGeneric.GenericSubproduct.SubProductCode and
                                            (a._genericAttributeMap.InputColumn == 2)).orderBy(\ a -> a.priority))
    }
    return retVal
  }
  
  /**
   * Extract the coverage patterns this is passed as an array of wrapper class as we need to order them
   * and the priority for ordering is on the mapping not the coverage pattern, there is probably a better way to
   * do this but for the moment it serves its purpose. 
   */
  public function covPatterns(inGeneric : GPGeneric_Ext) : List<clauseWrapper> {
    if(inGeneric != null){
      var wrappers = new ArrayList<clauseWrapper>()
      var patterns = inGeneric.PolicyLine.Pattern.getCoverageCategory("GPGenericStndGrp")
                                                 .coveragePatternsForEntity(GPGeneric_Ext)
                                                 .where(\ c -> inGeneric.isCoverageSelectedOrAvailable(c))
      patterns.each(\ c -> {
       wrappers.add(new clauseWrapper(){:coveragePattern = c, 
                                        :priority = inGeneric.GenericSubproduct.GenericClauseMappings
                                                    .firstWhere(\ g -> g.GenericClauseType == "coverage" 
                                                                       and g.Column == c.PublicID and !g.Retired
                                                                       and g.GenericSubProduct == inGeneric.GenericSubproduct).Priority}) 
      })
      return wrappers
    }
    return new ArrayList<clauseWrapper>()
  }

  public function modifiers(inGeneric : GPGeneric_Ext) : List<GenericModifierWrapper>{
    var wrappers = new ArrayList<GenericModifierWrapper>()
    for(modifier in inGeneric.Modifiers){
      var pattern = inGeneric.GenericSubproduct.GenericClauseMappings
                             .firstWhere(\ g -> g.GenericClauseType == GenericClauseType_Ext.TC_MODIFIER
                              and g.Column == modifier.PatternCode and !g.Retired
                              and g.GenericSubProduct == inGeneric.GenericSubproduct)
      wrappers.add(new GenericModifierWrapper(){:modifier = modifier, :priority = pattern.Priority,
                                                :modifierPattern = pattern, :modifierName = pattern.Name})
    }
    return wrappers
  }

  public function ExclPatterns(inGeneric : GPGeneric_Ext) : gw.api.productmodel.ExclusionPattern[] {
    var retVal : gw.api.productmodel.ExclusionPattern[]
    if(inGeneric != null){
      retVal = inGeneric.PolicyLine.Pattern.getCoverageCategory("GPGenericExclGrp").exclusionPatternsForEntity(GPGeneric_Ext).where(\ c -> inGeneric.isExclusionSelectedOrAvailable(c))
    }
    return retVal
  } 
  
  public function conPatterns(inGeneric : GPGeneric_Ext) : gw.api.productmodel.ConditionPattern[] {
    var retVal : gw.api.productmodel.ConditionPattern[]
    if(inGeneric != null){
      retVal = inGeneric.PolicyLine.Pattern.getCoverageCategory("GPGenericCondGrp").conditionPatternsForEntity(GPGeneric_Ext).where(\ c -> inGeneric.isConditionSelectedOrAvailable(c))
    }
    return retVal
  }
  
  public function clauseName(inGeneric : GPGeneric_Ext, inClauseCode : String) : String {    
    var retVal : String
    if(inGeneric != null){
      
      var value = inGeneric.GenericSubproduct.GenericClauseMappings.where(\ g -> g.Column == inClauseCode).first()
      retVal = value.Name
    }
    return retVal
  }
  
  public function clauseTerms(inGeneric : GPGeneric_Ext, inClauseCode : String) : List<GenericTermMap_Ext> {
    var retVal = new ArrayList<GenericTermMap_Ext>()
    if(inGeneric != null){
      if(inGeneric.GenericSubproduct != null){
        var clause = inGeneric.GenericSubproduct.GenericClauseMappings.where(\ g -> g.Column == inClauseCode)
        var terms = clause?.first().GenericTermMapping.toSet()
        if(terms != null){
          retVal.addAll(inGeneric.GenericSubproduct.GenericClauseMappings.where(\ g -> g.Column == inClauseCode).first().GenericTermMapping.toSet())
        }
      }
    }
    return retVal
    
  }
  
  /**
   * When the subproduct is changes then the coverable is cleaned up of all 
   * coverages and attributes that were entered
   */
  public function subProductCleanup(inGeneric : GPGeneric_Ext){
    inGeneric.Coverages.each(\ p -> inGeneric.removeCoverageFromCoverable(p))
    inGeneric.Conditions.each(\ p -> inGeneric.removeConditionFromCoverable(p))
    inGeneric.Exclusions.each(\ p -> inGeneric.removeFromExclusions(p))
    cleanValues(inGeneric)
    for(schedule in inGeneric.GPSchedules){
      schedule.GPScheduleItem.each(\ p -> {
        cleanValues(p)     
      })
      schedule.GenericScheduleMap = null
    }
    inGeneric.updateSchedules()
    subProductProductModel(inGeneric)
    
  }
  
  public function uiStyle(inGeneric : GPGeneric_Ext) : GenericSubprodStyle_Ext {
    var retVal = GenericSubprodStyle_Ext.TC_MULTITAB
    if(inGeneric != null and inGeneric.GenericSubproduct != null){
      if(inGeneric.GenericSubproduct.GenericSubproductStyle != null){
        retVal = inGeneric.GenericSubproduct.GenericSubproductStyle
      }
    }
    return retVal
  }
  
  
  public function scheduleItemLabel(inItem : GenericScheduleItemMap_Ext) : String {
    var retVal : String
    retVal = inItem.Name
    return retVal
  }
  
  public function schedules(){
  }
  
  private function cleanValues(inObject : Object){
    for(attNumber in 1 .. 100){
      try{
        inObject["BooleanValue${attNumber}"] = null
      } catch (e : Exception){
      }
      try{
        inObject["DateValue${attNumber}"] = null
      } catch (e : Exception){
      }
      try{
        inObject["DecimalValue${attNumber}"] = null
      } catch (e : Exception){
      }
      try{
        inObject["IntegerValue${attNumber}"] = null
      } catch (e : Exception){
      }
      try{
        inObject["LongValue${attNumber}"] = null
      } catch (e : Exception){
      }
      try{
        inObject["MoneyValue${attNumber}"] = null
      } catch (e : Exception){
      }
      try{
        inObject["StringValue${attNumber}"] = null
      } catch (e : Exception){
      }
    }
  }
  
  public function createAndAddGPGeneric() : GPGeneric_Ext {
    var retVal : GPGeneric_Ext
    retVal = _line.createAndAddGPGeneric_Ext()
    subProductProductModel(retVal)
    if(retVal.GenericSubproduct != null){
      subProductCleanup(retVal)
    }
//    if(retVal.GenericSubproduct != null) {
//      for(cov in retVal.GenericSubproduct.GenericClauseMappings.where(\ g -> g.GenericClauseType == "coverage" and !g.Retired)){
//        if(cov.ExistenceType == "Suggested"){
//          retVal.createCoverage(gw.api.productmodel.CoveragePattern.getByCode(cov.Column))
//        }
//      }
//    }
    return retVal
  }
  
  public function sortedSchedules(inGeneric : GPGeneric_Ext) : List<entity.GPSchedule_Ext>{
    var retVal = new ArrayList<entity.GPSchedule_Ext>()
    if(inGeneric.GPSchedules.HasElements){
      return inGeneric.GPSchedules.orderBy(\ p -> p.GenericScheduleMap.Priority).freeze()
    }
    return retVal.toList()
  }
  
  public function subProductProductModel(inGeneric : GPGeneric_Ext){
    inGeneric.InitialExclusionsCreated = false
    inGeneric.InitialCoveragesCreated  = false
    inGeneric.InitialConditionsCreated = false
    inGeneric.createOrSyncCoverages()
    inGeneric.createOrSyncConditions()
    inGeneric.createExclusions()
    inGeneric.syncModifiers()
    if(inGeneric.GenericSubproduct != null) {
      for(cov in inGeneric.GenericSubproduct.GenericClauseMappings.where(\ g -> g.GenericClauseType == "coverage" and !g.Retired)){
        if(cov.ExistenceType == "Suggested"){
//          inGeneric.createCoverage(gw.api.productmodel.CoveragePattern.getByCode(cov.Column))
        }
      }
    }
  }

}
