var wage = document.getElementById("search");
wage.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
        window.location.href = "searchpage.html";
    }
});

function funcHot() {
    window.location.href = "trending.html";
}

function funcLat() {
    window.location.href = "popular.html";
}

function funcProd(event) {
    window.location.href = "product.html";
    event.stopPropagation();
}

function funcSearch() {
    window.location.href = "searchpage.html"
}
