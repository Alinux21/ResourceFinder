function funcHot() {
    window.location.href = "trending.html";
}

function funcLat() {
    window.location.href = "popular.html";
}

function getResource(event,id) {
window.location.href = "product.html?id=" + id;
event.stopPropagation();
}

function funcSearch() {
    window.location.href = "searchpage.html"
}
