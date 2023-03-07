const express = require('express');
// const connectToMongo = require('./db');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 5000;

app.use(bodyParser.json());
// app.use(express.json());
const MongoUrl = 'mongodb://localhost:27017'
const dbName = 'inventory';
const collectionName = 'products';
app.post('/modify_inventory', (req, res)=>{
    const productUpdates = req.body.products;
    
    MongoClient.connect(MongoUrl, { useNewUrlParser: true}, (err, client)=>{
        if(err){
            console.log('error', err);
            return res.status(500).send({error: 'Failed to connevt the database'})
        }
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        productUpdates.array.forEach(update => {
            const productId = update.productId;
            const quantityUpdate = update.quatntity;


            collection.updateOne(
                {
                    _id:productId
                },
                {
                    $inc: {quatntity: quantityUpdate}
                }
            )
            .then(result=>{
                console.log(`updated ${result.modifiedCount} products`)
            })
            .catch(err =>{
                console.log('Error', err)
            })
        });

        client.close();
        return res.status(200).send({message: 'Inventory updated successfully'})
        
    });
});

// connectToMongo();

app.listen(port, () =>{
    console.log(`Listening to port' ${port}`)
})