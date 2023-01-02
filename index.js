import express from "express";
const app=express()
const port=9000;
app.use("/",(req,res)=>{
       res.json({Message: "Hello from Express App"});
})
app.listen(9000,()=>{
       console.log("server is running")

});