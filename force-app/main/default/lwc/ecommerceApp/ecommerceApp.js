import { LightningElement } from 'lwc';

export default class EcommerceApp extends LightningElement {

    handleAddToCart(event) {
        const product = event.detail;

        this.template
            .querySelector('c-shopping-cart')
            .addItem(product);
    }
    
handleCheckout(event) {

    const cartItems = event.detail.cartItems;
    const grandTotal = event.detail.grandTotal;

    this.template
        .querySelector('c-order-checkout')
        .setCheckoutData(
            cartItems,
            grandTotal
        );
}
}