// LOAD DASHBOARD JSON
// ==============================

fetch("../data/dashboard.json")
  .then(res => res.json())
  .then(data => {
    loadStats(data.stats);
    loadIssueChart(data.issueChart);
    loadMemberChart(data.memberChart);
    loadRecentActivity(data.recentActivity);
  })
  .catch(err => console.error("Error loading JSON:", err));


// ==============================
// LOAD STAT CARDS
// ==============================
function loadStats(stats) {
  document.querySelector('[data-stat="totalBooks"] h3').textContent = stats.totalBooks.count;
  document.querySelector('[data-stat="totalBooks"] .meta').textContent = stats.totalBooks.meta;

  document.querySelector('[data-stat="members"] h3').textContent = stats.members.count;
  document.querySelector('[data-stat="members"] .meta').textContent = stats.members.meta;

  document.querySelector('[data-stat="issuedToday"] h3').textContent = stats.issuedToday.count;
  document.querySelector('[data-stat="issuedToday"] .meta').textContent = stats.issuedToday.meta;

  document.querySelector('[data-stat="returnedToday"] h3').textContent = stats.returnedToday.count;
  document.querySelector('[data-stat="returnedToday"] .meta').textContent = stats.returnedToday.meta;
}


// ==============================
// ISSUE vs RETURN CHART
// ==============================
function loadIssueChart(chartData) {
  new Chart(document.getElementById("issueChart"), {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Issued",
          data: chartData.issued,
          borderColor: "#4e73df",
          borderWidth: 2,
          tension: 0.4
        },
        {
          label: "Returned",
          data: chartData.returned,
          borderColor: "#1cc88a",
          borderWidth: 2,
          tension: 0.4
        }
      ]
    }
  });
}


// ==============================
// MEMBER CHART
// ==============================
function loadMemberChart(chartData) {
  new Chart(document.getElementById("memberChart"), {
    type: "bar",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "New Members",
          data: chartData.newMembers,
          backgroundColor: "#36b9cc"
        },
        {
          label: "Active Borrowers",
          data: chartData.activeBorrowers,
          backgroundColor: "#f6c23e"
        }
      ]
    }
  });
}


// ==============================
// RECENT ACTIVITY LIST
// ==============================
function loadRecentActivity(list) {
  const container = document.querySelector(".recent-activity");

  // Remove static sample cards
  container.querySelectorAll(".activity-card").forEach(card => card.remove());

  list.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("activity-card");

    card.innerHTML = `
      <div class="left">
        <i class="${item.icon}"></i>
        <div>
          <h4>${item.title}</h4>
          <p>${item.subtitle}</p>
        </div>
      </div>
      <span class="time">${item.time}</span>
    `;

    container.appendChild(card);
  });
}
