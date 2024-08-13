document.addEventListener('DOMContentLoaded', function() {
    fetchMovieDates();
    fetchActors();
});

const apiUrl = 'https://my-json-server.typicode.com/daansterckx/movie/movies'; // Replace with your GitHub raw URL
// Function to fetch movie dates from the API
async function fetchMovieDates() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayMovieDates(data); // Access the array directly
    } catch (error) {
        console.error('Error fetching movie dates:', error);
    }
}
// Function to generate HTML for each movie date
function generateMovieDateHTML(movie, index) {
    return `
        <div class="card">
            <div class="card-header" id="heading${index}">
                <h2 class="mb-0">
                    <button class="btn btn-link text-decoration-none text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
                        ${movie.movie_name} - ${movie.movie_date}
                    </button>
                </h2>
            </div>
            <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}" data-bs-parent="#movie-dates-container">
                <div class="card-body">
                    <p><strong>Description:</strong> ${movie.description}</p>
                    <p><strong>Max Attendees:</strong> ${movie.max_attendees}</p>
                </div>
            </div>
        </div>
    `;
}

    // Function to display movie dates on the page
    function displayMovieDates(movies) {
        const container = document.getElementById('movie-dates-container');
        container.innerHTML = movies.map((movie, index) => generateMovieDateHTML(movie, index)).join('');
    }

function fetchActors() {
    fetch('https://my-json-server.typicode.com/daansterckx/fullstackactors/actors')
        .then(response => response.json())
        .then(data => {
            displayActors(data);
            addToggleArrowListeners();
        })
        .catch(error => console.error('Error fetching actors:', error));
}

// Function to display actors
function displayActors(actors) {
    const container = document.getElementById('actors-container');
    container.innerHTML = actors.map(actor => `
        <div class="accordion-item">
            <h2 class="accordion-header" id="heading${actor.id}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${actor.id}" aria-expanded="false" aria-controls="collapse${actor.id}">
                    ${actor.name}
                </button>
            </h2>
            <div id="collapse${actor.id}" class="accordion-collapse collapse" aria-labelledby="heading${actor.id}" data-bs-parent="#actors-container">
                <div class="accordion-body">
                    <p>Age: ${actor.age}</p>
                    <p>Movies:</p>
                    <ul>
                        ${actor.movies.map(movie => `<li>${movie}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `).join('');
}

function addToggleArrowListeners() {
    const buttons = document.querySelectorAll('.accordion-button');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const icon = this.querySelector('.collapse-icon');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            icon.innerHTML = isExpanded ? '&#9654;' : '&#9660;'; // Toggle between right and down arrow
        });
    });
}