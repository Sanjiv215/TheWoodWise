const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');

async function createCollection() {
    try {
        await client.connect();
        const db = client.db('thewoodwise');
        await db.createCollection('users');
    
    } finally {
        await client.close();
    }
}

createCollection();