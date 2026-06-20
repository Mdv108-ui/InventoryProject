import { LightningElement, api, track } from 'lwc';
import createOrder from '@salesforce/apex/OrderCheckoutController.createOrder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OrderCheckout extends LightningElement {

    @track cartItems = [];

    customerName = '';
    grandTotal = 0;

    @api
    setCheckoutData(cartItems, grandTotal) {
        this.cartItems = cartItems;
        this.grandTotal = grandTotal;
    }

    get hasItems() {
        return this.cartItems.length > 0;
    }

    handleNameChange(event) {
        this.customerName = event.target.value;
    }

    handleConfirmOrder() {

        if (!this.customerName) {
            this.showToast(
                'Error',
                'Please enter customer name.',
                'error'
            );
            return;
        }

        const cartPayload = this.cartItems.map(item => {
    return {
        id: item.productId,
        name: item.productName,
        price: item.price,
        cartQuantity: item.quantity
    };
});

        createOrder({
            customerName: this.customerName,
            cartJson: JSON.stringify(cartPayload)
        })
        .then(orderId => {

            this.showToast(
                'Success',
                'Order Created Successfully',
                'success'
            );

            this.dispatchEvent(
                new CustomEvent('ordercreated', {
                    detail: orderId
                })
            );
        })
        .catch(error => {

            this.showToast(
                'Error',
                error.body.message,
                'error'
            );
        });
    }

    showToast(title, message, variant) {

        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}