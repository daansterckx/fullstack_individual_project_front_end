document.addEventListener('DOMContentLoaded', function() {
    fetchMovieDates();
});

const apiUrl = 'https://my-json-server.typicode.com/daansterckx/movie/movies';
async function fetchMovieDates() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayMovieDates(data);
        populateDateSelect(data);
    } catch (error) {
        console.error('Error fetching movie dates:', error);
    }
}
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
function displayMovieDates(movies) {
    const container = document.getElementById('movie-dates-container');
    container.innerHTML = movies.map((movie, index) => generateMovieDateHTML(movie, index)).join('');
    fetchActors();
}
function populateDateSelect(movies) {
    const dateSelect = document.getElementById('date');
    movies.forEach(movie => {
        const option = document.createElement('option');
        option.value = movie.movie_date;
        option.textContent = `${movie.movie_name} - ${movie.movie_date}`;
        dateSelect.appendChild(option);
    });
}
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
function addActorClickEvents(actors) {
    document.querySelectorAll('.actor-btn').forEach(button => {
        button.addEventListener('click', function() {
            const actorIndex = this.getAttribute('data-actor-index');
            const actor = actors[actorIndex];
            showActorModal(actor);
        });
    });
}

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
let attendeeIdCounter = 10;
document.getElementById('reservation-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const attendeeData = {
        attendee_id: Date.now(),
        movie_id: document.getElementById('movie_id').value,
        attendee_name: document.getElementById('attendee_name').value,
        attendee_email: document.getElementById('attendee_email').value
    };
    fetch('https://127.0.0.1:8000/attendees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(attendeeData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});



function populateDateSelect(movies) {
    const dateSelect = document.getElementById('date');
    movies.forEach(movie => {
        const option = document.createElement('option');
        option.value = movie.movie_date;
        option.textContent = `${movie.movie_name} - ${movie.movie_date}`;
        option.setAttribute('data-movie-id', movie.id); 
        dateSelect.appendChild(option);
    });
}