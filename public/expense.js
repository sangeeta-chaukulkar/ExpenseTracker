var updatess=document.getElementById('updates');
updatess.style.display = "none";
const token=localStorage.getItem('token');

var expenseLst = document.getElementById('expenseList');

const addExpenses = document.getElementById('submits');
addExpenses.addEventListener('click',addExpense);

function addExpense(e){
  e.preventDefault();
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    data={
      amount: amount,
      description: description,
      category: category
    }
    axios.post(`http://localhost:3000/expense`,data,{headers:{"authorization":token}})
    .then(result=>{
        alert(result.data.message);
        console.log(result);
        // addNewExpensetoUI(result.data.expense);
        window.location.reload(true);

    })  
    .catch(err => {
        console.log(err)
    })
}

function addNewExpensetoUI(expense){
  const expenseElemId = `expense-${expense._id}`;
  expenseLst.innerHTML += `
      <li id=${expenseElemId}>
          ${expense.amount} - ${expense.description} - ${expense.category}
          <button onclick = deleteExpense(${expense._id}) >
              Delete Expense
          </button>
      </li>`
}

window.addEventListener('load', (e)=> {
  e.preventDefault();
  axios.get('http://localhost:3000/expense', { headers: {"authorization" : token} }).then(response => {
      console.log("responses",response)
      if(response.status === 200){
        expenseLst.innerHTML="";
        for (let i = 0; i < response.data.expenses.length; i++) {   
            var newLi =  document.createElement('li');
            newLi.setAttribute("id",`expense-${response.data.expenses[i]._id}`);
            var newLiText = document.createTextNode(response.data.expenses[i].amount);
            var newLiText1 = document.createTextNode(response.data.expenses[i].description);
            var newLiText2 = document.createTextNode(response.data.expenses[i].category);
            newLi.appendChild(newLiText);
            newLi.appendChild (document.createTextNode ("    "));
            newLi.appendChild(newLiText1);
            newLi.appendChild (document.createTextNode ("       "));
            newLi.appendChild(newLiText2);
            newLi.appendChild (document.createTextNode ("    "));
        
            var deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-danger btn-sm float-right delete';
            deleteBtn.appendChild(document.createTextNode('Delete expense'));
            newLi.appendChild(deleteBtn);
            var editbutton = document.createElement('button');
            editbutton.className = 'btn btn-dark btn-sm float-right';
            editbutton.appendChild(document.createTextNode('Edit expense'));
            newLi.appendChild(editbutton);
            expenseLst.appendChild(newLi);

            deleteBtn.addEventListener('click', () => {
              axios.delete(`http://localhost:3000/deleteexpense/${response.data.expenses[i]._id}`, { headers: {"authorization" : token} })
              .then((deleteresponse) => {
                console.log("deleteresponse",deleteresponse,"hh",response.data.expenses[i]._id)
              if(deleteresponse.status === 204){
                      removeExpensefromUI(response.data.expenses[i]._id);
                  } else {
                      throw new Error('Failed to delete');
                  }
              })
              .catch((err => {
                document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
              }))
            });
              editbutton.addEventListener('click', (e1) => {
                e1.preventDefault();
                addExpenses.style.display = "none";
                updatess.style.display = "block";
                document.getElementById('amount').value=response.data.expenses[i].amount;
                document.getElementById('description').value=response.data.expenses[i].description;
                document.getElementById('category').value=response.data.expenses[i].category;
                updatess.addEventListener('click', (e2) =>{
                  e2.preventDefault();
                  updateItem(e,response.data.expenses[i]._id);
                });
                                })
                      }} else {
                throw new Error();
      }
  })
});


function deleteExpense(expenseid) {
  axios.delete(`http://localhost:3000/deleteexpense/${expenseid}`, { headers: {"authorization" : token} })
  .then((response) => {
  if(response.status === 204){
          removeExpensefromUI(expenseid);
      } else {
          throw new Error('Failed to delete');
      }
  }).catch((err => {
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
  }))
}

function removeExpensefromUI(expenseid){
  const expenseElemId = `expense-${expenseid}`;
  document.getElementById(expenseElemId).remove();
}

document.getElementById('rayzorpay-btn').onclick = async function (e) {
  const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"authorization" : token} });
  console.log(response);
  var options =
  {
   "key": response.data.key_id, 
   "name": "Test Company",
   "order_id": response.data.order.id, // For one time payment
   "prefill": {
     "name": "Test User",
     "email": "abc@gmail.com",
     "contact": "23145678"
   },
   "theme": {
    "color": "#3399cc"
   },
   "handler": function (response) {
       console.log(response);
       axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
           order_id: options.order_id,
           payment_id: response.razorpay_payment_id,
       }, { headers: {"authorization" : token} }).then(() => {
           alert('You are a Premium User Now')
           window.location.replace('../expensePremium.html');
       }).catch(() => {
           alert('Something went wrong. Try Again!!!')
       })
   },
};
const rzp1 = new Razorpay(options);
rzp1.open();
e.preventDefault();

rzp1.on('payment.failed', function (response){
alert(response.error.code);
alert(response.error.description);
alert(response.error.source);
alert(response.error.step);
alert(response.error.reason);
alert(response.error.metadata.order_id);
alert(response.error.metadata.payment_id);
});
}

function updateItem(e,id){
    e.preventDefault();
    var amountnew = document.getElementById("amount").value;
    var descriptionnew= document.getElementById('description').value
    var categorynew= document.getElementById('category').value;
    axios.patch(`https://localhost:3000/updateExpense/${id}`,{
      amount: amountnew,
      description:  descriptionnew,
      category: categorynew,
      createdAt: Date.now()
    })
    .then((response) => {
      alert("expense updated successfully")
      window.location.reload(true);
    })
    .catch((err) => {
    console.log(err)});
}

