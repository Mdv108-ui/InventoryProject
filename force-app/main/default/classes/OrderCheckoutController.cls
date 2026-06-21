public with sharing class OrderCheckoutController {

    public class CartItemWrapper {
        @AuraEnabled public Id id;
        @AuraEnabled public String name;
        @AuraEnabled public Decimal price;
        @AuraEnabled public Integer cartQuantity;
    }

    @AuraEnabled
    public static Id createOrder(
        String customerName,
        String customerEmail,
        String cartJson
    ) {
        if (String.isBlank(customerName)) {
            throw new AuraHandledException('Customer name is required.');
        }

        if (String.isBlank(customerEmail)) {
            throw new AuraHandledException('Customer email is required.');
        }

        List<CartItemWrapper> cartItems = parseCartItems(cartJson);
        validateCartItems(cartItems);
        validatePermissions();

        Savepoint sp = Database.setSavepoint();

        try {
            Decimal grandTotal = calculateGrandTotal(cartItems);
            Order__c orderRecord = insertOrder(customerName, customerEmail, grandTotal);
            Map<Id, Product__c> productMap = getProductMap(cartItems);

            List<Order_Item__c> orderItems = new List<Order_Item__c>();
            List<Product__c> productsToUpdate = new List<Product__c>();

            processCartItems(cartItems, orderRecord.Id, productMap, orderItems, productsToUpdate);

            if (!orderItems.isEmpty()) {
                insert orderItems;
            }

            if (!productsToUpdate.isEmpty()) {
                update productsToUpdate;
            }

            return orderRecord.Id;

        } catch (Exception e) {
            Database.rollback(sp);
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static List<CartItemWrapper> parseCartItems(String cartJson) {
        List<CartItemWrapper> cartItems =
            (List<CartItemWrapper>) JSON.deserialize(cartJson, List<CartItemWrapper>.class);

        if (cartItems == null || cartItems.isEmpty()) {
            throw new AuraHandledException('Cart is empty.');
        }

        return cartItems;
    }

    private static void validateCartItems(List<CartItemWrapper> cartItems) {
        for (CartItemWrapper item : cartItems) {
            if (item.id == null) {
                throw new AuraHandledException('Product Id is missing.');
            }

            if (item.cartQuantity == null || item.cartQuantity <= 0) {
                throw new AuraHandledException('Invalid quantity for product: ' + item.name);
            }

            if (item.price == null || item.price <= 0) {
                throw new AuraHandledException('Invalid price for product: ' + item.name);
            }
        }
    }

    private static void validatePermissions() {
        if (!Schema.sObjectType.Order__c.isCreateable()) {
            throw new AuraHandledException('Insufficient permissions to create order.');
        }

        if (!Schema.sObjectType.Order_Item__c.isCreateable()) {
            throw new AuraHandledException('Insufficient permissions to create order items.');
        }

        if (!Schema.sObjectType.Product__c.isUpdateable()) {
            throw new AuraHandledException('Insufficient permissions to update products.');
        }
    }

    private static Decimal calculateGrandTotal(List<CartItemWrapper> cartItems) {
        Decimal grandTotal = 0;

        for (CartItemWrapper item : cartItems) {
            grandTotal += item.cartQuantity * item.price;
        }

        return grandTotal;
    }

    private static Order__c insertOrder(
        String customerName,
        String customerEmail,
        Decimal grandTotal
    ) {
        Order__c orderRecord = new Order__c(
            Customer_Name__c = customerName,
            Customer_Email__c = customerEmail,
            Order_Date__c = Date.today(),
            Status__c = 'Confirmed',
            Total_Amount__c = grandTotal
        );

        insert orderRecord;
        return orderRecord;
    }

    private static Map<Id, Product__c> getProductMap(List<CartItemWrapper> cartItems) {
        return new Map<Id, Product__c>([
            SELECT Id, Quantity__c
            FROM Product__c
            WHERE Id IN :getProductIds(cartItems)
            FOR UPDATE
        ]);
    }

    private static void processCartItems(
        List<CartItemWrapper> cartItems,
        Id orderId,
        Map<Id, Product__c> productMap,
        List<Order_Item__c> orderItems,
        List<Product__c> productsToUpdate
    ) {
        for (CartItemWrapper item : cartItems) {
            Product__c product = productMap.get(item.id);

            if (product == null) {
                throw new AuraHandledException('Product not found: ' + item.name);
            }

            if (product.Quantity__c < item.cartQuantity) {
                throw new AuraHandledException('Insufficient stock for product: ' + item.name);
            }

            orderItems.add(new Order_Item__c(
                Order__c = orderId,
                Product__c = item.id,
                Quantity__c = item.cartQuantity,
                Price__c = item.price
            ));

            product.Quantity__c = product.Quantity__c - item.cartQuantity;
            productsToUpdate.add(product);
        }
    }

    private static Set<Id> getProductIds(List<CartItemWrapper> cartItems) {
        Set<Id> productIds = new Set<Id>();

        for (CartItemWrapper item : cartItems) {
            if (item.id != null) {
                productIds.add(item.id);
            }
        }

        return productIds;
    }
}