var wage = document.getElementById("search");
wage.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
        window.location.href = "searchpage.html";
    }
});