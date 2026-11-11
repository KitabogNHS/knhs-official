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
  const facultySearch = document.getElementById("facultySearch");
  const facultyDepartment = document.getElementById("facultyDepartment");
  const facultyCount = document.getElementById("facultyCount");

  if (!client || !facultyList) {
    console.error("Supabase connection or faculty section is unavailable.");
    return;
  }

  const { data, error } = await client
    .from("faculty")
    .select("*")
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Unable to load faculty:", error.message);
    facultyList.innerHTML =
      '<p class="faculty-no-results">Unable to load faculty and staff information.</p>';
    return;
  }

  if (!data || data.length === 0) {
    facultyList.innerHTML =
      '<p class="faculty-no-results">No faculty and staff records available yet.</p>';

    if (facultyCount) {
      facultyCount.textContent = "0 faculty and staff members";
    }

    return;
  }

  function renderFaculty() {
    const searchTerm = facultySearch
      ? facultySearch.value.toLowerCase().trim()
      : "";

    const selectedDepartment = facultyDepartment
      ? facultyDepartment.value
      : "";

    const filteredFaculty = data.filter(member => {
      const name = (member.full_name || "").toLowerCase();
      const position = (member.position || "").toLowerCase();
      const department = (member.department || "").toLowerCase();

      const matchesSearch =
        name.includes(searchTerm) ||
        position.includes(searchTerm) ||
        department.includes(searchTerm);

      const matchesDepartment =
  !selectedDepartment ||
  (member.department || "").trim().toLowerCase() ===
  selectedDepartment.trim().toLowerCase();

      return matchesSearch && matchesDepartment;
    });

    if (facultyCount) {
      facultyCount.textContent =
        `Showing ${filteredFaculty.length} of ${data.length} faculty and staff members`;
    }

    if (filteredFaculty.length === 0) {
      facultyList.innerHTML =
        '<p class="faculty-no-results">No matching faculty or staff found.</p>';
      return;
    }

    facultyList.innerHTML = filteredFaculty.map(member => `
      <article>
        ${
          member.photo_url
            ? `<img src="${member.photo_url}" alt="${member.full_name || "Faculty member"}" class="faculty-photo">`
            : `<div class="faculty-photo-placeholder">KNHS</div>`
        }
        <h3>${member.full_name || "Faculty Member"}</h3>
        <p class="faculty-position">${member.position || "School Personnel"}</p>
        <p>${member.department || ""}</p>
      </article>
    `).join("");
  }

  // Populate department filter
  if (facultyDepartment) {
    const departments = [
      ...new Set(
        data
          .map(member => member.department)
          .filter(department => department && department.trim() !== "")
      )
    ].sort();

    facultyDepartment.innerHTML =
      '<option value="">All Departments</option>' +
      departments.map(department =>
        `<option value="${department}">${department}</option>`
      ).join("");
  }

  // Activate search and department filtering
  if (facultySearch) {
    facultySearch.addEventListener("input", renderFaculty);
  }

  if (facultyDepartment) {
    facultyDepartment.addEventListener("change", renderFaculty);
  }

  // Display all faculty members
  renderFaculty();
}

// Load faculty when homepage opens
loadPublicFaculty();


