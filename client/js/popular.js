const jsonElements = [];

fetch('http://localhost:5010/api/resources/popularResources')
    .then(response => response.json())
    .then(data => {

        var rows = "";

        data.forEach((element, index) => {
            jsonElements.push(element);

            var clicks = element.clicks;

            rows += '<article '
                + 'onclick="updatePreview(' + index + ')">'
                + '<p class="clicks">🔥' + clicks + '</p>'
                + '<h2>' + element.title + '</h2>'
                + '<p>' + element.summary + '</p>'
                + '<p class="tags">' + element.tags.split(',').map(tag => '#' + tag.trim().replace(' ', '_')) + '</p>'
                + "</article>"
        });

        document.getElementById("fetchedResources").innerHTML = rows;

    });


function updatePreview(index) {
    var element = jsonElements[index];


    var articlePreview = document.getElementById("articlePreview");

    var html  = '<article>'
                +'<h2>' + element.title + '</h2>'
                + '<p>' + element.description + '</p>'
                + '<h2>Resource link:</h2>'
                + '<a href="' + element.link + '">' + element.link + '</a>'
                + '<br><h2>Read more:</h2>'
                + '<a href="' + "product.html?id=" + element.id + '">'+element.title+'</a>'
                + '</article>';
    articlePreview.innerHTML = html;

}
