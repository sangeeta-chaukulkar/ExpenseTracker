const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.postUser = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  User.findOne({ where: { email: email } })
  .then(present => {
    if(present){
      return('User already exists');
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
      return('Created User');
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


