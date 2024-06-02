var urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get('id');


fetch("http://localhost:5010/api/resources/" + id)
    .then(response => {
        if (response.status === 404) {
            window.location.href = "404.html";
        } else {
            return response.json()
        }})
    .then(data => {

        title = data[0].title;
        description = data[0].description;
        tags = data[0].tags;
        formattedTags = tags.split(',').map(tag => '#' + tag.trim().replace(' ', '_'));
        link = data[0].link;
        posted_by = data[0].posted_by;
        image_src = data[0].image_src;

        console.log(data);

        
        linkElement = document.getElementById("resource-link");

        document.getElementById("resource-title").innerHTML = title;
        document.getElementById("resource-description").innerHTML = description;
        document.getElementById("resource-tags").innerHTML = formattedTags;
        document.getElementById("resource-link").innerHTML = link;
        linkElement.setAttribute('href', link);
        document.getElementById("resource-posted-by").innerHTML = posted_by;
        document.getElementById("resource-image").src = 'http://localhost:5010/api/resources/images/'+image_src;

    })
    .catch(error => {
        console.error('Error:', error);
    });