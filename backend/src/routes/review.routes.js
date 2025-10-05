import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { addReview, listReviews, updateReview, deleteReview } from '../controllers/review.controller.js';

const router = express.Router();

// Nested under /api/books/:bookId/reviews for list & add
router.get('/books/:bookId/reviews', listReviews);
router.post(
  '/books/:bookId/reviews',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }).toInt(),
    body('reviewText').optional().isString(),
  ],
  addReview
);

// Direct operations on review by id
router.put(
  '/reviews/:id',
  protect,
  [
    body('rating').optional().isInt({ min: 1, max: 5 }).toInt(),
    body('reviewText').optional().isString(),
  ],
  updateReview
);
router.delete('/reviews/:id', protect, deleteReview);

export default router;
