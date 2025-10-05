import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  mongoose.set('strictQuery', true);

  if (uri === 'memory') {
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri('bookreview');
    await mongoose.connect(memUri, { autoIndex: true });
    console.log('MongoDB connected (in-memory)');
    return;
  }

  await mongoose.connect(uri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 30000,
  });
  console.log('MongoDB connected');
}
