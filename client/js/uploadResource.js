localStorage.getItem('token') ? null : window.location.href = 'main-guest.html';

document.getElementById('uploadImage').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function () {
    var file = this.files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
        document.getElementById('uploadImage').src = reader.result;
        document.getElementById('imageName').innerText = file.name;
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        document.getElementById('uploadImage').src = "../assets/images/upload.png";
    }
});

document.getElementById('resourceForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    var username = null;

    fetch('http://localhost:5010/api/users/username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })

    }).then(response => response.json())
        .then(data => {

            username = data.username;

            var data = {
                title: document.getElementById('title').value,
                summary: document.getElementById('summary').value,
                description: document.getElementById('about').value,
                tags: document.getElementById('tags').value,
                link: document.getElementById('link').value,
                posted_by: username,
                image_src: document.getElementById('imageName').innerText.replace(/\s/g, '_')
            };

            console.log(data);

            var type = document.getElementById('type').value;

            var typeMap = {
                book: 'is_book',
                online_book: 'is_online_book',
                course: 'is_course',
                framework: 'is_framework',
                visual_programming_language: 'is_visual_programming_language',
                sound_programming_language: 'is_sound_programming_language',
                web_programming_library: 'is_web_programming_library',
                hardware: 'is_hardware',
                video: 'is_video',
                tutorial: 'is_tutorial',
                machine_learning: 'is_machine_learning',
                blog: 'is_blog'
            };


            // Initialize all type properties to undefined
            for (var key in typeMap) {
                data[typeMap[key]] = undefined;
            }

            // Set the correct type property to 1
            if (type in typeMap) {
                data[typeMap[type]] = 1;
            }

            var formData = new FormData();
            var fileInput = document.getElementById('fileInput');


            if (fileInput.files.length != 0) {

                if (fileInput.files[0].type != 'image/jpeg' && fileInput.files[0].type != 'image/png' && fileInput.files[0].type != 'image/jpg') {

                    centeredAlert('invalidImageBox');
                    return;
                }

                formData.append('image', fileInput.files[0]);

            }


            formData.append('data', JSON.stringify(data));

            fetch('http://localhost:5010/api/resources', {
                method: 'POST',
                body: formData
            }).then(response => response.json())
                .then(data => {
                    console.log(data)
                    window.location.href='dashboard.html';
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        })
        .catch((error) => {
            console.error('Error:', error);
        }
        )

});

function centeredAlert(elementId) {

    var currentBox = document.getElementById(elementId);
    var overlay = document.getElementById('overlay');


    //showing the exportBox and the overlay
    currentBox.style.display = 'block';
    overlay.style.display = 'block';

    //disabling scrolling
    document.body.style.overflow = 'hidden';

    currentBox.style.display = 'block';
    currentBox.style.position = 'fixed'; 
    currentBox.style.top = '50%'; 
    currentBox.style.left = '50%'; 
    currentBox.style.transform = 'translate(-50%, -50%)'; 
    currentBox.style.backgroundColor = 'white';
    currentBox.style.padding = '20px';
    currentBox.style.border = '1px solid black';
    currentBox.style.borderRadius = '5px';
    currentBox.style.zIndex = '2';
    currentBox.style.width = '40%';


    overlay.addEventListener('click', function () {
        //hiding the exportBox and the overlay
        currentBox.style.display = 'none';
        overlay.style.display = 'none';

        //re-enabling scrolling
        document.body.style.overflow = 'auto';
    });


}