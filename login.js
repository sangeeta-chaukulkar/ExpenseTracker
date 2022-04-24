
const loginbtn = document.getElementById('login-btn');
loginbtn.addEventListener('click',userLogin);
function userLogin(){
    ValidateEmail(email);
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    axios.get(`http://localhost:3000/login`)
    .then(result=>{
        if(result){
            alert("Login successfully");
        }
    })  
    .catch(err => {
        console.log(err)
    })
}

function ValidateEmail(inputText)
{
    const email = document.getElementById('email');
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(inputText.value.match(mailformat))
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
