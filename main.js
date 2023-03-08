let bookShelf = [];
const STORAGE_KEY = "book-shelf";

window.addEventListener("DOMContentLoaded", function () {
  const submit = document.getElementById("bookSubmit");
  const searchButton = document.getElementById("searchSubmit");

  if (localStorage.getItem(STORAGE_KEY) !== null) {
    loadDataFromStorage();
  }
  submit.addEventListener("click", function (e) {
    e.preventDefault();
    addBook();
  });

  searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    searchBook();
  });
});

function loadDataFromStorage() {
  let dataFromStorage = JSON.parse(localStorage.getItem(STORAGE_KEY));
  dataFromStorage.forEach((datas) => {
    bookShelf.push(datas);
  });
  document.dispatchEvent(new Event("RENDER_DATA"));
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

function clearInput() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;
}

function searchBook() {
  let bookShelfTmp = [];
  const judul = document.getElementById("searchBookTitle");
  let bookFromStorage = JSON.parse(localStorage.getItem(STORAGE_KEY));
  bookFromStorage.forEach((book) => {
    let test = book.title.toLowerCase().includes(judul.value);
    if (test) {
      bookShelfTmp.push(book);
      bookShelf = bookShelfTmp;
    }
  });
  document.dispatchEvent(new Event("RENDER_DATA"));
  judul.value = "";
}

function addBook() {
  let bookTitle = document.getElementById("inputBookTitle").value;
  let bookAuthor = document.getElementById("inputBookAuthor").value;
  let bookYear = document.getElementById("inputBookYear").value;
  let isCompleted = document.getElementById("inputBookIsComplete").checked;
  const id = +new Date();
  const bookObj = toObject(id, bookTitle, bookAuthor, bookYear, isCompleted);
  bookShelf.push(bookObj);
  document.dispatchEvent(new Event("RENDER_DATA"));
  saveToStorage();
  clearInput();
}

function findBook(id) {
  const bookByid = bookShelf.find((book) => {
    return book.id === id;
  });

  return bookByid;
}

function removeBook(id) {
  bookShelf = bookShelf.filter((book) => book.id != id);
  saveToStorage();
}

function saveToStorage() {
  let booksArr = JSON.stringify(bookShelf);
  localStorage.setItem(STORAGE_KEY, booksArr);
  document.dispatchEvent(new Event("SAVED_EVENT"));
  document.dispatchEvent(new Event("RENDER_DATA"));
}

function bookElement(bookDetail) {
  const article = document.createElement("article");
  const articleTitle = document.createElement("h3");
  const articleAuthor = document.createElement("p");
  const articleYear = document.createElement("p");

  const div = document.createElement("div");

  article.setAttribute("data-id", bookDetail.id);
  articleTitle.innerText = bookDetail.title;
  articleAuthor.innerText = `Penulis: ${bookDetail.author}`;
  articleYear.innerText = `Tahun: ${bookDetail.year}`;

  div.classList.add("action");

  const deleteButton = document.createElement("button");

  if (bookDetail.isCompleted) {
    const notFinishButton = document.createElement("button");
    notFinishButton.innerText = "Belum selesai di Baca";
    deleteButton.innerText = "Hapus Buku";

    notFinishButton.classList.add("green");
    deleteButton.classList.add("red");
    div.append(notFinishButton, deleteButton);

    notFinishButton.addEventListener("click", function () {
      let bookByid = findBook(bookDetail.id);
      bookByid.isCompleted = !bookByid.isCompleted;
      saveToStorage();
    });
  } else {
    const finishButton = document.createElement("button");

    finishButton.innerText = "selesai di Baca";
    deleteButton.innerText = "Hapus Buku";

    finishButton.classList.add("green");
    deleteButton.classList.add("red");
    div.append(finishButton, deleteButton);
    finishButton.addEventListener("click", function () {
      let bookByid = findBook(bookDetail.id);
      bookByid.isCompleted = !bookByid.isCompleted;
      saveToStorage();
    });
  }

  deleteButton.addEventListener("click", function () {
    if (confirm("Yakin Mau Dihapus?") == true) {
      removeBook(bookDetail.id);
      document.dispatchEvent(new Event("DELETE_EVENT"));
    }
  });

  article.classList.add("book_item");

  article.append(articleTitle, articleAuthor, articleYear, div);

  return article;
}

document.addEventListener("SAVED_EVENT", function () {
  let alertToast = document.querySelector(".alert-toast");
  alertToast.classList.add("show");
  setTimeout(() => {
    alertToast.classList.remove("show");
  }, 1500);
});

document.addEventListener("DELETE_EVENT", function () {
  let deleteToast = document.querySelector(".delete-toast");
  deleteToast.classList.add("show");
  setTimeout(() => {
    deleteToast.classList.remove("show");
  }, 1500);
});

document.addEventListener("RENDER_DATA", function () {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  bookShelf.forEach((bookData) => {
    const bookArticle = bookElement(bookData);
    if (bookData.isCompleted) {
      completeBookshelfList.append(bookArticle);
    } else {
      incompleteBookshelfList.append(bookArticle);
    }
  });
});
