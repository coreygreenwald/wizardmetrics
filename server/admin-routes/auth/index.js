const router = require('express').Router()
const { Customer, Conversion } = require('../../../db');

router.post('/login', (req, res, next) => {
  Customer.findOne({
    where: {
      username: req.body.username,
    }, include: [
      { model: Conversion }
    ]
  }).then(customer => {
    if (!customer) {
      res.status(401).send('Wrong username and/or password')
    } else {
      if (!customer.validatePassword(req.body.password)) {
        res.status(401).send('Wrong username and/or password')
      } else {
        req.session.customer = customer.username;
        res.send(customer);
      }
    }
  }).catch(next)
})

// During the production run of Wizard Metrics - Company Signup was managed through customer acquisition.
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
  res.json(req.customer);
})

module.exports = router; 