const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Returns true if the username is NOT already taken (i.e. it is valid for registration)
const isValid = (username) => {
  const usersWithSameName = users.filter((user) => user.username === username);
  return usersWithSameName.length === 0;
};

// Returns true if the username and password match a registered user
const authenticatedUser = (username, password) => {
  const matchingUsers = users.filter(
    (user) => user.username === username && user.password === password
  );
  return matchingUsers.length > 0;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in: username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    // Generate a JWT access token and store it in the session
    const accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "User successfully logged in", username, accessToken });
  }
  return res.status(208).json({ message: "Invalid Login. Check username and password" });
});

// Add or modify a book review (the review text comes from the query string or the body)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review || (req.body && req.body.review);
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
  if (!review) {
    return res.status(400).json({ message: "Review text is required (use ?review=... or a JSON body)" });
  }

  const isUpdate = Boolean(books[isbn].reviews[username]);
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: `Review for ISBN ${isbn} ${isUpdate ? "updated" : "added"} by user ${username}`,
    reviews: books[isbn].reviews,
  });
});

// Delete the logged-in user's review for a book
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: `No review by user ${username} found for ISBN ${isbn}` });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({
    message: `Review for ISBN ${isbn} posted by user ${username} deleted`,
    reviews: books[isbn].reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
