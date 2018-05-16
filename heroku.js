const mongo = require("mongodb");
const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const TelegramBot = require('node-telegram-bot-api');
const options = {
  webHook: {
  port: process.env.PORT
 }
};

const url = process.env.APP_URL || 'https://<app-name>.herokuapp.com:443';
const bot = new TelegramBot(TOKEN, options);

var db = mongo.MongoClient;
var dburl = "YourMongoDB url";


bot.setWebHook(`${url}/bot${TOKEN}`);

db.connect(dburl, function(err,database){


    var mydb = database.db("mydbusers");
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
