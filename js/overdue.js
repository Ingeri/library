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
  let dragging = false, offsetX = 0, offsetY = 0;

  header.addEventListener("mousedown", e => {
    if (e.target.closest("button")) return;
    if (minimized) return;

    dragging = true;
    offsetX = e.clientX - drawer.offsetLeft;
    offsetY = e.clientY - drawer.offsetTop;
    drawer.style.transition = "none";
  });

  document.addEventListener("mousemove", e => {
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

  document.addEventListener("mousemove", e => {
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
// Load JSON & Render Cards
// ======================
let overdueData = [];
let currentPage = 1;
const pageSize = 3;

function renderOverdue() {
  const container = document.querySelector(".overdue-grid");
  container.innerHTML = "";

  const start = (currentPage - 1) * pageSize;
  const pageData = overdueData.slice(start, start + pageSize);

  pageData.forEach((res, index) => {
    const card = document.createElement("div");
    card.classList.add("overdue-card");
    card.innerHTML = `
      <h3>${res.name}</h3>
      <p><strong>Email:</strong> ${res.email}</p>
      <p><strong>Book:</strong> ${res.book}</p>
      <p><strong>Due Date:</strong> ${res.dueDate}</p>
      <p><strong>Days Late:</strong> ${res.daysLate}</p>
      <p class="fine">Fine: $${res.fine.toFixed(2)}</p>
      <p class="status">Status: ${res.status}</p>
      <div class="actions">
          <i class="fas fa-eye view" data-index="${start+index}" title="View"></i>
          <i class="fas fa-message message" data-index="${start+index}" title="Message"></i>
          <i class="fas fa-check-circle mark" data-index="${start+index}" title="Mark as Paid"></i>
      </div>
    `;
    container.appendChild(card);
  });

  attachCardActions();
  renderPagination();
}

// ======================
// Pagination
// ======================
function renderPagination() {
  const totalPages = Math.ceil(overdueData.length / pageSize);
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = `
    <button ${
      currentPage === 1 ? "disabled" : ""
    } onclick="prevPage()">⬅</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button ${
      currentPage === totalPages ? "disabled" : ""
    } onclick="nextPage()">➡</button>
  `;
}

function prevPage() { if(currentPage>1){ currentPage--; renderOverdue(); } }
function nextPage() { if(currentPage < Math.ceil(overdueData.length / pageSize)){ currentPage++; renderOverdue(); } }

// ======================
// Sorting
// ======================
function sortAZ() { overdueData.sort((a,b)=> a.name.localeCompare(b.name)); renderOverdue(); }
function sortZA() { overdueData.sort((a,b)=> b.name.localeCompare(a.name)); renderOverdue(); }
function sortAvailable() { overdueData.sort((a,b)=> a.status.localeCompare(b.status)); renderOverdue(); }

// ======================
// Attach Actions
// ======================
function attachCardActions() {

  // --------------------
  // VIEW ACTION
  // --------------------
  document.querySelectorAll(".overdue-card .view").forEach(btn => {
    btn.onclick = () => {
      const res = overdueData[btn.dataset.index];
      openDrawer("View Overdue", `
        <p><strong>Name:</strong> ${res.name}</p>
        <p><strong>Email:</strong> ${res.email}</p>
        <p><strong>Book:</strong> ${res.book}</p>
        <p><strong>Due Date:</strong> ${res.dueDate}</p>
        <p><strong>Days Late:</strong> ${res.daysLate}</p>
        <p><strong>Fine:</strong> $${res.fine.toFixed(2)}</p>
        <p><strong>Status:</strong> ${res.status}</p>
      `);
    };
  });

  // --------------------
  // MESSAGE ACTION
  // --------------------
  document.querySelectorAll(".overdue-card .message").forEach(btn => {
    btn.onclick = () => {
      const res = overdueData[btn.dataset.index];
      openDrawer("Send Message", `
        <form id="messageForm">
          <p>Send message to <strong>${res.name}</strong> (${res.email})</p>
          <textarea name="message" rows="5" placeholder="Type your message here..." required></textarea><br>
          <button type="submit">Send</button>
        </form>
      `);

      document.getElementById("messageForm").onsubmit = e => {
        e.preventDefault();
        const message = e.target.message.value.trim();
        if(message) {
          alert(`\nMessage sent to ${res.email}:\n\n${message}\n`);
          e.target.reset();
        }
      };
    };
  });

  // --------------------
  // MARK AS PAID ACTION
  // --------------------
  document.querySelectorAll(".overdue-card .mark").forEach(btn => {
    btn.onclick = () => {
      const res = overdueData[btn.dataset.index];
      openDrawer("Mark Fine as Paid", `
        <form id="markPaidForm">
          <p>Mark the fine for <strong>${res.name}</strong> (${res.email}) as Paid.</p>
          <p>Current Status: <strong>${res.status}</strong></p>
          <button type="submit">Confirm</button>
        </form>
      `);

      document.getElementById("markPaidForm").onsubmit = e => {
        e.preventDefault();
        res.status = "Paid";
        alert(`\nFine for ${res.name} marked as Paid.\n`);
        renderOverdue();
      };
    };
  });

  // --------------------
  // ADD FINE ACTION (MISSING BEFORE)
  // --------------------
  document.querySelector(".add").onclick = () => {
    openDrawer("Add Fine", `
      <form id="addFineForm">
        <label>Name: <input type="text" name="name" required></label><br>
        <label>Email: <input type="email" name="email" required></label><br>
        <label>Book: <input type="text" name="book" required></label><br>
        <label>Due Date: <input type="date" name="dueDate" required></label><br>
        <label>Days Late: <input type="number" name="daysLate" required></label><br>
        <label>Fine: <input type="number" name="fine" step="0.01" required></label><br>
        <label>Status:
          <select name="status">
            <option value="Overdue">Overdue</option>
            <option value="Paid">Paid</option>
          </select>
        </label><br>
        <button type="submit">Add Fine</button>
      </form>
    `);

    document.getElementById("addFineForm").onsubmit = e => {
      e.preventDefault();
      const form = e.target;

      const newFine = {
        name: form.name.value,
        email: form.email.value,
        book: form.book.value,
        dueDate: form.dueDate.value,
        daysLate: Number(form.daysLate.value),
        fine: Number(form.fine.value),
        status: form.status.value
      };

      overdueData.push(newFine);
      renderOverdue();
      form.reset();
    };
  };

  // --------------------
  // EXPORT CSV (MISSING BEFORE)
  // --------------------
  document.querySelector(".export").onclick = () => {
    if (!overdueData.length) return alert("No data to export.");

    const headers = Object.keys(overdueData[0]);
    const rows = [
      headers.join(","),
      ...overdueData.map(res => headers.map(h => `"${res[h]}"`).join(","))
    ];

    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "overdue_fines.csv";
    a.click();

    URL.revokeObjectURL(url);
  };
}



// ======================
// Load JSON
// ======================
document.addEventListener("DOMContentLoaded", () => {
  fetch("../data/overdue.json")
    .then(res => res.json())
    .then(data => {
      overdueData = data;
      renderOverdue();
    })
    .catch(err => console.error("Failed to load overdue.json:", err));
});

// ======================
// Load Stats from JSON
// ======================
function loadStats() {
  fetch("../data/overduestats.json")
    .then(res => res.json())
    .then(stats => updateStats(stats))
    .catch(err => console.error("Failed to load stats:", err));
}

function updateStats(stats) {
  const statCards = document.querySelectorAll(".stats-grid .stat-card");

  if(statCards.length >= 3) {
    // Total Overdue
    statCards[0].querySelector("h3").textContent = stats.totalOverdue || 0;

    // Total Fines Pending
    statCards[1].querySelector("h3").textContent = `$${stats.totalFines?.toFixed(2) || 0}`;

    // Members Notified
    statCards[2].querySelector("h3").textContent = stats.membersNotified || 0;
  }
}

// Load stats on page load
document.addEventListener("DOMContentLoaded", () => {
  loadStats();
});
