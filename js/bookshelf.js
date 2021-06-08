const form = document.querySelector('#form-simpan');
const LocalNameStorage = 'LOCAL_BOOK_LIST';
const finishGroup = document.querySelector('#finish-group');
const readingGroup = document.querySelector('#reading-group');
const formSearch = document.querySelector('#form-search');

readingGroup.addEventListener('click', function (e){
  const buttonElement = e.target;
  const id = buttonElement.getAttribute('data-id');

  if (buttonElement.innerText === 'Selesai Baca') {
    changeReadingStatus(id);
  } else if (buttonElement.innerText === 'Hapus Buku') {
    deleteBook(id);
  }
});

finishGroup.addEventListener('click', function (e){
  const buttonElement = e.target;
  const id = buttonElement.getAttribute('data-id');
  if(buttonElement.innerText === 'Belum Selesai Baca') {
    changeReadingStatus(id);
  } else if (buttonElement.innerText === 'Hapus Buku') {
    deleteBook(id);
  }
});

formSearch.addEventListener('submit', function(event) {
    event.preventDefault();
    const keyword = document.querySelector('#search');
    const resultFilter = searchTitle(keyword.value);

    if (keyword.value === '') {
      renderBookList();
      return;
    }

    if (resultFilter.length > 0) {
      keyword.value = '';
      renderBookList(resultFilter);
    } else {
      keyword.value = '';
      renderBookList();
    }
});

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const id = new Date().toISOString();
  const title = document.querySelector('#judul');
  const author = document.querySelector('#penulis');
  const year = document.querySelector('#tahun');
  const isComplete = document.querySelector('#selesai');

  const bookData = {
    id,
    title: title.value,
    author: author.value,
    year: year.value,
    isComplete: isComplete.checked
  }
  storeBook(bookData);
  renderBookList();
});

function searchTitle(bookKeyword) {
  const books = showBookList();
  const bookFilter = books.filter((book) => {
    if (book.title.includes(bookKeyword)) {
      return ({book});
    }
  });
  if(bookFilter.length === 0) alert('data buku tidak ditemukan');
  return bookFilter;
}

function storeBook(book) {
  if (checkStorage()) {
    let dataListBook = null;
    if (localStorage.getItem(LocalNameStorage) === null) {
      dataListBook = [];
    } else {
      dataListBook = JSON.parse(localStorage.getItem(LocalNameStorage));
    }
    dataListBook.push(book);
    localStorage.setItem(LocalNameStorage, JSON.stringify(dataListBook));
  }
}

function changeReadingStatus(bookId) {
  const books = showBookList();
  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    alert('Buku tidak ditemukan');
    return;
  }

  const { isComplete } = books[index];
  books[index] = {
    ...books[index],
    isComplete: !isComplete
  };

  localStorage.setItem(LocalNameStorage, JSON.stringify(books));
  alert('Status baca berhasil diubah');
  renderBookList();
}

function deleteBook(bookId) {
  const books = showBookList();
  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    alert('Buku tidak ditemukan');
    return;
  }

  books.splice(index, 1);
  localStorage.setItem(LocalNameStorage, JSON.stringify(books));
  alert('Buku berhasil dihapus');
  renderBookList();
}

function checkStorage() {
  return typeof(localStorage) !== undefined;
}

function showBookList(){
  if (checkStorage()) {
    return JSON.parse(localStorage.getItem(LocalNameStorage)) || [];
  } else {
    return [];
  }
}

function renderBookList(filter = []){
  const bookList = showBookList();
  const reading = document.querySelector('#reading-group');
  const finish = document.querySelector('#finish-group');

  const titleRead = '<h2 class="title">Belum Selesai Dibaca</h2>';
  const titleFinish = '<h2 class="title">Selesai Dibaca</h2>';

  reading.innerHTML = '';
  finish.innerHTML = '';

  reading.innerHTML += titleRead;
  finish.innerHTML += titleFinish;

  if (filter.length > 0) {
    alert('Data Buku ditemukan');
    for (let book of filter) {
      if (book.isComplete) {
        let div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML += `
          <h3 class="title-book">${book.title}</h3>
          <p class="writer">Penulis: <span>${book.author}</span></p>
          <p class="year">Tahun: <span>${book.year}</span></p>
          <button type="button" class="btn btn-reading" data-id=${book.id}>Belum Selesai Baca</button>
          <button type="button" class="btn btn-delete" data-id=${book.id}>Hapus Buku</button>
        `;
        finish.appendChild(div);
      } else {
        let div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML += `
          <h3 class="title-book">${book.title}</h3>
          <p class="writer">Penulis: <span>${book.author}</span></p>
          <p class="year">Tahun: <span>${book.year}</span></p>
          <button type="button" class="btn btn-reading" data-id=${book.id}>Selesai Baca</button>
          <button type="button" class="btn btn-delete" data-id=${book.id}>Hapus Buku</button>
        `;
        reading.appendChild(div);
      }
    }
  } else {
    for (let book of bookList) {
      if (book.isComplete) {
        let div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML += `
          <h3 class="title-book">${book.title}</h3>
          <p class="writer">Penulis: <span>${book.author}</span></p>
          <p class="year">Tahun: <span>${book.year}</span></p>
          <button type="button" class="btn btn-reading" data-id=${book.id}>Belum Selesai Baca</button>
          <button type="button" class="btn btn-delete" data-id=${book.id}>Hapus Buku</button>
        `;
        finish.appendChild(div);
      } else {
        let div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML += `
          <h3 class="title-book">${book.title}</h3>
          <p class="writer">Penulis: <span>${book.author}</span></p>
          <p class="year">Tahun: <span>${book.year}</span></p>
          <button type="button" class="btn btn-reading" data-id=${book.id}>Selesai Baca</button>
          <button type="button" class="btn btn-delete" data-id=${book.id}>Hapus Buku</button>
        `;
        reading.appendChild(div);
      }
    }
  }
}

renderBookList();
