import { LightningElement, api, track } from 'lwc';
import createOrder from '@salesforce/apex/OrderCheckoutController.createOrder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OrderCheckout extends LightningElement {
    @track cartItems = [];

    customerName = '';
    grandTotal = 0;

    @api
    setCheckoutData(cartItems, grandTotal) {
        this.cartItems = cartItems || [];
        this.grandTotal = grandTotal || 0;

        console.log('Checkout Items => ', JSON.stringify(this.cartItems));
        console.log('Grand Total => ', this.grandTotal);
    }

    get hasItems() {
        return this.cartItems && this.cartItems.length > 0;
    }

    handleNameChange(event) {
        this.customerName = event.target.value;
    }

    handleConfirmOrder() {
        if (!this.customerName) {
            this.showToast('Error', 'Please enter customer name.', 'error');
            return;
        }

        if (!this.cartItems || this.cartItems.length === 0) {
            this.showToast('Error', 'Cart is empty.', 'error');
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

        console.log('Cart Payload => ', JSON.stringify(cartPayload));

        createOrder({
            customerName: this.customerName,
            cartJson: JSON.stringify(cartPayload)
        })
            .then(orderId => {
                this.showToast(
                    'Success',
                    'Order Created Successfully. Order Id: ' + orderId,
                    'success'
                );

                this.dispatchEvent(
                    new CustomEvent('ordercreated', {
                        detail: orderId
                    })
                );

                this.cartItems = [];
                this.grandTotal = 0;
                this.customerName = '';
            })
            .catch(error => {
                console.error('Order Error => ', JSON.stringify(error));

                this.showToast(
                    'Error',
                    error?.body?.message || 'Order creation failed.',
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