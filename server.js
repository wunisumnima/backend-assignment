// server.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 5000;

// Middleware to parse JSON and log requests
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// In-memory data storage
let books = [];

// GET /books - Retrieve all books
app.get('/books', (req, res) => {
  res.json(books);
});

// GET /books/:id - Retrieve a book by ID
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

// POST /books - Add a new book
app.post('/books', (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const newBook = { id: uuidv4(), title, author, year };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /books/:id - Update a book
app.put('/books/:id', (req, res) => {
  const { title, author, year } = req.body;
  const bookIndex = books.findIndex(b => b.id === req.params.id);

  if (bookIndex === -1) return res.status(404).json({ message: 'Book not found' });
  if (!title || !author || !year) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  books[bookIndex] = { id: req.params.id, title, author, year };
  res.json(books[bookIndex]);
});

// DELETE /books/:id - Delete a book
app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === req.params.id);
  if (bookIndex === -1) return res.status(404).json({ message: 'Book not found' });
  books.splice(bookIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
