// ===== Monthly Borrowing Trends =====
new Chart(document.getElementById("trendChart"), {
  type: "line",
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Borrowed Books",
        data: [120, 150, 180, 200, 240, 260, 300, 280, 310, 330, 350, 400],
        borderColor: "#4e73df",
        backgroundColor: "rgba(78,115,223,0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
      },
      {
        label: "Returned Books",
        data: [100, 130, 160, 180, 200, 230, 260, 250, 270, 290, 310, 360],
        borderColor: "#1cc88a",
        backgroundColor: "rgba(28,200,138,0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
      },
    ],
  },
  options: { responsive: true, plugins: { legend: { position: "top" } } },
});

// ===== Borrow vs Return Summary =====
const chartData = [1240, 1080];

const borrowReturnChart = new Chart(
  document.getElementById("borrowReturnChart"),
  {
    type: "bar",
    data: {
      labels: ["Borrowed", "Returned"],
      datasets: [
        {
          label: "Books Count",
          data: [...chartData],
          backgroundColor: ["#4e73df", "#1cc88a"],
          borderRadius: 12,
          maxBarThickness: 80,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            generateLabels: function (chart) {
              const data = chart.data.datasets[0];
              return chart.data.labels.map((label, i) => ({
                text: label,
                fillStyle: data.backgroundColor[i],
                strokeStyle: data.backgroundColor[i],
                hidden: data.data[i] === 0, // detect if bar is hidden
                index: i,
                font: {
                  decoration: data.data[i] === 0 ? "line-through" : "normal",
                }, // strike-through
              }));
            },
          },
          onClick: function (e, legendItem, legend) {
            const index = legendItem.index;
            const ci = legend.chart;
            // Toggle value between 0 and original
            ci.data.datasets[0].data[index] =
              ci.data.datasets[0].data[index] === 0 ? chartData[index] : 0;
            ci.update();
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.label + ": " + context.raw + " books";
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 200 },
          grid: { color: "#e0e0e0" },
        },
        x: { grid: { display: false } },
      },
    },
  }
);


// ===== Top Borrowed Books =====
new Chart(document.getElementById("topBooksChart"), {
  type: "pie",
  data: {
    labels: [
      "Python Basics",
      "HTML & CSS",
      "Digital Marketing",
      "Networking Essentials",
      "AI for Beginners",
    ],
    datasets: [
      {
        data: [150, 120, 100, 90, 80],
        backgroundColor: [
          "#4e73df",
          "#36b9cc",
          "#1cc88a",
          "#f6c23e",
          "#e74a3b",
        ],
      },
    ],
  },
  options: { responsive: true },
});

// ===== Genre Popularity =====
new Chart(document.getElementById("genreChart"), {
  type: "bar",
  data: {
    labels: ["Technology", "Fiction", "Business", "Science", "History", "Kids"],
    datasets: [
      {
        label: "Books Borrowed",
        data: [320, 210, 180, 260, 150, 90],
        backgroundColor: "#36b9cc",
        borderRadius: 10,
      },
    ],
  },
  options: { responsive: true },
});

// ===== Fine Status =====
new Chart(document.getElementById("fineStatusChart"), {
  type: "doughnut",
  data: {
    labels: ["Collected", "Pending"],
    datasets: [
      {
        data: [1120, 380],
        backgroundColor: ["#1cc88a", "#e74a3b"],
      },
    ],
  },
  options: { responsive: true },
});

// ===== Fine Breakdown =====
new Chart(document.getElementById("fineBreakdownChart"), {
  type: "bar",
  data: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Fine Payments",
        data: [200, 300, 250, 370],
        backgroundColor: "#f6c23e",
        borderRadius: 10,
      },
    ],
  },
  options: { responsive: true },
});