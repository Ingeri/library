// ============================
// HELPER: Number Formatter
// ============================
function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}

// ============================
// LOAD CHART DATA FROM JSON
// ============================
fetch("../data/reportchart.json")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Failed to load reportchart.json");
    }
    return res.json();
  })
  .then((data) => {
    // ============================
    // MONTHLY BORROWING TRENDS
    // ============================
    const trendCanvas = document.getElementById("trendChart");
    if (trendCanvas) {
      new Chart(trendCanvas, {
        type: "line",
        data: {
          labels: data.monthlyTrends.labels,
          datasets: [
            {
              label: "Borrowed Books",
              data: data.monthlyTrends.borrowed,
              borderColor: "#4e73df",
              backgroundColor: "rgba(78,115,223,0.1)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Returned Books",
              data: data.monthlyTrends.returned,
              borderColor: "#1cc88a",
              backgroundColor: "rgba(28,200,138,0.1)",
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          animation: {
            duration: 1200,
            easing: "easeOutQuart",
          },
        },
      });
    }

    // ==========================================
    // BORROW vs RETURN (INTERACTIVE + JSON DATA)
    // ==========================================
    const borrowCanvas = document.getElementById("borrowReturnChart");
    if (borrowCanvas) {
      const chartData = [...data.borrowVsReturn];

      const borrowReturnChart = new Chart(borrowCanvas, {
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
          animation: {
            duration: 1200,
            easing: "easeOutQuart",
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                generateLabels: function (chart) {
                  const dataSet = chart.data.datasets[0];

                  return chart.data.labels.map((label, i) => ({
                    text: label,
                    fillStyle: dataSet.backgroundColor[i],
                    strokeStyle: dataSet.backgroundColor[i],
                    hidden: dataSet.data[i] === 0,
                    index: i,
                    font: {
                      decoration:
                        dataSet.data[i] === 0 ? "line-through" : "normal",
                    },
                  }));
                },
              },
              onClick: function (e, legendItem, legend) {
                const index = legendItem.index;
                const chartInstance = legend.chart;

                chartInstance.data.datasets[0].data[index] =
                  chartInstance.data.datasets[0].data[index] === 0
                    ? chartData[index]
                    : 0;

                chartInstance.update();
              },
            },

            tooltip: {
              callbacks: {
                label: function (context) {
                  return (
                    context.label + ": " + formatNumber(context.raw) + " books"
                  );
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
            x: {
              grid: { display: false },
            },
          },
        },
      });
    }

    // ============================
    // TOP BORROWED BOOKS
    // ============================
    const topBooksCanvas = document.getElementById("topBooksChart");
    if (topBooksCanvas) {
      new Chart(topBooksCanvas, {
        type: "pie",
        data: {
          labels: data.topBooks.labels,
          datasets: [
            {
              data: data.topBooks.data,
            },
          ],
        },
        options: {
          responsive: true,
          animation: {
            duration: 1200,
            easing: "easeOutQuart",
          },
        },
      });
    }

    // ============================
    // GENRE POPULARITY
    // ============================
    const genreCanvas = document.getElementById("genreChart");
    if (genreCanvas) {
      new Chart(genreCanvas, {
        type: "bar",
        data: {
          labels: data.genrePopularity.labels,
          datasets: [
            {
              data: data.genrePopularity.data,
              backgroundColor: "#36b9cc",
            },
          ],
        },
        options: {
          responsive: true,
          animation: {
            duration: 1200,
            easing: "easeOutQuart",
          },
        },
      });
    }

    // ============================
    // FINE STATUS
    // ============================
    const fineStatusCanvas = document.getElementById("fineStatusChart");
    if (fineStatusCanvas) {
      new Chart(fineStatusCanvas, {
        type: "doughnut",
        data: {
          labels: ["Collected", "Pending"],
          datasets: [
            {
              data: data.fineStatus,
              backgroundColor: ["#1cc88a", "#e74a3b"],
            },
          ],
        },
        options: {
          responsive: true,
          animation: {
            duration: 1200,
            easing: "easeOutQuart",
          },
        },
      });
    }

    // ============================
    // FINE BREAKDOWN
    // ============================
    const fineBreakdownCanvas = document.getElementById("fineBreakdownChart");
    if (fineBreakdownCanvas) {
      new Chart(fineBreakdownCanvas, {
        type: "bar",
        data: {
          labels: data.fineBreakdown.labels,
          datasets: [
            {
              data: data.fineBreakdown.data,
              backgroundColor: "#f6c23e",
            },
          ],
        },
        options: {
          responsive: true,
          animation: {
            duration: 1200,
            easing: "easeOutQuart",
          },
        },
      });
    }
  })
  .catch((err) => {
    console.error("Chart Data Load Error:", err);
    alert("Failed to load report chart data. Check your JSON file path.");
  });
// ============================
// END OF REPORTS JS
// ============================

// ============================
// LOAD STATISTICS FROM JSON
// ============================
fetch("../data/reportstats.json")
  .then(res => {
    if (!res.ok) {
      throw new Error("Failed to load reportstats.json");
    }
    return res.json();
  })
  .then(stats => {

    document.getElementById("statBorrowed").innerText = formatNumber(stats.totalBorrowed);
    document.getElementById("statReturned").innerText = formatNumber(stats.totalReturned);
    document.getElementById("statFines").innerText = "$" + formatNumber(stats.totalFines);
    document.getElementById("statDamaged").innerText = formatNumber(stats.damagedBooks);

  })
  .catch(err => {
    console.error("Stats Load Error:", err);
  });