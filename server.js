// Backend (Node.js with Express)
// check RDS cmd: mysql -h test.cxkieqsi6k22.ap-southeast-2.rds.amazonaws.com -u admin -p
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package


const app = express();
const port = 3000;

app.use(cors());


// Create a connection pool to the RDS database
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'test.cxkieqsi6k22.ap-southeast-2.rds.amazonaws.com',
  user: 'admin',
  password: 'PhuongT16120*',
  database: 'test'
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Query the database
    connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
      // Release the connection back to the pool
      connection.release();

      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length > 0) {
        return res.redirect('/order');
      } else {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
    });
  });
});

// SignUp endpoint
app.post('/signup', (req, res) => {
  const { username, password} = req.body;

  // Insert user details into the database
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, results) => {
      // Release the connection back to the pool
      connection.release();

      if (err) {
        console.error('Error inserting user details into the database:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      return res.status(200).json({ message: 'User signed up successfully' });
    });
  });
});

// Order endpoint
app.get('/order', (req, res) => {
    // Handle the order request here
    res.send('This is the order page');
});

// Order endpoint
app.get('/', (req, res) => {
    // Handle the order request here
    res.send('This is the home page');
});
  

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
