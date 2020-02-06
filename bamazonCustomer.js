// =============set up variables===============

var mysql = require('mysql');
var Table = require('cli-table');
var inquirer = require('inquirer');
var fs = require('fs');

// =============set up variables===============

var connection = mysql.createConnection({
host     : 'localhost',
port     : 3306,
user     : 'root',
  password : 'Isaacaveryjoshua1!', //later change to ""
database : 'bamazon'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('\r\n');
    console.log('=====================================================================================================');
    console.log('\r\n');
    console.log('        * * * *     Welcome to Banila-Amazon- the Best Skincare for Makeup Lovers!    * * * *         ');
    console.log('\r\n');
    console.log('======================================================================================================');
    console.log('\r\n');
    displayProducts();
});


// =============displayProducts===============
function displayProducts(){
	var query = "SELECT * FROM products";
	connection.query(query, function(err, res){
		if(err) throw err;

        var displayTable = new Table ({
            head: ["Item ID", "Product Name", "Department","Category", "Price", "Quantity"],
            colWidths: [10,40,15,10,10,10]
        });

        for(var i = 0; i < res.length; i++){
            displayTable.push(
                [res[i].id,res[i].product_name, res[i].department_name, res[i].category, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(displayTable.toString());
        start();
        });
}
console.log('\r\n');



// =============startPrompt===============
function start(){
    inquirer.prompt({
        name: 'select',
        type: 'list',
        message: 'Would you like to [VIEW PRODUCTS] or [BUY PRODUCTS]?',
        choices: ['VIEW PRODUCTS', 'BUY PRODUCTS', 'CANCEL']
    })
    .then(answer => {
    switch (answer.select) {
        case 'VIEW PRODUCTS':
            productId();
            break;

        case 'BUY PRODUCTS':
            productPurchase();
            break;

        case 'CANCEL':
            end();
            break;
        }
    });
}
console.log('\r\n');



// =============productId()===============
function productId(){
    inquirer.prompt([{
        name: "product_id",
        type: "input",
        message: "Enter Product ID:",
        validate: function(value) {
            if (!isNaN(value) && value < 11) {
            return true;
            }
            return false;
            }
        },
        {
        name: "product_qty",
        type: "input",
        message: "Quantity of Product:",
        validate: function(value) {
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
            },
        filter: Number
        },
    ])
    .then(function(answer) {

        var query = connection.query("SELECT * FROM products", function(err,res){
            if (err) throw err;

            var selectedId = answer.product_id;
            var qtyOfProduct = answer.product_qty;

            console.log('\r\n');
            console.log('=====================================================================================================');
            console.log('\r\n');
            console.log('You selected | Item ID = ', selectedId);
            console.log('You selected | Quantity = ', qtyOfProduct);
            console.log('\r\n');


            connection.query("SELECT * FROM products WHERE ?", [{ id : answer.product_id }], function(err, res) {
                if (err) throw err;
                console.log("SELECTED ITEM");
                console.table(res);

                var current_quantity = res[0].stock_quantity;
                console.log('\r\n');
                console.log("Quantity of item currently in stock = " , current_quantity);
                var price = res[0].price;
                var remaining_quantity = current_quantity - qtyOfProduct;

                if(current_quantity > qtyOfProduct) {
                    console.log("Updated Inventory of item: " , remaining_quantity);
                    console.log("Total Cost of ", (qtyOfProduct), "quantity of item ID:", (selectedId ), " = $" + (qtyOfProduct * price));
                    console.log('\r\n');

                    connection.query("UPDATE products SET stock_quantity=? WHERE id=?",
                    [
                    remaining_quantity, selectedId
                    ],

                        function(err, res){
                            if (err) throw err;
                        });
                    }
                    else {
                        console.log('\r\n');
                        console.log("Sorry, the item is currently low in stock. Please try again.");
                    }

                    connection.query("SELECT * FROM products", function(err, res) {
                        console.log('\r\n');
                        console.log("UPDATED INVENTORY OF PRODUCTS IN STOCK");
                        console.table(res);
                        console.log('\r\n');

                        if (remaining_quantity > 0) {
                            buy ();
                        }else {
                            start ();
                        }
                    });
                }
            );
        });
    }
    );
}



// =============buy()===============
function buy(){
    inquirer.prompt([
         {
        type: "confirm",
        name: "purchase",
         message: "Would you like to purchase the item?"
        }
    ])
    .then(function(answer){
        if (answer.purchase === true) {
            productPurchase();
        } else {
            start();
        }
    });
}




// =============productPurchase()===============
function productPurchase(){
        inquirer.prompt([
            {
            type: "input",
            name: "confirm_id",
            message: "Please confirm the ID of the item you would like to purchase:" + "\r\n",
            validate: function(value) {
            if (!isNaN(value) && value < 11) {
            return true;
            }
            return false;
            }
            },

            {
            type: "input",
            name: "confirm_qty",
            message: "Please confirm the quantity of the item you would like to purchase:" + "\r\n",
            validate: function(value) {
                var valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
                },
            filter: Number
            },
        ])
        .then(function(answer) {

            var query = connection.query("SELECT * FROM products", function(err,res){
                if (err) throw err;

                var confirmId = answer.confirm_id;
                var confirmQty = answer.confirm_qty;

                console.log('\r\n');
                console.log('=====================================================================================================');
                console.log('\r\n');
                console.log('Item in your shopping cart = ', confirmId);
                console.log('Quantity of item in your shopping cart = ', confirmQty);
                console.log('\r\n');

                connection.query("SELECT * FROM products WHERE ?", [{ id : confirmId }], function(err, res) {
                    if (err) throw err;
                    console.log("ITEM TO BE PURCHASED");
                    console.table(res);

                    var price = res[0].price;
                    console.log('\r\n');
                    console.log("Your total is $" + (confirmQty * price) + "." + "\r\n" ); 
                    console.log("Your order has been placed.");
                    console.log('Thank you for shopping with us!');
                    console.log('\r\n');
                    });
                });
            });
        }



// =============end()===============
function end(){
    inquirer.prompt([
         {
        type: "confirm",
        name: "cancel",
         message: "Are you sure you would like to cancel?"
        }
    ])
    .then(function(answer){
        if (answer.cancel === true) {
            console.log("Sorry to see you go!");
            console.log("Hope to see you again!");
        } else {
            start();
        }
    });
}
