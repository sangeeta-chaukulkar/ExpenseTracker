
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



