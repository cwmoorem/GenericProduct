package acc.pc.lob.gp.validation

uses gw.validation.PCValidationBase
uses gw.validation.PCValidationContext

class GPGenericValidation extends PCValidationBase {

  var _generic : GPGeneric_Ext as generic

  construct(valContext : PCValidationContext, inGeneric : GPGeneric_Ext) {
    super(valContext)
    _generic = inGeneric
  }

  static function validateGeneric(inGeneric : GPGeneric_Ext) {
    PCValidationContext.doPageLevelValidation( \ context -> {
      var validation = new GPGenericValidation(context, inGeneric)
      validation.checkRequiredSchedule()
    })
  }

  override function validateImpl() {
    Context.addToVisited(this, "validateImpl")
    checkRequiredSchedule()
  }

  private function checkRequiredSchedule(){
    Context.addToVisited(this, "checkRequiredSchedule")
    _generic.GPSchedules.each( \ elt -> {
      if(elt.GenericScheduleMap.Required == true){
        if(elt.GPScheduleItem.Count == 0){
          Result.addError(_generic, "default", displaykey.Validation.GenericProduct.NoScheduleItems(elt.GenericScheduleMap.Name))
        }
      }
    })
  }
}