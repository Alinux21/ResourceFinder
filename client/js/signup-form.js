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

            if (data.password != data.confirmPassword) {
                var invalidCredentialsParagraph = document.getElementById('invalid-password');
                invalidCredentialsParagraph.style.display = 'block';
                invalidCredentialsParagraph.style.color = 'red';
                invalidCredentialsParagraph.style.fontSize = '20px';
                return;
            }

            fetch('http://localhost:5010/api/users/sign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                // credentials: 'include'
            }).then(res => {
                if (res.status == 404) {
                    return res.json().then(err => {
                        console.log(err.error);
                        var invalidCredentialsParagraph = document.getElementById('invalid-username');
                        invalidCredentialsParagraph.style.display = 'block';
                        invalidCredentialsParagraph.style.color = 'red';
                        invalidCredentialsParagraph.style.fontSize = '20px';

                        invalidCredentialsParagraph.innerHTML = err.error;
                        throw new Error('Internal server error');
                    });
                } else if (res.status == 500) {
                    throw new Error('Internal server error');
                }
                else {
                    return res.json();
                }
            })
                .then(data => {
                    console.log(data);
                    localStorage.setItem('token', data.token);
                })
                .then(() => window.location.href = 'main-admin.html')
                .catch(error => {
                    console.error(error);
                });
        });
    } else {
        console.log("Token valid");
        window.location.href = "main-admin.html";
    }
});
