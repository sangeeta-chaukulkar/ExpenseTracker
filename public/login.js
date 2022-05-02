
const forgotpassbtn = document.getElementById('forgotpass-btn');
forgotpassbtn.addEventListener('click',()=>{
    window.location.replace('forgotpassword.html');
});

const loginbtn = document.getElementById('login-btn');
loginbtn.addEventListener('click',userLogin);
function userLogin(e){
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    ValidateEmail(email);
    axios.post(`http://34.201.21.163:3000/login`,{email:email,password:password})
    .then(result=>{
        localStorage.setItem('token',result.data.token);
        if(result){
            if(result.data.message === 'Premium User'){
                window.location.replace('../expensePremium.html');
            }
            else{
                window.location.replace('../expense.html');
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


