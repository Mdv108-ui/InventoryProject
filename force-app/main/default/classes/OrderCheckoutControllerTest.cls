@isTest
private class OrderCheckoutControllerTest {

    @isTest
    static void testCreateOrderSuccess() {
        Product__c product = new Product__c(
            Name = 'Laptop',
            Product_Code__c = 'P001',
            Category__c = 'Electronics',
            Price__c = 50000,
            Quantity__c = 10,
            Active__c = true
        );
        insert product;

        String cartJson = JSON.serialize(new List<Map<String, Object>>{
            new Map<String, Object>{
                'id' => product.Id,
                'name' => product.Name,
                'price' => product.Price__c,
                'cartQuantity' => 2
            }
        });

        Test.startTest();
        Id orderId = OrderCheckoutController.createOrder('Madhavi', cartJson);
        Test.stopTest();

        Order__c ord = [
            SELECT Id, Customer_Name__c, Status__c, Total_Amount__c
            FROM Order__c
            WHERE Id = :orderId
        ];

        System.assertEquals('Madhavi', ord.Customer_Name__c);
        System.assertEquals('Confirmed', ord.Status__c);
        System.assertEquals(100000, ord.Total_Amount__c);

        List<Order_Item__c> items = [
            SELECT Id, Product__c, Quantity__c, Price__c, Subtotal__c
            FROM Order_Item__c
            WHERE Order__c = :orderId
        ];

        System.assertEquals(1, items.size());
        System.assertEquals(product.Id, items[0].Product__c);
        System.assertEquals(2, items[0].Quantity__c);
        System.assertEquals(50000, items[0].Price__c);

        Product__c updatedProduct = [
            SELECT Quantity__c
            FROM Product__c
            WHERE Id = :product.Id
        ];

        System.assertEquals(8, updatedProduct.Quantity__c);
    }

    @isTest
    static void testCreateOrderEmptyCustomerName() {
        try {
            OrderCheckoutController.createOrder('', '[]');
            System.assert(false, 'Exception should have been thrown.');
        } catch (AuraHandledException e) {
            System.assert(true);
        }
    }

    @isTest
    static void testCreateOrderInsufficientStock() {
        Product__c product = new Product__c(
            Name = 'Mobile',
            Product_Code__c = 'P002',
            Category__c = 'Electronics',
            Price__c = 20000,
            Quantity__c = 1,
            Active__c = true
        );
        insert product;

        String cartJson = JSON.serialize(new List<Map<String, Object>>{
            new Map<String, Object>{
                'id' => product.Id,
                'name' => product.Name,
                'price' => product.Price__c,
                'cartQuantity' => 5
            }
        });

        try {
            OrderCheckoutController.createOrder('Test Customer', cartJson);
            System.assert(false, 'Exception should have been thrown.');
        } catch (AuraHandledException e) {
            System.assert(true);
        }
    }
}