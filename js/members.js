//JavaScript for Loading & Rendering Members
let members = [];
let filteredMembers = [];

// Fetch members and stats
fetch("../data/members.json")
  .then((res) => res.json())
  .then((data) => {
    members = data;
    filteredMembers = members;
    renderMembersWithPagination();
  })
  .catch((err) => console.error("Error loading members.json", err));

fetch("../data/membersstats.json")
  .then((res) => res.json())
  .then((stats) => {
    document.querySelector(".stat-card .number").textContent =
      stats.totalMembers;
    document.querySelector(".stat-card.new .number").textContent =
      stats.newMembers;
    document.querySelector(".stat-card.active .number").textContent =
      stats.activeMembers;
  });

// View member drawer
function viewMember(id) {
  const member = members.find((m) => m.id === id);
  if (!member) return;

  const content = `
    <p><strong>Name:</strong> ${member.name}</p>
    <p><strong>Email:</strong> ${member.email}</p>
    <p><strong>Status:</strong> ${member.status}</p>
    <p><strong>Borrowed:</strong> ${member.borrowed}</p>
    <p><strong>Returned:</strong> ${member.returned}</p>
    <p><strong>Unreturned:</strong> ${member.borrowed - member.returned}</p>
    <p><strong>Grade:</strong> ${member.grade}</p>
    <p><strong>Role:</strong> ${member.role}</p>
    <p><strong>Tel:</strong> ${member.tel}</p>
    <p><strong>Fine:</strong> ${member.fine}</p>
  `;
  openDrawer(`Member Details`, content);
}

// Edit member drawer
function editMember(id) {
  const member = members.find((m) => m.id === id);
  if (!member) return;

  const content = `
    <label>Name: <input type="text" id="editName" value="${
      member.name
    }"></label>
    <label>Email: <input type="email" id="editEmail" value="${
      member.email
    }"></label>
    <label>Status: 
      <select id="editStatus">
        <option ${member.status === "Active" ? "selected" : ""}>Active</option>
        <option ${
          member.status === "Blocked" ? "selected" : ""
        }>Blocked</option>
        <option ${
          member.status === "Pending" ? "selected" : ""
        }>Pending</option>
      </select>
    </label>
    <label>Grade: <input type="text" id="editGrade" value="${
      member.grade
    }"></label>
    <label>Role: <input type="text" id="editRole" value="${
      member.role
    }"></label>
    <label>Tel: <input type="text" id="editTel" value="${member.tel}"></label>
    <label>Fine: <input type="number" id="editFine" value="${
      member.fine
    }"></label>
    <button onclick="saveMember(${member.id})">Save</button>
  `;
  openDrawer(`Edit Member`, content);
}

function saveMember(id) {
  const member = members.find((m) => m.id === id);
  member.name = document.getElementById("editName").value;
  member.email = document.getElementById("editEmail").value;
  member.status = document.getElementById("editStatus").value;
  member.grade = document.getElementById("editGrade").value;
  member.role = document.getElementById("editRole").value;
  member.tel = document.getElementById("editTel").value;
  member.fine = parseFloat(document.getElementById("editFine").value);
  renderMembersWithPagination();
  closeDrawer();
}

// Block member drawer
function blockMember(id) {
  const member = members.find((m) => m.id === id);
  if (!member) return;
  member.status = "Blocked";
  renderMembersWithPagination();
}

//Add new member drawer
document.querySelector(".add").addEventListener("click", () => {
  const content = `
    <label>Name: <input type="text" id="newName"></label>
    <label>Email: <input type="email" id="newEmail"></label>
    <label>Status: 
      <select id="newStatus">
        <option>Active</option>
        <option>Blocked</option>
        <option>Pending</option>
      </select>
    </label>
    <label>Grade: <input type="text" id="newGrade"></label>
    <label>Role: <input type="text" id="newRole"></label>
    <label>Tel: <input type="text" id="newTel"></label>
    <label>Fine: <input type="number" id="newFine"></label>
    <button onclick="saveNewMember()">Add Member</button>
  `;
  openDrawer("Add New Member", content);
});

function saveNewMember() {
  const newMember = {
    id: members.length + 1,
    name: document.getElementById("newName").value,
    email: document.getElementById("newEmail").value,
    status: document.getElementById("newStatus").value,
    borrowed: 0,
    returned: 0,
    grade: document.getElementById("newGrade").value,
    role: document.getElementById("newRole").value,
    tel: document.getElementById("newTel").value,
    fine: parseFloat(document.getElementById("newFine").value),
  };
  members.push(newMember);
  closeDrawer();
}

//export CSV functionality
document.querySelector(".export").addEventListener("click", () => {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent +=
    "Name,Email,Status,Borrowed,Returned,Unreturned,Grade,Role,Tel,Fine\n";
  members.forEach((m) => {
    csvContent += `${m.name},${m.email},${m.status},${m.borrowed},${
      m.returned
    },${m.borrowed - m.returned},${m.grade},${m.role},${m.tel},${m.fine}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "members.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Drawer functions
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

//05/december/2025
// ==========================
// SEARCH
// ==========================
document
  .querySelector(".search-bar input")
  .addEventListener("input", function () {
    const query = this.value.toLowerCase();
    filteredMembers = members.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.status.toLowerCase().includes(query)
    );
    currentPage = 1;
    renderMembersWithPagination();
  });

// ==========================
// PAGINATION VARIABLES
// ==========================
// let currentPage = 1;
// const itemsPerPage = 3;

// // ==========================
// // RENDER MEMBERS WITH PAGINATION
// // ==========================
// function renderMembersWithPagination() {
//   const grid = document.querySelector(".member-grid");
//   grid.innerHTML = "";

//   const start = (currentPage - 1) * itemsPerPage;
//   const end = start + itemsPerPage;
//   const pageMembers = filteredMembers.slice(start, end);

//   pageMembers.forEach((member) => {
//     const card = document.createElement("div");
//     card.className = "member-card";
//     card.innerHTML = `
//       <div class="member-info">
//         <div class="member-name">${member.name}</div>
//         <div class="member-email">${member.email}</div>
//         <span class="status ${member.status.toLowerCase()}">${
//       member.status
//     }</span>
//       </div>
//       <div class="stats">
//         <div>Borrowed: <strong>${member.borrowed}</strong></div>
//         <div>Returned: <strong>${member.returned}</strong></div>
//       </div>
//       <div class="actions">
//         <i class="fas fa-eye view" onclick="viewMember(${
//           member.id
//         })" title="View Member"></i>
//         <i class="fas fa-pen edit" onclick="editMember(${
//           member.id
//         })" title="Edit Member"></i>
//         <i class="fas fa-ban block" onclick="blockMember(${
//           member.id
//         })" title="Block Member"></i>
//       </div>
//     `;
//     grid.appendChild(card);
//   });

//   renderPaginationControls();
// }

// // ==========================
// // PAGINATION CONTROLS
// // ==========================
// function renderPaginationControls() {
//   const pageInfo = document.getElementById("pageInfo");
//   if (!pageInfo) return; // make sure your HTML has <span id="pageInfo"></span>

//   const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
//   let pagesHtml = "";

//   let startPage = Math.max(1, currentPage - 2);
//   let endPage = Math.min(totalPages, startPage + 4);
//   if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

//   if (startPage > 1)
//     pagesHtml += `<span class="page-number" onclick="goToPage(1)">1</span>...`;

//   for (let i = startPage; i <= endPage; i++) {
//     pagesHtml += `<span class="page-number ${
//       i === currentPage ? "active" : ""
//     }" onclick="goToPage(${i})">${i}</span>`;
//   }

//   if (endPage < totalPages)
//     pagesHtml += `...<span class="page-number" onclick="goToPage(${totalPages})">${totalPages}</span>`;

//   pageInfo.innerHTML = pagesHtml;

//   document.getElementById("prevBtn").disabled = currentPage === 1;
//   document.getElementById("nextBtn").disabled = currentPage === totalPages;
// }

// // ==========================
// // GO TO PAGE
// // ==========================
// function goToPage(page) {
//   currentPage = page;
//   renderMembersWithPagination();
// }

// // ==========================
// // NEXT / PREVIOUS BUTTONS
// // ==========================
// document.getElementById("prevBtn").addEventListener("click", () => {
//   if (currentPage > 1) {
//     currentPage--;
//     renderMembersWithPagination();
//   }
// });

// document.getElementById("nextBtn").addEventListener("click", () => {
//   const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
//   if (currentPage < totalPages) {
//     currentPage++;
//     renderMembersWithPagination();
//   }
// });

let currentPage = 1;
const itemsPerPage = 3;

// ==========================
// RENDER MEMBERS WITH PAGINATION
// ==========================
function renderMembersWithPagination() {
  const grid = document.querySelector(".member-grid");
  grid.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageMembers = filteredMembers.slice(start, end);

  pageMembers.forEach((member) => {
    const card = document.createElement("div");
    card.className = "member-card";
    card.innerHTML = `
      <div class="member-info">
        <div class="member-name">${member.name}</div>
        <div class="member-email">${member.email}</div>
        <span class="status ${member.status.toLowerCase()}">${
      member.status
    }</span>
      </div>
      <div class="stats">
        <div>Borrowed: <strong>${member.borrowed}</strong></div>
        <div>Returned: <strong>${member.returned}</strong></div>
      </div>
      <div class="actions">
        <i class="fas fa-eye view" onclick="viewMember(${
          member.id
        })" title="View Member"></i>
        <i class="fas fa-pen edit" onclick="editMember(${
          member.id
        })" title="Edit Member"></i>
        <i class="fas fa-ban block" onclick="blockMember(${
          member.id
        })" title="Block Member"></i>
      </div>
    `;
    grid.appendChild(card);
  });

  renderPaginationControls();
}

// ==========================
// PAGINATION CONTROLS DYNAMICALLY
// ==========================
function renderPaginationControls() {
  // Remove existing pagination if any
  const existing = document.querySelector(".pagination");
  if (existing) existing.remove();

  const container = document.createElement("div");
  container.className = "pagination";
  container.style.display = "flex";
  container.style.gap = "5px";
  container.style.justifyContent = "center";
  container.style.marginTop = "20px";

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  // Previous button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "⬅";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderMembersWithPagination();
    }
  });
  container.appendChild(prevBtn);

  // Page numbers
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

  if (startPage > 1) {
    const firstPage = document.createElement("span");
    firstPage.textContent = "1";
    firstPage.className = "page-number";
    firstPage.style.cursor = "pointer";
    firstPage.onclick = () => goToPage(1);
    container.appendChild(firstPage);

    const dots = document.createElement("span");
    dots.textContent = "...";
    container.appendChild(dots);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageSpan = document.createElement("span");
    pageSpan.textContent = i;
    pageSpan.className = "page-number";
    pageSpan.style.cursor = "pointer";
    pageSpan.style.padding = "5px 10px";
    pageSpan.style.borderRadius = "5px";
    pageSpan.style.border =
      i === currentPage ? "1px solid #333" : "1px solid transparent";
    pageSpan.style.backgroundColor = i === currentPage ? "#333" : "";
    pageSpan.style.color = i === currentPage ? "#fff" : "";
    pageSpan.onclick = () => goToPage(i);
    container.appendChild(pageSpan);
  }

  if (endPage < totalPages) {
    const dots = document.createElement("span");
    dots.textContent = "...";
    container.appendChild(dots);

    const lastPage = document.createElement("span");
    lastPage.textContent = totalPages;
    lastPage.className = "page-number";
    lastPage.style.cursor = "pointer";
    lastPage.onclick = () => goToPage(totalPages);
    container.appendChild(lastPage);
  }

  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "➡";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderMembersWithPagination();
    }
  });
  container.appendChild(nextBtn);

  // Append to the main container
  document.querySelector(".container").appendChild(container);
}

// ==========================
// GO TO PAGE
// ==========================
function goToPage(page) {
  currentPage = page;
  renderMembersWithPagination();
}


// ==========================
// SORTING FUNCTIONS
// ==========================
function sortAZ() {
  filteredMembers.sort((a, b) => a.name.localeCompare(b.name));
  renderMembersWithPagination();
}

function sortZA() {
  filteredMembers.sort((a, b) => b.name.localeCompare(a.name));
  renderMembersWithPagination();
}

function sortBorrowed() {
  filteredMembers.sort((a, b) => b.borrowed - a.borrowed);
  renderMembersWithPagination();
}
