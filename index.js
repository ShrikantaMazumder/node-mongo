const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const app = express();

app.use(cors());
app.use(bodyParser.json());

// const user = process.env.DB_USER;
// const pass = process.env.DB_PASS;

const uri = process.env.DB_PATH;

//Create new connection
let client = new MongoClient(uri, { useNewUrlParser: true });



const users = ['Shrikanta','Mainul','Mizan','Emran','Kuheli','Tahfiza'];

app.get('/',(req,res)=>{
    res.send("Hello world");
})

app.get('/user/:id',(req,res)=>{
    const id = req.params.id;
    const name = users[id];
    //res.send({id,name});
})

//Get products
app.get('/products',(req,res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find().limit(3).toArray((err,documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({message:err});
            } else {
                res.send(documents);
            }
            
            
        })
        client.close();
      });
})

//Post request
app.post('/add-product',(req,res)=>{
    client = new MongoClient(uri, { useNewUrlParser: true });
    const product = req.body;

    //Save to database
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insertOne(product,(err,result) => {
            if (err) {
                console.log(err);
                res.status(500).send({message:err});
            } else {
                res.send(product);
            }
            
            
        })
        //Connection close after taking action
        client.close();
      });
})

const port = process.env.PORT;
app.listen(port,() => console.log("Listening From 2500"));