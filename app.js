require('dotenv').config()
const express=require('express')
const app=express()
const path=require('path')
const session=require("express-session")
// const {v4:uuidv4}=require("uuid")
const nocache = require('nocache');
require('./config/databaseConnect')
const morgan=require('morgan')
const userRout=require('./routes/userRoutes')
const adminRout=require('./routes/adminRoutes')

const PORT=process.env.PORT||4000

app.use(session({
    secret:process.env.SESSION,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 },
    resave: false
}))

// middleware
app.use(express.urlencoded({extended:false}))
app.use(express.json())
// app. use(morgan('tiny'));
app.use(nocache())

//load static assets
app.use('/static',express.static(path.join(__dirname,'public')))
app.use('/assets',express.static(path.join(__dirname,'public/assets')))

app.use(express.static('public/admin'));
app.use(express.static('public/users'));

// set template engine
app.set('view engine','ejs')

// routes prefix
app.use("/",userRout)
app.use("/admin",adminRout)

app.listen(PORT,()=>{
    console.log(`server started at http://localhost:${PORT}`);
})
