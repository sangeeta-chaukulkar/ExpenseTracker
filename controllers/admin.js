const bcrypt = require('bcrypt');
const User = require('../models/user');
const Expense = require('../models/expense');
const jwt = require('jsonwebtoken');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const Forgotpassword = require('../models/forgotpassword');
const AWS=require('aws-sdk');

const ITEMS_PER_PAGE = localStorage.getItem('ITEMS_PER_PAGE');

exports.downloadExpenses =  async (req, res) => {
  try {
      if(!req.user.ispremiumuser){
          return res.status(401).json({ success: false, message: 'User is not a premium User'})
      }
    }
    catch(err) {
      res.status(500).json({ error: err, success: false, message: 'Something went wrong'})
  }
  }

exports.forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        if(user){
            const id = uuid.v4();
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                    throw new Error(err)
                })
            sgMail.setApiKey(process.env.SENGRID_API_KEY)
            const msg = {
                to: email, 
                from: 'uttamchaukulkar@gmail.com', 
                subject: 'SendGrid email',
                text: 'SendGrid with Node.js',
                html: `<p>Hi</p>`,
            }
            sgMail
            .send(msg)
            .then((response) => {
                return res.status(response[0].statusCode).json({message: 'Hello there!', sucess: true})
            })
            .catch((error) => {
                throw new Error(error);
            })
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }
}



exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ where: { email: email} })
  .then(user => {
    if(!user){
      return res.status(404).json( { message: "User Not Found" });
    }
    bcrypt.compare(password,user.password)
    .then(isMatch=>{
      if(isMatch){
        jwt.sign({id:user.dataValues.id,email:email}, process.env.TOKEN_SECRET, { expiresIn: '1800s' },(err,token)=>{
          localStorage.setItem('token',JSON.stringify({token:token}));
          if(user.dataValues.ispremiumuser){
            res.send({token:token,message:'Premium User'});
          }
          res.send({token:token,message:'Login successfully'}); 
        });
      }
      else{
        return res.status(401).json({ message: "User Not Authorized" });
      }
    })
    
  })
  .catch(err=>{
    console.log(err);
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
      res.json({message:'User already exists, Please Login'});
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
      res.json({message:'Successfuly signed up'});
    })
  })
    .catch(err => {
      console.log(err);
    });
};
const authenticate= (req, res,next) => {
  try{
    const token=req.header('authorization');
    const userid=Number(jwt.verify(token,process.env.TOKEN_SECRET));
    User.findByPk(userid).then(user=>{
      req.user=user;
      next();
    }).catch(err => {throw new Error(err)})
  }
  catch(err){
    return res.status(401).json({ success: false});
  }
}


exports.postExpense = authenticate,(req, res) => {
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;
  req.user.createExpense({
      amount: amount,
      description: description,
      category: category
    })
    .then(expense => {
      return res.status(201).json({ expense, message: 'Expenses added successfuly'});
      
    })
    .catch(err => {
      return res.status(402).json({ message: err});
    });
};

exports.getExpenses = (req, res, next) => {
  Expense.findAll()
    .then(expenses => {
      res.json({expenses});
    })
};
exports.getUserExpenses = authenticate,(req, res, next) => {
  Expense.findOne({ where: { userId: req.user } })
    .then(expenses => {
      if(!expenses){
        return res.status(404).json( { message: "Not Found" });
      }
      res.json({expenses});
    })
};

exports.getUserExpensess = (req, res, next) => {
  const userId=req.body.userId;
  Expense.findOne({ where: { userId: userId } })
    .then(expenses => {
      if(!expenses){
        return res.status(404).json( { message: "Not Found" });
      }
      res.json({expenses});
    })
};

exports.getUsers = (req, res, next) => {
  User.findAll()
    .then(users => {
      res.json({users});
    })
};
function uploadToS3(data,filename){
  const BUCKET_NAME=process.env.BUCKET_NAME;
  const IAM_USER_KEY=process.env.IAM_USER_KEY;
  const IAM_USER_SECRET=process.env.IAM_USER_SECRET;

  let s3bucket=new AWS.S3({
    accessKeyId:IAM_USER_KEY,
    secretAccessKey:IAM_USER_SECRET
    
  })
  var params={
    Bucket:BUCKET_NAME,
    Key:filename,
    Body:data,
    ACL:'public-read'
  }
  return new Promise((resolve,reject)=>{
    s3bucket.upload(params,(err,s3response)=>{
      if(err){
        console.log('Something went wrong',err)
        reject(err);
      }
      else{
        console.log('success',s3response);
         resolve(s3response.Location);
      }
    })
  })
 
}
exports.downloadexpense= async (req, res, next) => {
  try{
    const expenses=await req.user.getExpenses();
    console.log(expenses);
    const stringnifiedExpenses=JSON.stringify(expenses);
    const userid=req.user.id;
    const filename=`Expense${userid}/${new Date()}.txt`;
    const fileUrl= await uploadToS3(stringnifiedExpenses,filename);
    res.status(200).json({fileUrl,success:true})
  }
  catch(err){
    res.status(500).json({fileUrl:'',success:false,err:err})

  }
}

exports.getExpense=authenticate, (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Expense.count({ where: { userId: req.user} })
    .then(numExpense => {
      totalItems = numExpense;
      return Expense.findAll({ where: { userId: userId } },{ offset: ((page - 1) * ITEMS_PER_PAGE) , limit: ITEMS_PER_PAGE });
    }) 
    .then(expenses => {
      console.log(expenses);
      res.json({
        currentPage:page,
        prods: expenses,
        totalexpenses: totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}



