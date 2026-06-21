import { LightningElement, api, track } from 'lwc';
import createOrder from '@salesforce/apex/OrderCheckoutController.createOrder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OrderCheckout extends LightningElement {
    @track cartItems = [];

    customerName = '';
    grandTotal = 0;
customerEmail = '';
    @api
    setCheckoutData(cartItems, grandTotal) {
        this.cartItems = cartItems || [];
        this.grandTotal = grandTotal || 0;
    }

    get hasItems() {
        return this.cartItems.length > 0;
    }

    handleNameChange(event) {
        this.customerName = event.target.value;
    }
    handleEmailChange(event) {
    this.customerEmail = event.target.value;
}

    handleConfirmOrder() {
        if (!this.customerName) {
            this.showToast('Error', 'Please enter customer name.', 'error');
            return;
        }
        if (!this.customerEmail) {
    this.showToast(
        'Error',
        'Please enter customer email.',
        'error'
    );
    return;
}

        if (!this.cartItems || this.cartItems.length === 0) {
            this.showToast('Error', 'Cart is empty.', 'error');
            return;
        }

        const cartPayload = this.cartItems.map(item => ({
            id: item.productId,
            name: item.productName,
            price: item.price,
            cartQuantity: item.quantity
        }));

        createOrder({
    customerName: this.customerName,
    customerEmail: this.customerEmail,
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