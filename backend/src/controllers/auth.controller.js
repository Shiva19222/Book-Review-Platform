import { validationResult } from 'express-validator';
import { User } from '../models/User.model.js';
import { generateToken } from '../utils/generateToken.js';

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });
  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email },
    token,
  });
}

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await user.matchPassword(password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  const token = generateToken(user._id);
  res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
}

export async function me(req, res) {
  res.json({ user: req.user });
}
