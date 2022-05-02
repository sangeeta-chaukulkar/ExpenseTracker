
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
    axios.post(`http://34.201.21.163:3000/expense`,data,{headers:{"authorization":token}})
    .then(result=>{
        alert(result.data.message);
        console.log(result);
        addNewExpensetoUI(result.data.expense);
    })  
    .catch(err => {
        console.log(err)
    })
}

function addNewExpensetoUI(expense){
  const expenseElemId = `expense-${expense.id}`;
  expenseLst.innerHTML += `
      <li id=${expenseElemId}>
          ${expense.amount} - ${expense.description} - ${expense.category}
          <button onclick='deleteExpense(event, ${expense.id})'>
              Delete Expense
          </button>
      </li>`
}

window.addEventListener('load', (e)=> {
  e.preventDefault();
  console.log(localStorage);
  axios.get('http://34.201.21.163:3000/expense', { headers: {"authorization" : token} }).then(response => {
      if(response.status === 200){
        expenseLst.innerHTML="";
          response.data.expenses.forEach(expense => {
            const expenseElemId = `expense-${expense.id}`;
            expenseLst.innerHTML += `
            <li id=${expenseElemId}>
            ${expense.amount} - ${expense.description} - ${expense.category}
            <button onclick='deleteExpense(event, ${expense.id})'>
              Delete Expense
           </button>
           </li>`;
          })
      } else {
          throw new Error();
      }
  })
});
function deleteExpense(e, expenseid) {
  axios.delete(`http://34.201.21.163:3000/deleteexpense/${expenseid}`, { headers: {"authorization" : token} })
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
  const response  = await axios.get('http://34.201.21.163:3000/purchase/premiummembership', { headers: {"authorization" : token} });
  console.log(response);
  var options =
  {
   "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
   "name": "Test Company",
   "order_id": response.data.order.id, // For one time payment
   "prefill": {
     "name": "Test User",
     "email": "test.user@example.com",
     "contact": "7003442036"
   },
   "theme": {
    "color": "#3399cc"
   },
   // This handler function will handle the success payment
   "handler": function (response) {
       console.log(response);
       axios.post('http://34.201.21.163:3000/purchase/updatetransactionstatus',{
           order_id: options.order_id,
           payment_id: response.razorpay_payment_id,
       }, { headers: {"authorization" : token} }).then(() => {
           alert('You are a Premium User Now')
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

