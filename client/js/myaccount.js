const jwtToken = localStorage.getItem('token');

checkToken(jwtToken).then((res) => {
    if (res == false) {
        console.log("Token invalid token");
        if (jwtToken != null) { localStorage.removeItem('token'); }
        window.location.href = "login.html";
    } else {
        
    }
});
