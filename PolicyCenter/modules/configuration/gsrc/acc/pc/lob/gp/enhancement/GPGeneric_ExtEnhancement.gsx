package acc.pc.lob.gp.enhancement

enhancement GPGeneric_ExtEnhancement : entity.GPGeneric_Ext {
  
  /**
   * Is the given coverage code mapped in the Generic mapping for the coverable
   * @param inCoverageCode : The coverage code to check for a mapping
   */
  public function coverageAvailable(inCoverageCode : String) : boolean {
    var retVal = false
    retVal = clauseAvailable(inCoverageCode, typekey.GenericClauseType_Ext.TC_COVERAGE)
    return retVal
  }
  
  /**
   * Is the given condition code mapped in the Generic mapping for the coverable
   * @param inConditionCode : The condition code to check for a mapping
   */
  public function conditionAvailable(inConditionCode : String) : boolean {
    var retVal = false
    retVal = clauseAvailable(inConditionCode, typekey.GenericClauseType_Ext.TC_CONDITION)
    return retVal
  }

  /**
   * Is the given modifier code mapped in the Generic mapping for the coverable
   * @param inModiferCode : The modifier code to check for a mapping
   */
  public function modifierAvailable(inModifierCode : String) : boolean {
    var retVal = false
    retVal = clauseAvailable(inModifierCode, typekey.GenericClauseType_Ext.TC_MODIFIER)
    return retVal
  }
  
  /**
   * Is the given exclusion code mapped in the Generic mapping for the coverable
   * @param inExclusionCode : The exclusion code to check for a mapping
   */
  public function exclusionAvailable(inExclusionCode : String) : boolean {
    var retVal = false
    retVal = clauseAvailable(inExclusionCode, typekey.GenericClauseType_Ext.TC_EXCLUSION)
    return retVal
  }    
  
  private function clauseAvailable(inCode : String, inType : GenericClauseType_Ext) : boolean {
    var retVal = false
    retVal = this.GenericSubproduct?.GenericClauseMappings?.hasMatch(\ g -> g.GenericClauseType == inType and g.Column == inCode)
    return retVal
  }
  
  public function coverageExistence(inCoverageCode : String) : ExistenceType {
    var retVal = ExistenceType.TC_ELECTABLE
    var mapping = this.GenericSubproduct?.GenericClauseMappings?.firstWhere(\ g -> g.GenericClauseType == GenericClauseType_Ext.TC_COVERAGE
                                                                                     and g.Column == inCoverageCode)
    if(mapping != null and mapping.ExistenceType != null){
      retVal = mapping.ExistenceType
    }
    return retVal
  }

  public function conditionExistence(inCode : String) : ExistenceType {
    var retVal = ExistenceType.TC_ELECTABLE
    var mapping = this.GenericSubproduct?.GenericClauseMappings?.firstWhere(\ g -> g.GenericClauseType == GenericClauseType_Ext.TC_CONDITION
        and g.Column == inCode)
    if(mapping != null and mapping.ExistenceType != null){
      retVal = mapping.ExistenceType
    }
    return retVal
  }

  public function exclusionExistence(inCode : String) : ExistenceType {
    var retVal = ExistenceType.TC_ELECTABLE
    var mapping = this.GenericSubproduct?.GenericClauseMappings?.firstWhere(\ g -> g.GenericClauseType == GenericClauseType_Ext.TC_EXCLUSION
        and g.Column == inCode)
    if(mapping != null and mapping.ExistenceType != null){
      retVal = mapping.ExistenceType
    }
    return retVal
  }

  public function updateSchedules(){
    if(this.GenericSubproduct != null){
      //
      // Repurpose any we can first
      //
      for(scheduleMap in this.GenericSubproduct.GenericScheduleMap){
        if(this.GPSchedules.hasMatch(\ p -> p.GenericScheduleMap == null)){
          var newSchedule = this.GPSchedules.firstWhere(\ p -> p.GenericScheduleMap == null)
          newSchedule.GenericScheduleMap = scheduleMap
        }
      }   
      //
      // Add any missing ones
      //   
      for(scheduleMap in this.GenericSubproduct.GenericScheduleMap){
        if(!this.GPSchedules.hasMatch(\ p -> p.GenericScheduleMap.Code == scheduleMap.Code)){
          var newSchedule = new GPSchedule_Ext(this.Branch)
          newSchedule.GenericScheduleMap = scheduleMap
          this.addToGPSchedules(newSchedule)
        }
      }
    }
  }
  
}
