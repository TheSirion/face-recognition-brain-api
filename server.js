const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const PORT = process.env.PORT || 3000;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
// connects with the postgreSQL database using Knex.JS
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

// Queries the database and prints the response
db.select('*').from('users').then(data => {
  // console.log(data);
});

const app = express();
app.use(express.json());

var whitelist = ['https://thesirion.github.io', 'https://my-smart-brain-frontend.herokuapp.com', 'localhost:3000']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors({
  origin: corsOptions
}));

app.get('/', (req, res) => {
  // res.send(database.users);
  res.send('it works!');
})

// processes sign in data
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});
// registers a new user to the database
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
// gets a registered profile (if available)
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});
// handles the count of images processed
app.put('/image', (req, res) => {image.handleImage(req, res, db)});
// handles calling the Clarifai API
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)});

app.listen(PORT, () => {
  console.log(`app is running on port ${process.env.PORT}`);
})