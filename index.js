const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()
const port = process.env.PORT || 5055;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hcvpx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)

const app = express();






app.use(cors());
app.use(bodyParser.json());






const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
 
  const productCollection = client.db("dhakarDokan").collection("products");
  const orderCollection = client.db("dhakarDokan").collection("orders")

  app.get('/allProducts',(req, res)=>{
    productCollection.find()
    .toArray((err,items)=>{
      res.send(items)
    })
  })


  app.get('/orderedProducts',(req, res)=>{
    console.log(req.query.email)
    orderCollection.find({email:req.query.email})
    .toArray((err,items)=>{
      res.send(items)
    })
  })

  

  app.get('/cheackout/:id',(req, res)=>{
    console.log(req.params.id);
    productCollection.find({_id:ObjectId(req.params.id)})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
    
  })

  app.post('/addProduct',(req,res)=>{
    const product = req.body;
    console.log("new product",product);
    productCollection.insertOne(product)
    .then(result => {
      console.log(result);
      res.send(result.insertedCount > 0)
    })
    
  })

  app.post('/orderdone',(req,res)=>{
    const orderDetail = req.body;
    console.log("new product",orderDetail);
    orderCollection.insertOne(orderDetail)
    .then(result => {
      console.log(result);
      res.send(result.insertedCount > 0)
    })
    
  })

  app.delete('/delete/:id',(req, res)=>{
    console.log(req.params.id);
    productCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result=>{
      console.log(result);
      res.send(result.deletedCount > 0)
    })
  })
  
  console.log("db connected")
});


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})