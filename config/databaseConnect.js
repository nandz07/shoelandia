const mongoose=require('mongoose')

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
const db=mongoose.connection
db.on('error',(err)=>{
    console.log(err);
})
db.on('open',function(){
    console.log('Database Connected...!');
})


module.exports = mongoose