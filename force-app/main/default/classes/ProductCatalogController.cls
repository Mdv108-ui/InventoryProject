/**
 * Controller for retrieving active products in the product catalog.
 */
public with sharing class ProductCatalogController {

    /**
     * Retrieves active products from the catalog.
     *
     * @return List of active Product__c records.
     */
    @AuraEnabled(cacheable=true)
    public static List<Product__c> getActiveProducts() {

        if (!Schema.sObjectType.Product__c.isAccessible()) {
            throw new AuraHandledException('Access denied to Product records.');
        }

        return [
            SELECT Id,
                   Name,
                   Product_Code__c,
                   Category__c,
                   Description__c,
                   Price__c,
                   Quantity__c,
                   Active__c
            FROM Product__c
            WHERE Active__c = true
            ORDER BY Name ASC
        ];
    }
}