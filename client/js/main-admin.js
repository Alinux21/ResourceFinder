const jwtToken = localStorage.getItem('token');

function checkToken(token) {
    return new Promise((resolve, reject) => {
        if (token == null) {
            resolve(false);
        }
        fetch('http://localhost:5010/api/authentification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
            credentials: 'include'
        }).then(res => {
            if (res.status == 404 || res.status == 500) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
}

checkToken(jwtToken).then((res) => {
    if (res == false) {
        console.log("Token invalid");
        localStorage.removeItem('token');
        window.location.href = "login.html";
    } else {
        console.log("Token valid");
    }
});