import mysql from "mysql";
import { User } from "./services/user";
import { Login } from "./services/Login";
import { resolve } from "url";

export class DatabaseService{
    con:any;
    constructor(){
    }

connectToDatabase(){
         this.con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "password",
            database: "ecommerce"
          });
          this.con.connect(function(err:any) {
            if (err) throw err;
        });

        return this.con;
}

addUser(user:User){
    let con=this.connectToDatabase();
    let query="insert into utilisateur values(0,'"+user.name+"','"
    +user.adresse+"','"+user.telephone+"','"+user.mail+"','"
    +user.username+"','"+user.password+
    "')";

    con.query(query, function (err:any, result:any) {
        if (err) throw err;
        console.log("field inserted!");
      });
}

searchByLogin(login:Login){
  
  return new Promise(resolve=>{
   
    let con=this.connectToDatabase();
    let query="select * from utilisateur where username='mohammed' and password='password'";

    con.query(query, function (err:any, result:any, fields:any) {
      if (err) throw err;
      else{
        resolve(result);
      }
   });
  }).then((result)=>{
    return result;
  });
}

//fonction asynchrone

async search(login:Login){
  return await this.searchByLogin(login);
}

 makeString(length:number):string {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//console.log(makeid(5));

/*searchByLogin(login:Login){  
  return new Promise(resolve=>{
   
    let con=this.connectToDatabase();
    let query="select * from utilisateur where username='iii' and password='iiii'";

    con.query(query, function (err:any, result:any, fields:any) {
      if (err) throw err;
      else{
        resolve(result);
      }
   });
  });
}
*/
}