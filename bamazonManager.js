// =============set up variables===============

var Table = require('cli-table');
var mysql = require('mysql');
var inquirer = require('inquirer');

// =============set up variables===============

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
      password : '', //later change to ""
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
        start();
    });



// =============startPrompt===============
function start() {
    inquirer.prompt([
        {
        name: 'select',
        type: 'list',
        message: "Welcome Manager. What would you like to do?",
        choices: ["VIEW PRODUCTS FOR SALE", "VIEW LOW INVENTORY", "ADD TO INVENTORY", "ADD NEW PRODUCT"]
        }
    ])
    .then(answer => {
        switch (answer.select) {
            case 'VIEW PRODUCTS FOR SALE':
                currentInventory();
                break;
    
            case 'VIEW LOW INVENTORY':
                lowInventory();
                break;
    
            case 'ADD TO INVENTORY':
                addToInventory();
                break;

            case 'ADD NEW PRODUCT':
            addNewProduct();
            break;
            }
        });
    }
    console.log('\r\n');



// =============currentInventory()===============
function currentInventory() {
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
        console.log('\r\n');
        console.log("CURRENT INVENTORY OF PRODUCTS");
        console.log(displayTable.toString());
        start();
    });
}
console.log('\r\n');



// =============lowInventory()===============
function lowInventory() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res){
        if(err) throw err;

        var displayTable = new Table ({
        head: ["Item ID", "Product Name", "Department","Category", "Price", "Quantity"],
        colWidths: [10,40,15,10,10,10]
        });

        for(var i = 0; i < res.length; i++){
            if (res[i].stock_quantity <= 3) {
                displayTable.push(
                    [res[i].id,res[i].product_name, res[i].department_name, res[i].category, res[i].price, res[i].stock_quantity]
                );
            }
        }
        console.log('\r\n');
        console.log("PRODUCTS WITH LOW INVENTORY");
        console.log(displayTable.toString());
        start();
        });
}
console.log('\r\n');



// =============addToInventory()===============
function addToInventory() {
    inquirer.prompt([{
        name: 'id',
        type: 'input',
        message: "Enter item ID of product to be updated: ",
        },
        {
        name: 'new_quantity',
        type: 'input',
        message: "Enter new quantity of product: ",
        }
    ]).then(function(answer) {
        var query = connection.query("SELECT * FROM products", function(err,res){
            if (err) throw err;

            var selectedId = answer.id;
            var qtyOfProduct = answer.new_quantity;

            console.log('\r\n');

            connection.query("SELECT * FROM products WHERE ?", [{ id : selectedId }], function(err, res) {
                if (err) throw err;
                console.log("SELECTED ITEM TO BE UPDATED");
                console.table(res);

                var current_quantity = res[0].stock_quantity;
                console.log('DEBUG' , current_quantity);
                console.log('DEBUG', qtyOfProduct);


                var updated_quantity = current_quantity + qtyOfProduct;
                console.log('\r\n');
                console.log("Quantity of item currently in stock = " , current_quantity);
                console.log("Updated Inventory of item: " , updated_quantity);
                    console.log('\r\n');

                    connection.query("UPDATE products SET stock_quantity=? WHERE id=?",
                    [
                    updated_quantity, selectedId
                    ],

                    function(err, res){
                        if (err) throw err;
                        
                        console.log('\r\n');
                        console.log("Quantity of Item ID: ", (selectedId), " has been updated to: ", (updated_quantity));
                    }
                    );
                    connection.query("SELECT * FROM products", function(err, res) {
                        console.log('\r\n');
                        console.log("UPDATED INVENTORY OF PRODUCTS IN STOCK");
                        console.table(res);
                        console.log('\r\n');
                        start ();
                        }
                    );
                });
            }
        );
    });
}
console.log('\r\n');



// =============addNewProduct()===============
function addNewProduct() {
    inquirer.prompt([
        {
        type: "input",
        name: "inputName",
        message: "Enter name of the new product: ",
        },
        {
        type: "input",
        name: "inputDept",
        message: "Enter department of the new product: ",
        },
        {
        type: "input",
        name: "inputCategory",
         message: "Enter category of the new product: ",
        },
        {
            type: "input",
            name: "inputPrice",
            message: "Enter price of the new product: ",
        },
        {
            type: "input",
            name: "inputStock",
            message: "Enter quantity of the new product: ",
        }

    ]).then(function(answer) {

      connection.query("INSERT INTO products SET ?", {
        product_name: answer.inputName,
        department_name: answer.inputDept,
        category_name: answer.inputCategory,
        price: answer.inputPrice,
        stock_quantity: answer.inputStock
        }
      );
        console.log('\r\n');
        console.log("UPDATED INVENTORY WITH NEW PRODUCT");
        console.log(res.toString());
    });
}



