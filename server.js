const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

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
app.use(cors());

app.get('/', (req, res) => {
  // res.send(database.users);
  res.send('it works!');
})

// processes sign in data
app.post('/signin', cors(), (req, res) => {signin.handleSignin(req, res, db, bcrypt)});
// registers a new user to the database
app.post('/register', cors(), (req, res) => { register.handleRegister(req, res, db, bcrypt) });
// gets a registered profile (if available)
app.get('/profile/:id', cors(), (req, res) => {profile.handleProfileGet(req, res, db)});
// handles the count of images processed
app.put('/image', cors(), (req, res) => {image.handleImage(req, res, db)});
// handles calling the Clarifai API
app.post('/imageurl', cors(), (req, res) => {image.handleApiCall(req, res)});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
})