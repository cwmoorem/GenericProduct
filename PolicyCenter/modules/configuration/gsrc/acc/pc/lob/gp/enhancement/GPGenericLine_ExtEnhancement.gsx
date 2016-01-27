package acc.pc.lob.gp.enhancement

enhancement GPGenericLine_ExtEnhancement : entity.GPGenericLine_Ext {

  function createAndAddGPGeneric_Ext() : GPGeneric_Ext {
    var cbl = new GPGeneric_Ext(this.Branch)
    this.addToGPGenerics(cbl)
    if(this.Branch.Policy.GenericProduct.GenericSubProducts.Count == 1){
      cbl.GenericSubproduct = this.Branch.Policy.GenericProduct.GenericSubProducts.first()
    }
    cbl.syncModifiers()
    cbl.syncCoverages()
    return cbl
  }
  
  function removeGPGeneric_Ext(cbl : GPGeneric_Ext) {
    this.removeFromGPGenerics( cbl )
  }

  
  
}
