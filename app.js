const service = new BookService();

const bookInput = document.getElementById('bookInput');
const addBtn = document.getElementById('addBtn');
const bookList = document.getElementById('bookList');

function renderBooks() {
    bookList.innerHTML = '';
    service.getBooks().forEach(book => {
        const li = document.createElement('li');
        li.textContent = book;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Удалить';
        removeBtn.onclick = () => {
            service.removeBook(book);
            renderBooks();
        };

        li.appendChild(removeBtn);
        bookList.appendChild(li);
    });
}

addBtn.onclick = () => {
    const title = bookInput.value.trim();
    if (title) {
        service.addBook(title);
        bookInput.value = '';
        renderBooks();
    }
};

bookInput.onkeypress = (e) => {
    if (e.key === 'Enter') addBtn.click();
};
