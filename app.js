require('dotenv').config()
const express=require('express')
const app=express()
const path=require('path')
const session=require("express-session")
// const {v4:uuidv4}=require("uuid")
const nocache = require('nocache');
const mongoose=require('mongoose')
const morgan=require('morgan')

const PORT=process.env.PORT||4000

// database connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
const db=mongoose.connection
db.on('error',(err)=>{
    console.log(err);
})
db.on('open',function(){
    console.log('connected...!');
})

// middleware
app.use(express.urlencoded({extended:false}))
app.use(express.json())
// app. use(morgan('tiny'));
app.use(nocache())

//load static assets
app.use('/static',express.static(path.join(__dirname,'public')))
// app.use('/assets',express.static(path.join(__dirname,'public/assets')))

app.use(express.static('public/users'));
app.use(express.static('public/admin'));

app.use(session({
    secret:'my secret key',
    saveUninitialized:true,
    resave:false
}))

// set template engine
app.set('view engine','ejs')

app.get('/',(req,res)=>{
    res.render('users/index')
    // res.send('hai')
})


// routes prefix
app.use("",require('./routes/userRoutes'))
app.use("/admin",require('./routes/adminRoutes'))

app.listen(PORT,()=>{
    console.log(`server started at http://localhost/${PORT}`);
})
