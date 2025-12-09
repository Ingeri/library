// =========================
// DYNAMIC BOOK MANAGEMENT JS
// =========================

// GLOBAL VARIABLES
let books = [];
let filteredBooks = [];
let currentPage = 1;
const itemsPerPage = 6;

// DOM ELEMENTS
const grid = document.querySelector(".book-grid");
const searchInput = document.querySelector(".search-bar input");

// Stats Elements

// =========================
// LOAD BOOKS.JSON
// =========================
fetch("data/books.json")
  .then((res) => res.json())
  .then((data) => {
    books = data;
    filteredBooks = books;
    renderBooks();
  })
  .catch((err) => console.error("Error loading books.json", err));

// =========================
// LOAD STATS.JSON AND UPDATE UI
// =========================
// Select elements safely
const availableStat = document.querySelector(".books-stat-card.available p");
const newStat = document.querySelector(".books-stat-card.new p");
const categoriesStat = document.querySelector(".books-stat-card.categories p");

// Utility to format numbers (ex: 3420 → 3,420)
const formatNumber = (num) =>
  num.toLocaleString("en-US", { maximumFractionDigits: 0 });

// Load stats.json
async function loadStats() {
  try {
    const res = await fetch("data/stats.json");

    if (!res.ok) throw new Error("Failed to load stats.json");

    const stats = await res.json();

    // Update UI safely
    if (availableStat) availableStat.textContent = formatNumber(stats.availableBooks);
    if (newStat) newStat.textContent = formatNumber(stats.newBooks);
    if (categoriesStat) categoriesStat.textContent = formatNumber(stats.totalCategories);

  } catch (err) {
    console.error("Error loading stats:", err);

    // Fallback values in case of error
    if (availableStat) availableStat.textContent = "0";
    if (newStat) newStat.textContent = "0";
    if (categoriesStat) categoriesStat.textContent = "0";
  }
}

// Run function
loadStats();


// =========================
// RENDER BOOK CARDS
// =========================
function renderBooks() {
  grid.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const pageItems = filteredBooks.slice(start, end);

  if (pageItems.length === 0) {
    grid.innerHTML = "<p class='no-data'>No books found...</p>";
    return;
  }

  pageItems.forEach((book) => {
    const card = document.createElement("div");
    card.classList.add("book-card");

    card.innerHTML = `
      <div class="book-title">${book.title}</div>

      <div class="book-info">
          <span><strong>Author:</strong> ${book.author}</span>
          <span><strong>Status:</strong> ${book.status}</span>
      </div>

      <div class="book-info">
          <span><strong>ISBN:</strong> ${book.isbn}</span>
          <span><strong>Copies:</strong> ${book.copies}</span>
      </div>

      <div class="book-info">
          <span><strong>Category:</strong> ${book.category}</span>
          <span><strong>Grade:</strong> ${book.grade}</span>
      </div>

      <div class="book-actions">
          <i class="fas fa-eye view" data-id="${book.id}" title="View Book Details"></i>
          <i class="fas fa-plus add" data-id="${book.id}" title="Add Copy"></i>
          <i class="fas fa-minus remove" data-id="${book.id}" title="Remove Copy"></i>
          <i class="fas fa-pen edit" data-id="${book.id}" title="Edit Book"></i>
          <i class="fas fa-trash delete" data-id="${book.id}" title="Delete Book"></i>
      </div>
    `;

    grid.appendChild(card);
  });
  renderPagination();
}

// =========================
// SEARCH BOOKS
// =========================
searchInput.addEventListener("input", () => {
  const text = searchInput.value.toLowerCase();

  filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(text) ||
      b.author.toLowerCase().includes(text) ||
      b.isbn.includes(text)
  );

  currentPage = 1;
  renderBooks();
});

// =========================
// PAGINATION FUNCTIONS
// =========================
function renderPagination() {
  const pagination = document.querySelector(".pagination");
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  pagination.innerHTML = ""; // clear previous

  // Previous button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "⬅";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    currentPage--;
    renderBooks();
  });
  pagination.appendChild(prevBtn);

  // Pages logic
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  if (startPage > 1) {
    addPageSpan(1);
    if (startPage > 2) {
      pagination.appendChild(createEllipsis());
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    addPageSpan(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pagination.appendChild(createEllipsis());
    addPageSpan(totalPages);
  }

  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "➡";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    currentPage++;
    renderBooks();
  });
  pagination.appendChild(nextBtn);

  function addPageSpan(page) {
    const span = document.createElement("span");
    span.textContent = page;
    span.className = "page-number";
    if (page === currentPage) span.classList.add("active");
    span.addEventListener("click", () => {
      currentPage = page;
      renderBooks();
    });
    pagination.appendChild(span);
  }

  function createEllipsis() {
    const ellipsis = document.createElement("span");
    ellipsis.textContent = "...";
    ellipsis.style.padding = "5px 10px";
    ellipsis.style.userSelect = "none";
    return ellipsis;
  }
}

// =========================
// BOOK ACTIONS (VIEW / ADD / REMOVE / EDIT / DELETE)
// =========================

// =========================
// DRAWER UTILS
// =========================

function openDrawer(title, content) {
  // Remove existing drawer if present
  const existing = document.querySelector(".drawer");
  if (existing) existing.remove();

  // Create drawer element
  const drawer = document.createElement("div");
  drawer.classList.add("drawer");

  drawer.innerHTML = `
    <div class="drawer-header">
      <span class="drawer-title">${title}</span>
      <div class="drawer-controls">
        <button class="minimize"><span></span></button>
        <button class="maximize">🗖</button>
        <button class="close">✖</button>
      </div>
    </div>

    <div class="drawer-content">${content}</div>
    <div class="drawer-resize"></div>
  `;

  document.body.appendChild(drawer);

  const contentBox = drawer.querySelector(".drawer-content");
  const minimizeBtn = drawer.querySelector(".minimize");
  const maximizeBtn = drawer.querySelector(".maximize");

  // ======================
  // CLOSE
  // ======================
  drawer.querySelector(".close").onclick = () => drawer.remove();

  // ======================
  // MAXIMIZE / RESTORE
  // ======================
  let maximized = false;
  let minimized = false;
  const original = {};

  maximizeBtn.onclick = () => {
    if (!maximized) {
      // Save original size & position
      original.width = drawer.style.width;
      original.height = drawer.style.height;
      original.top = drawer.style.top;
      original.left = drawer.style.left;

      drawer.style.top = "7.5vh";
      drawer.style.left = "7.5vw";
      drawer.style.width = "85vw";
      drawer.style.height = "85vh";
      contentBox.style.display = "block";

      maximized = true;
      minimized = false;
    } else {
      drawer.style.width = original.width;
      drawer.style.height = original.height;
      drawer.style.top = original.top;
      drawer.style.left = original.left;

      maximized = false;
    }
  };

  // ======================
  // MINIMIZE / RESTORE
  // ======================
  minimizeBtn.onclick = () => {
    if (!minimized) {
      // Collapse content only
      contentBox.style.display = "none";
      drawer.style.height = "45px";

      // Move drawer to bottom-right
      drawer.style.top = "unset";
      drawer.style.left = "unset";
      drawer.style.right = "20px";
      drawer.style.bottom = "20px";
      drawer.style.width = "400px";

      minimized = true;
      maximized = false;
    } else {
      // Restore content
      contentBox.style.display = "block";
      drawer.style.height = original.height || "450px";

      drawer.style.right = "unset";
      drawer.style.bottom = "unset";
      drawer.style.top = original.top || "calc(50vh - 225px)";
      drawer.style.left = original.left || "calc(50vw - 210px)";

      minimized = false;
    }
  };

  // ======================
  // DRAGGING
  // ======================
  const header = drawer.querySelector(".drawer-header");
  let dragging = false,
    offsetX = 0,
    offsetY = 0;

  header.addEventListener("mousedown", (e) => {
    if (e.target.closest("button")) return;
    if (minimized) return; // cannot drag when minimized

    dragging = true;
    offsetX = e.clientX - drawer.offsetLeft;
    offsetY = e.clientY - drawer.offsetTop;
    drawer.style.transition = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    drawer.style.left = `${e.clientX - offsetX}px`;
    drawer.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
    drawer.style.transition = "";
  });

  // ======================
  // RESIZING
  // ======================
  const resizer = drawer.querySelector(".drawer-resize");
  let resizing = false;

  resizer.addEventListener("mousedown", () => {
    if (minimized) return; // no resize when minimized
    resizing = true;
    document.body.style.cursor = "se-resize";
  });

  document.addEventListener("mousemove", (e) => {
    if (!resizing) return;
    const rect = drawer.getBoundingClientRect();
    drawer.style.width = e.clientX - rect.left + "px";
    drawer.style.height = e.clientY - rect.top + "px";
  });

  document.addEventListener("mouseup", () => {
    resizing = false;
    document.body.style.cursor = "";
  });
}

// =========================
// BOOK ACTIONS USING DRAWER
// =========================
document.addEventListener("click", (e) => {
  const id = e.target.getAttribute("data-id");
  if (!id) return;

  const book = books.find((b) => b.id == id);

  if (e.target.classList.contains("view")) {
    const received =
      book.receivedDates && book.receivedDates.length
        ? book.receivedDates.join(", ")
        : "-";

    const copies =
      book.copiesCode && book.copiesCode.length
        ? book.copiesCode.map((c) => `${c.code} (${c.status})`).join(", ")
        : "-";

    const content = `
    <p><strong>Title:</strong> ${book.title}</p>
    <p><strong>Author:</strong> ${book.author}</p>
    <p><strong>ISBN:</strong> ${book.isbn}</p>
    <p><strong>Status:</strong> ${book.status}</p>
    <p><strong>Copies:</strong> ${book.copies}</p>
    <p><strong>Category:</strong> ${book.category}</p>
    <p><strong>Grade:</strong> ${book.grade}</p>

    <p><strong>Received Dates:</strong> ${received}</p>
    <p><strong>Publication Date:</strong> ${book.publicationDate || "-"}</p>
    <p><strong>Times Rented:</strong> ${book.timesRented || 0}</p>

    <p><strong>Available Copies:</strong> ${
      book.availableCopies ?? book.copies
    }</p>
    <p><strong>Rented Copies:</strong> ${book.rentedCopies || 0}</p>
    <p><strong>Damaged Copies:</strong> ${book.damagedCopies || 0}</p>

    <p><strong>Copies Codes:</strong> ${copies}</p>
  `;

    openDrawer(`View Book`, content);
  }


  // ADD COPY
  if (e.target.classList.contains("add")) {
    const content = `
    <h4>${book.title}</h4>
      <label>Number of copies to add:</label>
      <input type="number" id="add-copies" value="1" min="1">
      <button id="add-copies-btn">Add Copies</button>
    `;
    openDrawer(`Add Copies`, content);

    document.getElementById("add-copies-btn").onclick = () => {
      const qty = parseInt(document.getElementById("add-copies").value);
      if (!isNaN(qty) && qty > 0) book.copies += qty;
      filteredBooks = books;
      renderBooks();
      closeDrawer();
    };
  }

  // REMOVE COPY
  if (e.target.classList.contains("remove")) {
    const content = `
    <h4>${book.title}</h4>
      <label>Number of copies to remove:</label>
      <input type="number" id="remove-copies" value="1" min="1">
      <button id="remove-copies-btn">Remove Copies</button>
    `;
    openDrawer(`Remove Copies`, content);

    document.getElementById("remove-copies-btn").onclick = () => {
      const qty = parseInt(document.getElementById("remove-copies").value);
      if (!isNaN(qty) && qty > 0) {
        if (book.copies - qty >= 0) book.copies -= qty;
        else alert("Cannot remove more copies than available!");
      }
      filteredBooks = books;
      renderBooks();
      closeDrawer();
    };
  }

  // EDIT BOOK
  if (e.target.classList.contains("edit")) {
    const content = `
    <h4>${book.title}</h4>
      <label>Title</label><input type="text" id="edit-title" value="${
        book.title
      }">
      <label>Author</label><input type="text" id="edit-author" value="${
        book.author
      }">
      <label>ISBN</label><input type="text" id="edit-isbn" value="${book.isbn}">
      <label>Category</label><input type="text" id="edit-category" value="${
        book.category
      }">
      <label>Status</label>
      <select id="edit-status">
        <option value="Available" ${
          book.status === "Available" ? "selected" : ""
        }>Available</option>
        <option value="Issued" ${
          book.status === "Issued" ? "selected" : ""
        }>Issued</option>
        <option value="Overdue" ${
          book.status === "Overdue" ? "selected" : ""
        }>Overdue</option>
      </select>
      <label>Grade</label><input type="text" id="edit-grade" value="${
        book.grade
      }">
      <button id="edit-save-btn">Save Changes</button>
    `;
    openDrawer(`Edit Book`, content);

    document.getElementById("edit-save-btn").onclick = () => {
      book.title = document.getElementById("edit-title").value;
      book.author = document.getElementById("edit-author").value;
      book.isbn = document.getElementById("edit-isbn").value;
      book.category = document.getElementById("edit-category").value;
      book.status = document.getElementById("edit-status").value;
      book.grade = document.getElementById("edit-grade").value;
      filteredBooks = books;
      renderBooks();
      closeDrawer();
    };
  }

  // DELETE BOOK
  if (e.target.classList.contains("delete")) {
    if (book.copies === 0) {
      const content = `
        <p>Are you sure you want to delete "${book.title}"?</p>
        <button id="confirm-delete-btn">Yes, Delete</button>
        <button id="cancel-delete-btn">Cancel</button>
      `;
      openDrawer(`Delete Book`, content);

      document.getElementById("confirm-delete-btn").onclick = () => {
        books = books.filter(b => b.id != id);
        filteredBooks = books;
        renderBooks();
        closeDrawer();
      };

      document.getElementById("cancel-delete-btn").onclick = closeDrawer;
    } else {
      openDrawer(
        "Cannot Delete Book",
        `<p>${book.title} cannot be deleted while copies are available!</p>`
      );
    }
  }
});

// =========================
// SORTING (Optional Buttons)
// =========================
function sortAZ() {
  filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
  currentPage = 1; // reset to first page
  renderBooks();
}

function sortZA() {
  filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
  currentPage = 1;
  renderBooks();
}

function sortAvailable() {
  filteredBooks.sort((a, b) => b.availableCopies - a.availableCopies);
  currentPage = 1;
  renderBooks();
}

// =========================
// EXPORT CSV
// =========================
document.querySelector(".export").addEventListener("click", exportCSV);
 
function exportCSV() {
  if (!books || books.length === 0) {
    alert("No data to export!");
    return;
  }

  let csvContent = "";

  // HEADERS
  csvContent +=
    "ID,Title,Author,ISBN,Status,Copies,AvailableCopies,RentedCopies,DamagedCopies,Category,Grade,TimesRented,PublicationDate,ReceivedDates,CopiesCode\n";

  books.forEach((book) => {
    const receivedDates = book.receivedDates.join("|");

    const copiesCode = book.copiesCode
      .map((c) => `${c.code}(${c.status})`)
      .join(" | ");

    csvContent +=
      [
        book.id,
        `"${book.title}"`,
        `"${book.author}"`,
        book.isbn,
        book.status,
        book.copies,
        book.availableCopies,
        book.rentedCopies,
        book.damagedCopies,
        `"${book.category}"`,
        book.grade,
        book.timesRented,
        book.publicationDate,
        `"${receivedDates}"`,
        `"${copiesCode}"`,
      ].join(",") + "\n";
  });

  // Create CSV blob
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create download link
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "books_full.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// =========================
// ADD NEW BOOK
// =========================
document.querySelector(".top-actions .add").addEventListener("click", () => {
  const content = `
    <label>Title</label><input type="text" id="new-title" placeholder="Book Title">
    <label>Author</label><input type="text" id="new-author" placeholder="Author Name">
    <label>ISBN</label><input type="text" id="new-isbn" placeholder="ISBN Number">
    <label>Category</label><input type="text" id="new-category" placeholder="Category">
    <label>Status</label>
    <select id="new-status">
      <option value="Available">Available</option>
      <option value="Issued">Issued</option>
      <option value="Overdue">Overdue</option>
    </select>
    <label>Grade</label><input type="text" id="new-grade" placeholder="Grade">
    <label>Number of Copies</label><input type="number" id="new-copies" value="1" min="1">
    <button id="add-book-btn">Add Book</button>
  `;

  openDrawer("Add New Book", content);

  document.getElementById("add-book-btn").onclick = () => {
    const newBook = {
      id: books.length ? Math.max(...books.map(b => b.id)) + 1 : 1,
      title: document.getElementById("new-title").value.trim(),
      author: document.getElementById("new-author").value.trim(),
      isbn: document.getElementById("new-isbn").value.trim(),
      category: document.getElementById("new-category").value.trim(),
      status: document.getElementById("new-status").value,
      grade: document.getElementById("new-grade").value.trim(),
      copies: parseInt(document.getElementById("new-copies").value) || 1,
      timesRented: 0,
      availableCopies: parseInt(document.getElementById("new-copies").value) || 1,
      rentedCopies: 0,
      damagedCopies: 0,
      copiesCodes: []
    };

    books.push(newBook);
    filteredBooks = books;
    renderBooks();
    closeDrawer();
  };
});