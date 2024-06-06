const jsonElements = [];

fetch('http://localhost:5010/api/resources/popularResources')
    .then(response => response.json())
    .then(data => {

        var rows = "";
        var count = 0;

        data.forEach((element, index) => {
            if (count > 2) {
                return;
            }
            jsonElements.push(element);
            count++;

            rows += '<button class="hot-element" '
                + 'onclick="window.location.href=product.html?id= ' + element.id + '">'
                + '<span class="btn-h">' + element.title + '</span>'
                + '<span class="btn-p">' + element.summary + '</span>'
                + "</button>"

        });

        document.getElementById("popularResources").innerHTML = rows;

    });