package acc.pc.lob.gp.pageprocess

uses java.util.ArrayList
uses gw.api.database.Query
uses java.lang.Integer
uses java.lang.Exception
uses java.lang.Long
uses java.math.BigDecimal
uses java.util.Date
uses java.text.SimpleDateFormat
uses gw.api.util.DateUtil

class GenericProductInputInputSet {
                         
  private var _genericAttribute : entity.GenericAttributeMap_Ext   as genericAttribute
  private var _coverable        : GPGeneric_Ext                    as coverable
  private var _rangeList        : ArrayList<rangeItem>             as rangeList
  
  class rangeItem{
    private var _code     : String as code
    private var _name     : String as name
    private var _priority : int    as priority
  }

  construct(inGenericAttribute : entity.GenericAttributeMap_Ext, inCoverable : GPGeneric_Ext) {
    init(inGenericAttribute, inCoverable)
  }
  
  private function init(inGenericAttribute : entity.GenericAttributeMap_Ext, inCoverable : GPGeneric_Ext){
    _genericAttribute = inGenericAttribute
    _coverable        = inCoverable
    if(_genericAttribute.ListCode != null){
      rangeList()
    }
  }
  
  public property get required() : boolean {
    var retVal = false
    if(_genericAttribute != null){
      if(_genericAttribute.Required == true){
        retVal = true
      }
    }
    return retVal
  }
  
  public property get name() : String {
    return _genericAttribute.Name
  }
  
  public property set stringValue(inValue : String){
    coverable[_genericAttribute.Column] = inValue
  }
  
  public property get stringValue() : String {
    var retVal : String
    retVal = (_coverable[_genericAttribute.Column] as String)
    return retVal
  }
  
  public property set booleanValue(inValue : boolean){
    coverable[_genericAttribute.Column] = inValue
  }
  
  public property get booleanValue() : boolean {
    var retVal : boolean
    try{
      retVal = new Boolean(_coverable[_genericAttribute.Column] as String).booleanValue()
    } catch (e : Exception){
      retVal = null
    }
    return retVal
  }
  
  public property set integerValue(inValue : int){
    coverable[_genericAttribute.Column] = inValue
  }
  
  public property get integerValue() : int {
    var retVal : int
    try {
      retVal = Integer.parseInt(_coverable[_genericAttribute.Column] as String)
    } catch (e : Exception){
      retVal = null
    }
    return retVal
  } 
  
  public property set longValue(inValue : long){
    coverable[_genericAttribute.Column] = inValue
  }
  
  public property get longValue() : long {
    var retVal : long
    retVal = Long.parseLong(_coverable[_genericAttribute.Column] as String)
    return retVal
  }
  
  public property set decimalValue(inValue : BigDecimal){
    coverable[_genericAttribute.Column] = inValue
  }
  
  public property get decimalValue() : BigDecimal {
    var retVal : BigDecimal
    try {
      retVal = new BigDecimal(_coverable[_genericAttribute.Column] as String)
    } catch(e : Exception){
      retVal = null
    }
    return retVal
  }
  
  public property set dateValue(inValue : Date){
    coverable[_genericAttribute.Column] = inValue
  }
  
  public property get dateValue() : Date {
    var retVal : Date
    try{
      retVal = (new SimpleDateFormat("yyyy-MM-dd").parse((_coverable[_genericAttribute.Column] as String)))
    } catch (e : Exception){
      retVal = DateUtil.currentDate()
    }
    return retVal
  }  

  public property set moneyValue(inValue : BigDecimal){
    coverable[_genericAttribute.Column] = inValue
  }
  
  public property get moneyValue() : BigDecimal {
    var retVal : BigDecimal
    try{
      retVal = new BigDecimal(_coverable[_genericAttribute.Column] as String)
    } catch (e : Exception){
      retVal = null
    }
    return retVal
  }
  
  public property set rangeValue(inValue : rangeItem){
    coverable[_genericAttribute.Column] = inValue.code
  }
  
  public property get rangeValue() : rangeItem {
    var retVal : rangeItem
    retVal = _rangeList.firstWhere(\ r -> r.code == (_coverable[_genericAttribute.Column] as String))
    return retVal
  }

  /**
   * Create a list of items to be used in the UI
  */
  public function rangeList() : List<rangeItem>{
    if(_rangeList == null){
      _rangeList = new ArrayList<rangeItem>()
      if(_genericAttribute.ListType == GenericListType_Ext.TC_MAPPEDLIST){
        var query = Query.make(GenericListMap_Ext).compare("ListCode", Equals, _genericAttribute.ListCode)
        var results = query.select().orderBy(\ g -> g.Priority).iterator()
        while(results.hasNext()){
          var resultVal = results.next()
          var rangeVal = new rangeItem(){:code = resultVal.Code,
                                         :name = resultVal.Name,
                                         :priority = resultVal.Priority}
          _rangeList.add(rangeVal)
        }
      }
      if(_genericAttribute.ListType == GenericListType_Ext.TC_TYPELIST){
        var results = gw.util.TypekeyUtil.getTypeKeys(_genericAttribute.ListCode)
        results.each( \ elt -> {
          var rangeVal = new rangeItem(){:code = (elt["Code"] as String),
                                         :name = (elt["Name"] as String),
                                         :priority = (elt["Priority"] as int)}
          _rangeList.add(rangeVal)
        })
      }
    }
    return _rangeList
  }

}
