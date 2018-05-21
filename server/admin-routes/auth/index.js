const router = require('express').Router()
const { Customer } = require('../../../db');

router.post('/login', (req, res, next) => {
  //, attributes: ['name', 'username', 'publicId', 'location']
  Customer.findOne({where: {username: req.body.username}})
    .then(customer => {
      if (!customer) {
        console.log('No such customer found:', req.body.email)
        res.status(401).send('Wrong username and/or password')
      } else if (!customer.validatePassword(req.body.password)) {
        console.log('Incorrect password for customer:', req.body.email)
        res.status(401).send('Wrong username and/or password')
      } else {
        req.session.customer = customer.username;
        res.send(customer);
      }
    })
    .catch(next)
})

// router.post('/signup', (req, res, next) => {
//   Customer.create(req.body)
//     .then(customer => {
//       req.login(customer, err => (err ? next(err) : res.json(customer)))
//     })
//     .catch(err => {
//       if (err.name === 'SequelizeUniqueConstraintError') {
//         res.status(401).send('Customer already exists')
//       } else {
//         next(err)
//       }
//     })
// })

router.post('/logout', (req, res) => {
  delete req.session;
  res.redirect('/');
})

router.get('/me', (req, res) => {
  res.json(req.user);
})

module.exports = router; 