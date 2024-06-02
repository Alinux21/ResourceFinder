function checkToken(token) {
    return new Promise((resolve, reject) => {
        if (token == null) {
            resolve(false);
            return; // Add an early return here
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
        }).catch(() => {
            resolve(false); // Add a catch block to handle network errors
        });
    });
}