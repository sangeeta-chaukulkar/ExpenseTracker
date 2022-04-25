
const loginbtn = document.getElementById('login-btn');
loginbtn.addEventListener('click',userLogin);
function userLogin(e){
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    ValidateEmail(email);
    axios.post(`http://localhost:3000/login`,{email:email,password:password})
    .then(result=>{
        if(result){
            if(result.data.message === 'Premium User'){
                window.location.href('../expensePremium.html');
            }
            else{
                window.location.href('../expense.html');
            }    
        }
        else {
            throw new Error('Failed to login')
        }
    })  
    .catch(err => {
        console.log(err)
    })
}

function ValidateEmail(inputText)
{
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // let input=inputText.value;
    if(inputText.match(mailformat))
    {
    return true;
    }
    else
    {
    alert("You have entered an invalid email address!");
    inputText.focus();
    return false;
    }
}


