const courseContainer =
  document.getElementById("course-container");

const courseCount =
  document.getElementById("course-count");

const searchInput =
  document.getElementById("search");

const vendorFilter =
  document.getElementById("vendor-filter");

const levelFilter =
  document.getElementById("level-filter");

const categoryFilter =
  document.getElementById("category-filter");

const backendStatus =
  document.getElementById("backend-status");

const clearFiltersButton =
  document.getElementById("clear-filters");

let courses = [];


/*
  Check whether the backend API is reachable.
*/
async function checkBackendHealth() {

  try {

    const response =
      await fetch("/api/health");

    if (!response.ok) {
      throw new Error(
        "Backend health check failed"
      );
    }

    const data =
      await response.json();

    backendStatus.textContent =
      `● Backend ${data.status}`;

    backendStatus.className =
      "status-badge status-online";

  } catch (error) {

    backendStatus.textContent =
      "● Backend offline";

    backendStatus.className =
      "status-badge status-offline";
  }
}


/*
  Load all course data from the backend.
*/
async function loadCourses() {

  try {

    const response =
      await fetch("/api/courses");

    if (!response.ok) {
      throw new Error(
        "Could not load courses"
      );
    }

    const data =
      await response.json();

    courses =
      data.courses;

    renderCourses(courses);

  } catch (error) {

    courseContainer.innerHTML = `
      <div class="error-message">
        <strong>Unable to load courses.</strong>
        <br>
        The backend service could not be reached.
      </div>
    `;

    courseCount.textContent =
      "Courses unavailable";
  }
}


/*
  Render a list of course cards.
*/
function renderCourses(courseList) {

  courseContainer.innerHTML = "";

  courseCount.textContent =
    `${courseList.length} course${
      courseList.length === 1 ? "" : "s"
    } available`;

  if (courseList.length === 0) {

    courseContainer.innerHTML = `
      <div class="empty-state">
        <h3>No courses found</h3>
        <p>
          Try changing your search or filters.
        </p>
      </div>
    `;

    return;
  }

  courseList.forEach(course => {

    const card =
      document.createElement("article");

    card.className =
      "course-card";

    card.innerHTML = `
      <div class="course-card-top">

        <span class="vendor-badge">
          ${course.vendor}
        </span>

        <span class="category-badge">
          ${course.category}
        </span>

      </div>

      <h3>
        ${course.title}
      </h3>

      <p class="course-description">
        ${course.description}
      </p>

      <div class="course-details">

        <div class="detail">
          <span class="detail-label">
            Exam
          </span>

          <span class="detail-value">
            ${course.examCode}
          </span>
        </div>

        <div class="detail">
          <span class="detail-label">
            Level
          </span>

          <span class="detail-value">
            ${course.level}
          </span>
        </div>

        <div class="detail">
          <span class="detail-label">
            Duration
          </span>

          <span class="detail-value">
            ${course.durationHours} hours
          </span>
        </div>

        <div class="detail">
          <span class="detail-label">
            Vendor
          </span>

          <span class="detail-value">
            ${course.vendor}
          </span>
        </div>

      </div>
    `;

    courseContainer.appendChild(card);
  });
}


/*
  Apply all active filters.
*/
function filterCourses() {

  const searchTerm =
    searchInput.value
      .trim()
      .toLowerCase();

  const selectedVendor =
    vendorFilter.value;

  const selectedLevel =
    levelFilter.value;

  const selectedCategory =
    categoryFilter.value;

  const filteredCourses =
    courses.filter(course => {

      const matchesSearch =
        course.title
          .toLowerCase()
          .includes(searchTerm) ||

        course.vendor
          .toLowerCase()
          .includes(searchTerm) ||

        course.examCode
          .toLowerCase()
          .includes(searchTerm) ||

        course.category
          .toLowerCase()
          .includes(searchTerm);

      const matchesVendor =
        selectedVendor === "" ||
        course.vendor === selectedVendor;

      const matchesLevel =
        selectedLevel === "" ||
        course.level === selectedLevel;

      const matchesCategory =
        selectedCategory === "" ||
        course.category === selectedCategory;

      return (
        matchesSearch &&
        matchesVendor &&
        matchesLevel &&
        matchesCategory
      );
    });

  renderCourses(filteredCourses);
}


/*
  Reset all search/filter controls.
*/
function clearFilters() {

  searchInput.value = "";

  vendorFilter.value = "";

  levelFilter.value = "";

  categoryFilter.value = "";

  renderCourses(courses);
}


/*
  Event listeners
*/
searchInput.addEventListener(
  "input",
  filterCourses
);

vendorFilter.addEventListener(
  "change",
  filterCourses
);

levelFilter.addEventListener(
  "change",
  filterCourses
);

categoryFilter.addEventListener(
  "change",
  filterCourses
);

clearFiltersButton.addEventListener(
  "click",
  clearFilters
);


/*
  Initial application startup
*/
checkBackendHealth();

loadCourses();