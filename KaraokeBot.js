// made by t.me/omar_real
// my channel t.me/set_web
// this file for learing not for using :)


var mongo = require("mongodb");
var TelegramBot = require("node-telegram-bot-api");
var fs = require("fs");
var red = fs.readFileSync(__dirname + "/ban.json");
var ar = JSON.parse(red);
var cli = mongo.MongoClient;
 
var redtimefile = fs.readFileSync(__dirname + "/time.json");
var redtime = JSON.parse(redtimefile);
var url = "MongoUrl";


var token = 'token'; // your telegram bot token

var opt = {polling:true}

var bot = new TelegramBot(token,opt);

var admins = [578601940,460344634,117331455,491580711,431226062]; // admins


cli.connect(url,function(err,database){

var db = database.db("users");

var col = db.collection("ids");
var mike = db.collection("mike");
var guest = db.collection("guest");


// function for set time 

function setmiketime (){

var date = new Date();

if(date.getMinutes() < 55){
redtime.time = date.getMinutes() + 5 ;    
}

if(date.getMinutes() > 55){
redtime.time = date.getMinutes() + 5 - 60;    
}

fs.writeFileSync(__dirname + "/time.json",JSON.stringify(redtime));    
    

var int = setInterval(function(myint){
    var date = new Date();
    var file = fs.readFileSync(__dirname + "/time.json");
    var read = JSON.parse(file);
    
    
if(read.time == date.getMinutes()){
               
               
                      clearInterval(int);
    
    mike.find().toArray(function(err, guid) {
       if(guid[0] != undefined){
           
               
               
               var keyboard = {inline_keyboard:[
[{text:"عودة ◀️",callback_data:'back'}]    
]};   
               bot.sendMessage(guid[0].id,"انتهى الوقت ⏱ الخاص بك على المايك 🎙",{reply_markup:keyboard});
               
               mike.remove({id : guid[0].id},function(err, done) {
                   
                   guest.find().toArray(function(err, guid) {

if(guid[0] != undefined){
guest.remove({id : guid[0].id});
}

});    
                  
                  if(!err){
                      
                      
                      col.find({id : {$ne : guid[0].id} }).toArray(function(err, res) {
                         
                         
                         res.forEach(function(ids){
                             
bot.sendMessage(ids.id,"اصبح المايك 🎤 متاح الان ✅",{
"reply_markup":{
"inline_keyboard":[

[{text:"استلام المايك 🎙",callback_data:"mike"}]    
    
]
}
}).catch(err => {});  

                             
                         });
                          
                      });
                      
                  }
                   
               });
               
           
           
       } 
    });
    
    }

   },1000);



}



bot.on('message',function (msg) {
 

var chatid = msg.chat.id;
var text = msg.text;
var username = msg.from.username;
var id = msg.from.id;



if(text == "/start" && ar.ids.indexOf(id) == -1){

col.find({id:id}).toArray(function(err,data){
 
if(data[0] == undefined){
bot.sendMessage(chatid,"اهلا بك في مجتمع كاريوكي 🎤 \nمكان حيث يمكنك مشاركة 🎼 مواهبك الغنائية مع الاخرين 👥", {
    
'reply_markup':{
    
'inline_keyboard':[

[{text:"تسجيل 📃",callback_data:"singup"}],
[{text:"القوانين 📙",callback_data:"rules"}]
        
    
]    
    
}   
    
}); 


}

if(data[0] != undefined){
    
mike.find({id : id}).toArray(function(err,res){

if(res[0] == undefined){
bot.sendMessage(chatid,"مجتمع كاريوكي 🎤  حيث مرحب لجميع المواهب الغنائية ✳️ ",{
    
'reply_markup':{
    
'inline_keyboard':[
    
[{text:"استلام المايك 🎙",'callback_data':'mike'}],
[{text:"تسجيل خروج 🗯",callback_data:"logout"}]
    
]    

}    
    
    
}); 

}


if(res[0] != undefined){
bot.sendMessage(chatid,"انت الان على المايك 🎙 \nشارك 🔖 صوتك مع الاخرين 🗣",{
 
'reply_markup':{

'inline_keyboard':[

[{text:"ترك المايك 🔕",callback_data:"leavemice"}]    

]    

} 
    
});  
}

    
});  
    
   
}


    
});  
    
    
}


if(msg.voice && ar.ids.indexOf(id) == -1 && !msg.forward_from && !msg.forward_from_chat){
mike.find({id:id}).toArray(function(err, res) {
    
if(res[0] == undefined){
    
guest.find().toArray(function(err, guid) {
  
if(guid[0] != undefined){

if(id != guid[0].id){
 bot.sendMessage(chatid,"انت لست على المايك 🎙يجب ان تمتلك المايك لارسال رسالة صوتية 🎼",{
'reply_to_message_id':msg.message_id    
}).catch(err => {});
}

} 
    
});  
    


}

if(res[0] != undefined){
var keyboard = {inline_keyboard:[
[{text:"ترك المايك 🔕",callback_data:"leavemice"}]    
]};
bot.sendMessage(chatid,"تم ✅ ارسال رسالتك الصوتية للجميع 👥",{
"reply_to_message_id":msg.message_id,
reply_markup:keyboard
}).catch(err => {});

col.find({id : {$ne : id}},function(err, users) {
users.forEach(function(ids){
    
    
  bot.sendVoice(ids.id,msg.voice.file_id,{
      caption:msg.from.first_name
  }).catch(err => {});


 

});
});
    
}

});


guest.find().toArray(function(err, guid) {

if(guid[0] == undefined){
    
}

if(guid[0] != undefined){
if(id == guid[0].id){

var keyboard = {inline_keyboard:[
[{text:"ترك الضيافة 🔕",callback_data:"leaveguest"}]    
]};
bot.sendMessage(chatid,"تم ✅ ارسال رسالتك الصوتية للجميع 👥",{
"reply_to_message_id":msg.message_id,
reply_markup:keyboard
});

col.find({id : {$ne : parseInt(guid[0].id)} }).toArray(function(err, res) {
res.forEach(function(ids){
  bot.sendVoice(ids.id,msg.voice.file_id, {
      caption:msg.from.first_name
  }).catch(err => {});    
});   
});
    
}    
}
    
});

}



// get members count


if(msg.text == "/users"){
var count = 0;

col.find().toArray(function(err, res) {

res.forEach(function(ids){

count = count + 1;    
    
}); 


bot.sendMessage(chatid,"عدد 🔺 المستخدمين 👥 : " + count).catch(err => {});
    
});


}


// ban users 

if(text == "/ban" && admins.indexOf(id) != -1){

var len = ar.ids.length;
    
mike.find().toArray(function(err, res) {
ar.ids[len] = res[0].id;
fs.writeFileSync(__dirname + "/ban.json", JSON.stringify(ar));
});
    
    
mike.find().toArray(function(err, res) {
   

col.find({id : {$ne : res[0].id} },function(err, users) {
users.forEach(function(ids){
bot.sendMessage(ids.id,"تم حضر ❌ صاحب المايك 🎙\nنرجو من الجميع الالتزام بلقوانين📃", {
"reply_markup":{
"inline_keyboard":[

[{text:"استلام المايك 🎙",callback_data:"mike"}]    
    
]
}    
}).catch(err => {});    
});
});
 
bot.sendMessage(res[0].id,"تم ✅ حضرك من المايك ❌ لعدم التزامك بقوانين المجتمع 📃");

mike.remove({id:res[0].id});   
    
});  


}



// commands 

 
if(text == "/mike" && ar.ids.indexOf(id) == -1){
mike.find().toArray(function(err,res){
if(res[0] == undefined){

mike.insert({id:chatid},function(err,done){

if(!err){
    

    
var keyboard = {inline_keyboard:[
[{text:"ترك المايك 🔕",callback_data:"leavemice"}]    
]};    
    
bot.sendMessage(chatid,"لقد حصلت على المايك 🎙 \nشارك 🔖 صوتك مع الاخرين 🗣",{
reply_markup:keyboard
});


col.find({id : {$ne : chatid}},function(err, users) {
var username = msg.from.first_name;    
users.forEach(function(ids){
bot.sendMessage(ids.id, "اصبح 🚹 : " + username + " يستخدم المايك 🎙 ").catch(err => {}); 
});  
});

setmiketime();

}
    
});
    
}

if(res[0] != undefined){
    
mike.find({id:id}).toArray(function(err, res) {
   
if(res[0] == undefined){
var keyboard = {inline_keyboard:[
[{text:"عودة ◀️",callback_data:'back'}]    
]};    
    
bot.sendMessage(chatid,"هناك شخص 🚹 اخر على المايك 🎤",{
reply_markup:keyboard
});
    
}

if(res[0] != undefined){


var keyboard = {inline_keyboard:[
[{text:"ترك المايك 🔕",callback_data:"leavemice"}]    
]};    
    
bot.sendMessage(chatid,"انت صاحب 🎙 المايك بلفعل ✅",{
reply_markup:keyboard
}).catch(err => {});    
}
    
});

}

});

    
} 



// end commands



// remove ban 

var ex = text.split(" ");

if(ex[0] == "/unban" && ex.indexOf(ex[1]) != -1 && admins.indexOf(id) != -1){



if(ar.ids.indexOf(ex[1] != -1)){
    

bot.sendMessage(chatid,"تم ✅ ازالة الحضر ❌ عن : " + ex[1]).catch(err => {});
bot.sendMessage(ex[1],"تم ✅ ازالة الحضر عنك 🔖 احترم القوانين في المرة القادمة 🙏🏻").catch(err => {});

var index = ar.ids.indexOf(ex[1]);
ar.ids.splice(index,1);

fs.writeFileSync(__dirname + "/ban.json", JSON.stringify(ar));


}




}




// add new Guest 

if(msg.text == "/guest"){

mike.find().toArray(function(err, res) {

guest.find().toArray(function(err, gus) {
    
if(gus[0] != undefined){
bot.sendMessage(chatid,"هناك 🚹 ضيف بلفعل على المايك 🎙");   
}  


if(gus[0] == undefined){
if(res[0] == undefined){
bot.sendMessage(chatid,"ليس ❌ هناك احد يستخدم المايك 🎙",{
"reply_markup":{
"inline_keyboard":[

[{text:"استلام المايك 🎙",callback_data:"mike"}]    
    
]
}    
});  
}


if(res[0] != undefined){
bot.sendMessage(chatid,"تم ✅ ارسال طلبك لصاحب المايك 🎙");

bot.sendMessage(res[0].id,"يرغب 🚹 : " + msg.from.first_name + "\nان يكون ضيفك على المايك 🎙 " + "\nللقبول ارسل 💌" + "\n/add@" + msg.from.id);

}
}
    
});
    
});

}

// end new Guest


// confirm guest 


var exid = text.split("@");

if(exid[0] == "/add" && exid.indexOf(exid[1])){
    
mike.find().toArray(function(err, res) {

if(res[0] == undefined){
bot.sendMessage(chatid,"لا يوجد ❌ احد على المايك 🎙 يبدو ان هذا الطلب كان منذ فترة 📃",{
"reply_markup":{
"inline_keyboard":[

[{text:"استلام المايك 🎙",callback_data:"mike"}]    
    
]
}     
});
}

if(res[0] != undefined){


var keyboard = {inline_keyboard:[
[{text:"عودة ◀️",callback_data:'back'}]    
]}; 
if(id != res[0].id){
bot.sendMessage(chatid,"انت لست ❌ صاحب المايك 🎙",{
reply_markup:keyboard 
});    
}

if(id == res[0].id){
    
guest.find().toArray(function(err, res) {
   

if(res[0] == undefined){
  
  bot.sendMessage(exid[1],"قام صاحب المايك 🚹 بلموافقة على طلبك ✅ يمكنك الان ارسال رسائل صوتية 🎙").then( doo => {
    
guest.insert({id:parseInt(exid[1])},function(err, done) {

if(done){
    
guest.find().toArray(function(err, guid) {


col.find({id : {$ne : guid[0].id}}).toArray(function(err, res) {
res.forEach(function(ids){
bot.sendMessage(ids.id,"تم ✅ اضافة ضيف جديد للمايك 🚹").catch(err => {});
});
});


});

}
    
}); 
    
}).catch( ()=> {

bot.sendMessage(chatid,"الايدي 🎙 غير موجود ❌");    
    
});  
    
}

if(res[0] != undefined){
bot.sendMessage(chatid,"هناك 🎙 ضيف على المايك بلفعل 🚹").catch(err => {});    
}
   
    
});  


    
}
    
}
    
});  
    
}

// end confirm


// out 


if(text == "/leaveguest"){
    
guest.find({id : chatid}).toArray(function(err, guid) {
   
if(guid[0] == undefined){
bot.sendMessage(chatid,"انت لست ❌ على الضيافة 🎼",{
reply_markup:{
inline_keyboard:[
[{text:"ارسال طلب ضيافة 💌",callback_data:"guest"}]
]    
}     
});
}

if(guid[0] != undefined){
if(chatid != guid[0].id){
bot.sendMessage(chatid,"انت لست ❌ على الضيافة 🎼",{
reply_markup:{
inline_keyboard:[
[{text:"ارسال طلب ضيافة 💌",callback_data:"guest"}]
]    
}     
});    
}

if(chatid == guid[0].id){

bot.sendMessage(chatid,"لقد قمت بلخروج ❌ من الضيافة 🎼");
    
col.find({id : {$ne : chatid}}).toArray(function(err, res) {

res.forEach(function(ids){

bot.sendMessage(ids.id,"قام الضيف 🚹 بلخروج من المايك 🎙",{
reply_markup:{
inline_keyboard:[
[{text:"ارسال طلب ضيافة 💌",callback_data:"guest"}]
]    
}   

}).catch(err => {});    
      
});
    
});
  
  
guest.remove({id : chatid});  
    
}

}
    
});  
    
}


// remove guest

if(text == "/rem"){

mike.find().toArray(function(err, res) {


if(res[0] == undefined){
bot.sendMessage(chatid,"انت لست ❌ صاحب المايك 🎙 \nيبدو ان المايك 🎤 متاح هل تود الحصول عليه ؟",{
"reply_markup":{
"inline_keyboard":[

[{text:"استلام المايك 🎙",callback_data:"mike"}]    
    
]
}    
});
}

if(res[0] != undefined){

if(id == res[0].id){

guest.find().toArray(function(err, res) {
 
 
if(res[0] == undefined){
bot.sendMessage(chatid,"ليس ❌ هناك ضيف على المايك 🎙");
}


if(res[0] != undefined){


guest.remove({id:res[0].id},function(err, done) {

col.find().toArray(function(err, res) {
    
res.forEach(function(ids){
  

bot.sendMessage(ids.id,"تم ✅ ازالة 🗑 الضيف من للمايك 🎙",{
reply_markup:{
inline_keyboard:[
[{text:"ارسال طلب ضيافة 💌",callback_data:"guest"}]
]    
}   

}).catch(err => {});    
  
    
});  
    
    
});
    
});

}
    
});
    
}
    
}
    
});
    
}

// end remove guest


// start send message

var send = text.split(" ");
var sendmesg = text.replace("/msg","");

if(send[0] == "/msg" && send.indexOf(send[1]) != -1){
    
mike.find().toArray(function(err, getid) {
 
if(getid[0] != undefined){
//start if

if(id != getid[0].id){
bot.sendMessage(chatid, "هذا الامر ⚙️ لصاحب المايك فقط ✅",{
"reply_markup":{
"inline_keyboard":[

[{text:"استلام المايك 🎙",callback_data:"mike"}]    
    
]
}    
}).catch(err => {});    
} 


if(id == getid[0].id){

bot.sendMessage(chatid, "تم ✅ ارسال رسالتك للمستخدمين 🚹",{
reply_to_message_id:msg.message_id    
});

col.find({id : {$ne : getid[0].id}}).toArray(function(err, res) {
res.forEach(function(ids){
bot.sendMessage(ids.id,"رسالة 💌 من صاحب المايك 🎙 " + "\n\n" + sendmesg + "\n\nللتعليق 📪 قم برد على الرسالة وكتب رسالتك 📩").catch(err => {});
});    
});
    
}

// end if
}
    
});   
    
}

// start leave commands 

if(text == "/delete" && admins.indexOf(id) != -1){
    
mike.find().toArray(function(err, res) {
 
if(res[0] != undefined){

 
mike.remove({id:res[0].id},function(err,done){  
    
bot.sendMessage(chatid,"تم ازالة ✅ صاحب المايك 🎙").catch(err => {});
    
guest.find().toArray(function(err, guid) {

if(guid[0] != undefined){
guest.remove({id : guid[0].id});
}

});    
    
col.find({id : {$ne : chatid}},function(err,users){

users.forEach(function(ids){
bot.sendMessage(ids.id,"اصبح المايك 🎤 متاح الان ✅",{
"reply_markup":{
"inline_keyboard":[

[{text:"استلام المايك 🎙",callback_data:"mike"}]    
    
]
}
}).catch(err => {});  
});
    
});
});  
       
} 
});  
    
   
}


if(text == "/leave" && ar.ids.indexOf(id) == -1){

mike.find({id:chatid}).toArray(function(err,res){
var keyboard = {inline_keyboard:[
[{text:"عودة ◀️",callback_data:'back'}]    
]};  

if(res[0] == undefined){
bot.sendMessage(chatid,"انت لست ❌ على المايك 🎤",{
reply_markup:keyboard
}).catch(err => {});

}

if(res[0] != undefined){
mike.remove({id:chatid},function(err,done){
    
bot.sendMessage(chatid,"لقد قمت بلخروج 🚹 من المايك ✅",{
reply_markup:keyboard
}).catch(err => {});

guest.find().toArray(function(err, guid) {

if(guid[0] != undefined){
guest.remove({id : guid[0].id});
}

});

col.find({id : {$ne : chatid}},function(err,users){

users.forEach(function(ids){
bot.sendMessage(ids.id,"اصبح المايك 🎤 متاح الان ✅",{
"reply_markup":{
"inline_keyboard":[

[{text:"استلام المايك 🎙",callback_data:"mike"}]    
    
]
}
}).catch(err => {}); 
});
    
});

});
}
    
});
    
}

// end leave commands



// make comments 

if(msg.reply_to_message){
    
mike.find().toArray(function(err, res) {    

if(res[0] != undefined){
    
bot.sendMessage(chatid,"تم ✅ ارسال تعليقك لصاحب المايك 🎙",{
    reply_to_message_id:msg.message_id
}).catch(err => {});



bot.sendMessage(res[0].id, "تعليق جديد من 🚹 : " + msg.from.first_name + "\nالتعليق : " + text).catch(err => {});    
}

guest.find().toArray(function(err, guid) {

if(guid[0] != undefined){
bot.sendMessage(guid[0].id, "تعليق جديد من 🚹 : " + msg.from.first_name + "\nالتعليق : " + text).catch(err => {});  
}
    
});

if(res[0] == undefined){
bot.sendMessage(chatid,"ليس هناك ❌ احد على المايك 🎙",{
"reply_markup":{
"inline_keyboard":[

[{text:"استلام المايك 🎙",callback_data:"mike"}]    
    
]
}    
}).catch(err => {});
}
    
});
    
}

// end comments


// start logout commands 

if(text == "/logout" && ar.ids.indexOf(id) == -1){

var keyboard = {inline_keyboard:[

[{text:"الرئيسية 🏘",callback_data:"home"}]
    
]};    

col.find({id:id}).toArray(function(err,res){

if(res[0] != undefined){
col.remove({id:id});
bot.sendMessage(chatid,"تم ✅ تسجيل الخروج من حسابك 🚹",{
reply_markup:keyboard
}).catch(err => {});
}

if(res[0] == undefined){
bot.sendMessage(chatid,"قم بأنشاء حساب اولا ❌",{
'reply_markup':{
    
'inline_keyboard':[

[{text:"تسجيل 📃",callback_data:"singup"}],

]

}
}).catch(err => {});

}

});
    
      
    
}


// end logout commands   

});


bot.on("callback_query",function(query){
    
var data = query.data;
var msgid = query.message.message_id;
var chatid = query.message.chat.id;
var username = query.message.chat.first_name;

if(data == "logout"){

col.remove({id:chatid},function(err,res){
    
var keyboard = {inline_keyboard:[

[{text:"الرئيسية 🏘",callback_data:"home"}]
    
]};    

if(!err){
bot.editMessageText("تم ✅ تسجيل الخروج من حسابك 🚹",{
chat_id:chatid,
message_id:msgid,
reply_markup:keyboard
}).catch(err => {});
}    
    
});
    
}


if(data == "singup"){

col.insert({id:chatid},function(err,res){
    
if(!err){
    
var keyboard = {inline_keyboard:[
[{text:"استلام المايك 🎙",'callback_data':'mike'}],
[{text:"تسجيل خروج 🗯",callback_data:"logout"}]
]};    

bot.editMessageText("مجتمع كاريوكي 🎤  حيث مرحب لجميع المواهب الغنائية ✳️",{

chat_id:chatid,
message_id:msgid,
reply_markup:keyboard
    
}).catch(err => {});
    
}    
    
});
    
}
   
   
if(data == "home" && ar.ids.indexOf(chatid) == -1){
    
    
var keyboard = {inline_keyboard:[
[{text:"تسجيل 📃",callback_data:"singup"}],
[{text:"القوانين 📙",callback_data:"rules"}]
]};    
    
bot.editMessageText("اهلا بك في مجتمع كاريوكي 🎤 \nمكان حيث يمكنك مشاركة 🎼 مواهبك الغنائية مع الاخرين 👥",{
    
chat_id:chatid,
message_id:msgid,
reply_markup:keyboard
    
}).catch(err => {});
    
}


if(data == "rules" && ar.ids.indexOf(chatid) == -1){
    
var keyboard = {inline_keyboard:[

[{text:"الرئيسية 🏘",callback_data:"home"}]
    
]};       
    
bot.editMessageText("🗯 عزيزي : " + username + "\nيرجى قرائة القوانين 📃 لتنجب الحضر ❌" + "\n◾️ ممنوع الاسائة في التسجيل الصوتي \n◾️ ممنوع الاطالة بستعمال المايك اترك الفرصة لغيرك\n◾️ الابتعاد عن الاديان والطوائف فهذا مجتمع للمرح\n◾️ استعمال المايك للغناء فقط ",{
    
chat_id:chatid,
message_id:msgid,
reply_markup:keyboard
}).catch(err => {});
}


if(data == "mike" && ar.ids.indexOf(chatid) == -1){
    
mike.find().toArray(function(err,res){
if(res[0] == undefined){

mike.insert({id:chatid},function(err,done){

if(!err){
    
var keyboard = {inline_keyboard:[
[{text:"ترك المايك 🔕",callback_data:"leavemice"}]    
]};    
    
bot.editMessageText("لقد حصلت على المايك 🎙 \nشارك 🔖 صوتك مع الاخرين 🗣",{
chat_id:chatid,
message_id:msgid,
reply_markup:keyboard
}).catch(err => {});


col.find({id : {$ne : chatid}},function(err, users) {
users.forEach(function(ids){
bot.sendMessage(ids.id, "اصبح 🚹 : " + username + " يستخدم المايك 🎙 ").catch(err => {});
});  
});

setmiketime();

} 
    
});
    
}


if(res[0] != undefined){
    
var keyboard = {inline_keyboard:[
[{text:"عودة ◀️",callback_data:'back'}]    
]};    
    
bot.editMessageText("هناك شخص 🚹 اخر على المايك 🎤",{
chat_id:chatid,
message_id:msgid,
reply_markup:keyboard
}).catch(err => {});
}

});  
    
}
   
   
if(data == "back" && ar.ids.indexOf(chatid) == -1){
var keyboard = {inline_keyboard:[
[{text:"استلام المايك 🎙",'callback_data':'mike'}],
[{text:"تسجيل خروج 🗯",callback_data:"logout"}]
]};    

bot.editMessageText("مجتمع كاريوكي 🎤  حيث مرحب لجميع المواهب الغنائية ✳️",{

chat_id:chatid,
message_id:msgid,
reply_markup:keyboard
    
}).catch(err => {});
}


if(data == "leavemice" && ar.ids.indexOf(chatid) == -1){

mike.find({id:chatid}).toArray(function(err,res){
var keyboard = {inline_keyboard:[
[{text:"عودة ◀️",callback_data:'back'}]    
]};  

if(res[0] == undefined){
bot.editMessageText("انت لست ❌ على المايك 🎤",{
chat_id:chatid,
message_id:msgid,
reply_markup:keyboard
}).catch(err => {});

}

if(res[0] != undefined){
mike.remove({id:chatid},function(err,done){
    
bot.editMessageText("لقد قمت بلخروج 🚹 من المايك ✅",{
chat_id:chatid,
message_id:msgid,
reply_markup:keyboard
}).catch(err => {}); 

guest.find().toArray(function(err, guid) {

if(guid[0] != undefined){
guest.remove({id : guid[0].id});
}

});

col.find({id : {$ne : chatid}},function(err,users){

users.forEach(function(ids){
bot.sendMessage(ids.id,"اصبح المايك 🎤 متاح الان ✅",{
"reply_markup":{
"inline_keyboard":[

[{text:"استلام المايك 🎙",callback_data:"mike"}]    
    
]
}
}).catch(err => {}); ;  
});
    
});

});
}
    
});
    
}


if(data == "guest"){
    
    

mike.find().toArray(function(err, res) {

guest.find().toArray(function(err, gus) {
    
var keyboard = {inline_keyboard:[
[{text:"عودة ◀️",callback_data:'back'}]    
]}; 
    
if(gus[0] != undefined){
bot.editMessageText("هناك 🚹 ضيف بلفعل على المايك 🎙",{
chat_id:chatid,
message_id:msgid,
reply_markup:keyboard
});   
}  


if(gus[0] == undefined){
if(res[0] == undefined){
    
var keyboard = {"inline_keyboard":[
[{text:"استلام المايك 🎙",callback_data:"mike"}]    ]
}     
    
bot.editMessageText("ليس ❌ هناك احد يستخدم المايك 🎙",{
chat_id:chatid,
message_id:msgid,
reply_markup:keyboard
});  
}


if(res[0] != undefined){
bot.editMessageText("تم ✅ ارسال طلبك لصاحب المايك 🎙",{
chat_id:chatid,
message_id:msgid
});

bot.sendMessage(res[0].id,"يرغب 🚹 : " + username + "\nان يكون ضيفك على المايك 🎙 " + "\nللقبول ارسل 💌" + "\n/add@" + chatid);

}
}
    
});
    
});    
    
}


if(data == "leaveguest" && ar.ids.indexOf(chatid) == -1){

guest.find({id:chatid}).toArray(function(err,res){
var keyboard = {inline_keyboard:[
[{text:"عودة ◀️",callback_data:'back'}]    
]};  

if(res[0] == undefined){
bot.editMessageText("انت لست ❌ على الضيافة 🎤",{
chat_id:chatid,
message_id:msgid,
reply_markup:keyboard
}).catch(err => {});

}

if(res[0] != undefined){
mike.remove({id:chatid},function(err,done){
    
bot.editMessageText("لقد قمت بلخروج 🚹 من الضيافة ✅",{
chat_id:chatid,
message_id:msgid,
reply_markup:keyboard
}).catch(err => {}); 


col.find({id : {$ne : chatid}},function(err,users){

users.forEach(function(ids){
bot.sendMessage(ids.id,"اصبحت الضيافة  🎤 متاح الان ✅",{
"reply_markup":{
"inline_keyboard":[

[{text:"طلب الضيافة 🎙",callback_data:"guest"}]    
    
]
}
}).catch(err => {}); ;  
});
    
});

});
}
    
});
    
}

   
    
});


});


