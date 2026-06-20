# Inventory & Order Management System

## Project Overview

A Salesforce-based Inventory & Order Management System designed to streamline product management, inventory tracking, order processing, and customer order tracking.

This application automates inventory creation, monitors stock levels, generates low stock alerts, and provides an intuitive Lightning Web Component (LWC) user interface for managing products and orders.

---

## Features

### Product Management

* Create, update, and delete products
* Activate/deactivate products
* Product catalog display

### Inventory Management

* Automatic inventory record creation when a product is created
* Stock quantity tracking
* Reorder level management
* Low stock alerts via Flow
* Stock status calculation

### Order Management

* Shopping cart functionality
* Add/remove products from cart
* Quantity updates
* Order checkout process
* Order status tracking

### Security Model

* System Administrator access
* Sales User access
* Object-level permissions
* Field-level security

---

## Custom Objects

### Product__c

* Product Code
* Price
* Description
* Active

### Inventory__c

* Product Lookup
* Stock Quantity
* Reorder Level
* Stock Status

### Order__c

* Order Number
* Customer Name
* Order Date
* Status
* Total Amount

### Order_Item__c

* Product Lookup
* Quantity
* Price
* Subtotal

---

## Automation

### Flow 1

Product Creation → Inventory Creation

### Flow 2

Inventory Update → Low Stock Email Alert

---

## Lightning Web Components

### Product Catalog

Displays active products and allows users to add products to the cart.

### Shopping Cart

* Add items
* Remove items
* Update quantities
* Calculate totals

### Order Checkout

Creates orders and order items.

### Order Tracking

Displays order status and history.

---

## Technology Stack

* Salesforce Platform
* Apex
* Lightning Web Components (LWC)
* Record Triggered Flows
* SOQL
* Lightning App Builder
* Reports & Dashboards

---

## Business Flow

Product Creation
→ Inventory Creation
→ Product Catalog
→ Shopping Cart
→ Checkout
→ Order Creation
→ Inventory Update
→ Order Tracking

---

## Security

* Public Read Only for Products
* Public Read Only for Inventory
* Private Orders
* Permission Sets for Sales Users

---

## Future Enhancements

* Discount and Coupon Management
* Multi-Warehouse Inventory
* External ERP Integration
* REST API Integration
* Advanced Analytics Dashboard

---

## Deployment

1. Clone Repository
2. Authorize Salesforce Org
3. Deploy Metadata
4. Assign Permissions
5. Activate Flows
6. Add LWCs to Lightning Pages

---

## Author

Madhavi Ganji
Salesforce Developer
