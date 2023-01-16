const bcrypt = require('bcrypt');
const User = require('../models/user');
const Expense = require('../models/expense');
const ForgotPassword = require('../models/forgotpassword');

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const localStorage=require("localStorage");
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const Forgotpassword = require('../models/forgotpassword');
const AWS=require('aws-sdk');
const user = require('../models/user');


exports.deleteexpense = (req, res) => {
  const expenseid = req.params.expenseid;
  Expense.findByIdAndRemove(expenseid).then(() => {
      return res.status(204).json({ success: true, message: "Deleted Successfuly"})
  }).catch(err => {
      return res.status(403).json({ success: true, message: "Failed"})
  })
}

exports.downloadExpenses =  async (req, res) => {
  try {
      if(!req.user.isPremiumUser){
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
        var user = await User.findOne( { email : email});
        if(user){
            const forgotUser = new ForgotPassword({active: true,expiresby: Date.now()+10,userId: user._id })
            forgotUser.save()
            .then((response) => {
              return res.status(202).json({message: 'Hello there!',result : response, sucess: true})
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
  User.findOne({  email : email} )
  .then(user => {
    if(!user){
      return res.status(404).json( { message: "User Not Found" });
    }
    bcrypt.compare(password,user.password)
    .then(isMatch=>{
      if(isMatch){
        jwt.sign({id : user._id, email : user.email}, process.env.TOKEN_SECRET, { expiresIn: '1800s' },(err,token)=>{
          if(user.isPremiumUser){
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
  User.findOne({  email: email })
  .then(present => {
    if(present){
      res.json({message:'User already exists, Please Login'});
    }
   bcrypt.hash(password,12)  
    .then(hashpassword=>{
      const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: hashpassword,
      isPremiumUser : false
    })
    user.save()
    })
    .then(result => {
      res.json({message:'Successfuly signed up'});
    })
  })
    .catch(err => {
      console.log(err);
    });
};


exports.postExpense = (req, res) => {
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;
  const expense = new Expense({
    amount: amount,
    description: description,
    category: category,
    createdAt: Date.now(),
    userId : req.user
  })
  expense.save()
    .then(expense => {
      return res.status(201).json({ expense, message: 'Expenses added successfuly'});
    })
    .catch(err => {
      return res.status(402).json({ message: err});
    });
};

exports.getexpenses = (req, res)=> {
  Expense.find({userId : req.user._id }).then(expenses => {
      return res.status(200).json({expenses, success: true})
  })
  .catch(err => {
      return res.status(402).json({ error: err, success: false})
  })
}

exports.updateExpense = async  (req, res)=> {
  const id = req.params.expenseid;
  Expense.findOne({  _id:id }).then(updaterequest => {
    if(updaterequest){
      updaterequest.updateOne({
        amount : req.body.amount,
        description:req.body.description,
        category:req.body.category,
        createdAt: req.body.createdAt})
        .then(() => {
          res.status(200).json({message: 'Successfuly update', success: true})
        })
    }
      else{
          return res.status(404).json({ error: 'Updation failed', success: false})
      }
    })
}

exports.getleaderboard = (req, res, next) => {
  Expense.aggregate([{
    $group: { _id : "$userId",
    total : { $sum : "$amount"}
  }
  }])
    .then(expenses => {
      if(!expenses){
        return res.status(404).json( { message: "Not Found" });
      }
      res.json({expenses});
    })
};

exports.getUserExpenses = (req, res, next) => {
  Expense.find({  userId: req.params.userid } )
    .then(expenses => {
      if(!expenses){
        return res.status(404).json( { message: "Not Found" });
      }
      res.json({expenses});
    })
};

exports.getUser = (req, res, next) => {
  User.find({_id : req.params.id})
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
    const expenses=await getUserExpenses();
    const stringnifiedExpenses=JSON.stringify(expenses);
    const userid=req.user._id;
    const filename=`Expense${userid}/${new Date()}.txt`;
    const fileUrl= await uploadToS3(stringnifiedExpenses,filename);
    res.status(201).json({fileUrl,success:true})
  }
  catch(err){
    res.status(500).json({fileUrl:'',success:false,err:err})

  }
}
exports.getExpenset = (req, res)=> {
  const th= req.params.threshold;
  var threshold;
  if(th == "month"){ threshold = new Date(Date.now()-30*24*60*60*1000); }
  if(th == "daily"){ threshold = new Date(Date.now()-1*24*60*60*1000); }
  if(th == "weekly"){ threshold = new Date(Date.now()-7*24*60*60*1000); }
  let page = +req.query.page || 1;
  let ITEMS_PER_PAGE = parseInt(req.params.items_per_page);
  let totalItems;
  Expense.find({userId : req.user._id, createdAt: { $gte: threshold }})
  .then(numExpense => {
    numExpense=JSON.parse(JSON.stringify(numExpense))
    totalItems = Object.keys(numExpense).length;
    return Expense.find({  userId : req.user._id, createdAt: { $gte: threshold } }).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
  }) 
  .then(expenses => {
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
    return res.status(500).json({ error: err, success: false})
  })

}


