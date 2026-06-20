import { LightningElement, track ,api} from 'lwc';
import getOrderDetails from '@salesforce/apex/OrderTrackingController.getOrderDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OrderTracking extends LightningElement {

    orderId;
    @track orderRecord;
    @track orderItems = [];
    @api
setOrderId(orderId) {
    this.orderId = orderId;
    this.handleSearch();
}

    handleOrderIdChange(event) {
        this.orderId = event.target.value;
    }

    handleSearch() {
        if (!this.orderId) {
            this.showToast('Error', 'Please enter Order Id.', 'error');
            return;
        }

        getOrderDetails({ orderId: this.orderId })
            .then(result => {
                this.orderRecord = result.orderRecord;
                this.orderItems = result.orderItems;
            })
            .catch(error => {
                this.showToast(
                    'Error',
                    error.body ? error.body.message : 'Order not found.',
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