
function checkToken(token) {
    if (token == null) {
        return false;
    }
    fetch('http://localhost:5010/api/authentification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
        credentials: 'include'
    }).then(res => {
        if (res.status == 404) {
            return false;
        } else if (res.status == 500) {
            return false;
        } else {
            return true;
        }
    })
}

const authToken = localStorage.getItem("token");
if (!checkToken(authToken)) {
    console.log("Token is not valid");
    window.location.href = "login.html";
} else {
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
}
