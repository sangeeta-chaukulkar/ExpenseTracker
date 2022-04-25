function forgotpassword(e) {
    e.preventDefault();
    console.log(e.target.name);
    const form = new FormData(e.target);

    const userEmail = {
        email: form.get("email"),

    }
    console.log(userEmail)
    // axios.post('http://localhost:3000/password/forgotpassword',userEmail).then(response => {
    //     console.log(response);
    
    // }).catch(err => {
    //     console.log(err);
    // })
}