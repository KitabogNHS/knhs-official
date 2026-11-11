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

// =====================================
// LOAD PUBLISHED ANNOUNCEMENTS FROM SUPABASE
// =====================================

async function loadPublicAnnouncements() {
  const client = window.knhsSupabase;

  if (!client) {
    console.error("KNHS Supabase connection is unavailable.");
    return;
  }

  const { data, error } = await client
    .from("announcements")
    .select("title, description, image_url, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load announcements:", error.message);
    return;
  }

  if (typeof window.displayAnnouncements === "function") {
    window.displayAnnouncements(data);
  }
}

// Load announcements when the homepage opens
loadPublicAnnouncements();


// =====================================
// LOAD FACULTY & STAFF FROM SUPABASE
// =====================================

async function loadPublicFaculty() {
  const client = window.knhsSupabase;
  const facultyList = document.getElementById("facultyList");

  if (!client || !facultyList) {
    console.error("Supabase connection or faculty section is unavailable.");
    return;
  }

  const { data, error } = await client
    .from("faculty")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Unable to load faculty:", error.message);
    facultyList.innerHTML = "<p>Unable to load faculty and staff information.</p>";
    return;
  }
console.log("Faculty records received:", data);
  if (!data || data.length === 0) {
    facultyList.innerHTML = "<p>No faculty and staff records available yet.</p>";
    return;
  }

facultyList.innerHTML = data.map(member => `
  <article>
    ${
      member.photo_url
        ? `<img src="${member.photo_url}" alt="${member.full_name}" class="faculty-photo">`
        : `<div class="faculty-photo-placeholder">KNHS</div>`
    }
    <h3>${member.full_name || "Faculty Member"}</h3>
    <p>${member.position || "School Personnel"}</p>
    <p>${member.department || ""}</p>
  </article>
`).join("");

}

// Load faculty when the homepage opens
loadPublicFaculty();

