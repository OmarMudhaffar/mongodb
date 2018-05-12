var mongo = require("mongodb");
var TelegramBot = require("node-telegram-bot-api");

var db = mongo.MongoClient;

var url = "Mongo Url";


var token = 'Token';

var opt = {polling:true}

var bot = new TelegramBot(token,opt);

db.connect(url, function(err,database){
  
var mydb = database.db("users");
var row = mydb.collection("ids");

bot.on('message',function (msg) {

var text = msg.text;
var chatid = msg.chat.id;
var userid = msg.from.id;


var ex = text.split(" ");
var rs = text.replace("/bc","");

if(ex[0] == "/bc" && ex.indexOf(ex[1] != -1)){

row.find().toArray(function(err,res){

    if(res[0] != undefined){
        res.forEach(function(usersid){
          bot.sendMessage(usersid.id,rs)
        });
    }

});

}


if(text == "/start"){

row.find({id:chatid}).toArray(function(err,res){

if(res[0] == undefined){
row.insert({id : chatid});
bot.sendMessage(chatid,"welcome to our new bot");    
}

if(res[0] != undefined){
bot.sendMessage(chatid,"hello bro :)");
}

});

}


});

});
