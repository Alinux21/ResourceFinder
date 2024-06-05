
var urlParams = new URLSearchParams(window.location.search);
var query = urlParams.get('query');

console.log('http://localhost:5010/api/words/' + query);

fetch('http://localhost:5010/api/words/' + query)
    .then(response => response.json())
    .then(data => {
        var rows = "";
        data.forEach(element => {
            rows += '<article '
                + 'onclick="getResource(event,' + element.id + ')">'
                + '<h2>' + element.title + '</h2>'
                + '<p>' + element.summary + '</p>'
                + '<p class="tags">' + element.tags.split(',').map(tag => '#' + tag.trim().replace(' ', '_')) + '</p>'
                + "</article>"
        });

        document.getElementById("search-results").innerHTML = rows;
    })
