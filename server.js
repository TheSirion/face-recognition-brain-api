const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// connects with the postgreSQL database using Knex.JS
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'matheusribeiro',
    password : 'sqlHeavyWeapon',
    database : 'smart-brain'
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
  res.send(database.users);
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

app.listen(3000, () => {
  console.log('app is running on port 3000');
})