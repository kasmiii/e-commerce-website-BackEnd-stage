"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbcommerce_1 = require("./dbcommerce");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
//declaration du service degestion de la base de donnee
let dbcommerce = new dbcommerce_1.DatabaseService();
const app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(cors_1.default());
//c'est indispensable d'utiliser le middleware "cors" de express car il permet de partager les donnees entre 2 domaibes diffrents(2 serveurs de 2 ports different) !!!
app.get('/', (req, resp) => {
    resp.send('app works !');
});
app.post('/signup', body_parser_1.default.json(), (req, resp) => {
    let user;
    resp.json(req.body);
    user = req.body;
    dbcommerce.addUser(user);
    console.log(user);
    resp.send("signup cote serveur works !");
    //con.end();
});
app.get('/listproduits', body_parser_1.default.json(), (req, resp) => {
    let con = dbcommerce.connectToDatabase();
    let query = "select * from produit";
    con.query(query, function (err, result, fields) {
        if (err)
            throw err;
        else {
            resp.send(result);
        }
    });
    con.end();
});
//chercher par produit
app.post('/listproduits/chercherparnom', body_parser_1.default.json(), (req, resp) => {
    let con = dbcommerce.connectToDatabase();
    let choice;
    choice = req.body;
    console.log("le produit choisi seems like:" + choice.produit);
    if (choice.produit !== undefined) {
        let query = "select * from produit where descriptionprod like '%" + choice.produit + "%' ";
        con.query(query, function (err, result, fields) {
            if (err)
                throw err;
            else {
                //console.log(result);
                resp.send(result);
            }
        });
    }
    con.end();
});
app.get('/listproduits/:id', (req, resp) => {
    let con = dbcommerce.connectToDatabase();
    let id = req.params.id;
    console.log(id);
    let produit;
    let query = "select * from produit where idproduit='" + id + "' ";
    con.query(query, function (err, result, fields) {
        if (err)
            throw err;
        else {
            produit = result;
            //console.log("le produit choisi est:",produit);
            resp.send(produit);
        }
    });
    con.end();
});
app.get('/listproduits/chercherparnom/:id', (req, resp) => {
    let con = dbcommerce.connectToDatabase();
    let id = req.params.id;
    console.log("" + id);
    let produit;
    let query = "select * from produit where idproduit='" + id + "' ";
    con.query(query, function (err, result, fields) {
        if (err)
            throw err;
        else {
            produit = result;
            console.log("le produit choisi dans la partie recherche  est:", produit);
            resp.send(produit);
        }
    });
    con.end();
});
app.post('/signin', body_parser_1.default.json(), (req, resp) => {
    let login;
    let user = {
        id: 0,
        name: '',
        adresse: '',
        telephone: '',
        mail: '',
        username: '',
        password: ''
    };
    //req.json(req.body);aaaatention!!!!!!!!!!
    login = req.body;
    let con = dbcommerce.connectToDatabase();
    let query = "select * from utilisateur where username='" + login.username + "' and password='" + login.password + "'";
    console.log("affichage du login:\n");
    console.log(login);
    con.query(query, function (err, result, fields) {
        if (err)
            throw err;
        else {
            //console.log("le resultat de traitement ",result);
            user.id = result[0].idUser;
            user.name = result[0].nomClient;
            user.adresse = result[0].adresse;
            user.telephone = result[0].telephone;
            user.mail = result[0].mail;
            user.username = result[0].username;
            user.password = result[0].password;
            console.log("le resultat du traitement est: ", user);
            //user.id=result.idUser;
            resp.send(user);
        }
    });
    con.end();
});
app.get('/ajouteraupanier/:idUser/:idProduit', (req, resp) => {
    //traitement de la requete
    let id_user = req.params.idUser;
    let id_produit = req.params.idProduit;
    let idLigne = dbcommerce.makeString(6);
    console.log("les parametres recuperes a partie de la requete sont " + id_user + " ----> " + id_produit);
    let con = dbcommerce.connectToDatabase();
    let query = "insert into lignecommande values('" + idLigne + "','" + id_user + "','" + id_produit + "',1)";
    con.query(query, function (err, result, fields) {
        if (err)
            throw err;
        else {
            console.log("requete executee avec succes \n");
        }
    });
    con.end();
});
app.get('/cart/:idUser', (req, resp) => {
    let con = dbcommerce.connectToDatabase();
    let idUser = req.params.idUser;
    let id = parseInt(idUser, 10);
    let commands;
    console.log("this is the card page: " + id);
    let query = "select p.idproduit,p.locationprod,p.descriptionProd,l.quantite,p.prix,p.promotion from lignecommande l,produit p where l.idProduit=p.idproduit and l.idUser=3 ";
    con.query(query, (err, result, fields) => {
        commands = result;
        console.log(commands);
        console.log("on essaye acceser au champs de row data packet:", result[0].prix);
        console.log("la lnguer de result est:", result.length);
        resp.send(commands);
    });
});
app.listen(8888, () => {
    console.log("server started !");
});
