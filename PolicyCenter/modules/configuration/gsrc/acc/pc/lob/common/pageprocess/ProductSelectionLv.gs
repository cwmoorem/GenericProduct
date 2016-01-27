package acc.pc.lob.common.pageprocess

uses acc.pc.job.AvailableProduct
uses java.util.ArrayList
uses gw.api.database.Query

class ProductSelectionLv {

  construct(){
  }

  public function availableProductOffers(productOffers : ProductSelection[]) : AvailableProduct[] {

    var availableProducts = new ArrayList<AvailableProduct>()

    for(product in productOffers){
      if(product.ProductCode == "GPGeneric"){
        var queryProducts = Query.make(GenericProduct_Ext).select()
        for(qProduct in queryProducts){
          var availableProduct = new AvailableProduct()
          availableProduct.productCode = product.ProductCode
          availableProduct.productSelection = product
          availableProduct.variation = qProduct
          availableProduct.order = 999
          availableProducts.add(availableProduct)
        }
      } else {
        var availableProduct = new AvailableProduct()
        availableProduct.productCode = product.ProductCode
        availableProduct.productSelection = product
        availableProduct.order = 1
        availableProducts.add(availableProduct)
      }
    }
    return availableProducts.toTypedArray()
  }

}