@isTest
private class ProductCatalogControllerTest {

    @isTest
    static void testGetActiveProducts() {

        Product__c p1 = new Product__c(
            Name='Laptop',
            Product_Code__c='P001',
            Category__c='Electronics',
            Price__c=50000,
            Quantity__c=10,
            Active__c=true
        );

        Product__c p2 = new Product__c(
            Name='Mobile',
            Product_Code__c='P002',
            Category__c='Electronics',
            Price__c=20000,
            Quantity__c=5,
            Active__c=false
        );

        insert new List<Product__c>{p1,p2};

        Test.startTest();

        List<Product__c> products =
            ProductCatalogController.getActiveProducts();

        Test.stopTest();

        System.assertEquals(1, products.size());
        System.assertEquals('Laptop', products[0].Name);
    }
}