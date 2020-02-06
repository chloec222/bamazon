# BAMAZON
### Overview
Bamazon is an Amazon-like storefront utilizing the MySQL database. The app will take in orders from customers and deplete stock from the store's inventory.


Applications Used:
- [x] mySQL Server & Workbench
- [x] mySQl npm
- [x] INquirer npm


**Bamazon will take in a specific command and render results based on the specified command.**
### BAMAZON-CUSTOMER
- view products
- buy products
- cancel/exit


### BAMAZON-MANAGER
- view products for sale
- view low inventory
- add to inventory
- add new product


### BAMAZON-CUSTOMER MAIN STOREFRONT | *[view products], [buy products] or [cancel]* |
![Image of lowstock1](/images/lowstock1.png)


#### CASE 1: `VIEW PRODUCTS` WITH INSUFFICENT STOCK OF SELECTED ITEM 
- **Step 1: choose specific item from inventory**
![Image of lowstock1](/images/lowstock1.png)

- **Step 2: item low in stock**
![Image of lowstock2](/images/lowstock2.png)




#### CASE 2: `VIEW PRODUCTS` WITH SUFFICIENT STOCK OF SELECTED ITEM 
- **Step 1: choose specific item from inventory**
![Image of stock1](/images/stock1.png)


- **Step 2: item in stock**
![Image of stock2](/images/stock2.png)


- **Step 3: option to either buy or return to main opening prompt**
![Image of stock3](/images/stock3.png)



#### CASE 3: `BUY PRODUCTS` WITHOUT NEEDING TO `VIEW PRODUCTS` FIRST
- **Step 1: choose item to buy right away**
![Image of buy](/images/buy.png)


#### CASE 4: `CANCEL`TO EXIT BAMAZON ONLINE STOREFRONT
- **Step 1: exit out of bamazon immediately**
![Image of cancel](/images/cancel.png)


