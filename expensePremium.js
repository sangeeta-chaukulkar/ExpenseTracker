
const token=localStorage.getItem('token');


async function getmonthlyexpenses(e){
    const expenseTable=document.getElementById('expenseTable');
    const response  = await axios.get('http://localhost:3000/getmonthlyexpenses',{headers:{"authorization":token}});
    console.log("expenses",response.data.expenses.length);
    expenseTable.innerHTML=`
    <tr><th>Date</th><th>Description</th><th>Category</th><th>Expense</th></tr>`
    for (let i=0;i < response.data.expenses.length;i++){
        expenseTable.innerHTML+=`<tr>
        <td>${response.data.expenses[i].createdAt}</td>
        <td>${response.data.expenses[i].description}</td>
        <td>${response.data.expenses[i].category}</td>
        <td>${response.data.expenses[i].amount}</td>
      </tr>`
    }
    expenseTable.innerHTML+=`</table>`;
}
async function weeklyexpenses(e){
    const expenseTable=document.getElementById('expenseTable');
    const response  = await axios.get('http://localhost:3000/weeklyexpenses',{headers:{"authorization":token}});
    console.log("expenses",response.data.expenses.length);
    expenseTable.innerHTML=`
    <tr><th>Date</th><th>Description</th><th>Category</th><th>Expense</th></tr>`
    for (let i=0;i < response.data.expenses.length;i++){
        expenseTable.innerHTML+=`<tr>
        <td>${response.data.expenses[i].createdAt}</td>
        <td>${response.data.expenses[i].description}</td>
        <td>${response.data.expenses[i].category}</td>
        <td>${response.data.expenses[i].amount}</td>
      </tr>`
    }
    expenseTable.innerHTML+=`</table>`;
}
async function dailyexpenses(e){
    const expenseTable=document.getElementById('expenseTable');
    const response  = await axios.get('http://localhost:3000/dailyexpenses',{headers:{"authorization":token}});
    console.log("expenses",response.data.expenses.length);
    expenseTable.innerHTML=`
    <tr><th>Date</th><th>Description</th><th>Category</th><th>Expense</th></tr>`
    for (let i=0;i < response.data.expenses.length;i++){
        expenseTable.innerHTML+=`<tr>
        <td>${response.data.expenses[i].createdAt}</td>
        <td>${response.data.expenses[i].description}</td>
        <td>${response.data.expenses[i].category}</td>
        <td>${response.data.expenses[i].amount}</td>
      </tr>`
    }
    expenseTable.innerHTML+=`</table>`;
}

function download(){
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
    const response  = await axios.get('http://localhost:3000/users');
    console.log("users",response);
    const expenseTable=document.getElementById('expenseTable');
    expenseTable.innerHTML="";
    expenseTable.innerHTML=`
    <tr><th>Name</th><th>email</th><th>Expense Details</th></tr>`
    for (let i=0;i < response.data.users.length;i++){
        let userId = `${response.data.users[i].id}`;
        expenseTable.innerHTML += `<tr>
        <td>${response.data.users[i].name}</td>
        <td>${response.data.users[i].email}</td>
        <td><a href="#" onclick="showExpense(${userId})">See expense details</a></td>
      </tr>`
    }   
    expenseTable.innerHTML +=`</table>`;
}
async function showExpense(userId){
        // const userExpenses  = await axios.get(`http://localhost:3000/userExpenses/${userId}`);
        // console.log(userExpenses);
        paginationuserButtons(ITEMS_PER_PAGE,userId);
        const backbtn=document.createElement('button');
        backbtn.innerHTML = "Back"; 
        backbtn.setAttribute("id","backbutton");
        backbtn.addEventListener('click',userLists);
        const backbtndiv=document.getElementById('backbtn');
        backbtndiv.setAttribute("id","backbuttondiv");
        backbtndiv.appendChild(backbtn);
    //     expenseTable.innerHTML='';
    //     expenseTable.innerHTML =`
    //     <tr><th>Amount</th><th>Description</th><th>Category</th></tr>`;
    //     for (let j=0;j<userExpenses.data.expenses.length;j++){
    //         expenseTable.innerHTML += `<tr>
    //     <td>${userExpenses.data.expenses[j].amount}</td>
    //     <td>${userExpenses.data.expenses[j].description}</td>
    //     <td>${userExpenses.data.expenses[j].category}</td>
    //   </tr>`
    //     }
    //     expenseTable.innerHTML +=`</table>`;
}

const itemPerPage =document.getElementById('itemsPerPage');
itemPerPage.addEventListener('change',function(){
    const itemPerPagec =document.getElementById('itemsPerPage').value;
    localStorage.setItem('ITEMS_PER_PAGE',itemPerPagec);
    paginationButtons(itemPerPagec);
},false);

const ITEMS_PER_PAGE=document.getElementById('itemsPerPage').value;
console.log("ITEMS_PER_PAGE",ITEMS_PER_PAGE);
localStorage.setItem('ITEMS_PER_PAGE',ITEMS_PER_PAGE);

// window.addEventListener('DOMContentLoaded',paginationButtons(ITEMS_PER_PAGE));
function paginationButtons(ITEMS_PER_PAGE) {
    const token=localStorage.getItem('token');
    console.log("pagination",token,"h",ITEMS_PER_PAGE);
    axios.get(`http://localhost:3000/getexpense/${ITEMS_PER_PAGE}`,{headers:{"authorization":token}})
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
                        expensePagination(a.innerHTML,ITEMS_PER_PAGE);
                    };
                    parentNodeCart.appendChild(a);
                }
                const a1 = document.createElement('button');
                a1.innerHTML = `${data.currentPage}`; 
                a1.setAttribute('class','active');
                a1.onclick= () => {
                    expensePagination(a1.innerHTML,ITEMS_PER_PAGE);
                };
                // a1.setAttribute('class','active');
                parentNodeCart.appendChild(a1);
                if (data.hasPreviousPage){
                    const a2 = document.createElement('button');
                    a2.innerHTML = `${data.previousPage}`; 
                    // a2.setAttribute('class','active');
                    a2.onclick= () => {
                        expensePagination(a2.innerHTML,ITEMS_PER_PAGE);
                    };
                    parentNodeCart.appendChild(a2);
                }
                if (data.hasNextPage){
                    const a3 = document.createElement('button');
                    a3.innerHTML = `${data.nextPage}`; 
                    // a3.setAttribute('class','active');
                    a3.onclick= () => {
                        expensePagination(a3.innerHTML,ITEMS_PER_PAGE);
                    };
                    parentNodeCart.appendChild(a3);
                }
                if (data.lastPage!==data.currentPage && data.nextPage !== data.lastPage ){
                    const a4 = document.createElement('button');
                    a4.innerHTML = `${data.lastPage}`; 
                    // a4.setAttribute('class','active');
                    a4.onclick= () => {
                        expensePagination(a4.innerHTML,ITEMS_PER_PAGE);
                    };
                    parentNodeCart.appendChild(a4);
                }
                })
                .then(results=>{
                    expensePagination(1,ITEMS_PER_PAGE);
                })
            .catch(err => {
            console.log(err);
            });
}

function expensePagination(title,ITEMS_PER_PAGE){
    axios.get(`http://localhost:3000/getexpense/${ITEMS_PER_PAGE}/?page=${title}`,{headers:{"authorization":token}})
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
function paginationuserButtons(ITEMS_PER_PAGE,userId) {
    const token=localStorage.getItem('token');
    console.log("pagination",token,"h",ITEMS_PER_PAGE,userId);
    axios.get(`http://localhost:3000/getuserexpense/${userId}/${ITEMS_PER_PAGE}`)
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
                        userExpensePagination(a.innerHTML,ITEMS_PER_PAGE,userId);
                    };
                    parentNodeCart.appendChild(a);
                }
                const a1 = document.createElement('button');
                a1.innerHTML = `${data.currentPage}`; 
                a1.setAttribute('class','active');
                a1.onclick= () => {
                    userExpensePagination(a1.innerHTML,ITEMS_PER_PAGE,userId);
                };
                // a1.setAttribute('class','active');
                parentNodeCart.appendChild(a1);
                if (data.hasPreviousPage){
                    const a2 = document.createElement('button');
                    a2.innerHTML = `${data.previousPage}`; 
                    // a2.setAttribute('class','active');
                    a2.onclick= () => {
                        userExpensePagination(a2.innerHTML,ITEMS_PER_PAGE,userId);
                    };
                    parentNodeCart.appendChild(a2);
                }
                if (data.hasNextPage){
                    const a3 = document.createElement('button');
                    a3.innerHTML = `${data.nextPage}`; 
                    // a3.setAttribute('class','active');
                    a3.onclick= () => {
                        userExpensePagination(a3.innerHTML,ITEMS_PER_PAGE,userId);
                    };
                    parentNodeCart.appendChild(a3);
                }
                if (data.lastPage!==data.currentPage && data.nextPage !== data.lastPage ){
                    const a4 = document.createElement('button');
                    a4.innerHTML = `${data.lastPage}`; 
                    // a4.setAttribute('class','active');
                    a4.onclick= () => {
                        userExpensePagination(a4.innerHTML,ITEMS_PER_PAGE,userId);
                    };
                    parentNodeCart.appendChild(a4);
                }
                })
                .then(results=>{
                    userExpensePagination(1,ITEMS_PER_PAGE,userId);
                })
            .catch(err => {
            console.log(err);
            });
}

function userExpensePagination(title,ITEMS_PER_PAGE,userId){
    axios.get(`http://localhost:3000/getuserexpense/${userId}/${ITEMS_PER_PAGE}/?page=${title}`)
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

