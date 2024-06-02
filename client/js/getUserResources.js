
const token = localStorage.getItem('token');
var username = null;

fetch('http://localhost:5010/api/users/username', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token })

}).then(response => response.json()).then(data => {

    username = data.username;

    fetch('http://localhost:5010/api/resources/user/' + username, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then(data => {
        var rows = "";
        data.forEach(element => {
            rows += '<article onclick="redirectToResource(' + element.id + ')">'
                + '<h2>' + element.title + '</h2>'
                + '<p>' + element.summary + '</p>'
                + '<p class="tags">' + element.tags.split(',').map(tag => '#' + tag.trim().replace(' ', '_')) + '</p>'
                + '<button type="submit" onclick="redirectToEditResource(event,' + element.id + ')">Edit</button>'
                + '<button type="submit">Delete</button>'
                + "</article>"
        });

        document.getElementById("userResources").innerHTML = rows;
    }).catch(error => {
        console.error('Error:', error);
    });

});

function redirectToEditResource(event, id) {
    event.stopPropagation();
    console.log('Redirecting to edit resource');
    window.location.href = "edit-resource.html?id=" + id;
}

function redirectToResource(id) {

    window.location.href = "product.html?id=" + id;
}