// DICHIARAZIONE VARIABILI GENERALI

const row = document.getElementById("row");
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

// CREO FUNZIONE PER CREARE LA CARD

const createBookCards = function (book) {
  const card = document.createElement("div");
  card.classList.add("col-6"); //bisogna dare per ogni classe un classList.add diverso!
  card.classList.add("col-md-3");
  card.innerHTML = `
    <div class="card">
    <img src="${book.img}" class="card-img-top" alt="${book.title}">
    <div class="card-body">
        <h5 class="card-title">${book.title}</h5>
        <p class="card-text">Prezzo: $${book.price}</p>
        <button class="btn btn-danger" onclick="removeBook(this)">Scarta</button>
        <button class="btn btn-primary" onclick="addToCart('${book.title}', ${book.price})">Compra ora</button>
    </div>
  </div>`;

  return card;
};

// FUNZIONE PER APPENDERE LA CARD

const appendBooks = function (books) {
  row.innerHTML = "";
  books.forEach((book) => {
    const card = createBookCards(book);
    row.appendChild(card);
  });
};

// FUNZIONE PER RIMUOVERE LA CARD DALLA PAGINA

const removeBook = function (button) {
  const card = button.closest(".card");
  card.remove();
};

// CREO FUNZIONE PER RENDERIZZARE I LIBRI NEL CARRELLO

const renderCartItems = function () {
  const cartContainer = document.getElementById("cart-list");
  cartContainer.innerHTML = "";
  cartItems.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `${item.title} - $${item.price}
        <button class="btn btn-danger" onclick="removeFromCart('${item.title}')">Rimuovi dal carrello</button>`;
    cartContainer.appendChild(listItem);
  });
};

// FUNZIONE PER AGGIUNGERE LIBRI AL CARRELLO

const addToCart = function (title, price) {
  const newBook = { title, price };
  cartItems.push(newBook);
  localStorage.setItem("cart", JSON.stringify(cartItems));
  renderCartItems();
};

// FUNZIONE PER RIMUOVERE LIBRO DAL CARRELLO
const removeFromCart = function (title) {
  cartItems = cartItems.filter((item) => item.title !== title);
  localStorage.setItem("cart", JSON.stringify(cartItems));
  renderCartItems();
};

// CREO FUNZIONE PER LA REQUEST

const getLibrary = function () {
  fetch("https://striveschool-api.herokuapp.com/books")
    .then((response) => {
      console.log("response", response);
      if (response.ok) {
        return response.json();
      } else {
        if (response.status === 404) {
          throw new Error("404 - Pagina non trovata");
        } else if (response.status === 500) {
          throw new Error("500 - Internal server error");
        } else {
          throw new Error("Errore generico");
        }
      }
    })
    .then((books) => {
      console.log("books", books);
      appendBooks(books);
    })
    .catch((err) => {
      console.log("errore!", err);
    });
};

getLibrary();
