document.addEventListener('DOMContentLoaded', function() {
    fetchMovieDates();
});

const apiUrl = 'https://my-json-server.typicode.com/daansterckx/movie/movies'; // Replace with your GitHub raw URL

// Function to fetch movie dates from the API
async function fetchMovieDates() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayMovieDates(data); // Access the array directly
        populateDateSelect(data); // Populate the date select dropdown
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
                        <img src="../assets/front.jpg" alt="${movie.movie_name}" width="100" height="100">
                        ${movie.movie_name} - ${movie.movie_date}
                    </button>
                </h2>
            </div>
            <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}" data-bs-parent="#movie-dates-container">
                <div class="card-body">
                    <p><strong>Description:</strong> ${movie.description}</p>
                    <p><strong>Max Attendees:</strong> ${movie.max_attendees}</p>
                    <div id="actors-container-${index}">
                        <h3>Actors:</h3>
                        <div class="accordion" id="actorsAccordion${index}">
                            <!-- Actors will be inserted here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Function to display movie dates on the page
function displayMovieDates(movies) {
    const container = document.getElementById('movie-dates-container');
    container.innerHTML = movies.map((movie, index) => generateMovieDateHTML(movie, index)).join('');
    fetchActors();
}

// Function to populate the date select dropdown
function populateDateSelect(movies) {
    const dateSelect = document.getElementById('date');
    movies.forEach(movie => {
        const option = document.createElement('option');
        option.value = movie.movie_date;
        option.textContent = `${movie.movie_name} - ${movie.movie_date}`;
        dateSelect.appendChild(option);
    });
}

// Function to fetch actors from the API
function fetchActors() {
    fetch('https://my-json-server.typicode.com/daansterckx/fullstackactors/actors')
        .then(response => response.json())
        .then(data => {
            data.forEach((actor, index) => {
                const actorHTML = generateActorHTML(actor, index);
                document.querySelectorAll(`[id^="actorsAccordion"]`).forEach(accordion => {
                    accordion.innerHTML += actorHTML;
                });
            });
            addActorClickEvents(data);
        })
        .catch(error => console.error('Error fetching actors:', error));
}

// Function to generate HTML for each actor
function generateActorHTML(actor, index) {
    const madeUpInfo = `${actor.name} is a renowned actor known for their versatility and dedication to the craft. With a career spanning over ${actor.age - 20} years, ${actor.name} has captivated audiences with performances in both independent films and major blockbusters. ${actor.name} is also an advocate for various charitable causes and has received numerous awards for their contributions to the film industry.`;
    return `
        <div class="card">
            <div class="card-header" id="headingActor${index}">
                <h2 class="mb-0">
                    <button class="btn btn-link collapsed actor-btn" type="button" data-bs-toggle="collapse" data-target="#collapseActor${index}" aria-expanded="false" aria-controls="collapseActor${index}" data-actor-index="${index}">
                        ${actor.name}
                    </button>
                </h2>
            </div>
            <div id="collapseActor${index}" class="collapse" aria-labelledby="headingActor${index}" data-parent="#actorsAccordion${index}">
                <div class="card-body">
                    <p><strong>Age:</strong> ${actor.age}</p>
                    <p><strong>Movies:</strong> ${actor.movies.join(', ')}</p>
                    <p><strong>Bio:</strong> ${madeUpInfo}</p>
                </div>
            </div>
        </div>
    `;
}

// Function to add click events to actor buttons
function addActorClickEvents(actors) {
    document.querySelectorAll('.actor-btn').forEach(button => {
        button.addEventListener('click', function() {
            const actorIndex = this.getAttribute('data-actor-index');
            const actor = actors[actorIndex];
            showActorModal(actor);
        });
    });
}

// Function to show the actor modal with the actor's information
function showActorModal(actor) {
    const modalTitle = document.getElementById('actorModalLabel');
    const modalBody = document.getElementById('actorBio');
    modalTitle.textContent = actor.name;
    modalBody.innerHTML = `
        <p><strong>Age:</strong> ${actor.age}</p>
        <p><strong>Movies:</strong> ${actor.movies.join(', ')}</p>
        <p><strong>Bio:</strong> ${actor.name} is a renowned actor known for their versatility and dedication to the craft. With a career spanning over ${actor.age - 20} years, ${actor.name} has captivated audiences with performances in both independent films and major blockbusters. ${actor.name} is also an advocate for various charitable causes and has received numerous awards for their contributions to the film industry.</p>
    `;
    const actorModal = new bootstrap.Modal(document.getElementById('actorModal'));
    actorModal.show();
}

let attendeeIdCounter = 10; // Initialize a counter for attendee IDs

document.getElementById('reservation-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const dateSelect = document.getElementById('date');
    const date = dateSelect.value;
    const movieId = dateSelect.options[dateSelect.selectedIndex].getAttribute('data-movie-id');

    const data = {
        attendee_id: attendeeIdCounter++, // Assign and increment the attendee ID
        movie_id: parseInt(movieId), // Ensure movie_id is an integer
        attendee_name: name,
        attendee_email: email
    };

    fetch('https://127.0.0.1:8000/attendees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Reservation successful!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`Reservation failed: ${error.message}`);
    });
});

// Function to populate the date select dropdown
function populateDateSelect(movies) {
    const dateSelect = document.getElementById('date');
    movies.forEach(movie => {
        const option = document.createElement('option');
        option.value = movie.movie_date;
        option.textContent = `${movie.movie_name} - ${movie.movie_date}`;
        option.setAttribute('data-movie-id', movie.id); // Add movie ID as a data attribute
        dateSelect.appendChild(option);
    });
}