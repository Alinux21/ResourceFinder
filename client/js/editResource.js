const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

fetch('http://localhost:5010/api/resources/' + id)
    .then(response => response.json())
    .then(data => {


        document.getElementById('title').value = data[0].title;
        document.getElementById('summary').value = data[0].summary;
        document.getElementById('about').value = data[0].description;
        document.getElementById('tags').value = data[0].tags;
        document.getElementById('link').value = data[0].link;
        document.getElementById('type').value = data[0].type;

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

        for (var key in typeMap) {
            if (data[0][typeMap[key]] == 1) {
                document.getElementById('type').value = key;
                break;
            }
        }

        var image_src = data[0].image_src;
        if(image_src){
            document.getElementById('uploadImage').src = 'http://localhost:5010/api/resources/images/' + image_src;
        }else{
            document.getElementById('uploadImage').src = "../assets/images/upload.png";
        }
    });


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
            if (fileInput.files.length > 0) {
                formData.append('image', fileInput.files[0]);
            }

            console.log(formData.get('image'));


            var urlParams = new URLSearchParams(window.location.search);
            var id = urlParams.get('id');

            formData.append('data', JSON.stringify(data));

            fetch('http://localhost:5010/api/resources/' + id, {
                method: 'PUT',
                body: formData
            }).then(response => response.json())
                .then(data => console.log(data))
                .catch((error) => {
                    console.error('Error:', error);
                });

        })
        .catch((error) => {
            console.error('Error:', error);
        }
        )

});