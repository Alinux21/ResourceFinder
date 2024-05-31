const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', event =>  {
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
    }).then(res => res.json())
      .then(data => localStorage.setItem('token', data.token))
});