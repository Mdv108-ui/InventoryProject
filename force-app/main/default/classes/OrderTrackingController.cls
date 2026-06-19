public with sharing class OrderTrackingController {

    public class OrderDetailsWrapper {
        @AuraEnabled public Order__c orderRecord;
        @AuraEnabled public List<Order_Item__c> orderItems;
    }

    @AuraEnabled(cacheable=true)
    public static OrderDetailsWrapper getOrderDetails(Id orderId) {
        if (orderId == null) {
            throw new AuraHandledException('Order Id is required.');
        }

        Order__c orderRecord = [
            SELECT Id, Name, Customer_Name__c, Order_Date__c,
                   Status__c, Total_Amount__c
            FROM Order__c
            WHERE Id = :orderId
            LIMIT 1
        ];

        List<Order_Item__c> orderItems = [
            SELECT Id, Name, Product__c, Product__r.Name,
                   Quantity__c, Price__c, Subtotal__c
            FROM Order_Item__c
            WHERE Order__c = :orderId
        ];

        OrderDetailsWrapper wrapper = new OrderDetailsWrapper();
        wrapper.orderRecord = orderRecord;
        wrapper.orderItems = orderItems;

        return wrapper;
    }
}