function logout(){

    const jwtToken = localStorage.getItem('token');

    checkToken(jwtToken).then((res) => {
        if (res == true) {
            console.log("Token invalid");
            localStorage.removeItem('token');
            window.location.href = "login.html";
        }
    });
    
}