// Application state
let countdownInterval;
let quoteInterval;
let birthDate;
let lifeExpectancy = 78; // Default life expectancy

// Motivational quotes
const motivationalQuotes = [
  {
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    quote: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
  },
  {
    quote:
      "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    quote: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
  },
  {
    quote: "Life is really simple, but we insist on making it complicated.",
    author: "Confucius",
  },
  {
    quote:
      "In the end, we will remember not the words of our enemies, but the silence of our friends.",
    author: "Martin Luther King Jr.",
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    quote: "Life is 10% what happens to you and 90% how you react to it.",
    author: "Charles R. Swindoll",
  },
  {
    quote: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
  },
  {
    quote:
      "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
    author: "Albert Einstein",
  },
  {
    quote: "Don't count the days, make the days count.",
    author: "Muhammad Ali",
  },
  {
    quote:
      "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
  },
];

// Motivational messages
const motivationalMessages = [
  "Every second is a chance to change your life. What will you create today?",
  "Time is the most valuable thing we have. Invest it wisely.",
  "Your future self is counting on the decisions you make today.",
  "Each moment is a fresh beginning. Make it count.",
  "Life isn't about finding yourself. Life is about creating yourself.",
  "The clock is ticking, but your story is still being written.",
  "Today is the youngest you'll ever be. Make the most of it.",
  "Time flies when you're pursuing your dreams. What's your next move?",
  "Every sunrise is an invitation to brighten someone's day.",
  "Your time is now. Your moment is now. Your life is now.",
];

// DOM elements
const elements = {
  welcomeSection: document.getElementById("welcomeSection"),
  countdownSection: document.getElementById("countdownSection"),
  birthForm: document.getElementById("birthForm"),
  birthDateInput: document.getElementById("birthDate"),
  settingsBtn: document.getElementById("settingsBtn"),
  settingsModal: document.getElementById("settingsModal"),
  closeModal: document.getElementById("closeModal"),
  settingsForm: document.getElementById("settingsForm"),
  settingsBirthDate: document.getElementById("settingsBirthDate"),
  lifeExpectancyInput: document.getElementById("lifeExpectancy"),
  resetData: document.getElementById("resetData"),
  motivationalQuote: document.getElementById("motivationalQuote"),
  quoteAuthor: document.getElementById("quoteAuthor"),
  motivationText: document.getElementById("motivationText"),
  progressFill: document.getElementById("progressFill"),
  progressPercentage: document.getElementById("progressPercentage"),
  years: document.getElementById("years"),
  months: document.getElementById("months"),
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

// Initialize the application
function init() {
  loadUserData();
  setupEventListeners();

  if (birthDate) {
    showCountdownSection();
    startCountdown();
    startQuoteRotation();
    updateMotivationalMessage();
  } else {
    showWelcomeSection();
  }
}

// Load user data from localStorage
function loadUserData() {
  const savedBirthDate = localStorage.getItem("birthDate");
  const savedLifeExpectancy = localStorage.getItem("lifeExpectancy");

  if (savedBirthDate) {
    birthDate = new Date(savedBirthDate);
  }

  if (savedLifeExpectancy) {
    lifeExpectancy = parseInt(savedLifeExpectancy);
  }
}

// Save user data to localStorage
function saveUserData() {
  if (birthDate) {
    localStorage.setItem("birthDate", birthDate.toISOString());
  }
  localStorage.setItem("lifeExpectancy", lifeExpectancy.toString());
}

// Setup event listeners
function setupEventListeners() {
  // Birth form submission
  elements.birthForm.addEventListener("submit", handleBirthFormSubmit);

  // Settings modal
  elements.settingsBtn.addEventListener("click", openSettingsModal);
  elements.closeModal.addEventListener("click", closeSettingsModal);
  elements.settingsModal.addEventListener("click", handleModalBackdropClick);

  // Settings form
  elements.settingsForm.addEventListener("submit", handleSettingsFormSubmit);
  elements.resetData.addEventListener("click", handleResetData);

  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeydown);
}

// Handle birth form submission
function handleBirthFormSubmit(e) {
  e.preventDefault();
  const selectedDate = elements.birthDateInput.value;

  if (!selectedDate) {
    alert("Please select your birth date.");
    return;
  }

  birthDate = new Date(selectedDate);
  saveUserData();

  showCountdownSection();
  startCountdown();
  startQuoteRotation();
  updateMotivationalMessage();
}

// Handle settings form submission
function handleSettingsFormSubmit(e) {
  e.preventDefault();

  const newBirthDate = elements.settingsBirthDate.value;
  const newLifeExpectancy = elements.lifeExpectancyInput.value;

  if (newBirthDate) {
    birthDate = new Date(newBirthDate);
  }

  if (newLifeExpectancy) {
    lifeExpectancy = parseInt(newLifeExpectancy);
  }

  saveUserData();
  closeSettingsModal();

  // Restart countdown with new data
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  startCountdown();
}

// Handle reset data
function handleResetData() {
  if (
    confirm(
      "Are you sure you want to reset all data? This will clear your birth date and settings."
    )
  ) {
    localStorage.clear();
    location.reload();
  }
}

// Handle modal backdrop click
function handleModalBackdropClick(e) {
  if (e.target === elements.settingsModal) {
    closeSettingsModal();
  }
}

// Handle keyboard shortcuts
function handleKeydown(e) {
  if (e.key === "Escape" && elements.settingsModal.classList.contains("show")) {
    closeSettingsModal();
  }
}

// Show welcome section
function showWelcomeSection() {
  elements.welcomeSection.style.display = "block";
  elements.countdownSection.style.display = "none";
}

// Show countdown section
function showCountdownSection() {
  elements.welcomeSection.style.display = "none";
  elements.countdownSection.style.display = "block";
}

// Open settings modal
function openSettingsModal() {
  elements.settingsModal.classList.add("show");

  // Populate current values
  if (birthDate) {
    elements.settingsBirthDate.value = formatDateForInput(birthDate);
  }
  elements.lifeExpectancyInput.value = lifeExpectancy;
}

// Close settings modal
function closeSettingsModal() {
  elements.settingsModal.classList.remove("show");
}

// Format date for input field
function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Calculate remaining time
function calculateRemainingTime() {
  if (!birthDate) return null;

  const now = new Date();
  const endDate = new Date(birthDate);
  endDate.setFullYear(endDate.getFullYear() + lifeExpectancy);

  const timeDiff = endDate - now;

  if (timeDiff <= 0) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      progress: 100,
    };
  }

  // Calculate time units
  const seconds = Math.floor(timeDiff / 1000) % 60;
  const minutes = Math.floor(timeDiff / (1000 * 60)) % 60;
  const hours = Math.floor(timeDiff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) % 30;
  const months = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30)) % 12;
  const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));

  // Calculate progress
  const totalLifeTime = lifeExpectancy * 365 * 24 * 60 * 60 * 1000;
  const livedTime = now - birthDate;
  const progress = Math.max(
    0,
    Math.min(100, (livedTime / totalLifeTime) * 100)
  );

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    progress,
  };
}

// Update countdown display
function updateCountdownDisplay() {
  const timeData = calculateRemainingTime();

  if (!timeData) return;

  // Update countdown numbers with animation
  updateCountdownNumber(elements.years, timeData.years);
  updateCountdownNumber(elements.months, timeData.months);
  updateCountdownNumber(elements.days, timeData.days);
  updateCountdownNumber(elements.hours, timeData.hours);
  updateCountdownNumber(elements.minutes, timeData.minutes);
  updateCountdownNumber(elements.seconds, timeData.seconds);

  // Update progress
  elements.progressFill.style.width = `${timeData.progress}%`;
  elements.progressPercentage.textContent = `${timeData.progress.toFixed(1)}%`;
}

// Update countdown number with animation
function updateCountdownNumber(element, newValue) {
  const currentValue = parseInt(element.textContent) || 0;

  if (currentValue !== newValue) {
    element.style.transform = "scale(1.1)";
    element.textContent = newValue;

    setTimeout(() => {
      element.style.transform = "scale(1)";
    }, 150);
  }
}

// Start countdown
function startCountdown() {
  updateCountdownDisplay(); // Initial update

  countdownInterval = setInterval(() => {
    updateCountdownDisplay();
  }, 1000);
}

// Start quote rotation
function startQuoteRotation() {
  let currentQuoteIndex = 0;

  function updateQuote() {
    const quote = motivationalQuotes[currentQuoteIndex];
    elements.motivationalQuote.textContent = `"${quote.quote}"`;
    elements.quoteAuthor.textContent = `- ${quote.author}`;

    currentQuoteIndex = (currentQuoteIndex + 1) % motivationalQuotes.length;
  }

  updateQuote(); // Initial quote

  quoteInterval = setInterval(updateQuote, 30000); // Change every 30 seconds
}

// Update motivational message
function updateMotivationalMessage() {
  const randomMessage =
    motivationalMessages[
      Math.floor(Math.random() * motivationalMessages.length)
    ];
  elements.motivationText.textContent = randomMessage;

  // Update message every 45 seconds
  setInterval(() => {
    const randomMessage =
      motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
      ];
    elements.motivationText.style.opacity = "0.5";

    setTimeout(() => {
      elements.motivationText.textContent = randomMessage;
      elements.motivationText.style.opacity = "1";
    }, 300);
  }, 45000);
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", init);

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && birthDate) {
    // Immediately update when tab becomes visible
    updateCountdownDisplay();
  }
});

// Handle window focus
window.addEventListener("focus", () => {
  if (birthDate) {
    updateCountdownDisplay();
  }
});
