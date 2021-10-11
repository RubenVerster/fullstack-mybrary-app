const express = require('express');
const router = express.Router();

const Book = require('../models/book');
const Author = require('../models/author');

const fs = require('fs');
const path = require('path');
const uploadPath = path.join('public', Book.coverImageBasePath);

// not needed, since we use FilePond for image uploads
// const multer = require('multer');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback) => {
//     callback(null, imageMimeTypes.includes(file.mimetype));
//   },
// });

//all books
router.get('/', async (req, res) => {
  let query = Book.find();

  //this is used to search through the MongoDB with the title a user entered
  //use the regex method to search through the DB
  if (
    req.query.title != null &&
    req.query.title != '' &&
    req.query.title != undefined
  ) {
    console.log(req.query.title);
    query = query.regex('title', new RegExp(req.query.title, 'i'));
  }

  //this is used to search through the MongoDB with the date a user entered
  //the lte method searches the DB for a value that is <= to the date, gte method is just >=
  if (
    req.query.publishedBefore != null &&
    req.query.publishedBefore != '' &&
    req.query.publishedBefore != undefined
  ) {
    query = query.lte('publishDate', req.query.publishedBefore);
    console.log(req.query.publishedBefore);
  }
  if (
    req.query.publishedAfter != null &&
    req.query.publishedAfter != '' &&
    req.query.publishedAfter != undefined
  ) {
    console.log(req.query.publishedAfter);
    query = query.gte('publishDate', req.query.publishedAfter);
  }

  try {
    const books = await query.exec();
    res.render('books/index', {
      books: books,
      searchOptions: req.query,
    });
  } catch (error) {
    res.redirect('/');
  }
});

//new book
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book());
});

//create book
router.post('/', async (req, res) => {
  // const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    // coverImageName: fileName,
    description: req.body.description,
  });
  saveCover(book, req.body.cover);

  try {
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`books`);
  } catch (error) {
    // if (book.coverImageName != null) {
    //   removeBookCover(book.coverImageName);
    // }
    renderNewPage(res, book, true);
  }
});

// const removeBookCover = (fileName) => {
//   fs.unlink(path.join(uploadPath, fileName), (err) => {
//     if (err) console.err(err);
//   });
// };

const saveCover = (book, coverEncoded) => {
  if (coverEncoded == null) return;

  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64');
    book.coverImageType = cover.type;
  }
};

const renderNewPage = async (res, book, hasError = false) => {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };

    if (hasError) params.errorMessage = 'Error Creating Book';

    res.render('books/new', params);
  } catch (error) {
    res.redirect('/books');
  }
};

module.exports = router;
