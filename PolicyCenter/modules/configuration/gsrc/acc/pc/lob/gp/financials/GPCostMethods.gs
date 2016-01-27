package acc.pc.lob.gp.financials

/**
 * Additional methods and properties provided by the costs that supply this interface.
 */
@Export
interface GPCostMethods
{
  property get Coverage() : Coverage
  property get OwningCoverable() : Coverable
  property get Jurisdiction() : Jurisdiction
}
