let books = [];
const STORAGE_KEY = "book-shelf";
window.addEventListener("DOMContentLoaded", function () {
  const submit = document.getElementById("bookSubmit");
  if (localStorage.getItem(STORAGE_KEY) !== null) {
    loadDataFromStorage();
  }
  submit.addEventListener("click", function (e) {
    e.preventDefault();
    addBook();
  });
});

function loadDataFromStorage() {
  let dataFromStorage = JSON.parse(localStorage.getItem(STORAGE_KEY));
  dataFromStorage.forEach((datas) => {
    books.push(datas);
  });
  document.dispatchEvent(new Event("RENDER-DATA"));
}

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
  document.dispatchEvent(new Event("RENDER-DATA"));
  saveToStorage();
}

function saveToStorage() {
  let booksArr = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, booksArr);
  // document.dispatchEvent(new Event("RENDER-DATA"));
}

function bookElement(bookDetail) {
  // const container = document.getElementById("incompleteBookshelfList");
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
  return article;
}

document.addEventListener("RENDER-DATA", function () {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";

  // const bookObj = JSON.parse(localStorage.getItem(STORAGE_KEY));
  // console.log(bookObj);
  books.forEach((element) => {
    const bookArticle = bookElement(element);
    incompleteBookshelfList.append(bookArticle);
    // bookElement(element);
  });
});
