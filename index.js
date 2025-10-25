const express = require("express");
const cors = require("cors");
const Book = require("./models/book.models");
const { initializeDatabase } = require("./db/db.connect");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

initializeDatabase();

const newBook = {
  title: "Lean In",
  author: "Sheryl Sandberg",
  publishedYear: 2012,
  genre: ["Non-fiction", "Business"],
  language: "English",
  country: "United States",
  rating: 4.1,
  summary:
    "A book about empowering women in the workplace and achieving leadership roles.",
  coverImageUrl: "https://example.com/lean_in.jpg",
};

// 1. Create an API with route "/books" to create a new book data in the books Database. Make sure to do error handling. Test your API with Postman. Add the following book:
async function createBook(bookData) {
  try {
    const book = new Book(bookData);
    const savedBook = await book.save();
    return savedBook;
  } catch (error) {
    console.log("Error in creating book.", error);
  }
}

app.post("/books", async (req, res) => {
  try {
    const savedBook = await createBook(req.body);
    res
      .status(201)
      .json({ message: "Book added successfully.", book: savedBook });
  } catch (error) {
    res.status(500).json({ error: "Failed to add book." });
  }
});

// 2. Run your API and create another book data in the db.
const newBook2 = {
  title: "Shoe Dog",
  author: "Phil Knight",
  publishedYear: 2016,
  genre: ["Autobiography", "Business"],
  language: "English",
  country: "United States",
  rating: 4.5,
  summary:
    "An inspiring memoir by the co-founder of Nike, detailing the journey of building a global athletic brand.",
  coverImageUrl: "https://example.com/shoe_dog.jpg",
};

// 3. Create an API to get all the books in the database as response. Make sure to do error handling.
async function readAllBooks() {
  try {
    const books = await Book.find();
    return books;
  } catch (error) {
    console.log("Error in fetching books.", error);
  }
}

app.get("/books", async (req, res) => {
  try {
    const books = await readAllBooks();

    if (books.length != 0) {
      res.status(200).json({ books });
    } else {
      res.status(404).json({ message: "No book found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// 4. Create an API to get a book's detail by its title. Make sure to do error handling.
async function readBookByTitle(bookTitle) {
  try {
    const book = await Book.findOne({ title: bookTitle });
    return book;
  } catch (error) {
    console.log("Error in fetching book by title.", error);
  }
}

app.get("/books/title/:title", async (req, res) => {
  try {
    const book = await readBookByTitle(req.params.title);

    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// 5. Create an API to get details of all the books by an author. Make sure to do error handling.
async function readBooksByAuthor(bookAuthor) {
  try {
    const books = await Book.find({ author: bookAuthor });
    return books;
  } catch (error) {
    console.log("Error in fetching book by title.", error);
  }
}

app.get("/books/author/:author", async (req, res) => {
  try {
    const books = await readBooksByAuthor(req.params.author);

    if (books.length != 0) {
      res.status(200).json({ books });
    } else {
      res.status(404).json({ message: "No books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books by author name." });
  }
});

// 6. Create an API to get all the books which are of "Business" genre.
async function readBooksByGenre(bookGenre) {
  try {
    const books = await Book.find({ genre: bookGenre });
    return books;
  } catch (error) {
    console.log("Error in fetching book by genre.", error);
  }
}

app.get("/books/genre/:genre", async (req, res) => {
  try {
    const books = await readBooksByGenre(req.params.genre);

    if (books.length != 0) {
      res.status(200).json({ books });
    } else {
      res.status(404).json({ message: "No books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books by genre." });
  }
});

// 7. Create an API to get all the books which was released in the year 2012.
async function readBooksByReleaseYear2012() {
  try {
    const books = await Book.find({ publishedYear: 2012 });
    return books;
  } catch (error) {
    console.log("Error in fetching book by genre.", error);
  }
}

app.get("/books/release-year-2012", async (req, res) => {
  try {
    const books = await readBooksByReleaseYear2012();

    if (books.length != 0) {
      res.status(200).json({ books });
    } else {
      res.status(404).json({ message: "No books found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch books by release year 2012." });
  }
});

// 8. Create an API to update a book's rating with the help of its id. Update the rating of the "Lean In" from 4.1 to 4.5. Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling.
// Updated book rating: { "rating": 4.5 }
async function updateBookById(bookId, dataToUpdate) {
  try {
    const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {
      new: true,
    });
    return updatedBook;
  } catch (error) {
    console.log("Error in updating book.", error);
  }
}

app.post("/books/:bookId", async (req, res) => {
  try {
    const updatedBook = await updateBookById(req.params.bookId, req.body);

    if (updatedBook) {
      res
        .status(200)
        .json({ message: "Book updated successfully", updatedBook });
    } else {
      res.status(404).json({ message: "Book does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update book by book id." });
  }
});

// 9. Create an API to update a book's rating with the help of its title. Update the details of the book "Shoe Dog". Use the query .findOneAndUpdate() for this. Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling.
// Updated book data: { "publishedYear": 2017, "rating": 4.2 }
async function updateBookByTitle(bookTitle, dataToUpdate) {
  try {
    const updatedBook = await Book.findOneAndUpdate(
      { title: bookTitle },
      dataToUpdate,
      {
        new: true,
      }
    );
    return updatedBook;
  } catch (error) {
    console.log("Error in updating book.", error);
  }
}

app.post("/books/title/:title", async (req, res) => {
  try {
    const updatedBook = await updateBookByTitle(req.params.title, req.body);

    if (updatedBook) {
      res
        .status(200)
        .json({ message: "Book updated successfully", updatedBook });
    } else {
      res.status(404).json({ message: "Book does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update book by title." });
  }
});

// 10. Create an API to delete a book with the help of a book id, Send an error message "Book not found" in case the book does not exist. Make sure to do error handling.
async function deleteBookById(bookId) {
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);
    return deletedBook;
  } catch (error) {
    console.log("Error in deleting book.", error);
  }
}

app.delete("/books/:bookId", async (req, res) => {
  try {
    const deletedBook = await deleteBookById(req.params.bookId);

    if (deletedBook) {
      res
        .status(200)
        .json({ message: "Book deleted successfully", deletedBook });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book by book id." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
