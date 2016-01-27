package acc.pc.lob.gp.financials
uses gw.api.domain.financials.TransactionAdapter

@Export
class GPTransactionAdapter implements TransactionAdapter
{
  var _owner : GPTransaction_Ext
  
  construct( owner : GPTransaction_Ext )
  {
    _owner = owner
  }
  
  override property get Cost() : Cost
  {
    return _owner.GPCost_Ext
  }

}
