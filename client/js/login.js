function checkToken(token) {
    if (token == null) {
        return false;
    }
    const response = fetch('http://localhost:5010/api/authentification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
        credentials: 'include'
    }).then(res => {
        if (res.status == 404) {
            return false;
        } else if (res.status == 500) {
            return false;
        } else {
            return true;
        }
    })
}

const loginToken = localStorage.getItem('token');
console.log(loginToken);
if (checkToken(loginToken) == true) {
    window.location.href = 'main-admin.html';
} else {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', event => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData);

        fetch('http://localhost:5010/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        }).then(res => {
            if (res.status == 404) {
                window.location.href = 'login-form.html';
                throw new Error('Resource not found');
            } else if (res.status == 500) {
                window.location.href = 'login-form.html';
                throw new Error('Internal server error');
            }
            else {
                return res.json();
            }
        })
            .then(data => {
                localStorage.removeItem('token');
                localStorage.setItem('token', data.token)
            })
            .then(() => window.location.href = 'main-admin.html')
    });
}