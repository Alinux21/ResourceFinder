function getResource(event,id) {
window.location.href = "product.html?id=" + id;
event.stopPropagation();
}

document.getElementById('search').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        window.location.href = "searchpage.html?query=" + e.target.value;
    }
});