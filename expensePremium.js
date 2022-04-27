const token=localStorage.getItem('token');
expensePagination(1);
async function expenses(e){
    const expenseList=document.getElementById('expenseList');
    expenseList.innerHTML=`<table id="expenseTable">
    <tr><th>Date</th><th>Description</th><th>Category</th><th>Income</th><th>Expense</th></tr>
    `;
    const response  = await axios.get('http://localhost:3000/userExpenses',{headers:{"Authorization":token}});
    for (let i=0;i < response.data.users.length;i++){
        expenseList.innerHTML+=`<tr>
        <td>${response.data.users[i].createdAt}</td>
        <td>${response.data.users[i].description}</td>
        <td>${response.data.users[i].category}</td>
        <td></td>
        <td>${response.data.users[i].amount}</td>
      </tr>`;
    }
    expenseList.innerHTML+=`</table>`;
}
// expenses();
function download(){
        axios.get('http://localhost:3000/download', { headers: {"Authorization" : token} })
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
            showError(err)
        });
    }


document.getElementById('userList').onclick = async function (e) {
    const response  = await axios.get('http://localhost:3000/users');
    console.log(response);
    const parentElement = document.getElementById('expenseList');
    parentElement.innerHTML="";
    for (let i=0;i < response.data.users.length;i++){
        const userId = `${response.data.users[i].id}`;
        const userExpenses  = await axios.post('http://localhost:3000/userExpensess',{userId:userId});
        console.log(userExpenses);
        for (let j=0;i<userExpenses.data.users.length;j++){
        parentElement.innerHTML += `
            <li id=${userId}>
                ${response.data.users[i].name}-
                ${userExpenses.data.users[j].amount} - ${userExpenses.data.users[j].description} - ${userExpenses.data[j].users.category}
            </li>`
        }
    }   
}
window.addEventListener('DOMContentLoaded',()=>{
    const token=localStorage.getItem('token');
    const ITEMS_PER_PAGE=document.getElementById('itemsPerPage').value;
    localStorage.setItem('ITEMS_PER_PAGE',ITEMS_PER_PAGE);
    axios.get('http://localhost:3000/getexpense',{headers:{"Authorization":token}})
                .then(expenses => {  
                const parentNodeCart=document.getElementById('expensePagination');
                parentNodeCart.innerHTML="";
                data = JSON.parse(JSON.stringify(expenses));
                data=data.data;
                if (data.currentPage != 1){
                    const a = document.createElement('button');
                    a.innerHTML = "1"; 
                    a.onclick= () => {
                        expensePagination(a.innerHTML);
                    };
                    parentNodeCart.appendChild(a);
                }
                const a1 = document.createElement('button');
                a1.innerHTML = `${data.currentPage}`; 
                a1.onclick= () => {
                    expensePagination(a1.innerHTML);
                };
                // a1.setAttribute('class','active');
                parentNodeCart.appendChild(a1);
                if (data.hasPreviousPage){
                    const a2 = document.createElement('button');
                    a2.innerHTML = `${data.previousPage}`; 
                    a2.onclick= () => {
                        expensePagination(a2.innerHTML);
                    };
                    parentNodeCart.appendChild(a2);
                }
                if (data.hasNextPage){
                    const a3 = document.createElement('button');
                    a3.innerHTML = `${data.nextPage}`; 
                    a3.onclick= () => {
                        expensePagination(a3.innerHTML);
                    };
                    parentNodeCart.appendChild(a3);
                }
                if (data.lastPage!==data.currentPage && data.nextPage !== data.lastPage ){
                    const a4 = document.createElement('button');
                    a4.innerHTML = `${data.lastPage}`; 
                    a4.onclick= () => {
                        expensePagination(a4.innerHTML);
                    };
                    parentNodeCart.appendChild(a4);
                }
                })
            .catch(err => {
            console.log(err);
            });
})

function expensePagination(title){
    axios.get(`http://localhost:3000/?page=${title}`)
        .then(expenses => {
            const expenseNode=document.getElementById('expenseList');
            expenseNode.innerHTML=`<table id="expenseTable">
            <tr><th>Date</th><th>Description</th><th>Category</th><th>Income</th><th>Expense</th></tr>
            `;
            data = JSON.parse(JSON.stringify(expenses));
            console.log("expese",data);
            data.data.users.forEach(response=>{
                const childele=document.createElement('div');
                childele.setAttribute("id", `${response.id}`);
                childele.innerHTML=`<tr>
                <td>${response.createdAt}</td>
                <td>${response.description}</td>
                <td>${response.category}</td>
                <td></td>
                <td>${response.amount}</td>
              </tr>`;
                expenseNode.appendChild(childele);
            })
            expenseNode.innerHTML+=`</table>`;
        })
}

