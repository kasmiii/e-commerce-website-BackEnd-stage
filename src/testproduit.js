var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "ecommerce"
});

let produit;

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM produit where idproduit='8ii9dt' ", function (err, result, fields) {
    if (err) throw err;
    produit=result;
    console.log(produit);
  });
});