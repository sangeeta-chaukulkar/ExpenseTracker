const signupbtn = document.getElementById('signup-btn');
signupbtn.addEventListener('click',addUser);

function addUser(e){
    e.preventDefault();
    validate();
    const userName = document.getElementById('userName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    data={
        name: userName,
        email: email,
        phone: phone,
        password: password
    }
    axios.post(`http://localhost:3000/signup`,data)
    .then(result=>{
        alert(result.data.message);
        if(result.data.message === 'User already exists, Please Login' || 'Successfuly signed up'){
            window.location.replace('../login.html');
        }
        else{
            window.location.replace('../signup.html');
        }    


    })  
    .catch(err => {
        console.log(err)
    })
}

function validate() {  
    const userName = document.getElementById('userName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    if (userName.value.length <= 0) {  
        alert("Name is required");  
        return false;  
    } 
    ValidateEmail(email);
    phonenumber(phone);
}
function phonenumber(inputtxt)
{
  var phoneno = /^\d{10}$/;
  if((inputtxt.value.match(phoneno))) return true;
    else
    {
    alert("Enter valid phone number");
    inputtxt.focus();
    return false;
    }
}
function ValidateEmail(inputText)
{
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
