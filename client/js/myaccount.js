const jwtToken = localStorage.getItem('token');

function seePassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }

    var y = document.getElementById("newpassword");
    if (y.type === "password") {
      y.type = "text";
    } else {
      y.type = "password";
    }
  }

checkToken(jwtToken).then((res) => {
    if (res == false) {
        console.log("Token invalid token");
        if (jwtToken != null) { localStorage.removeItem('token'); }
        window.location.href = "login.html";
    } else {
        fetch('http://localhost:5010/api/users/myaccount/' + jwtToken)
        .then(response => response.json())
        .then(data => {
            var rows1 = "";
            var rows2 = "";

            console.log(data);

            data.forEach((element, index) => {
                rows1 += '<div class="field_group">'
                    + '<label for="fname">First Name</label>'
                    + '<input type="text" id="fname" value="' + element.firstName + '">'
                    + '</div>'
                    + '<div class="field_group">'
                    + '<label for="lname">Last Name</label>'
                    + '<input type="text" id="lname" value="' + element.lastName + '">'
                    + '</div>'
                    + '<div class="field_group">'
                    + '<label for="phonenr">Phone number</label>'
                    + '<input type="text" id="phonenr" value="' + element.phoneNumber + '">'
                    + '</div>'
                    + '<div class="field_group">'
                    + '<label for="email">Email address</label>'
                    + '<input type="text" id="email" value="' + element.emailAdress + '">'
                    + '</div>'
                    + '<div class="field_group">'
                    + '<label for="country">Country</label>'
                    + '<input type="text" id="country" value="' + element.country + '">'
                    + '</div>'
                    + '<div class="field_group">'
                    + '<label for="city">City</label>'
                    + '<input type="text" id="city" value="' + element.city + '">'
                    + '</div>';

                rows2 += '<div class="field_group">'
                    + '<label for="password">Current password</label>'
                    + '<input type="password" id="password" value="' + element.password + '">'
                    + '</div>'
                    + '<div class="field_group">'
                    + '<label for="newpassword">New Password</label>'
                    + '<input type="password" id="newpassword">'
                    + '</div>';
            });

            document.getElementById("personalFields").innerHTML = rows1;
            document.getElementById("passwordFields").innerHTML = rows2;

        });
    }
});

document.getElementById('saveChanges').addEventListener('click', function() {
    let personalInfo = {
        firstName: document.getElementById('fname').value,
        lastName: document.getElementById('lname').value,
        phoneNumber: document.getElementById('phonenr').value,
        emailAdress: document.getElementById('email').value,
        country: document.getElementById('country').value,
        city: document.getElementById('city').value,
        newPassword: document.getElementById('newpassword').value,
        token: jwtToken
    };

    fetch('http://localhost:5010/api/users/myaccount/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'},
        body: JSON.stringify(personalInfo)
    }).then(response => response.json())
      .then(data => {
        const ans = data.status;
        if (ans == false) {
            alert('Password is incorrect');
        } else {
            localStorage.removeItem('token');
            localStorage.setItem('token', data.token);
            alert('Changes saved');
        }
    });
});
