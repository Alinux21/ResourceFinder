const jsonElements = [];

fetch('http://localhost:5010/api/resources/latestResources')
    .then(response => response.json())
    .then(data => {
        let rows = "";
        data.forEach((element, index) => {
            jsonElements.push(element);
            rows += `<article onclick="updatePreview(${index})">
                        <h2>${element.title}</h2>
                        <p>${element.summary}</p>
                        <p class="tags">${element.tags.split(',').map(tag => '#' + tag.trim().replace(' ', '_')).join(', ')}</p>
                     </article>`;
        });
        document.getElementById("fetchedResources").innerHTML = rows;
    });

function updatePreview(index) {
    const element = jsonElements[index];
    const html = `<article>
                    <h2>${element.title}</h2>
                    <p>${element.description}</p>
                    <h2>Resource link:</h2>
                    <a href="${element.link}">${element.link}</a>
                    <br><h2>Read more:</h2>
                    <a href="product.html?id=${element.id}">${element.title}</a>
                  </article>`;
    document.getElementById("articlePreview").innerHTML = html;
}

function checkToken(token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            resolve(false);
            return;
        }
        fetch('http://localhost:5010/api/users/authentification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
            credentials: 'include'
        }).then(res => {
            resolve(res.status !== 404 && res.status !== 500);
        }).catch(() => {
            resolve(false);
        });
    });
}

function logoRedirect() {
    const jwtToken = localStorage.getItem('token');
    checkToken(jwtToken).then(isValid => {
        if (isValid) {
            window.location.href = "main-admin.html";
        } else {
            localStorage.removeItem('token');
            window.location.href = "main-guest.html";
        }
    });
}