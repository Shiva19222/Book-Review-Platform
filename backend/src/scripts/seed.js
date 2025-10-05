import 'dotenv/config';
import mongoose from 'mongoose';
import { Book } from '../models/Book.model.js';

async function main(){
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookreview?directConnection=true';
  await mongoose.connect(uri);
  console.log('[seed] connected');

  const samples = [
    {
      title: 'Educated',
      author: 'Tara Westover',
      genre: 'Memoir',
      year: 2018,
      coverUrl: 'https://m.media-amazon.com/images/I/81Y5WuARqpL.jpg',
      description: 'A powerful memoir about resilience and self-invention.',
      addedBy: new mongoose.Types.ObjectId(),
    },
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      genre: 'Self-help',
      year: 2018,
      coverUrl: 'https://m.media-amazon.com/images/I/91bYsX41DVL.jpg',
      description: 'Tiny changes, remarkable results.',
      addedBy: new mongoose.Types.ObjectId(),
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt, David Thomas',
      genre: 'Programming',
      year: 1999,
      coverUrl: 'https://m.media-amazon.com/images/I/41as+WafrFL.jpg',
      description: 'Journey to mastery with pragmatic tips.',
      addedBy: new mongoose.Types.ObjectId(),
    },
  ];

  const existing = await Book.countDocuments();
  if (existing === 0){
    await Book.insertMany(samples);
    console.log('[seed] inserted', samples.length, 'books');
  } else {
    console.log('[seed] skipped: collection already has', existing, 'books');
  }

  await mongoose.disconnect();
  console.log('[seed] done');
}

main().catch((e) => { console.error('[seed] error', e); process.exit(1); });
