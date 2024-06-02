const jwtToken = localStorage.getItem('token');

checkToken(jwtToken).then((res) => {
    if (res == false) {
        console.log("Token invalid");
        localStorage.removeItem('token');
    } else {
        console.log("Token valid");
        window.location.href = "main-admin.html";
    }
});