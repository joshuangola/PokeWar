const cardList = document.getElementById("card-list");
const addCardForm = document.getElementById("add-card-form");
const cardNameInput = document.getElementById("card-name");
const cardCategoryInput = document.getElementById("card-category");
const cardValueInput = document.getElementById("card-value");
const cardImageInput = document.getElementById("card-image");
const baseUrl = "http://localhost:4004";

const editModal = document.getElementById("edit-modal");
const closeBtn = document.querySelector(".close");
const editCardForm = document.getElementById("edit-card-form");
const editCardNameInput = document.getElementById("edit-card-name");
const editCardCategoryInput = document.getElementById("edit-card-category");
const editCardValueInput = document.getElementById("edit-card-value");
const editCardImageInput = document.getElementById("edit-card-image");

let editingCardId = null;

(async function () {
  await loadCards();
})();

addCardForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = cardNameInput.value.trim();
  const category = cardCategoryInput.value.trim();
  const value = parseInt(cardValueInput.value);
  const image = cardImageInput.value.trim();

  if (!name || !category || !value || !image) return;

  const newCard = {
    name,
    category,
    value,
    image,
  };

  try {
    await axios.post(`${baseUrl}/api/pokemon`, newCard);
    await loadCards();
    addCardForm.reset();
  } catch (error) {
    console.error(error);
    alert("Error adding card");
  }
});

async function loadCards() {
  try {
    const response = await axios.get(`${baseUrl}/api/pokemon`);
    const cards = response.data;
    cardList.innerHTML = "";
    cards.forEach(createCardElement);
  } catch (error) {
    console.error(error);
    alert("Error loading cards");
  }
}

function createCardElement(card) {
  const cardElement = document.createElement("div");
  cardElement.className = "card";
  cardElement.innerHTML = `
        <img src="${card.image}" alt="${card.name}">
        <div>
          <strong>${card.name}</strong> (${card.category}, ${card.value})
        </div>
        <div>
          <button class="edit-button">Edit</button>
          <button class="delete-button">Delete</button>
        </div>
      `;
  cardList.appendChild(cardElement);

  const editButton = cardElement.querySelector(".edit-button");
  editButton.addEventListener("click", () => editCard(card.id));

  const deleteButton = cardElement.querySelector(".delete-button");
  deleteButton.addEventListener("click", () => deleteCard(card.id));
}

async function editCard(id) {
  const card = (await axios.get(`${baseUrl}/api/pokemon/${id}`)).data;
  editCardNameInput.value = card.name;
  editCardCategoryInput.value = card.category;
  editCardValueInput.value = card.value;
  editCardImageInput.value = card.image;

  editingCardId = id;
  editModal.style.display = "block";
}

closeBtn.onclick = function () {
  editModal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == editModal) {
    editModal.style.display = "none";
  }
};

editCardForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = editCardNameInput.value.trim();
  const category = editCardCategoryInput.value.trim();
  const value = parseInt(editCardValueInput.value);
  const image = editCardImageInput.value.trim();

  if (!name || !category || !value || !image) return;

  const updatedCard = {
    name,
    category,
    value,
    image,
  };

  try {
    await axios.put(`${baseUrl}/api/pokemon/${editingCardId}`, updatedCard);
    await loadCards();
    editModal.style.display = "none";
    editCardForm.reset();
  } catch (error) {
    console.error(error);
    alert("Error updating card");
  }
});

async function deleteCard(id) {
  try {
    await axios.delete(`${baseUrl}/api/pokemon/${id}`);
    await loadCards();
  } catch (error) {
    console.error(error);
    alert("Error deleting card");
  }
}
