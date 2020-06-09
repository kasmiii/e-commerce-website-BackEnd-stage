"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
class DatabaseService {
    constructor() {
    }
    connectToDatabase() {
        this.con = mysql_1.default.createConnection({
            host: "localhost",
            user: "root",
            password: "password",
            database: "ecommerce"
        });
        this.con.connect(function (err) {
            if (err)
                throw err;
        });
        return this.con;
    }
    addUser(user) {
        let con = this.connectToDatabase();
        let query = "insert into utilisateur values(0,'" + user.name + "','"
            + user.adresse + "','" + user.telephone + "','" + user.mail + "','"
            + user.username + "','" + user.password +
            "')";
        con.query(query, function (err, result) {
            if (err)
                throw err;
            console.log("field inserted!");
        });
    }
    searchByLogin(login) {
        return new Promise(resolve => {
            let con = this.connectToDatabase();
            let query = "select * from utilisateur where username='mohammed' and password='password'";
            con.query(query, function (err, result, fields) {
                if (err)
                    throw err;
                else {
                    resolve(result);
                }
            });
        }).then((result) => {
            return result;
        });
    }
    //fonction asynchrone
    search(login) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.searchByLogin(login);
        });
    }
    makeString(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
exports.DatabaseService = DatabaseService;
