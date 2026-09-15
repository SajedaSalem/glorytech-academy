const courseContainer = document.getElementById("course-container");
const courseCount = document.getElementById("course-count");
const searchInput = document.getElementById("search");
const vendorFilter = document.getElementById("vendor-filter");
const backendStatus = document.getElementById("backend-status");

let courses = [];

// Check if backend is reachable
async function checkBackendHealth() {
  try {
    const response = await fetch("/api/health");

    if (!response.ok) {
      throw new Error("Backend unavailable");
    }

    const data = await response.json();

    backendStatus.textContent = `Backend: ${data.status}`;
    backendStatus.className = "status-online";
  } catch (error) {
    backendStatus.textContent = "Backend: offline";
    backendStatus.className = "status-offline";
  }
}

// Load courses from backend
async function loadCourses() {
  try {
    const response = await fetch("/api/courses");

    if (!response.ok) {
      throw new Error("Could not load courses");
    }

    const data = await response.json();

    courses = data.courses;

    renderCourses(courses);
  } catch (error) {
    courseContainer.innerHTML = `
      <div class="error-message">
        Unable to load courses from the backend.
      </div>
    `;

    courseCount.textContent = "";
  }
}

// Display courses on the page
function renderCourses(courseList) {
  courseContainer.innerHTML = "";

  courseCount.textContent = `${courseList.length} course(s) available`;

  if (courseList.length === 0) {
    courseContainer.innerHTML = `
      <p>No courses found.</p>
    `;
    return;
  }

  courseList.forEach(course => {
    const card = document.createElement("article");

    card.className = "course-card";

    card.innerHTML = `
      <span class="vendor-badge">${course.vendor}</span>

      <h2>${course.title}</h2>

      <p>
        <strong>Exam:</strong>
        ${course.examCode}
      </p>

      <p>
        <strong>Level:</strong>
        ${course.level}
      </p>

      <p>
        <strong>Category:</strong>
        ${course.category}
      </p>

      <p>
        <strong>Duration:</strong>
        ${course.durationHours} hours
      </p>

      <p>${course.description}</p>
    `;

    courseContainer.appendChild(card);
  });
}

// Search and filter courses
function filterCourses() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedVendor = vendorFilter.value;

  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm) ||
      course.vendor.toLowerCase().includes(searchTerm) ||
      course.examCode.toLowerCase().includes(searchTerm);

    const matchesVendor =
      selectedVendor === "" ||
      course.vendor === selectedVendor;

    return matchesSearch && matchesVendor;
  });

  renderCourses(filteredCourses);
}

searchInput.addEventListener("input", filterCourses);
vendorFilter.addEventListener("change", filterCourses);

checkBackendHealth();
loadCourses();