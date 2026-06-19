import { LightningElement, wire } from 'lwc';
import getActiveProducts from '@salesforce/apex/ProductCatalogController.getActiveProducts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ProductCatalog extends LightningElement {
    products;
    error;

    @wire(getActiveProducts)
    wiredProducts({ data, error }) {
        if (data) {
            this.products = data.map(product => {
                return {
                    ...product,
                    isOutOfStock: product.Quantity__c <= 0
                };
            });
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.products = undefined;
        }
    }

    handleAddToCart(event) {
        const productId = event.target.dataset.id;
        const selectedProduct = this.products.find(product => product.Id === productId);

        const addToCartEvent = new CustomEvent('addtocart', {
            detail: selectedProduct
        });

        this.dispatchEvent(addToCartEvent);

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Added to Cart',
                message: selectedProduct.Name + ' added to cart.',
                variant: 'success'
            })
        );
    }
}