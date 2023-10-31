const COHORT = "2308-ACC-PT-WEB-PT-B";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

const eventList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getEvents();
  renderEvents();
}
render();

/**
 * Update state with events from API
 */
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Render events from state
 */
function renderEvents() {
  if (!state.events.length) {
    eventList.innerHTML = "<li>No Events.</li>";
    return;
  }

  const eventCards = state.events.map((event) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${event.name}</h2>
      <p>${event.description}</p>
      <p>${event.date}</p>
      <p>${event.location}</p>
      <button id="${event.id}" type="button">Delete Event</button>
    `;
    return li;
  });

  eventList.replaceChildren(...eventCards);
  const deleteButtons = document.querySelectorAll("li > button")
  deleteButtons.forEach(button => {
    button.addEventListener("click", () => deleteEvent(button.id) )
  })
}
async function deleteEvent(deleteId) {
  //console.log(button.id + " clicked!")
  try {
    const response = await fetch(`${API_URL}/${deleteId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
    if (!response.ok) {
      throw new Error("Failed to delete event")
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

async function addEvent(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        date: addEventForm.date.value,
        location: addEventForm.location.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    render();
  } catch (error) {
    console.error(error);
  }

}
