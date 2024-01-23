// mongoUtil: this file contains Mongo related utility functions

const {MongoClient} = require('mongodb')
let _db = null
require('dotenv').config()

async function connectToMongoDB() {
    const uri = process.env.MONGODB_URI
    const client = new MongoClient(uri)

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('fmc_media_database');
        _db = db
        return db
      } catch (error) {
        console.error('Error connecting to MongoDB', error);
        throw error;    
      }
}

function getDB() {
  return _db
}



module.exports = {connectToMongoDB, getDB}