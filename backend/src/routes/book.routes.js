import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { createBook, listBooks, getBook, updateBook, deleteBook } from '../controllers/book.controller.js';

const router = express.Router();

router.get('/', listBooks);
router.get('/:id', getBook);

router.post(
  '/',
  protect,
  [
    body('title').isString().trim().isLength({ min: 1 }).withMessage('Title required'),
    body('author').isString().trim().isLength({ min: 1 }).withMessage('Author required'),
    body('description').optional().isString(),
    body('genre').optional().isString(),
    body('year').optional().isInt({ min: 0 }).toInt(),
    body('coverUrl').optional().isString(),
  ],
  createBook
);

router.put(
  '/:id',
  protect,
  [
    body('title').optional().isString().trim(),
    body('author').optional().isString().trim(),
    body('description').optional().isString(),
    body('genre').optional().isString(),
    body('year').optional().isInt({ min: 0 }).toInt(),
    body('coverUrl').optional().isString(),
  ],
  updateBook
);

router.delete('/:id', protect, deleteBook);

export default router;
