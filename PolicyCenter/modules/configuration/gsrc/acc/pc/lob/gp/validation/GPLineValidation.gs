package acc.pc.lob.gp.validation

uses gw.validation.PCValidationContext
uses gw.policy.PolicyLineValidation
uses java.lang.UnsupportedOperationException

@Export
class GPLineValidation extends PolicyLineValidation<entity.GPGenericLine_Ext> {
  
  property get gpLine() : entity.GPGenericLine_Ext {
    return Line
  }

  construct(valContext : PCValidationContext, polLine : entity.GPGenericLine_Ext) {
    super(valContext, polLine)
  }
  
  override function doValidate() {
    var generics = gpLine.GPGenerics
    for (generic in generics) {
      var genericValidator = new GPGenericValidation(Context, generic)
      genericValidator.validate()
    }
  }

  /**
   * Validation for Audit is not supported
   */
  override function validateLineForAudit() {
    throw new UnsupportedOperationException(displaykey.Validator.UnsupportedAuditLineError)
  }
}
