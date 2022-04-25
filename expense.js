
var expenseLst = document.getElementById('expenseList');

const addExpense = document.getElementById('submits');
addExpense.addEventListener('click',addExpense);

function addExpense(e){
  e.preventDefault();
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const token=localStorage.getItem('token');
    data={
      amount: amount,
      description: description,
      category: category
    }
    axios.post(`http://localhost:3000/expense`,data,{headers:{"Authorization":token}})
    .then(result=>{
        alert(result.data.message);
    })  
    .catch(err => {
        console.log(err)
    })
}

expenseDeatils();
function expenseDeatils(){
    axios.get("http://localhost:3000/expense")
    .then((response) => {
        console.log(response);
        expenseLst.innerHTML="";
        for (let i = 0; i < response.data.length; i++) {   
            var newLi =  document.createElement('li');
            var newLiText = document.createTextNode(response.data[i].amount);
            var newLiText1 = document.createTextNode(response.data[i].description);
            var newLiText2 = document.createTextNode(response.data[i].category);
            newLi.appendChild(newLiText);
            newLi.appendChild (document.createTextNode ("    "));
            newLi.appendChild(newLiText1);
            newLi.appendChild (document.createTextNode ("       "));
            newLi.appendChild(newLiText2);
            expenseLst.appendChild(newLi);   
        }
      })
    .catch((err) => {
        console.log(err)});
}

document.getElementById('rayzorpay-btn').onclick = async function (e) {
  const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
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
       axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
           order_id: options.order_id,
           payment_id: response.razorpay_payment_id,
       }, { headers: {"Authorization" : token} }).then(() => {
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

