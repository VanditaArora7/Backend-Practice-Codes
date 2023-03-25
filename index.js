//Server
// import http from "http"
// // import vari from "./newfile.js";
// // import{vari2,vari3} from "./newfile.js";
// // console.log(vari);
// // console.log(vari2);
// // console.log(vari3);
// // import * as myobj from "./newfile.js";
// // console.log(myobj)
// import { IQ_percentage } from "./newfile.js";
// import fs from "fs";
// import path from "path";



// const home=fs.readFileSync("./index.html");


// const server=http.createServer((req,res)=>{
//    // res.end("<h1>Nice</h1>")
//    if(req.url==="/about"){
//     res.end(IQ_percentage());
//    }
//    else if(req.url==="/"){
//     res.end(home)
//    }
//    else if(req.url==="/contact"){
//     res.end("<h1>Contact Page</h1>")
//    }
//  else{
//     res.end("<h1>Page not Found</h1>")
//    }
   
// })
// server.listen(5000,()=>{
//     console.log("Server started working")
// })

import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieparser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app=express();

mongoose.connect("mongodb://127.0.0.1:27017/Backend",{
    useNewUrlParser:true,useUnifiedTopology:true
}).then(()=>{console.log("Database connected successfully")}).catch((err)=>{console.log("err")})

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const Message=mongoose.model("User",userSchema)




//const users=[];
//setting up view engine

//Using middlewares
app.use(cookieparser())
app.use(express.static(path.join(path.resolve(),"public")))//middleware

app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")

const isAuthenticated=async(req,res,next)=>{
    const {token}=req.cookies;
    if(token){
       const decoded= jwt.verify(token,"iamamonkey")
       // console.log(decoded_userid)
       req.user=await Message.findById(decoded._id)
        next()
    }
    else{
        res.render("login")
    }
}




// app.get("/",isAuthenticated,(req,res)=>{
   
//  res.json({
//     success:true,
//     products:[]
//  })
// res.status(400).send("My wish")
// const pathlocation=path.resolve();
// res.sendFile(path.join(pathlocation,"./index.html"))

//res.sendFile()
//console.log(req.cookies.token)
//res.render("login")
// const{token}=req.cookies
// if(token){
//     res.render("logout")
// }
// else{
//     res.render("login")

// }
// res.render("login")
//res.render("index")
// res.sendFile("index")
// res.render("logout")
// })
// app.get("/success",(req,res)=>{
//     res.render("success")
// })
// app.post("/contact",async(req,res)=>{
//    // console.log(req.body)
//   // users.push({username:req.body.name,email:req.body.email})
//    // res.render("success")
//   // const messageData={username:req.body.name,email:req.body.email}
//   const {name,email}=req.body;//DESTRUCTURING
//    // await Message.create({name:req.body.name,email:req.body.email})
// //    await Message.create({name:name,email:email})
// await Message.create({name,email})//IF KEY AND VALUE PAIR ARE SAME
//    res.redirect("/success")




// })
// app.get("/users",(req,res)=>{
//     res.json({
//         users
//     })
// })
// app.get("/add",(req,res)=>{
//     Message.create({name:"Vandita",email:"Vandita@gail.com"}).then(()=>{
//         res.send("Data added successfully to db")
//     })
// })
// app.get("/add",async(req,res)=>{
//     await Message.create({name:"ABS",email:"Abs@gmail.com"});
//     res.send("Data added to db successfully")
// })
// app.post("/login",(req,res)=>{
//      res.cookie("token","storingcookie",{
//        httpOnly:true,expires:new Date(Date.now()+60*1000
//  ) });
//     res.redirect("/")
// })
// app.get("/logout",(req,res)=>{
//     res.clearCookie("token")
//     res.redirect("/")

// })
//////////////////////////////////LOGIN FORM//////////////
app.get("/",isAuthenticated,(req,res)=>{
    res.render("logout",{name:req.user.name})
})
app.post("/login",async(req,res)=>{
    //console.log(req.body)
    const{email,password}=req.body
    let user=await Message.findOne({email})
    if(!user){
        return res.redirect("/register")
    }
    // user = await Message.create({
    //     name:req.body.name,
    //     email:req.body.email
    // })

    
    ////IF THE USER ALREADY EXISTS IN THE DATABASE

    
   // const token=jwt.sign({_id:user._id},"iamamonkey")


//     res.cookie("token",token,{
//       httpOnly:true,expires:new Date(Date.now()+60*1000
// ) });

    const isMatch=await bcrypt.compare(password,user.password)
    if(isMatch){

        const token=jwt.sign({_id:user._id},"iamamonkey")


        res.cookie("token",token,{
          httpOnly:true,expires:new Date(Date.now()+60*1000
    ) })
    res.redirect("/")

    }
   res.render("login",{email,message:"Incorrect Password"})
})
app.get("/logout",(req,res)=>{
    res.clearCookie("token")
    res.redirect("/")

})
app.get("/register",(req,res)=>{
    res.render("register")
})
app.post("/register",async(req,res)=>{
   
   const{name,email,password}=req.body;

   let user=await Message.findOne({email})
    if(user){
        return res.redirect("/login")
    }
    const hashedpassword= await bcrypt.hash(password,10)
    user = await Message.create({
        name,
        email,
        password:hashedpassword
    })
    const token=jwt.sign({_id:user._id},"iamamonkey")


    res.cookie("token",token,{
      httpOnly:true,expires:new Date(Date.now()+60*1000
) })
        res.render("login")
})


app.listen(5000,()=>{
    console.log("Server has started working ")
})

