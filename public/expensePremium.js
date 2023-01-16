
const token=localStorage.getItem('token');

var updatess=document.getElementById('updates');
updatess.style.display = "none";
var expenseMain=document.getElementById('expenseMain');
expenseMain.style.display = "none";
var container=document.getElementsByClassName('container');
var containerfluid=document.getElementsByClassName('container-fluid');
var itemPerPage=document.getElementById('itemsPerPage');
const itemPerPagec =document.getElementById('itemsPerPage').value;
localStorage.setItem('ITEMS_PER_PAGE',itemPerPagec);
var itemsPerPage=document.getElementById('itemsPerPage');
var expensePagination=document.getElementById('expensePagination');


async function getmonthlyexpenses(e){
    for (const element of container) {
        element.style.display = 'none';
      }
      for (const element of containerfluid) {
        element.style.display = 'none';
      }
    expenseMain.style.display = "block";
    const expenseTable=document.getElementById('expenseTable');
    const ITEMS_PER_PAGE=localStorage.getItem('ITEMS_PER_PAGE')
    const threshold= "month";
    paginationButtons(threshold,itemPerPagec);
    itemPerPage.addEventListener('change',function(){
    const itemPerPagec =document.getElementById('itemsPerPage').value;
    localStorage.setItem('ITEMS_PER_PAGE',itemPerPagec);
    paginationButtons(threshold,itemPerPagec);
},false);
}
async function weeklyexpenses(e){
    for (const element of container) {
        element.style.display = 'none';
      }
      for (const element of containerfluid) {
        element.style.display = 'none';
      }
    expenseMain.style.display = "block";
    const expenseTable=document.getElementById('expenseTable');
    const ITEMS_PER_PAGE=localStorage.getItem('ITEMS_PER_PAGE')
    const threshold= "weekly";
    paginationButtons(threshold,itemPerPagec);
    itemPerPage.addEventListener('change',function(){
      const itemPerPagec =document.getElementById('itemsPerPage').value;
      localStorage.setItem('ITEMS_PER_PAGE',itemPerPagec);
      paginationButtons(threshold,itemPerPagec);
  },false);

}
async function dailyexpenses(e){
    for (const element of container) {
        element.style.display = 'none';
      }
      for (const element of containerfluid) {
        element.style.display = 'none';
      }
    expenseMain.style.display = "block";
    const expenseTable=document.getElementById('expenseTable');
    const ITEMS_PER_PAGE=localStorage.getItem('ITEMS_PER_PAGE')
    const threshold= "daily";
    paginationButtons(threshold,itemPerPagec);
    itemPerPage.addEventListener('change',function(){
      const itemPerPagec =document.getElementById('itemsPerPage').value;
      localStorage.setItem('ITEMS_PER_PAGE',itemPerPagec);
      paginationButtons(threshold,itemPerPagec);
  },false);
}

function download(){
    for (const element of container) {
        element.style.display = 'none';
      }
      for (const element of containerfluid) {
        element.style.display = 'none';
      }
    expenseMain.style.display = "block";
        axios.get('http://localhost:3000/download', { headers: {"authorization" : token} })
        .then((response) => {
            if(response.status === 201){
                var a = document.createElement("a");
                a.href = response.data.fileUrl;
                a.download = 'myexpense.csv';
                a.click();
            } else {
                throw new Error(response.data.message)
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }


const userlist=document.getElementById('userList');
userlist.addEventListener('click',userLists);
async function userLists () {
    for (const element of container) {
        element.style.display = 'none';
      }
      for (const element of containerfluid) {
        element.style.display = 'none';
      }
    itemsPerPage.style.display = "none";
    expensePagination.style.display = "none";
    expenseMain.style.display = "block";
    const response  = await axios.get('http://localhost:3000/leaderboard');
    const expenseTable=document.getElementById('expenseTable');
    expenseTable.innerHTML="";
    expenseTable.innerHTML=`
    <tr><th>Name</th><th>Total expense</th></tr>`
    for (let i=0;i < response.data.expenses.length;i++){
            let userId = `${response.data.expenses[i]._id}`;
            axios.get(`http://localhost:3000/getuser/${userId}`).then( (username) =>{
                expenseTable.innerHTML += `<tr>
                <td>${username.data.users[0].name}</td>
                <td>${response.data.expenses[i].total}</td>
                </tr>`
            })
            .catch((err) => console.log(err))
    }   
    expenseTable.innerHTML +=`</table>`;
}




// window.addEventListener('DOMContentLoaded',paginationButtons(ITEMS_PER_PAGE));
function paginationButtons(threshold,ITEMS_PER_PAGE) {
    for (const element of container) {
        element.style.display = 'none';
      }
      for (const element of containerfluid) {
        element.style.display = 'none';
      }
    expenseMain.style.display = "block";
    const token=localStorage.getItem('token');
    axios.get(`http://localhost:3000/getExpenset/${threshold}/${ITEMS_PER_PAGE}`,{headers:{"authorization":token}})
                .then(expenses => {  
                console.log("pagination",expenses);
                const parentNodeCart=document.getElementById('expensePagination');
                parentNodeCart.innerHTML="";
                data = JSON.parse(JSON.stringify(expenses));
                data=data.data;
                console.log("data",data);
                if (data.currentPage != 1){
                    const a = document.createElement('button');
                    a.innerHTML = "1"; 
                    a.setAttribute('class','active');
                    a.onclick= () => {
                        expensePagination(a.innerHTML,threshold,ITEMS_PER_PAGE);
                    };
                    parentNodeCart.appendChild(a);
                }
                const a1 = document.createElement('button');
                a1.innerHTML = `${data.currentPage}`; 
                a1.setAttribute('class','active');
                a1.onclick= () => {
                    expensePagination(a1.innerHTML,threshold,ITEMS_PER_PAGE);
                };
                // a1.setAttribute('class','active');
                parentNodeCart.appendChild(a1);
                if (data.hasPreviousPage){
                    const a2 = document.createElement('button');
                    a2.innerHTML = `${data.previousPage}`; 
                    // a2.setAttribute('class','active');
                    a2.onclick= () => {
                        expensePagination(a2.innerHTML,threshold,ITEMS_PER_PAGE);
                    };
                    parentNodeCart.appendChild(a2);
                }
                if (data.hasNextPage){
                    const a3 = document.createElement('button');
                    a3.innerHTML = `${data.nextPage}`; 
                    // a3.setAttribute('class','active');
                    a3.onclick= () => {
                        expensePagination(a3.innerHTML,threshold,ITEMS_PER_PAGE);
                    };
                    parentNodeCart.appendChild(a3);
                }
                if (data.lastPage!==data.currentPage && data.nextPage !== data.lastPage ){
                    const a4 = document.createElement('button');
                    a4.innerHTML = `${data.lastPage}`; 
                    // a4.setAttribute('class','active');
                    a4.onclick= () => {
                        expensePagination(a4.innerHTML,threshold,ITEMS_PER_PAGE);
                    };
                    parentNodeCart.appendChild(a4);
                }
                })
                .then(results=>{
                    expensePagination(1,threshold,ITEMS_PER_PAGE);
                    document.getElementById('itemsPerPage').value = threshold;
                })
            .catch(err => {
            console.log(err);
            });
}

function expensePagination(title,threshold,ITEMS_PER_PAGE){
    for (const element of container) {
        element.style.display = 'none';
      }
      for (const element of containerfluid) {
        element.style.display = 'none';
      }
    expenseMain.style.display = "block";
    axios.get(`http://localhost:3000/getExpenset/${threshold}/${ITEMS_PER_PAGE}/?page=${title}`,{headers:{"authorization":token}})
        .then(expenses => {
            const expenseTable=document.getElementById('expenseTable');
            expenseTable.innerHTML=`
             <tr><th>Date</th><th>Description</th><th>Category</th><th>Expense</th></tr>
              `
            data = JSON.parse(JSON.stringify(expenses));
            console.log("expese",data);
            data.data.prods.forEach(response=>{
                expenseTable.innerHTML+=`<tr>
                <td>${response.createdAt}</td>
                <td>${response.description}</td>
                <td>${response.category}</td>
                <td>${response.amount}</td>
              </tr>`;
            })
            expenseTable.innerHTML+=`</table>`;
        })
}


const paginations=document.getElementById('expensePagination');
var btns = paginations.getElementsByClassName("active");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace("active", "");
      this.className += "active";
    });
  }

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
function createExpense(){
  for (const element of container) {
    element.style.display = 'block';
  }
  for (const element of containerfluid) {
    element.style.display = 'block';
  }
  expenseMain.style.display = "none";
}

window.addEventListener('load', (e)=> {
  e.preventDefault();
  axios.get('http://localhost:3000/expense', { headers: {"authorization" : token} }).then(response => {
      console.log("responses",response)
      if(response.status === 200){
        expenseLst.innerHTML="";
        for (let i = 0; i < response.data.expenses.length; i++) {   
        // response.data.expenses.forEach(expense => {
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
                alert("edit",response.data.expenses[i]._id)
                addExpenses.style.display = "none";
                updatess.style.display = "block";
                console.log("edit",response.data.expenses[i]._id)
                document.getElementById('amount').value=response.data.expenses[i].amount;
                document.getElementById('description').value=response.data.expenses[i].description;
                document.getElementById('category').value=response.data.expenses[i].category;
                updatess.addEventListener('click', (e2) =>{
                  e2.preventDefault();
                  updateItem(e,response.data.expenses[i]._id)
                })
                                })
                      }} else {
                throw new Error();
      }
  })
});

function removeExpensefromUI(expenseid){
  const expenseElemId = `expense-${expenseid}`;
  document.getElementById(expenseElemId).remove();
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


