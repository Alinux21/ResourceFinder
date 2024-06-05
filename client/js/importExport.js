function importResources() {

    console.log("Importing resources");

    document.querySelector('#importResourcesButton').click() //clicking the hidden file input button

    document.querySelector('#importResourcesButton').onchange = function (event) {
        console.log("File selected");
        var file = event.target.files[0];
        console.log(file);
        var formData = new FormData();
        formData.append('file', file);

        var fileType = file.name.split('.').pop().toLowerCase();
        if (fileType !== 'json' && fileType !== 'csv') {
            console.error('Invalid file type. Please select a .json or .csv file.');
            centeredAlert('importErrorBox');
            return;
        }

        fetch('http://localhost:5010/api/imports', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }


}

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

function exportJSON() {
    console.log("Exporting JSON");


    fetch('http://localhost:5010/api/resources')
        .then(response => response.json())
        .then(data => {

            console.log(data);

            var jsonString = JSON.stringify(data);

            var blob = new Blob([jsonString], { type: "application/json" });

            var url = URL.createObjectURL(blob);

            var link = document.createElement('a');

            link.href = url;
            link.download = 'resources.json';
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

        })


}

function exportCSV() {
    console.log("Exporting CSV");

    fetch('http://localhost:5010/api/resources')
        .then(response => response.json())
        .then(data => {

            var csvString = convertToCSV(data);

            var blob = new Blob([csvString], { type: "text/csv" });

            var url = URL.createObjectURL(blob);

            var link = document.createElement('a');

            link.href = url;
            link.download = 'resources.csv';
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
        });



}

function convertToCSV(data) {
    var csv = [];

    var headers = "title,summary,description,tags,link,posted_by,is_book,is_online_book,is_course,is_framework,is_visual_programming_language,is_sound_programming_language,is_web_programming_library,is_hardware,is_video,is_tutorial,is_machine_learning,is_blog,image_src,created_at,updated_at";
    csv.push(headers); //adding the headers

    var keys = headers.split(',');

    for (var i = 0; i < data.length; i++) {
        csv.push(keys.map(key => `"${data[i][key]}"`).join(',')); //add the data rows, text contains '\n' so we map data in " "
    }

    return csv.join('\n');
}