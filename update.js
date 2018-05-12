var mongo = require("mongodb");
var TelegramBot = require("node-telegram-bot-api");

var db = mongo.MongoClient;

var url = "Mongo Url";


var token = 'TOKEN';

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

    row.update({id : userid}, {$set : {id : 2} } ,function(err,res){
     if(!err){
         bot.sendMessage(chatid,"updated!");
     }
    });

}


});

});
