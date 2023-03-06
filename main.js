let books = [];
const STORAGE_KEY = "book-shelf";
window.addEventListener("DOMContentLoaded", function () {
  const submit = document.getElementById("bookSubmit");

  submit.addEventListener("click", function (e) {
    e.preventDefault();
    addBook();
  });

  document.dispatchEvent(new Event("RENDER-DATA"));
});

function toObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function addBook() {
  let bookTitle = document.getElementById("inputBookTitle").value;
  let bookAuthor = document.getElementById("inputBookAuthor").value;
  let bookYear = document.getElementById("inputBookYear").value;
  const id = +new Date();
  const bookObj = toObject(id, bookTitle, bookAuthor, bookYear, false);
  books.push(bookObj);
  saveToStorage(books);
}

function saveToStorage(parsedBook) {
  let currentStorage = JSON.parse(localStorage.getItem(STORAGE_KEY));
  console.log(currentStorage.push(parsedBook));
  console.log(currentStorage);
  //   localStorage.setItem(STORAGE_KEY, parsedBook);
  document.dispatchEvent(new Event("RENDER-DATA"));
}

function bookElement(bookDetail) {
  const container = document.getElementById("incompleteBookshelfList");
  const article = document.createElement("article");
  const articleTitle = document.createElement("h3");
  const articleAuthor = document.createElement("p");
  const articleYear = document.createElement("p");

  const div = document.createElement("div");
  const finishButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  articleTitle.innerText = bookDetail.title;
  articleAuthor.innerText = `Penulis: ${bookDetail.author}`;
  articleYear.innerText = `Tahun: ${bookDetail.year}`;

  finishButton.innerText = "Belum selesai di Baca";
  deleteButton.innerText = "Hapus Buku";

  div.classList.add("action");
  finishButton.classList.add("green");
  deleteButton.classList.add("red");

  article.classList.add("book_item");

  div.append(finishButton, deleteButton);
  article.append(articleTitle, articleAuthor, articleYear, div);

  container.append(article);
  return container;
}

document.addEventListener("RENDER-DATA", function () {
  const bookObj = JSON.parse(localStorage.getItem(STORAGE_KEY));
  bookObj.forEach((element) => {
    bookElement(element);
  });
});
