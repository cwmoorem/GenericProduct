package acc.pc.lob.gp.pageprocess

uses java.util.ArrayList
uses gw.api.database.Query
uses java.lang.Exception
uses java.lang.Integer
uses java.lang.Long
uses java.math.BigDecimal
uses java.util.Date
uses java.text.SimpleDateFormat
uses gw.api.util.DateUtil

class GPGenericScheduleInputCell {
  
  private var _genericItem : GenericScheduleItemMap_Ext as genericItem
  private var _item        : GPScheduleItem_Ext         as item
  private var _rangeList   : ArrayList<rangeItem>       as rangeList

  class rangeItem{
    private var _code     : String as code
    private var _name     : String as name
    private var _priority : int    as priority
  }

  construct(inGenericItem : GenericScheduleItemMap_Ext, inItem : GPScheduleItem_Ext ) {
    init(inGenericItem, inItem)
  }
  
  private function init(inGenericItem : GenericScheduleItemMap_Ext, inItem : GPScheduleItem_Ext){
    _genericItem = inGenericItem
    _item = inItem
    if(inGenericItem.ListCode != null){
      rangeList()
    }
  }

  public property get required() : boolean {
    var retVal = false
    if(_genericItem != null){
      if(_genericItem.Required == true){
        retVal = true
      }
    }
    return retVal
  }

  public property set stringValue(inValue : String){
    _item[_genericItem.Column] = inValue
  }
  
  public property get stringValue() : String {
    var retVal : String
    retVal = (_item[_genericItem.Column] as String)
    return retVal
  }
  
  public property set booleanValue(inValue : boolean){
    _item[_genericItem.Column] = inValue
  }
  
  public property get booleanValue() : boolean {
    var retVal : boolean
    try{
      retVal = new Boolean(_item[_genericItem.Column] as String).booleanValue()
    } catch (e : Exception){
      retVal = null
    }
    return retVal
  }
  
  public property set integerValue(inValue : int){
    _item[_genericItem.Column] = inValue
  }
  
  public property get integerValue() : int {
    var retVal : int
    try {
      retVal = Integer.parseInt(_item[_genericItem.Column] as String)
    } catch (e : Exception){
      retVal = null
    }
    return retVal
  } 
  
  public property set longValue(inValue : long){
    _item[_genericItem.Column] = inValue
  }
  
  public property get longValue() : long {
    var retVal : long
    retVal = Long.parseLong(_item[_genericItem.Column] as String)
    return retVal
  }
  
  public property set decimalValue(inValue : BigDecimal){
    _item[_genericItem.Column] = inValue
  }
  
  public property get decimalValue() : BigDecimal {
    var retVal : BigDecimal
    try {
      retVal = new BigDecimal(_item[_genericItem.Column] as String)
    } catch(e : Exception){
      retVal = null
    }
    return retVal
  }
  
  public property set dateValue(inValue : Date){
    _item[_genericItem.Column] = inValue
  }
  
  public property get dateValue() : Date {
    var retVal : Date
    try{
      retVal = (new SimpleDateFormat("yyyy-MM-dd").parse((_item[_genericItem.Column] as String)))
//      retVal = new Date(_item[_genericItem.Column] as String)
    } catch (e : Exception){
      retVal = DateUtil.currentDate()
    }
    return retVal
  }  

  public property set moneyValue(inValue : BigDecimal){
    _item[_genericItem.Column] = inValue
  }
  
  public property get moneyValue() : BigDecimal {
    var retVal : BigDecimal
    try{
      retVal = new BigDecimal(_item[_genericItem.Column] as String)
    } catch (e : Exception){
      retVal = null
    }
    return retVal
  }
  
  public property set rangeValue(inValue : rangeItem){
    _item[_genericItem.Column] = inValue.code
  }
  
  public property get rangeValue() : rangeItem {
    var retVal : rangeItem
    try{
      retVal = _rangeList.firstWhere(\ r -> r.code == (_item[_genericItem.Column] as String))
    } catch (e : Exception){
      retVal = null
    }
    return retVal
  }   
  
  public function rangeList() : List<rangeItem>{
    if(_rangeList == null){
      _rangeList = new ArrayList<rangeItem>()
      if(_genericItem.ListType == GenericListType_Ext.TC_MAPPEDLIST){
        var query = Query.make(GenericListMap_Ext).compare("ListCode", Equals, _genericItem.ListCode)
        var results = query.select().orderBy(\ g -> g.Priority).iterator()
        while(results.hasNext()){
          var resultVal = results.next()
          var rangeVal = new rangeItem(){:code = resultVal.Code,
                                         :name = resultVal.Name,
                                         :priority = resultVal.Priority}
          _rangeList.add(rangeVal)
        }
      }
      if(_genericItem.ListType == GenericListType_Ext.TC_TYPELIST){
        var results = gw.util.TypekeyUtil.getTypeKeys(_genericItem.ListCode)
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
