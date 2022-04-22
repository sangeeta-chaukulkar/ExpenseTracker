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
    return false;
    }
}
