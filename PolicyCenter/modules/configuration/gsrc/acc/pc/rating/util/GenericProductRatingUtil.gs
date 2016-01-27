package acc.pc.rating.util

uses gw.api.database.Query
uses java.util.ArrayList

class GenericProductRatingUtil {

  var _rateBook        : RateBook         as rateBook
  var _genericProducts : productWrapper[] as genericProducts

  construct(inRateBook : RateBook){
    _rateBook = inRateBook
    loadGenericProducts()
  }

  class productWrapper{
    var _productCode : String             as productCode
    var _productName : String             as productName
    var _product     : GenericProduct_Ext as product
  }

  public function loadGenericProducts(){
    var retVal = new ArrayList<productWrapper>()
    var query = Query.make(GenericProduct_Ext).select()
    query.each( \ elt -> {
      retVal.add(new productWrapper(){:productCode = elt.ProductCode, :productName = elt.Name, :product = elt})
    })
    _genericProducts = retVal.toTypedArray()
  }

  public property get genericProduct() : productWrapper {
    var retVal : productWrapper
    retVal = _genericProducts.firstWhere( \ elt -> elt.productCode == _rateBook.GenericProductCode)
    return retVal
  }

  public property set genericProduct(inProductWrapper : productWrapper){
    _rateBook.GenericProductCode = inProductWrapper.productCode
  }

}