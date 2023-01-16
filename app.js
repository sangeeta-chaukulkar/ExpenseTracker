const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose')
const morgan=require('morgan');
const fs=require('fs');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');


const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');

const accessLogStream =fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})
const app = express();
var cors = require('cors')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('combined',{stream:accessLogStream}));



const adminRoutes = require('./routes/admin');
const purchaseRoutes = require('./routes/purchase');
const resetpasswordRoutes = require('./routes/resetpassword');
app.use('/purchase', purchaseRoutes);
app.use(resetpasswordRoutes);



app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'))
app.set('view engine', 'pug');
app.use(adminRoutes);

app.use('/',(req, res, next) => {
  next();
});

app.use((req, res)=>{
  res.sendFile(path.join(__dirname,`public/login.html`));
})

app.use(errorController.get404);


mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ac-7fqfvf8-shard-00-00.berdqcw.mongodb.net:27017,ac-7fqfvf8-shard-00-01.berdqcw.mongodb.net:27017,ac-7fqfvf8-shard-00-02.berdqcw.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-h3qnek-shard-0&authSource=admin&retryWrites=true&w=majority`)
.then(result => {
  app.listen(3000);     
// mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@expense.berdqcw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority
    //  mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.gerjbiu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority
  })
  .catch(err => {
    console.log(err);
  });
