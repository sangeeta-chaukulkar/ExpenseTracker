document.getElementById('userList').onclick = async function (e) {
    const response  = await axios.get('http://localhost:3000/users');
    console.log(response);
    const parentElement = document.getElementById('expenseList');
    parentElement.innerHTML="";
    for (let i=0;i < response.data.users.length;i++){
        const userId = `${response.data.users[i].id}`;
        const userExpenses  = await axios.post('http://localhost:3000/userExpenses',{userId:userId});
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