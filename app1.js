var express= require('express');
var path = require('path');
var methodOverride = require("method-override");
var mongoose=require("mongoose");
var bodyParser= require('body-parser');
var expressSanitizer= require("express-sanitizer");
const ejsLint = require('ejs-lint');
var app=express();

app.use(express.static(path.join(__dirname, 'public')));

//APP CONFIGRATION

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

app.set("view engine", "ejs"); 
mongoose.connect('mongodb://localhost:27017/hotel-manager',{useNewUrlParser: true});

//MONGOOSE CONFIGRATION
var hotelSchema= new mongoose.Schema({
    image: String,
    title: String,
    reputation: String,
    description: String,
    price: Number,
    location: String,
    No_of_rooms: String,
    Hotel_rating: Number,
})

var hotel=mongoose.model("hotel",hotelSchema);

app.get("/",function(req,res){
    res.redirect("/hotels");
})

//INDEX ROUTE
app.get("/hotels",function(req,res){
    hotel.find({},function(err,allhotels){
        if(err){
            console.log("ERROR OCCURED")
            console.log(err);
        }else{
            res.render("index",{hotels:allhotels})
        }
    })
})

app.post("/hotels",function(req,res){
    req.body.hotel.body=req.sanitize(req.body.hotel.body);
    hotel.create(req.body.hotel,function(err,newhotel){
        if(err){
            console.log("ERROR");
            console.log(err)
            res.render("new")
        }else{
            res.redirect("/hotels");
        }
    })
    
})

//NEW ROUTE
app.get("/hotels/new",function(req,res){
    res.render("new")
})

//SHOW ROUTE
app.get("/hotels/:id",function(req,res){
    hotel.findById(req.params.id,function(err,foundhotel){
        if(err){
            console.log("ERROR IN SHOWS");
            console.log(err);
        }else{
            res.render("show",{hotel:foundhotel});
        }
    })
})

//EDIT ROUTE
app.get("/hotels/:id/edit",function(req,res){
    hotel.findById(req.params.id,function(err,foundhotel){
        if(err){
            console.log("ERROR IN EDIT")
            console.log(err)
        }else{
            res.render("edit",{hotel:foundhotel});
        }
    })
})

//UPDATE ROUTE
app.put("/hotels/:id",function(req,res){
    req.body.hotel.body=req.sanitize(req.body.hotel.body);
    hotel.findByIdAndUpdate(req.params.id, req.body.hotel, function(err,updatedhotel){
        if(err){
            res.redirect("/hotels");
        }else{
            res.redirect("/hotels/" + req.params.id);
        }
    } )
})

//DELETE ROUTE
app.delete("/hotels/:id",function(req,res){
    hotel.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/hotels');
        }
    })
})

app.listen(8080,function(){
    console.log("server is listening on 8080");
});

