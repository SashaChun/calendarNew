import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.DATABASE_URL);

let clientPromise;

if (process.env.NODE_ENV === 'development') {
     if (global._mongoClientPromise) {
        clientPromise = global._mongoClientPromise;
    } else {
        global._mongoClientPromise = client.connect();
        clientPromise = global._mongoClientPromise;
    }
} else {
     clientPromise = client.connect();
}

export default clientPromise;
