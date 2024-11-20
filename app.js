const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images, etc.) from the 'public' folder
app.use(express.static('public'));

// MySQL pool configuration
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "test",
    connectionLimit: 10
});

// Route to serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/lab6.html');
});

// Route to handle book addition via POST request
app.post('/add-book', (req, res) => {
    const { isbn, title, author } = req.body;

    const insertBook = `
        INSERT INTO Book1 (isbn, title, author_name)
        VALUES (?, ?, ?);
    `;

    pool.query(insertBook, [isbn, title, author], (err, result) => {
        if (err) {
            console.error('Error', err.sqlMessage);
            return res.status(500).send('Database error!');
        }
        res.send('Book added to the record');
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

// Create the table if it doesn't exist
const createTable = `
CREATE TABLE IF NOT EXISTS Book1 (
    isbn VARCHAR(20) PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    author_name VARCHAR(100) NOT NULL
);
`;

pool.query(createTable, (err, result) => {
    if (err) {
        return console.error("Error in creating table", err);
    }
    console.log("Table has been created", result);
});
