const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
// const helmet=require('helmet');
const morgan=require('morgan');
const fs=require('fs');
// const https=require('https');

// const privateKey=fs.readFileSync('server.key');
// const certificate=fs.readFileSync('server.cert');

// var skey=require('crypto').randomBytes(64).toString('hex');

const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');

const accessLogStream =fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})
const app = express();
var cors = require('cors')
app.use(cors())
// app.use(helmet());

app.use(morgan('combined',{stream:accessLogStream}));



const adminRoutes = require('./routes/admin');
const purchaseRoutes = require('./routes/purchase');
const resetpasswordRoutes = require('./routes/resetpassword');
app.use('/purchase', purchaseRoutes);
app.use(resetpasswordRoutes);

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// app.set('view engine', 'html');
app.use(adminRoutes);


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);


app.use((req, res)=>{
  res.sendFile(path.join(__dirname,`public/${req.url}`));
})

app.use(errorController.get404);


sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
    //  https.createServer
    // ({key:privateKey,cert:certificate},app)
    // .listen(process.env.PORT || 3000);
     app.listen(process.env.PORT || 3000);;

    // console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
