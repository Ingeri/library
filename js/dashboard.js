// ===== ISSUE CHART =====
new Chart(document.getElementById("issueChart"), {
  type: "line",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Issued",
        data: [20, 30, 25, 40, 35, 28, 32],
        borderColor: "#4e73df",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "Returned",
        data: [10, 20, 15, 25, 22, 18, 20],
        borderColor: "#1cc88a",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  },
});

// ===== MEMBER CHART =====
new Chart(document.getElementById("memberChart"), {
  type: "bar",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Members",
        data: [15, 20, 25, 22, 30, 28],
        backgroundColor: "#36b9cc",
      },
      {
        label: "Active Borrowers",
        data: [40, 45, 50, 48, 52, 55],
        backgroundColor: "#f6c23e",
      },
    ],
  },
});
