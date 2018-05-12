var mongo = require("mongodb");
var TelegramBot = require("node-telegram-bot-api");

var db = mongo.MongoClient;

var url = "MongoDb";

var token = 'Token';

var opt = {polling:true}

var bot = new TelegramBot(token,opt);

db.connect(url, function(err,database){
  
var mydb = database.db("users");
var row = mydb.collection("ids");
var rules = mydb.collection("rules");

bot.on('message',function (msg) {

var text = msg.text;
var chatid = msg.chat.id;
var userid = msg.from.id;


var ex = text.split(" ");
var rs = text.replace("/set","");

if(ex[0] == "/set" && ex.indexOf(ex[1]) != -1){

rules.find({id:chatid}).toArray(function(err,res){

if(res[0] == undefined){
rules.insert({id : chatid, myrules : rs},function(err,done){

    if(!err){
        bot.sendMessage(chatid,"done saved");
    }

});
}

if(res[0] != undefined){
rules.update({id : chatid}, {$set : {myrules : rs} },function(err,done){

    if(!err){
        bot.sendMessage(chatid,"group rules has been updated");
    }

});
}

});

}

// get the rules


if(text == "/rules"){
   
rules.find({id : chatid}).toArray(function(err,res){

if(res[0] == undefined){
bot.sendMessage(chatid,"no rules found");
}

if(res[0] != undefined){
 bot.sendMessage(chatid,res[0].myrules);   
}

});  

}

});

});
