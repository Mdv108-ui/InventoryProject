import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ShoppingCart extends LightningElement {
    @track cartItems = [];

    @api
    addItem(product) {
        const existingItem = this.cartItems.find(item => item.Id === product.Id);

        if (existingItem) {
            if (existingItem.cartQuantity < existingItem.Quantity__c) {
                existingItem.cartQuantity += 1;
                existingItem.totalPrice = existingItem.cartQuantity * existingItem.Price__c;
            } else {
                this.showToast('Stock Limit', 'Cannot add more than available quantity.', 'warning');
            }
        } else {
            this.cartItems = [
                ...this.cartItems,
                {
                    ...product,
                    cartQuantity: 1,
                    totalPrice: product.Price__c
                }
            ];
        }

        this.cartItems = [...this.cartItems];
    }

    handleQuantityChange(event) {
        const productId = event.target.dataset.id;
        const enteredQuantity = parseInt(event.target.value, 10);

        this.cartItems = this.cartItems.map(item => {
            if (item.Id === productId) {
                let finalQuantity = enteredQuantity;

                if (finalQuantity > item.Quantity__c) {
                    finalQuantity = item.Quantity__c;
                    this.showToast('Stock Limit', 'Quantity cannot exceed available stock.', 'warning');
                }

                if (finalQuantity < 1 || isNaN(finalQuantity)) {
                    finalQuantity = 1;
                }

                return {
                    ...item,
                    cartQuantity: finalQuantity,
                    totalPrice: finalQuantity * item.Price__c
                };
            }

            return item;
        });
    }

    handleRemove(event) {
        const productId = event.target.dataset.id;
        this.cartItems = this.cartItems.filter(item => item.Id !== productId);
    }

    get hasItems() {
        return this.cartItems.length > 0;
    }

    get grandTotal() {
        return this.cartItems.reduce((total, item) => {
            return total + item.totalPrice;
        }, 0);
    }

    handleCheckout() {
        const checkoutEvent = new CustomEvent('checkout', {
            detail: {
                cartItems: this.cartItems,
                grandTotal: this.grandTotal
            }
        });

        this.dispatchEvent(checkoutEvent);
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }
}