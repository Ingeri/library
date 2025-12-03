// Handle form submission
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  });
});

// Backup button
document.querySelector(".backup-btn").addEventListener("click", () => {
  alert("Backup created successfully!");
});

// Restore backup
document.getElementById("restoreBackup").addEventListener("change", () => {
  alert("Backup restored successfully!");
});