const userContainer = document.getElementById("user-container");
const paginationContainer = document.getElementById("pagination");
const errorContainer = document.getElementById("error-container");
const usersPerPage = 6;
let currentPage = 1;

// Function to fetch user data from API
const fetchUsers = async (page) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${usersPerPage}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const users = await response.json();
    return users;
  } catch (error) {
    displayError(error.message);
  }
};

// Function to render users in the DOM
const renderUsers = (users) => {
  userContainer.innerHTML = ""; // Clear previous users
  users.forEach((user) => {
    const userDiv = document.createElement("div");
    userDiv.className = "user";
    userDiv.innerText = `${user.name} (${user.email})`;
    userContainer.appendChild(userDiv);
  });
};

// Function to create pagination buttons
const createPaginationButtons = (totalUsers) => {
  paginationContainer.innerHTML = ""; // Clear previous buttons
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.className = "page-button";
    button.innerText = i;
    button.addEventListener("click", () => handlePageClick(i));
    if (i === currentPage) {
      button.classList.add("active");
    }
    paginationContainer.appendChild(button);
  }
};

// Handle page click
const handlePageClick = async (page) => {
  currentPage = page;
  const users = await fetchUsers(currentPage);
  if (users) {
    renderUsers(users);
    updateActiveButton(page);
  }
};

// Update active button style
const updateActiveButton = (page) => {
  const buttons = document.querySelectorAll(".page-button");
  buttons.forEach((button) => {
    button.classList.remove("active");
    if (parseInt(button.innerText) === page) {
      button.classList.add("active");
    }
  });
};

// Display error message
const displayError = (message) => {
  errorContainer.innerHTML = `<p class="error-message">${message}</p>`;
};

// Initial render
const init = async () => {
  const totalUsersResponse = await fetch(
    "https://jsonplaceholder.typicode.com/users"
  );
  if (totalUsersResponse.ok) {
    const totalUsers = await totalUsersResponse.json();
    createPaginationButtons(totalUsers.length);

    const users = await fetchUsers(currentPage);
    if (users) {
      renderUsers(users);
    }
  } else {
    displayError(
      `Error: ${totalUsersResponse.status} ${totalUsersResponse.statusText}`
    );
  }
};

init();
