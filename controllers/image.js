const Clarifai = require('clarifai');

// the required key to access the Clarifai API.
const app = new Clarifai.App({
  apiKey: 'b2d22409dbb24f09a4792265618b07ae'
});

const handleApiCall = (req, res) => {
app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
.then(data => res.json(data))
.catch(err => res.status(400).json('unable to work with API'));
}

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1) // a simpler way to call update() to increment a number column
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
  handleImage,
  handleApiCall
}