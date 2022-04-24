const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

// var skey=require('crypto').randomBytes(64).toString('hex');

const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const User = require('./models/user');


const app = express();
var cors = require('cors')
app.use(cors())


const adminRoutes = require('./routes/admin');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'html');
app.use(adminRoutes);
app.use((req, res)=>{
  res.sendFile(path.join(__dirname,`${req.url}`));
})

app.use(errorController.get404);


sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
     app.listen(3000);;
    // console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
