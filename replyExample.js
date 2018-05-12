var mongo = require("mongodb");
var TelegramBot = require("node-telegram-bot-api");

var db = mongo.MongoClient;

var url = "MongoUrl";


var token = 'Token';

var opt = {polling:true}

var bot = new TelegramBot(token,opt);

db.connect(url, function(err,database){
  
var mydb = database.db("users");
var row = mydb.collection("ids");
var rules = mydb.collection("rules");
var reply = mydb.collection("replys")

bot.on('message',function (msg) {

var text = msg.text;
var chatid = msg.chat.id;
var userid = msg.from.id;


var ex = text.split("-");
var re = text.replace("-","");

if(ex.indexOf(ex[0]) != -1 && ex.indexOf(ex[1]) != -1){

reply.insert({id : chatid, txt : ex[0], replymsg : ex[1]},function(err,res){

    if(!err){
        bot.sendMessage(chatid,"Done saved");
    }

});  


}


if(text){

reply.find({id : chatid, txt : text}).toArray(function(err,res){

if(res[0] != undefined){
bot.sendMessage(chatid,res[0].replymsg);
}

});

}


});

});
