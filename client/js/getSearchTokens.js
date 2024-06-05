var urlParams = new URLSearchParams(window.location.search);
var query = urlParams.get('query');

var typeMap = [
    'is_book',
    'is_online_book',
    'is_course',
    'is_framework',
    'is_visual_programming_language',
    'is_sound_programming_language',
    'is_web_programming_library',
    'is_hardware',
    'is_video',
    'is_tutorial',
    'is_machine_learning',
    'is_blog'
];

document.addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilters();
});

function getAllTypes(element) {
    var types = [];
    if (element.is_book) types.push('is_book');
    if (element.is_online_book) types.push('is_online_book');
    if (element.is_course) types.push('is_course');
    if (element.is_framework) types.push('is_framework');
    if (element.is_visual_programming_language) types.push('is_visual_programming_language');
    if (element.is_sound_programming_language) types.push('is_sound_programming_language');
    if (element.is_web_programming_library) types.push('is_web_programming_library');
    if (element.is_hardware) types.push('is_hardware');
    if (element.is_video) types.push('is_video');
    if (element.is_tutorial) types.push('is_tutorial');
    if (element.is_machine_learning) types.push('is_machine_learning');
    if (element.is_blog) types.push('is_blog');
    return types;
}

function fetchAndDisplayResources() {
    fetch('http://localhost:5010/api/words/' + query)
        .then(response => response.json())
        .then(data => {
            window.allData = data;
            displayResources(data);
        });
}

function displayResources(data) {
    var rows = "";
    data.forEach(element => {
        rows += '<article onclick="getResource(event,' + element.id + ')">'
            + '<h2>' + element.title + '</h2>'
            + '<p>' + element.summary + '</p>'
            + '<p class="tags">' + element.tags.split(',').map(tag => '#' + tag.trim().replace(' ', '_')).join(' ') + '</p>'
            + "</article>";
    });
    document.getElementById("search-results").innerHTML = rows;
}

function applyFilters() {
    let filters = [];
    document.querySelectorAll('[type="checkbox"]').forEach((checkbox) => {
        if (checkbox.checked) {
            filters.push(checkbox.value);
        }
    });

    let filteredData;

    if (filters.length === 0) {
        filteredData = window.allData; 
    } else {
        filteredData = window.allData.filter(element => {
            var types = getAllTypes(element);
            return types.some(type => filters.includes(type));
        });
    }

    displayResources(filteredData);
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayResources);
