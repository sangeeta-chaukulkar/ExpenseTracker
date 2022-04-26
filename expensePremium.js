const token=localStorage.getItem('token');
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
expenses();
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
