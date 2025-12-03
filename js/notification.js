// Sample notification data
let notifications = [
  {
    type: "unread",
    icon: "book-open",
    title: "New Borrow Request",
    msg: "A student wants to borrow 'Python Basics'.",
    time: "2 min ago",
  },
  {
    type: "important",
    icon: "clock-rotate-left",
    title: "Book Overdue",
    msg: "'Data Structures in C' is overdue.",
    time: "1 hour ago",
  },
  {
    type: "system",
    icon: "gear",
    title: "System Update",
    msg: "LMS maintenance tonight at 10PM.",
    time: "Today",
  },
  {
    type: "unread",
    icon: "envelope-open",
    title: "New Message",
    msg: "A user sent you a message.",
    time: "3 hours ago",
  },
  {
    type: "important",
    icon: "triangle-exclamation",
    title: "Low Stock",
    msg: "'JS Essentials' has 2 copies left.",
    time: "Yesterday",
  },
  {
    type: "read",
    icon: "check-circle",
    title: "Book Returned",
    msg: "'Modern Web Development' returned.",
    time: "2 days ago",
  },
  {
    type: "system",
    icon: "info-circle",
    title: "Policy Update",
    msg: "New renting rules are now active.",
    time: "3 days ago",
  },
];

let shown = 3; // number displayed initially

function renderNotifications(filter = "all") {
  const list = document.getElementById("notificationList");
  list.innerHTML = "";

  let filtered = notifications.filter(
    (n) =>
      filter === "all" ||
      n.type === filter ||
      (filter === "unread" && n.type === "unread")
  );

  filtered.slice(0, shown).forEach((n) => {
    list.innerHTML += `
            <div class="notification-card ${n.type}">
                <i class="fa-solid fa-${n.icon} icon"></i>
                <div class="details">
                    <div class="title">${n.title}</div>
                    <div class="message">${n.msg}</div>
                    <div class="time">${n.time}</div>
                </div>
                <div class="badge ${n.type}">${n.type.toUpperCase()}</div>
            </div>
            `;
  });

  updateStats();
}

function updateStats() {
  document.getElementById("totalCount").innerText = notifications.length;
  document.getElementById("unreadCount").innerText = notifications.filter(
    (n) => n.type === "unread"
  ).length;
  document.getElementById("readCount").innerText = notifications.filter(
    (n) => n.type === "read"
  ).length;
}

document.getElementById("filter").addEventListener("change", (e) => {
  renderNotifications(e.target.value);
});

document.getElementById("loadMoreBtn").addEventListener("click", () => {
  shown += 3;
  renderNotifications(document.getElementById("filter").value);
});

document.getElementById("markAllBtn").addEventListener("click", () => {
  notifications = notifications.map((n) => ({ ...n, type: "read" }));
  renderNotifications("all");
});

// Initial render
renderNotifications();
