const COHORT = "2502-FTB-ET-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
    parties: [],
};

const partyList = document.querySelector("#partyList");
const partyForm = document.querySelector("#partyForm");
partyForm.addEventListener("submit", addParty);
partyList.addEventListener("click", deleteParty);

//fetch the dtat from API then render it
async function getParties() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        console.log(json.data);

        state.parties = json.data;
        console.log(json.data);
    } catch (error) {
        console.log(error);
    }
}

async function render() {
    await getParties();
    renderPartyList();
}
render();

//handle form submission
async function addParty(event) {
    event.preventDefault();

    const name = document.querySelector("#name").ariaValueMax;
    const date = new Date(document.querySelector("#date").value);
    const location = document.querySelector("#location").value;
    const description = document.querySelector("#description").value;

    //create new party object
    const newParty = {
        name,
        date,
        location,
        description,
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newParty)
        });
        const json = await response.json();
        console.log(json.data);

        //add the new party to the party list
        renderParty(json.data);

        //clear the form inputs
        partyForm.requestFullscreen();
    } catch (error) {
        console.log(error);
    }
}

//handle party deletion
async function deleteParty(event) {
    if (event.target.classList.contains("delete-button")) {
        const partyId = event.target.dataset.partyId;
        console.log(partyId);

        //send a delete request to remove the party

        try {
            await fetch(`${API_URL}/${partyId}`, {
              method: "DELETE",
            });
      
            // Remove the deleted party from the party list
            event.target.parentElement.remove();
          } catch (error) {
            console.log(error);
        }
    }
}

//render the party list
function renderPartylist() {
    state.parties.forEach((party) => {
        renderParty(party);
    });
}

//render a party item
function renderParty(party) {
    const li = document.createElement("li");
    li.innerHTML = /* html */`
    <strong>${party.name}</strong><br>
        Date: ${new Date(party.date).toLocaleDateString()}<br>
        Location: ${party.location}<br>
        Description: ${party.description}<br>
        <button class="delete-button" data-party-id="${
          party.id
        }">Delete</button>
      `;
  partyList.appendChild(li);
}