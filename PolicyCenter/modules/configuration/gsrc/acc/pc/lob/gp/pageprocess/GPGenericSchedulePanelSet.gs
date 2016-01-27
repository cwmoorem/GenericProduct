package acc.pc.lob.gp.pageprocess

uses java.util.ArrayList

class GPGenericSchedulePanelSet {
  
  private var _generic       : GPSchedule_Ext                  as generic
  private var _scheduleItems : List<GPScheduleItem_Ext>        as scheduleItems
  private var _usedMap       : List<usage>                     as usedMap

  class usage{
    private var _name     : String                     as name
    private var _used     : boolean                    as used
    private var _column   : int                        as column
    private var _storage  : String                     as storage
    private var _generic  : GenericScheduleItemMap_Ext as generic
  }

  construct(inGeneric : GPSchedule_Ext) {
    init(inGeneric)
  }
  
  private function init(inGeneric : GPSchedule_Ext){
    _generic = inGeneric
    buildScheduleITems()
  }
  
  public function buildScheduleITems(){
    _usedMap = new ArrayList<usage>()
    for(item in 1..10){
       var newUsage = new usage(){:used = false, :column = item}
       _usedMap.add(newUsage) 
    }
    if(_generic.GenericScheduleMap.GenericScheduleItemsMap.HasElements){
      for(item in _generic.GenericScheduleMap.GenericScheduleItemsMap.orderBy(\ g -> g.Priority) index i){
        if(_usedMap.hasMatch(\ u -> u.column == (i + 1))){
          var uiUsage = _usedMap.firstWhere(\ u -> u.column == (i + 1))
          uiUsage.name = item.Name
          uiUsage.used = true
          uiUsage.storage = item.Column
          uiUsage.generic = item
        }
      }
    }
  }
  
  public function cellHeader(inCell : int) : String{
    var retVal : String
    if(_usedMap.hasMatch(\ u -> u.column == inCell)){
     retVal = _usedMap.firstWhere(\ u -> u.column == inCell).name
    } else {
      retVal = ""
    }
    return retVal
  }
  
  public function cellUsed(inCell : int) : boolean{
    var retVal : boolean
    if(_usedMap.hasMatch(\ u -> u.column == inCell)){
      retVal = _usedMap.firstWhere(\ u -> u.column == inCell).used
    } else {
      retVal = false
    }
    return retVal
  }
  
  public function genericItem(inCell : int) : GenericScheduleItemMap_Ext {
    var retVal : GenericScheduleItemMap_Ext
    if(_usedMap.hasMatch(\ u -> u.column == inCell)){
      retVal = _usedMap.firstWhere(\ u -> u.column == inCell).generic
    }
    return retVal    
  }
  
  public function addNewItem() : GPScheduleItem_Ext{
    var retVal : GPScheduleItem_Ext
    retVal = new GPScheduleItem_Ext(_generic.Branch)
    retVal.GPSchedule = _generic
    _generic.addToGPScheduleItem(retVal)
    return retVal
  }
  
  public function removeItem(inItem : GPScheduleItem_Ext){
    _generic.removeFromGPScheduleItem(inItem)
  }

  public function AttributeValueType(inCell : int) : String {
    var retVal : String
    if(genericItem(inCell).ListType != null){
      retVal = "range"
    } else {
      retVal = genericItem(inCell).AttributeValueType.Code
    }
    return retVal
  }

}
