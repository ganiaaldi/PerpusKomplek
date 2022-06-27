
function validateFormLogin() {
    if (document.getElementById("username").value === "" || document.getElementById("password").value === "")
    {
      alert('Nomor anggota dan kata sandi tidak boleh kosong.')
    }
    else {
        window.location.href = "content.html";
    }
}

const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'db_book';

function isStorageExist() {
    if (typeof (Storage) === 'undefined') {
        alert('Browser tidak support local storage!');
        return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id, 
        title,
        author,
        year,
        isCompleted
    }
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function createBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.classList.add('book-title');
    textTitle.innerText = bookObject.title;
    
    const bookInformation = document.createElement('div');
    bookInformation.classList.add('book-information');

    const textAuthor = document.createElement('span').innerText = 'Penulis: ' + bookObject.author;
    const divider = document.createElement('span').innerText = ' | ';
    const textYear = document.createElement('span').innerText = 'Tahun: ' + bookObject.year;

    bookInformation.append(textAuthor, divider, textYear);
    
    const container = document.createElement('div');
    container.classList.add('item');
    container.append(textTitle, bookInformation);
    
    const containerAction = document.createElement('div');
    containerAction.classList.add('item-action');

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('button','delete');
    deleteBtn.innerText = 'Hapus';
    
    deleteBtn.addEventListener('click', function () {
        confirmDelete(bookObject);
    });

    container.append(containerAction);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const unfinishedBtn = document.createElement('button');
        unfinishedBtn.classList.add('button', 'okay');
        unfinishedBtn.innerText = 'Belum dibaca';
     
        unfinishedBtn.addEventListener('click', function () {
            addBookToUnfinished(bookObject.id);
        });

        containerAction.append(unfinishedBtn, deleteBtn);

    } else {
        const finishedBtn = document.createElement('button');
        finishedBtn.classList.add('button', 'okay');
        finishedBtn.innerText = 'Sudah dibaca';
        
        finishedBtn.addEventListener('click', function () {
            addBookToFinished(bookObject.id);
        });
        
        containerAction.append(finishedBtn, deleteBtn);
    }
    return container;
}

function addBook() {
    const textTitle = document.getElementById('tittleBook').value;
    const textAuthor = document.getElementById('authorBook').value;
    const textYear = document.getElementById('yearBook').value;
    const checkbox = document.getElementById('checkBook').checked;

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, textTitle, textAuthor, Number(textYear), checkbox);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBookToFinished(bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    window.location.reload()
    saveData();
}

function addBookToUnfinished(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    window.location.reload()
    saveData();
}

function deleteBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function confirmDelete(book) {
    let text = `Apakah anda akan menghapus buku ${book.title}?`;
  if (confirm(text) == true) {
    deleteBook(book.id);
  } else {
  }
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('formAddBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault;
        addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});


document.addEventListener(RENDER_EVENT, function () {
    console.log('cek book', books)
    const unfinished = document.getElementById('unfinished');
    const finished = document.getElementById('finished');
    for (const bookItem of books) {
        console.log('item book', bookItem)
        const bookElement = createBook(bookItem);
        if (bookItem.isCompleted) {
            finished.append(bookElement);
        } else {
            unfinished.append(bookElement);
        }
    }
})

function enterSearch(event) {
    console.log(event.key)
    if (event.key === "Enter") {
        searchingBook()
    }
}

function searchingBook() {
  const search = document.getElementById('query').value.toLocaleLowerCase();
  const itemList = document.querySelectorAll('.item-list');
  let item;

  let title;
  let titleValue;

  for (let j = 0; j < itemList.length; j++) {
      item = itemList[j].getElementsByClassName("item");
      
      for (let i = 0; i < item.length; i++) {
          title = item[i].getElementsByTagName('h3')[0];

          if (title) {
              titleValue = title.textContent || title.innerText;
              titleValue = titleValue.toLocaleLowerCase();

              if (titleValue.indexOf(search) > -1) {
                  item[i].style.display = "";
              } else {
                  item[i].style.display = "none";
              }
          }
      }
      
  }
};