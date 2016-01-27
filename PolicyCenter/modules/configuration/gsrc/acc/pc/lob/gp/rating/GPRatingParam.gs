package acc.pc.lob.gp.rating

uses java.util.ArrayList
uses java.math.BigDecimal
uses java.util.Date

class GPRatingParam {

  var _coverageMapping : GenericClauseMap_Ext  as coverageMapping
  var _terms           : termWrapper[]
  var _attributes      : attributeWrapper[]
  var _target          : String
  var _attribute       : attributeWrapper
  var _term            : termWrapper
  var _valueType       : valueType

  enum valueType {
    Attribute, Term
  }

  class attributeWrapper{
    var _name      : String                 as name
    var _code      : String                 as code
    var _value     : Object                 as value
    var _valueType : AttributeValueType_Ext as valueType
  }

  class termWrapper{
    var _name      : String                 as name
    var _code      : String                 as code
    var _value     : Object                 as value
    var _valueType : AttributeValueType_Ext as valueType
  }

  construct(cov: GPGenericCov_Ext){
    init(cov)
  }

  private function init(cov: GPGenericCov_Ext){
    var mapping = cov.GPGeneric.GenericSubproduct.GenericClauseMappings.firstWhere( \ elt -> cov.PatternCode == elt.Column)
    _coverageMapping = mapping
    loadAttributes(cov)
    loadTerms(cov)
  }

  public property get coverageCode() : String {
    var retVal : String
    retVal = _coverageMapping.Code
    return retVal
  }

  public property set targetTerm(inTarget : String){
    _valueType = valueType.Term
    _target = inTarget.toLowerCase()
    _term = _terms.firstWhere( \ elt -> elt.code == _target)
  }

  public property get targetTerm() : String {
    var retVal : String
    if(_valueType == valueType.Term){
      retVal = _target
    }
    return retVal
  }

  public property set targetAttribute(inTarget : String){
    _valueType = valueType.Attribute
    _target = inTarget.toLowerCase()
    _attribute = _attributes.firstWhere( \ elt -> elt.code == _target)
  }

  public property get targetAttribute() : String {
    var retVal : String
    if(_valueType == valueType.Attribute){
      retVal = _target
    }
    return retVal
  }

  private function loadAttributes(cov: GPGenericCov_Ext){
    var wrappers = new ArrayList<attributeWrapper>()
    var coveredObject = cov.OwningCoverable as GPGeneric_Ext
    var attributeMaps = coveredObject.GenericSubproduct.GenericAttributeMappings
    for(loopAttribute in attributeMaps){
      var wrapper = new attributeWrapper()
      wrapper.code = loopAttribute.Code
      wrapper.name = loopAttribute.Name
      wrapper.valueType = loopAttribute.AttributeValueType
      wrapper.value = coveredObject[loopAttribute.Column]
      wrappers.add(wrapper)
    }
    _attributes = wrappers.toTypedArray()
  }

  private function loadTerms(cov: GPGenericCov_Ext){
    var wrappers = new ArrayList<termWrapper>()
    var coveredObject = cov.OwningCoverable as GPGeneric_Ext
    var coverageMaps = coveredObject.GenericSubproduct.GenericClauseMappings.where( \ elt -> elt.GenericClauseType == GenericClauseType_Ext.TC_COVERAGE)
    var termMaps = new ArrayList<GenericTermMap_Ext>()

    for(coverage in coverageMaps){
      termMaps.addAll(coverage.GenericTermMapping.toList())
    }

    for(loopTerm in termMaps){
      var wrapper = new termWrapper()
      wrapper.code = loopTerm.Code
      wrapper.name = loopTerm.Name
      wrapper.valueType = loopTerm.AttributeValueType
      wrapper.value = cov[loopTerm.Column]
      wrappers.add(wrapper)
    }
    _terms = wrappers.toTypedArray()
  }

  public property get valueString() : String {
    var retVal : String
    if(_valueType == valueType.Attribute){
      if(_attribute.valueType == AttributeValueType_Ext.TC_STRING or _attribute.valueType == AttributeValueType_Ext.TC_STRING_MULTILINE){
        retVal = _attribute.value as String
      }
    }
    if(_valueType == valueType.Term){
      if(_term.valueType == AttributeValueType_Ext.TC_STRING or _attribute.valueType == AttributeValueType_Ext.TC_STRING_MULTILINE){
        retVal = _term.value as String
      }
    }
    return retVal
  }

  public property get valueMoney() : BigDecimal {
    var retVal : BigDecimal
    if(_valueType == valueType.Attribute){
      if(_attribute.valueType == AttributeValueType_Ext.TC_MONEY){
        retVal = _attribute.value as BigDecimal
      }
    }
    if(_valueType == valueType.Term){
      if(_term.valueType == AttributeValueType_Ext.TC_MONEY){
        retVal = _term.value as BigDecimal
      }
    }
    return retVal
  }

  public property get valueInteger() : int {
    var retVal : int
    if(_valueType == valueType.Attribute){
      if(_attribute.valueType == AttributeValueType_Ext.TC_INTEGER){
        retVal = _attribute.value as int
      }
    }
    if(_valueType == valueType.Term){
      if(_term.valueType == AttributeValueType_Ext.TC_INTEGER){
        retVal = _term.value as int
      }
    }
    return retVal
  }

  public property get valueBoolean() : boolean {
    var retVal : boolean
    if(_valueType == valueType.Attribute){
      if(_attribute.valueType == AttributeValueType_Ext.TC_BOOLEAN){
        retVal = _attribute.value as boolean
      }
    }
    if(_valueType == valueType.Term){
      if(_term.valueType == AttributeValueType_Ext.TC_BOOLEAN){
        retVal = _term.value as boolean
      }
    }
    return retVal
  }

  public property get valueDate() : Date {
    var retVal : Date
    if(_valueType == valueType.Attribute){
      if(_attribute.valueType == AttributeValueType_Ext.TC_DATE){
        retVal = _attribute.value as Date
      }
    }
    if(_valueType == valueType.Term){
      if(_term.valueType == AttributeValueType_Ext.TC_DATE){
        retVal = _term.value as Date
      }
    }
    return retVal
  }

  public property get valueTypekey() : String {
    var retVal : String
    if(_valueType == valueType.Attribute){
      if(_attribute.valueType == AttributeValueType_Ext.TC_TYPEKEY){
        retVal = _attribute.value as String
      }
    }
    if(_valueType == valueType.Term){
      if(_term.valueType == AttributeValueType_Ext.TC_TYPEKEY){
        retVal = _term.value as String
      }
    }
    return retVal
  }

}