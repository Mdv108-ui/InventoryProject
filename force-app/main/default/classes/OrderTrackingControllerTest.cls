@isTest
private class OrderTrackingControllerTest {

    @isTest
    static void testGetOrderDetails() {
        Product__c product = new Product__c(
            Name = 'Keyboard',
            Product_Code__c = 'P003',
            Category__c = 'Electronics',
            Price__c = 1500,
            Quantity__c = 20,
            Active__c = true
        );
        insert product;

        Order__c orderRecord = new Order__c(
            Customer_Name__c = 'Madhavi',
            Order_Date__c = Date.today(),
            Status__c = 'Confirmed',
            Total_Amount__c = 3000
        );
        insert orderRecord;

        Order_Item__c orderItem = new Order_Item__c(
            Order__c = orderRecord.Id,
            Product__c = product.Id,
            Quantity__c = 2,
            Price__c = 1500
        );
        insert orderItem;

        Test.startTest();
        OrderTrackingController.OrderDetailsWrapper result =
            OrderTrackingController.getOrderDetails(orderRecord.Id);
        Test.stopTest();

        System.assertNotEquals(null, result);
        System.assertEquals(orderRecord.Id, result.orderRecord.Id);
        System.assertEquals('Madhavi', result.orderRecord.Customer_Name__c);
        System.assertEquals(1, result.orderItems.size());
        System.assertEquals(product.Id, result.orderItems[0].Product__c);
    }

    @isTest
    static void testGetOrderDetailsNullId() {
        try {
            OrderTrackingController.getOrderDetails(null);
            System.assert(false, 'Exception should have been thrown.');
        } catch (AuraHandledException e) {
            System.assert(true);
        }
    }
}