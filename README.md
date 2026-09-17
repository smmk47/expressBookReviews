# Express Book Reviews – Online Bookstore API

**Project name:** Express Book Reviews (Node.js & Express final project)

A server-side application for an online bookstore built with **Node.js**, **Express**, **express-session**,
**JSON Web Tokens** and **Axios**. It exposes REST endpoints to list and search books, read reviews,
register and log in users, and let authenticated users add, modify and delete their own reviews.
Book data comes from `final_project/router/booksdb.js`.

## Running

```bash
cd final_project
npm install
node index.js      # server listens on http://localhost:5000
```

## Endpoints

### General users (`final_project/router/general.js`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | List all books (Promise) |
| GET | `/isbn/:isbn` | Book by ISBN (Promise) |
| GET | `/author/:author` | Books by author (Promise) |
| GET | `/title/:title` | Books by title (Promise) |
| GET | `/review/:isbn` | Reviews for a book |
| POST | `/register` | Register a new user (`{ "username", "password" }`) |
| GET | `/async/books` | List all books (async/await + Axios) |
| GET | `/async/isbn/:isbn` | Book by ISBN (async/await + Axios) |
| GET | `/async/author/:author` | Books by author (async/await + Axios) |
| GET | `/async/title/:title` | Books by title (async/await + Axios) |

### Registered users (`final_project/router/auth_users.js`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/customer/login` | Log in; stores a JWT in the session |
| PUT | `/customer/auth/review/:isbn?review=...` | Add or modify the logged-in user's review |
| DELETE | `/customer/auth/review/:isbn` | Delete the logged-in user's review |

Routes under `/customer/auth/*` are protected by the JWT session middleware in `final_project/index.js`.

## Saved cURL outputs

The `final_project/outputs/` folder holds the command and output for each graded task:
`githubrepo`, `getallbooks`, `getbooksbyISBN`, `getbooksbyauthor`, `getbooksbytitle`, `getbookreview`,
`register`, `login`, `reviewadded`, `deletereview`.
