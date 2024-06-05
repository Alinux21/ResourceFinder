var urlParams = new URLSearchParams(window.location.search);
var query = urlParams.get('query');
let currentPage = 1;
const resultsPerPage = 10;
let fetching = false;

<<<<<<< Updated upstream
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
=======
function startSearch() {
    currentPage = 1;
    document.getElementById("search-results").innerHTML = ''; // Clear previous results
    fetchResults();
}

function fetchResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    const offset = (currentPage - 1) * resultsPerPage;

    if (!fetching && query) {
        fetching = true;
        fetch(`http://localhost:5010/api/words/${query}?limit=${resultsPerPage}&offset=${offset}`)
            .then(response => response.json())
            .then(data => {
                displayResults(data);
                fetching = false;
            });
    }
}

function displayResults(data) {
    const searchResults = document.getElementById("search-results");

    data.forEach(element => {
        const article = document.createElement('article');
        article.onclick = () => getResource(event, element.id);

        const title = document.createElement('h2');
        title.textContent = element.title;

        const summary = document.createElement('p');
        summary.textContent = element.summary;

        const tags = document.createElement('p');
        tags.className = 'tags';
        tags.textContent = element.tags.split(',').map(tag => '#' + tag.trim().replace(' ', '_')).join(' ');

        article.appendChild(title);
        article.appendChild(summary);
        article.appendChild(tags);

        searchResults.appendChild(article);
    });

    if (data.length < resultsPerPage) {
        window.removeEventListener('scroll', handleScroll);
    }
}

function handleScroll() {
    const bottomOfWindow = window.innerHeight + window.scrollY >= document.documentElement.offsetHeight;

    if (bottomOfWindow) {
        currentPage++;
        fetchResults();
    }
}

window.addEventListener('scroll', handleScroll);

startSearch();  // Initialize the first search
>>>>>>> Stashed changes
