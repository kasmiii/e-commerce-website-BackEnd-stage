import express,{Request,Response} from "express"
import { DatabaseService } from "./dbcommerce";
import bodyParser from "body-parser";
import cors from "cors";
import { User } from "./services/user";
import { Login } from "./services/Login";
import { Search } from "./services/choice";
import { Produit } from "./services/produit";
import { Command } from "./services/command";

//declaration du service degestion de la base de donnee
    
    let dbcommerce=new DatabaseService();

    const app=express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
        //c'est indispensable d'utiliser le middleware "cors" de express car il permet de partager les donnees entre 2 domaibes diffrents(2 serveurs de 2 ports different) !!!

    app.get('/',(req:Request,resp:Response)=>{
        resp.send('app works !');
    });
        
    app.post('/signup',bodyParser.json(),(req:Request,resp:Response)=>{
            
        let user:User;
        resp.json(req.body);
        user=req.body;
        dbcommerce.addUser(user);
        console.log(user);
        resp.send("signup cote serveur works !");
        //con.end();
    });

    app.get('/listproduits',bodyParser.json(),(req:Request,resp:Response)=>{
        let con=dbcommerce.connectToDatabase();
        let query="select * from produit";
        con.query(query, function (err:any, result:any, fields:any) {
            if (err) throw err;
            else{
              resp.send(result);
            }
         });
         con.end();
    });

//chercher par produit

app.post('/listproduits/chercherparnom',bodyParser.json(),(req:Request,resp:Response)=>{
    let con=dbcommerce.connectToDatabase();
    let choice:Search;
    choice=req.body;
    console.log("le produit choisi seems like:"+choice.produit);
    if(choice.produit!==undefined){
        let query="select * from produit where descriptionprod like '%"+choice.produit+"%' ";
    con.query(query, function (err:any, result:any, fields:any) {
        if (err) throw err;
        else{
          //console.log(result);
          resp.send(result);
          
        }
        
     });
     
    }
    con.end();
});

app.get('/listproduits/:id',(req:Request,resp:Response)=>{
    let con=dbcommerce.connectToDatabase();
    let id:string=req.params.id;
    console.log(id);
    let produit:Produit;
    let query="select * from produit where idproduit='"+id+"' ";
    con.query(query,function(err:any, result:Produit, fields:any){
        if(err)throw err;
        else{
            produit=result;
            //console.log("le produit choisi est:",produit);
            resp.send(produit);
        }
    });
    con.end();
});

app.get('/listproduits/chercherparnom/:id',(req:Request,resp:Response)=>{
    let con=dbcommerce.connectToDatabase();
    let id:string=req.params.id;
    console.log(""+id);
    let produit:Produit;
    let query="select * from produit where idproduit='"+id+"' ";
    con.query(query,function(err:any, result:Produit, fields:any){
        if(err)throw err;
        else{
            produit=result;
            console.log("le produit choisi dans la partie recherche  est:",produit);
            resp.send(produit);
        }
    });
    con.end();
});


app.post('/signin',bodyParser.json(),(req:Request,resp:Response)=>{
        let login:Login;
        let user:User={
            id:0,
            name:'',
            adresse:'',
            telephone:'',
            mail:'',
            username:'',
            password:''
        };
        //req.json(req.body);aaaatention!!!!!!!!!!
        login=req.body;
        let con=dbcommerce.connectToDatabase();
        let query="select * from utilisateur where username='"+login.username+"' and password='"+login.password+"'";
        console.log("affichage du login:\n");
        console.log(login);

        con.query(query, function (err:any, result:any, fields:any) {
        if (err) throw err;
        else{
            //console.log("le resultat de traitement ",result);
            user.id=result[0].idUser;
            user.name=result[0].nomClient;
            user.adresse=result[0].adresse;
            user.telephone=result[0].telephone;
            user.mail=result[0].mail;
            user.username=result[0].username;
            user.password=result[0].password;
            
            console.log("le resultat du traitement est: ",user);
            
            //user.id=result.idUser;

            resp.send(user);
            
        }
        });
        con.end();
    });
    
    app.get('/ajouteraupanier/:idUser/:idProduit',(req:Request,resp:Response)=>{

        //traitement de la requete
        let id_user:string=req.params.idUser;
        let id_produit:string=req.params.idProduit;
        let idLigne=dbcommerce.makeString(6);
        console.log("les parametres recuperes a partie de la requete sont "+id_user+" ----> "+id_produit);
        let con=dbcommerce.connectToDatabase();
        let query="insert into lignecommande values('"+idLigne+"','"+id_user+"','"+id_produit+"',1)";
        con.query(query, function (err:any, result:any, fields:any){
            if (err) throw err;
            else{
                console.log("requete executee avec succes \n");
            }
        });
        con.end();
    });
    
    app.get('/cart/:idUser',(req:Request,resp:Response)=>{

        let con=dbcommerce.connectToDatabase();
        let idUser=req.params.idUser;
        let id=parseInt(idUser,10);
        let commands:Command[];
        console.log("this is the card page: "+id);
        let query="select p.idproduit,p.locationprod,p.descriptionProd,l.quantite,p.prix,p.promotion from lignecommande l,produit p where l.idProduit=p.idproduit and l.idUser=3 ";

        con.query(query,(err:any, result:Command[], fields:any)=>{
        commands=result;
        console.log(commands);
        console.log("on essaye acceser au champs de row data packet:",result[0].prix);
        console.log("la lnguer de result est:",result.length);
        
        resp.send(commands);
        });

    });

    app.listen(8888,()=>{
    console.log("server started !");
    });