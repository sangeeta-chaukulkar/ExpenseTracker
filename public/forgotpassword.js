function forgotpassword(e) {
    e.preventDefault();
    const form = new FormData(e.target);

    const userEmail = {
        email: form.get("email")
    }
    console.log(userEmail)
    axios.post('http://localhost:3000/forgotpassword',userEmail).then(response => {
        if(response.status === 202){
            document.body.innerHTML += '<div style="color:green;">Mail Successfully sent <div>'
            window.location.replace(`http://localhost:3000/resetpassword/${response.data.result._id}`)
        } else {
            throw new Error('Something went wrong!!!')
        }
    }).catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
}