var mongo = require("mongodb");
var TelegramBot = require("node-telegram-bot-api");

var db = mongo.MongoClient;

var url = "Mongo Url";


var token = 'Telegran Bot Token';

var opt = {polling:true}

var bot = new TelegramBot(token,opt);

db.connect(url, function(err,database){

var mydb = database.db("users");
var rwo = mydb.collection("ids");    

bot.on('message',function (msg) {

    if(msg.text == "/start"){
        bot.sendMessage(msg.chat.id,"Work!!!");
    }

});

database.close();

});
