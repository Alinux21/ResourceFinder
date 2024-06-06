const jwtToken = localStorage.getItem('token');

console.log("Checking token");

checkToken(jwtToken).then((res) => {
    if (res == false) {
        console.log("Token invalid");
        localStorage.removeItem('token');
        window.location.href = "login.html";
    } else {
        console.log("Token valid");
    }
});