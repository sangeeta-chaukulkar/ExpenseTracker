const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ where: { email: email ,password:password} })
  .then(present => {
    if(present){
      res.json('Present');
    }
  })
}

exports.postUser = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  User.findOne({ where: { email: email } })
  .then(present => {
    if(present){
      res.json('User already exists, Please Login');
    }
   bcrypt.hash(password,12)  
    .then(hashpassword=>{
      User
    .create({
      name: name,
      email: email,
      phone: phone,
      password: hashpassword
    })
    })
    .then(result => {
      res.json('Successfuly signed up');
    })
  })
    .catch(err => {
      console.log(err);
    });
};

// exports.getUser = (req, res, next) => {
//   User.findAll()
//     .then(users => {
//       res.json({users});
//     })
// };


