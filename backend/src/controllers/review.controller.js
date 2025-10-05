import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import { Review } from '../models/Review.model.js';

export async function addReview(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { bookId } = req.params;
  const { rating, reviewText } = req.body;
  if (!mongoose.isValidObjectId(bookId)) return res.status(400).json({ message: 'Invalid book id' });
  try {
    const review = await Review.findOneAndUpdate(
      { bookId, userId: req.user._id },
      { $set: { rating, reviewText } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate review' });
    }
    throw err;
  }
}

export async function listReviews(req, res) {
  const { bookId } = req.params;
  if (!mongoose.isValidObjectId(bookId)) return res.status(400).json({ message: 'Invalid book id' });
  const reviews = await Review.find({ bookId }).populate('userId', 'name').sort({ createdAt: -1 }).lean();
  res.json(reviews);
}

export async function updateReview(req, res) {
  const { id } = req.params; // review id
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid review id' });
  const review = await Review.findById(id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  if (review.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  const { rating, reviewText } = req.body;
  if (rating !== undefined) review.rating = rating;
  if (reviewText !== undefined) review.reviewText = reviewText;
  await review.save();
  res.json(review);
}

export async function deleteReview(req, res) {
  const { id } = req.params; // review id
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid review id' });
  const review = await Review.findById(id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  if (review.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  await review.deleteOne();
  res.json({ message: 'Deleted' });
}
