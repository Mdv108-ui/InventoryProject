import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ShoppingCart extends LightningElement {
    @track cartItems = [];

    @api
    addItem(product) {
        const existingItem = this.cartItems.find(
            item => item.productId === product.productId
        );

        if (existingItem) {
            this.cartItems = this.cartItems.map(item => {
                if (item.productId === product.productId) {
                    if (item.quantity >= item.availableQty) {
                        this.showToast(
                            'Stock Limit',
                            'Cannot add more than available quantity.',
                            'warning'
                        );
                        return item;
                    }

                    const newQuantity = item.quantity + 1;

                    return {
                        ...item,
                        quantity: newQuantity,
                        subtotal: newQuantity * item.price
                    };
                }
                return item;
            });
        } else {
            this.cartItems = [
                ...this.cartItems,
                {
                    productId: product.productId,
                    productName: product.productName,
                    productCode: product.productCode,
                    category: product.category,
                    price: product.price || 0,
                    availableQty: product.availableQty || 0,
                    quantity: 1,
                    subtotal: product.price || 0
                }
            ];
        }

        this.notifyCheckout();
    }

    handleQuantityChange(event) {
        const productId = event.target.dataset.id;
        let enteredQuantity = parseInt(event.target.value, 10);

        this.cartItems = this.cartItems.map(item => {
            if (item.productId === productId) {
                if (isNaN(enteredQuantity) || enteredQuantity < 1) {
                    enteredQuantity = 1;
                }

                if (enteredQuantity > item.availableQty) {
                    enteredQuantity = item.availableQty;
                    this.showToast(
                        'Stock Limit',
                        'Quantity cannot exceed available stock.',
                        'warning'
                    );
                }

                return {
                    ...item,
                    quantity: enteredQuantity,
                    subtotal: enteredQuantity * item.price
                };
            }

            return item;
        });

        this.notifyCheckout();
    }

    handleRemove(event) {
        const productId = event.target.dataset.id;

        this.cartItems = this.cartItems.filter(
            item => item.productId !== productId
        );

        this.notifyCheckout();
    }

    handleCheckout() {
        this.notifyCheckout();
    }

    notifyCheckout() {
        this.dispatchEvent(
            new CustomEvent('checkout', {
                detail: {
                    cartItems: this.cartItems,
                    grandTotal: this.grandTotal
                }
            })
        );
    }

    get hasItems() {
        return this.cartItems.length > 0;
    }

    get grandTotal() {
        return this.cartItems.reduce(
            (total, item) => total + item.subtotal,
            0
        );
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