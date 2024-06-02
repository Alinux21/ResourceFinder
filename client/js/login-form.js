const jwtToken = localStorage.getItem('token');

checkToken(jwtToken).then((res) => {
    if (res == false) {
        console.log("Token invalid token");
        if (jwtToken != null) { localStorage.removeItem('token'); }

        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', event => {
            event.preventDefault();

            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData);

            console.log(data);

            fetch('http://localhost:5010/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            }).then(res => {
                if (res.status == 404) {
                    console.log('Reloading the page');
                    throw new Error('Resource not found');
                } else if (res.status == 500) {
                    throw new Error('Internal server error');
                }
                else {
                    return res.json();
                }
            })
                .then(data => {
                    localStorage.setItem('token', data.token)
                })
                .then(() => window.location.href = 'main-admin.html')
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    } else {
        console.log("Token valid");
        window.location.href = "main-admin.html";
    }
});
