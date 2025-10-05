import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { Book } from '../models/Book.model.js';
import { Review } from '../models/Review.model.js';

function buildQuery({ q, genre, author }) {
  const query = {};
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { author: { $regex: q, $options: 'i' } },
    ];
  }
  if (genre) query.genre = { $regex: `^${genre}$`, $options: 'i' };
  if (author) query.author = author;
  return query;
}

export async function createBook(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, author, description, genre, year, coverUrl } = req.body;
  const book = await Book.create({ title, author, description, genre, year, coverUrl, addedBy: req.user._id });
  const plain = book.toObject();
  plain._id = String(plain._id);
  res.status(201).json(plain);
}

export async function listBooks(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const limit = 5;
  const { q, genre, author, sort: sortKey } = req.query;
  const query = buildQuery({ q, genre, author });
  const total = await Book.countDocuments(query);
  // basic sort (year or createdAt). rating sort is applied after ratings are joined
  let primarySort = { createdAt: -1 };
  if (sortKey === 'year_desc') primarySort = { year: -1 };
  else if (sortKey === 'year_asc') primarySort = { year: 1 };

  const booksRaw = await Book.find(query)
    .sort(primarySort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  // attach avgRating
  const bookIds = booksRaw.map((b) => b._id);
  const ratings = await Review.aggregate([
    { $match: { bookId: { $in: bookIds } } },
    { $group: { _id: '$bookId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const map = new Map(ratings.map((r) => [r._id.toString(), r]));
  let withRatings = booksRaw.map((b) => {
    const r = map.get(b._id.toString());
    return { ...b, averageRating: r ? Number(r.avg.toFixed(2)) : 0, reviewsCount: r ? r.count : 0 };
    });
  // rating-based sort applied after join
  if (sortKey === 'rating_desc') {
    withRatings.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
  } else if (sortKey === 'rating_asc') {
    withRatings.sort((a, b) => (a.averageRating || 0) - (b.averageRating || 0));
  }
  res.json({ page, pages: Math.ceil(total / limit) || 1, total, items: withRatings });
}

export async function getBook(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
  const book = await Book.findById(id).lean();
  if (!book) return res.status(404).json({ message: 'Book not found' });
  const ratingAgg = await Review.aggregate([
    { $match: { bookId: book._id } },
    { $group: { _id: '$bookId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const meta = ratingAgg[0];
  res.json({ ...book, averageRating: meta ? Number(meta.avg.toFixed(2)) : 0, reviewsCount: meta ? meta.count : 0 });
}

export async function updateBook(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
  const book = await Book.findById(id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (book.addedBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  const { title, author, description, genre, year } = req.body;
  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (description !== undefined) book.description = description;
  if (genre !== undefined) book.genre = genre;
  if (year !== undefined) book.year = year;
  await book.save();
  res.json(book);
}

export async function deleteBook(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
  const book = await Book.findById(id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (book.addedBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  await book.deleteOne();
  // Optionally delete related reviews
  await Review.deleteMany({ bookId: id });
  res.json({ message: 'Deleted' });
}
