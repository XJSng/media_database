const {MongoClient} = require('mongodb')
require('dotenv').config()

async function connectToMongoDB() {
    const url = process.env.MONGODB_URL
    const client = new MongoClient(url)

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db();
      } catch (error) {
        console.error('Error connecting to MongoDB', error);
        throw error;    
      }
}


module.exports= {connectToMongoDB}