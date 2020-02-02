// =============set up variables===============

var mysql = require("mysql");
var table = require('cli-table');
var inquirer = require("inquirer");

// =============set up variables===============

var connection = mysql.createConnection({
host     : 'localhost',
port     : 3306,
user     : 'root',
  password : '',
database : 'bamazon'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("\r\n");
    console.log("==================================================================================================");
    console.log("\r\n");
    console.log("        * * * *     Welcome to Banila-Amazon- the Best Skincare for Makeup Lovers!    * * * *         ");
    console.log("\r\n");
    console.log("===================================================================================================");
    console.log("\r\n");
    start();
});

// =============make a selection===============
function start(){
    inquirer.prompt([{
        name: "choice",
        type: "rawlist",
        message: "What would you like to do?", 
        choices: [
            "View Products",
            "Search for Products",
            "Buy Products",
            "Cancel"],
        default: true
    }]).then(function(answer){
        switch(answer.choice){
            case "View Products":
                displayProducts(); //display product table
                start();
        
                break;
            case "Search for Products":
                searchProducts(); //search inventory
                break;
            case "Buy Products":
                buyProducts(); //take order & calculate total cost
                break;
            case "Cancel":
                console.log("Thank you for visiting, we hope to see you again!");
                break;
            default:
                console.log("Please make a selection!");
        }
    });
}

// =============displayProducts===============
function displayProducts(){
	var query = "SELECT * FROM products";
	connection.query(query, function(err, res){
		if(err) throw err;


    var displayTable = new Table ({
        head: ["Item ID", "Product Name", "Department","Category", "Price", "Quantity"],
        colWidths: [10,25,25,25,10,14]
    });
    for(var i = 0; i < res.length; i++){
        displayTable.push(
            [res[i].id,res[i].product_name, res[i].department_name, res[i].category,  res[i].price, res[i].stock_quantity]
            );
        }
        console.log(displayTable.toString());
        displayProducts();
        start();
    });
}


// =============searchProducts===============
function searchProducts(){
    inquirer.prompt([
		{
		type: "input",
		name: "id",
		message: "Please enter the Item ID of the product you would like to buy." + "\r\n",
		validate: function(value) {
		if (!isNaN(value) && value < 11) {
		return true;
		}
		return false;
		}
		},

		{
		type: "input",
		name: "quantity",
		message: "How many units of the product would you like to buy?" + "\r\n",
		validate: function(value) {
		if (!isNaN(value)) {
		return true;
		}
		return false;
		}
		}

		]).then(function(answer) {

			var userId = answer.id;
			console.log("Chosen item id: " , userId);

			var userQuantity = answer.quantity;
			console.log("Chosen quantity from stock: " , userQuantity , "\r\n");

			connection.query("SELECT * FROM products WHERE ?", [{ id : answer.id }], function(err, res) {
				if (err) throw err;
				
				
				console.table(res);
				var current_quantity = res[0].stock_quantity;
				console.log("Current quantity in stock: " , current_quantity);
				var price = res[0].price;
				var remaining_quantity = current_quantity - userQuantity;
				console.log("Remaining quantity in stock: " , remaining_quantity);

				if(current_quantity > userQuantity) {

					console.log("Amount Remaining: " + remaining_quantity);
					console.log("Total Cost: $" + (userQuantity * price) + "\r\n");

					connection.query("UPDATE products SET stock_quantity=? WHERE id=?",
                    [
                    remaining_quantity, userId
                    ],

					
						function(err, res){
							console.table(res);
						});

					connection.query("SELECT * FROM products", function(err, res) {

						console.log("This is the updated inventory of product items: ");
						console.log("------------------------------- \r\n");
						console.table(res);
					}).catch(function(err){
                        console.log("We are low on stock, please try a different quantity!");
				});
                }
            
				
            });
        
        buyProducts();
		});
}




// =============buyProducts===============
function buyProducts(){
    inquirer.prompt([{
        name: "choice",
        type: "rawlist",
        message: "What would you like to buy?", //why aren't you displaying???
        choices:
        [
            "Banila Clean-it Zero Cleansing Balm $19.00",
            "Dear Hydration Toner $16.00",
            "Dear Hydration Moisturizer $21.00",
            "Dear Hydration Cream $25.00",
            "Dear Hydration Mist 15.00",
            "Hi Bye Vita Peel Pads $22.00",
            "Hi Bye Vita Exfoliating Scrub $14.00",
            "Hi Bye Clean Up Sebum $21.00",
            "Hi Bye Clean Up Mud Facial Mask $20.00",
            "Hi Bye Soothing Spot Treatment $14.00",
            ],
        default: true
    },
    {
        type: "input",
        name: "quantity",
        message: "How many would you like to purchase?",
    }
]).then(function(userPurchase) {

    //connect to database to find stock_quantity in database. If user quantity input is greater than stock, decline purchase.
    var inputId = choices[i];
    connection.query("SELECT * FROM products WHERE id=?", userPurchase.inputId, function(err, res) {
        for (var i = 0; i < res.length; i++) {

            if (userPurchase.quantity > res[i].stock_quantity) {

                console.log("===================================================");
                console.log("Sorry! Not enough in stock. Please try again later.");
                console.log("===================================================");
                startPrompt();

            } else {
                //list item information for user for confirm prompt
                console.log("===================================");
                console.log("Awesome! We can fulfull your order.");
                console.log("===================================");
                console.log("You've selected:");
                console.log("----------------");
                console.log("Item: " + res[i].product_name);
                console.log("Department: " + res[i].department_name);
                console.log("Price: " + res[i].price);
                console.log("Quantity: " + userPurchase.quantity);
                console.log("----------------");
                console.log("Total: " + res[i].price * userPurchase.quantity);
                console.log("===================================");

                var newStock = (res[i].stock_quantity - userPurchase.quantity);
                var purchaseId = (userPurchase.inputId);
                //console.log(newStock);
                confirmPrompt(newStock, purchaseId);
            }
        }
    });
});

}

//=================================Confirm Purchase===============================

function confirmPrompt(newStock, purchaseId) {

    inquirer.prompt([{

        type: "confirm",
        name: "confirmPurchase",
        message: "Are you sure you would like to purchase this item and quantity?",
        default: true

    }]).then(function(userConfirm) {
        if (userConfirm.confirmPurchase === true) {

            //if user confirms purchase, update mysql database with new stock quantity by subtracting user quantity purchased.

            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock
            }, {
                id: purchaseId
            }], function(err, res) {});

            console.log("=================================");
            console.log("Transaction completed. Thank you.");
            console.log("=================================");
            startPrompt();
        } else {
            console.log("=================================");
            console.log("Transaction did not go through!");
            console.log("=================================");
            startPrompt();
        }
    });
}











