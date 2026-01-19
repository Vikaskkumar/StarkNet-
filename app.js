const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");

const cors = require('cors')
const  Dbconnection = require('./config/db.js')

 


Dbconnection();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(require('./Routes/auth'));
app.use(require('./Routes/createPost'));
app.use(require('./Routes/user'));

//serving frontend
app.use(express.static(path.join(__dirname,"./Frontend/dist")));

app.get((req,res)=>{
    res.sendFile(
        path.join(__dirname,"./Frontend/dist/index.html"),
        function (err){
            res.status(500).send(err);
        }
    )
})

app.listen(PORT,()=>{
    console.log('server is running on port' + PORT);
})

