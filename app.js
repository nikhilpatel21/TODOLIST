//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");
const app = express();
const PORT=process.env.PORT || 3000;

//connect kiya mongodb se
mongoose.connect("mongodb+srv://admin-nikhil:1234@cluster0.pmt4q9v.mongodb.net/todolistDB",{useNewUrlParser:true});
//mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser:true});
// schema bnaya
const itemsSchema={
  name:String,
}
//Item bnaya jo schema pe based hai
const Item=mongoose.model("Item", itemsSchema);

const item1=new Item({
  name:"Welcome to todolist"
});

const item2=new Item({
  name:"hit + to add item"
});

const item3=new Item({
  name:"hit <-- to deleteitem"
});

const defaultItems=[item1, item2,item3];

const listSchema={
  name:String,
  items: [itemsSchema]
}

const List=mongoose.model("List",listSchema);


/*  Baar baar hoga save isliye comment out kr rha hoon
Item.insertMany(defaultItems)
  .then(function(){
    console.log("Success");
  })
  .catch(function(err){
    console.log(err);
  })
*/
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res) {

  //promise not callback
  Item.find()
  .then(function(foundItems){
  
    //yeh isliye kiya kyoki baar barr enter ho rahe the ab ek hi baar hoga
    if(foundItems.length===0){
  
      Item.insertMany(defaultItems)
  .then(function(){
    console.log("Success");
  })
  .catch(function(err){
    console.log(err);
  })
  // isliye redirect wapis se taaki ek baar isert karne baad chale  warna else wale mein nhi jaa pata
    res.redirect("/");
    }
    else{
  res.render("list", {listTitle: "Today", newListItems: foundItems});
      console.log(foundItems);
  }
})
  .catch(function(err){
  
      console.log(err);   
  })




  //res.render("list", {listTitle: "Today", newListItems: foundItems});
})

app.get("/:customListName",(req,res)=>{
  const customListName=req.params.customListName;
  List.findOne({name:customListName})
  .then((foundList)=>{
    if(!foundList){
      const list=new List({
        name:customListName,
        items:defaultItems
      })
      list.save();
      console.log("saved");
      res.redirect("/"+customListName);
      console.log("not exist")
    }
    else{
      console.log("exist");
      res.render("list",{listTitle:foundList.name, newListItems:foundList.items});
      
    }
  })
  .catch((err)=>{
    console.log(err);
  })

  //const list=new List({
    //name:customListName,
    //items: defaultItems
  //})
  //list.save();

})

app.post("/", function(req, res){

  const itemName = req.body.newItem;
const item=new Item({
  name:itemName
})
 item.save();
    res.redirect("/");
  
});
app.post("/delete",(req,res)=>{
  const checkedItemId=req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId)
  .then(()=>{
    console.log("successfully deleted item");
  })
  .catch((err)=>{
    console.log(err);
  })

  res.redirect("/")

})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(PORT, function() {
  console.log("Server started on port 3000");
});
