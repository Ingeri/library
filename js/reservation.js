let reservations = []; // All reservations
let currentPage = 1;
const perPage = 3;

// ======================
// Drawer Function
// ======================
function openDrawer(title, content) {
  const existing = document.querySelector(".drawer");
  if (existing) existing.remove();

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

  // CLOSE
  drawer.querySelector(".close").onclick = () => drawer.remove();

  // MAXIMIZE / RESTORE
  let maximized = false;
  let minimized = false;
  const original = {};

  maximizeBtn.onclick = () => {
    if (!maximized) {
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

  // MINIMIZE / RESTORE
  minimizeBtn.onclick = () => {
    if (!minimized) {
      contentBox.style.display = "none";
      drawer.style.height = "45px";
      drawer.style.top = "unset";
      drawer.style.left = "unset";
      drawer.style.right = "20px";
      drawer.style.bottom = "20px";
      drawer.style.width = "400px";

      minimized = true;
      maximized = false;
    } else {
      contentBox.style.display = "block";
      drawer.style.height = original.height || "450px";
      drawer.style.right = "unset";
      drawer.style.bottom = "unset";
      drawer.style.top = original.top || "calc(50vh - 225px)";
      drawer.style.left = original.left || "calc(50vw - 210px)";

      minimized = false;
    }
  };

  // DRAGGING
  const header = drawer.querySelector(".drawer-header");
  let dragging = false,
    offsetX = 0,
    offsetY = 0;
  header.addEventListener("mousedown", (e) => {
    if (e.target.closest("button")) return;
    if (minimized) return;

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

  // RESIZING
  const resizer = drawer.querySelector(".drawer-resize");
  let resizing = false;
  resizer.addEventListener("mousedown", () => {
    if (minimized) return;
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

// ======================
// RENDER RESERVATIONS
// ======================
function renderReservations() {
  const container = document.querySelector(".reservation-grid");
  container.innerHTML = "";

  const start = (currentPage - 1) * perPage;
  const pageData = reservations.slice(start, start + perPage);

  pageData.forEach((res, index) => {
    const card = document.createElement("div");
    card.classList.add("reservation-card");
    card.innerHTML = `
      <div class="reservation-info">
        <h3>${res.name}</h3>
        <p><strong>Book:</strong> ${res.book}</p>
        <p><strong>ISBN:</strong> ${res.isbn}</p>
        <p><strong>Status:</strong> ${res.status}</p>
        <p><strong>Request Date:</strong> ${res.requestDate}</p>
      </div>
      <div class="reservation-actions">
        <i class="fas fa-eye view" data-index="${
          start + index
        }" title="View Reservation"></i>
        <i class="fas fa-envelope notify" data-index="${
          start + index
        }" title="Notify Member"></i>
        <i class="fas fa-check available" data-index="${
          start + index
        }" title="Mark as Available"></i>
        <i class="fas fa-trash delete" data-index="${
          start + index
        }" title="Delete Reservation"></i>
      </div>
    `;
    container.appendChild(card);
  });

  attachActionListeners();
  renderPagination();
}

// ======================
// ATTACH ACTION LISTENERS
// ======================
function attachActionListeners() {
  document.querySelectorAll(".reservation-actions i").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      const res = reservations[index];
      openDrawer(
        btn.title,
        `
        <p><strong>Name:</strong> ${res.name}</p>
        <p><strong>Book:</strong> ${res.book}</p>
        <p><strong>ISBN:</strong> ${res.isbn}</p>
        <p><strong>Status:</strong> ${res.status}</p>
        <p><strong>Request Date:</strong> ${res.requestDate}</p>
      `
      );
    });
  });
}

// ======================
// ADD RESERVATION (OPEN DRAWER FORM)
// ======================
document.querySelector(".add").addEventListener("click", () => {
  openDrawer(
    "Add Reservation",
    `
    <form id="addReservationForm">
      <label>Name:<input type="text" name="name" required></label><br>
      <label>Book:<input type="text" name="book" required></label><br>
      <label>ISBN:<input type="text" name="isbn" required></label><br>
      <label>Status:
        <select name="status">
          <option value="Reserved">Reserved</option>
          <option value="Available">Available</option>
        </select>
      </label><br>
      <label>Request Date:<input type="date" name="requestDate" required></label><br>
      <button type="submit">Add Reservation</button>
    </form>
  `
  );

  const form = document.getElementById("addReservationForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const newRes = Object.fromEntries(formData.entries());
    reservations.push(newRes);
    renderReservations();
    document.querySelector(".drawer .close").click();
  });
});

// ======================
// PAGINATION
// ======================
function renderPagination() {
  const container = document.querySelector(".pagination");
  container.innerHTML = "";
  const totalPages = Math.ceil(reservations.length / perPage);

  if (currentPage > 1) {
    const prev = document.createElement("button");
    prev.textContent = "⬅";
    prev.addEventListener("click", () => {
      currentPage--;
      renderReservations();
    });
    container.appendChild(prev);
  }

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      renderReservations();
    });
    container.appendChild(btn);
  }

  if (currentPage < totalPages) {
    const next = document.createElement("button");
    next.textContent = "➡";
    next.addEventListener("click", () => {
      currentPage++;
      renderReservations();
    });
    container.appendChild(next);
  }
}

// ======================
// SORTING FUNCTIONS
// ======================
function sortAZ() {
  reservations.sort((a, b) => a.name.localeCompare(b.name));
  renderReservations();
}

function sortZA() {
  reservations.sort((a, b) => b.name.localeCompare(a.name));
  renderReservations();
}

function sortAvailable() {
  reservations.sort((a, b) => {
    if (a.status === "Available" && b.status !== "Available") return -1;
    if (a.status !== "Available" && b.status === "Available") return 1;
    return 0;
  });
  renderReservations();
}

// ======================
// LOAD DATA AND STATS
// ======================
document.addEventListener("DOMContentLoaded", () => {
  fetch("../data/reservations.json")
    .then((res) => res.json())
    .then((data) => {
      reservations = data;
      renderReservations();
    });

  fetch("../data/reservationstats.json")
    .then((res) => res.json())
    .then((stats) => updateStats(stats));
});

// ======================
// UPDATE STATS
// ======================
function updateStats(stats) {
  document.querySelector(".total-reservations .stat-number").textContent =
    stats.total || 0;
  document.querySelector(".ready-pickup .stat-number").textContent =
    stats.ready || 0;
  document.querySelector(".pending-reservations .stat-number").textContent =
    stats.pending || 0;
}

// ======================
// EXPORT JSON TO CSV
// ======================
document.querySelector(".export").addEventListener("click", () => {
  if (!reservations.length) return alert("No reservations to export.");

  const headers = Object.keys(reservations[0]);
  const csvRows = [
    headers.join(","), // header row
    ...reservations.map(res => 
      headers.map(h => `"${res[h]}"`).join(",") // wrap values in quotes
    )
  ];

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "reservations.csv");
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
