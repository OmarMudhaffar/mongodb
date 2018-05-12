var mongo = require("mongodb");
var TelegramBot = require("node-telegram-bot-api");

var db = mongo.MongoClient;

var url = "Mongo url";


var token = '';

var opt = {polling:true}

var bot = new TelegramBot(token,opt);

db.connect(url, function(err,database){
  
var mydb = database.db("users");
var row = mydb.collection("ids");

bot.on('message',function (msg) {

var text = msg.text;
var chatid = msg.chat.id;
var userid = msg.from.id;

if(text = "/start"){

    row.insert({id : userid},function(err,res){
     if(!err){
         bot.sendMessage(chatid,"inserted");
     }
    });

}


});

});
