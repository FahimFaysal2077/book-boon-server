const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ewkr7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(cors());


const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
    res.send('Hello World!')
  })


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const booksCollection = client.db("bookBoonStore").collection("books");
    const ordersCollection = client.db("bookBoonStore").collection("orders");
    
    app.post('/addOrder', (req, res) => {
        const order =req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/books', (req, res) => {
        booksCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.get('/book/:id', (req, res) => {
        booksCollection.find({_id: ObjectID(req.params.id)})
        .toArray( (err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post('/addBook', (req, res) => {
        const newBook = req.body;
        console.log('Adding new book: ', newBook);
        booksCollection.insertOne(newBook)
        .then(result => {
            console.log('Inserted Count', result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/allOrders', (req, res) => {
        ordersCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.delete('deleteBook/:id', (req, res) => {
        const id = ObjectId(req.params.id);
        console.log('delete this', id);
        booksCollection.findOneAndDelete({_id: id})
        .then(documents => res.send(!!documents.value))
      })


});





app.listen(process.env.PORT || port)