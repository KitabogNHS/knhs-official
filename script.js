// =====================================
// KITABOG NATIONAL HIGH SCHOOL
// Website JavaScript
// =====================================

// MOBILE NAVIGATION MENU
const menuBtn = document.getElementById("menuBtn");
const navigation = document.getElementById("navigation");

if (menuBtn && navigation) {
  menuBtn.addEventListener("click", function () {
    navigation.classList.toggle("show");

    const isOpen = navigation.classList.contains("show");
    menuBtn.setAttribute("aria-expanded", isOpen);
    menuBtn.textContent = isOpen ? "✕" : "☰";
  });

  // Close menu after selecting a navigation link
  navigation.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navigation.classList.remove("show");
      menuBtn.textContent = "☰";
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// AUTOMATIC COPYRIGHT YEAR
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// ANNOUNCEMENT DISPLAY PREPARATION
// Future announcements can be connected to Supabase.

function displayAnnouncements(announcements) {
  const announcementList = document.getElementById("announcementList");

  if (!announcementList || !Array.isArray(announcements)) {
    return;
  }

  announcementList.innerHTML = "";

  announcements.forEach(function (announcement) {
    const article = document.createElement("article");

    const heading = document.createElement("h3");
    heading.textContent = announcement.title || "School Announcement";

    const description = document.createElement("p");
    description.textContent = announcement.description || "";

    article.appendChild(heading);
    article.appendChild(description);

    announcementList.appendChild(article);
  });
}

// Make the function available for future dashboard integration.
window.displayAnnouncements = displayAnnouncements;

console.log("KNHS website scripts loaded successfully.");
