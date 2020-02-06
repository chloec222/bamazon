# bamazon
# BAMAZON
### Overview
Bamazon is an Amazon-like storefront utilizing the MySQL database. The app will take in orders from customers and deplete stock from the store's inventory.


Applications Used:
- [x] mySQL Server & Workbench
- [x] mySQl npm
- [x] INquirer npm


**Bamazon will take in a specific command and render results based on the specified command.**
###bmazonCustomer
- view products
- buy products
- cancel/exit


###bmazonManager
- view products for sale
- view low inventory
- add to inventory
- add new product


### BAMAZON-CUSTOMER MAIN STOREFROMT
`bamazon` *to [view products], [buy products] or [cancel]*
![Image of lowstock1](/images/lowstock1.png)


#### CASE 1: `VIEW PRODUCTS` WITH INSUFFICENT STOCK OF SELECTED ITEM 
*choice to select specific item from inventory
![Image of lowstock1](/images/lowstock1.png)


*selected item low in stock
![Image of lowstock2](/images/lowstock2.png)




#### CASE 2: `VIEW PRODUCTS` WITH SUFFICIENT STOCK OF SELECTED ITEM
*choice to select specific item from inventory
![Image of stock1](/images/stock1.png)


*selected item in stock
![Image of stock2](/images/stock2.png)


*options to either buy or return to main opening prompt
![Image of stock3](/images/stock3.png)



#### CASE 3: `BUY PRODUCTS` WITHOUT NEEDING TO `VIEW PRODUCTS` FIRST
*selected item to be purchased right away
![Image of buy](/images/buy.png)


#### CASE 4: `CANCEL`TO EXIT BAMAZON ONLINE STOREFRONT
*exit out of bamazon immediately
![Image of cancel](/images/cancel.png)


