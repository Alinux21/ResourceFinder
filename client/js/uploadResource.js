document.getElementById('uploadImage').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function() {
    var file = this.files[0];
    var reader = new FileReader();

    reader.onloadend = function() {
        document.getElementById('uploadImage').src = reader.result;
        document.getElementById('imageName').innerText = file.name;
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        document.getElementById('uploadImage').src = "../assets/images/upload.png";
    }
});

document.getElementById('resourceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
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

    var data = {
        title: document.getElementById('title').value,
        summary: document.getElementById('summary').value,
        description: document.getElementById('about').value,
        tags: document.getElementById('tags').value,
        link: document.getElementById('link').value
    };

    // Initialize all type properties to undefined
    for (var key in typeMap) {
        data[typeMap[key]] = undefined;
    }

    // Set the correct type property to 1
    if (type in typeMap) {
        data[typeMap[type]] = 1;
    }


    console.log(data);


    fetch('http://localhost:5010/api/resources', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch((error) => {
        console.error('Error:', error);
      });
});
