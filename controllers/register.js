const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;

  // input validation
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }

  const hash = bcrypt.hashSync(password);
  // transaction() makes sure that, if something in one database fails, 
  // all changes in any database will roll back. Perfect for when more than 
  // one table needs to be updated.
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
      // determines which column should be returned by the insert() method
      .returning('*')
      .insert({ // makes an insert query
        name: name,
        email: loginEmail[0],
        joined: new Date()
      })
      .then(user => {
        res.json(user[0]);
      })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
    .catch(err => res.status(400).json('unable to register', err));
}

module.exports = {
  handleRegister: handleRegister
};