// script.js

// --- State & Data ---
let currentDate = new Date(2025, 11, 1); // Dec 2025
let selectedDate = null;
let selectedColor = 'blue';
let isSidebarOpen = false;
let events = [];

// Default Data
const defaultEvents = [
  { id: 1, date: '2025-12-05', title: 'Community Meeting', color: 'blue' },
  { id: 2, date: '2025-12-12', title: 'Health Drive', color: 'green' },
  { id: 3, date: '2025-12-18', title: 'Holiday', color: 'red' },
  { id: 4, date: '2025-12-22', title: 'Training', color: 'purple' },
  { id: 5, date: '2025-12-27', title: 'Town Hall', color: 'orange' },
];

const announcements = [
  {
    id: 1,
    title: "Annual Barangay Fiesta Celebration",
    date: "December 15, 2025",
    category: "Community Events",
    categoryColor: "blue",
    priority: "HIGH",
    priorityColor: "bg-red-100 text-red-600",
    description: "Join us for our annual fiesta celebration with food, games, and cultural performances."
  },
  {
    id: 2,
    title: "Free Medical Check-up and Vaccination",
    date: "December 5, 2025",
    category: "Health Services",
    categoryColor: "green",
    priority: "HIGH",
    priorityColor: "bg-red-100 text-red-600",
    description: "Free health services available for all residents. Bring your health cards."
  },
  {
    id: 3,
    title: "Flood Warning Advisory",
    date: "November 28, 2025",
    category: "Advisory",
    categoryColor: "red",
    priority: "HIGH",
    priorityColor: "bg-red-100 text-red-600",
    description: "Heavy rainfall expected. Residents in low-lying areas are advised to prepare."
  },
  {
    id: 4,
    title: "Monthly Barangay Assembly",
    date: "December 10, 2025",
    category: "Meeting",
    categoryColor: "purple",
    priority: "MEDIUM",
    priorityColor: "bg-yellow-100 text-yellow-700",
    description: "Regular monthly meeting to discuss community concerns and updates."
  }
];

// --- Config Maps ---
const announcementFilters = ["All", "Community Events", "Health Services", "Advisory", "Meeting", "Sports"];
let activeFilter = "All";

const colorStyles = {
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  red: 'bg-red-500 text-white',
  purple: 'bg-purple-500 text-white',
  orange: 'bg-orange-500 text-white',
};

const categoryBadgeStyles = {
  "Community Events": "bg-blue-500",
  "Health Services": "bg-green-500",
  "Advisory": "bg-red-500",
  "Meeting": "bg-purple-500",
  "Sports": "bg-orange-500"
};

const categoryBorderStyles = {
  "Community Events": "border-blue-500",
  "Health Services": "border-green-500",
  "Advisory": "border-red-500",
  "Meeting": "border-purple-500",
  "Sports": "border-orange-500"
};

const iconMap = {
  "Community Events": "users",
  "Health Services": "heart",
  "Advisory": "alert-circle",
  "Meeting": "briefcase",
  "Sports": "trophy"
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  // Check which page we are on
  const isCalendarPage = document.getElementById('calendar-grid');
  const isAnnouncementPage = document.getElementById('announcements-list');

  if (isCalendarPage) {
    loadEvents();
    renderCalendar();
  }

  if (isAnnouncementPage) {
    renderAnnouncementFilters();
    renderAnnouncements();
  }

  // Initialize Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// --- Local Storage Logic ---
function loadEvents() {
  const savedEvents = localStorage.getItem('calendarAppEvents');
  if (savedEvents) {
    events = JSON.parse(savedEvents);
  } else {
    events = defaultEvents;
  }
}

function saveEvents() {
  localStorage.setItem('calendarAppEvents', JSON.stringify(events));
}

// --- Calendar Logic ---
function changeMonth(offset) {
  currentDate.setMonth(currentDate.getMonth() + offset);
  renderCalendar();
}

function handleDateClick(year, month, day) {
  selectedDate = new Date(year, month, day);
  openSidebar();
  renderCalendar();
  updateSidebarUI();
}

function updateSidebarUI() {
  if (!selectedDate) return;
  const dateStr = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const dateDisplay = document.getElementById('sidebar-date-display');
  const titleInput = document.getElementById('event-title-input');

  if(dateDisplay) dateDisplay.textContent = dateStr;
  if(titleInput) {
    titleInput.value = '';
    setTimeout(() => { titleInput.focus(); }, 300);
  }
  selectColor('blue');
}

function openSidebar() {
  isSidebarOpen = true;
  const sidebar = document.getElementById('event-sidebar-container');
  if(sidebar) {
    sidebar.classList.remove('hidden', 'lg:w-0', 'lg:opacity-0', 'lg:border-0');
    sidebar.classList.add('w-full', 'lg:w-80', 'opacity-100', 'border');
  }
}

function closeSidebar() {
  isSidebarOpen = false;
  selectedDate = null;
  const sidebar = document.getElementById('event-sidebar-container');
  if(sidebar) {
    sidebar.classList.remove('w-full', 'lg:w-80', 'opacity-100', 'border');
    sidebar.classList.add('hidden', 'lg:flex', 'lg:w-0', 'lg:opacity-0', 'lg:border-0');
  }
  renderCalendar();
}

function selectColor(color) {
  selectedColor = color;
  document.querySelectorAll('.color-btn').forEach(btn => {
    if (btn.getAttribute('data-color') === color) {
      btn.classList.add('ring-2', 'ring-gray-400', 'scale-105', 'ring-offset-2', 'ring-transparent');
      btn.classList.remove('ring-transparent');
    } else {
      btn.classList.remove('ring-2', 'ring-gray-400', 'scale-105', 'ring-offset-2');
      btn.classList.add('ring-transparent');
    }
  });
}

function addEvent() {
  const titleInput = document.getElementById('event-title-input');
  if(!titleInput) return;

  const title = titleInput.value.trim();
  if (!title || !selectedDate) return;

  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const day = String(selectedDate.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  events.push({
    id: Date.now(),
    date: dateStr,
    title: title,
    color: selectedColor
  });
  saveEvents();
  titleInput.value = '';
  renderCalendar();
}

function deleteEvent(e, id) {
  e.stopPropagation();
  if(confirm("Are you sure you want to delete this event?")) {
    events = events.filter(ev => ev.id !== id);
    saveEvents();
    renderCalendar();
  }
}

function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return; // Exit if not on calendar page

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  document.getElementById('month-year-display').textContent = `${monthNames[month]} ${year}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalCells = firstDayIndex + daysInMonth;
  const weeks = Math.ceil(totalCells / 7);

  grid.style.gridTemplateRows = `repeat(${weeks}, minmax(0, 1fr))`;
  grid.innerHTML = '';

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = "border-r border-b border-gray-100 bg-gray-50/30";
    grid.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = events.filter(e => e.date === dateStr);
    const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;

    const cell = document.createElement('div');
    cell.className = `p-2 cursor-pointer transition-colors hover:bg-blue-50/50 relative group flex flex-col border-r border-b border-gray-100 ${isSelected ? 'bg-blue-50 ring-inset ring-2 ring-blue-500 z-10' : 'bg-white'}`;
    cell.onclick = () => handleDateClick(year, month, day);

    const numberDiv = document.createElement('div');
    numberDiv.className = `w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium mb-1 shrink-0 ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500'}`;
    numberDiv.textContent = day;
    cell.appendChild(numberDiv);

    const eventsDiv = document.createElement('div');
    eventsDiv.className = "flex flex-col gap-1.5 overflow-y-auto no-scrollbar flex-1 min-h-0";

    dayEvents.forEach(ev => {
      const evEl = document.createElement('div');
      evEl.className = `text-[11px] px-2 py-1 rounded-md truncate font-medium shadow-sm transition-transform hover:scale-[1.02] ${colorStyles[ev.color]} group/event relative shrink-0`;
      evEl.innerHTML = `
                      ${ev.title}
                      <button class="absolute right-1 top-1 hidden group-hover/event:block text-white hover:text-red-200" onclick="deleteEvent(event, ${ev.id})">
                          <i data-lucide="trash-2" class="w-3 h-3"></i>
                      </button>
                  `;
      eventsDiv.appendChild(evEl);
    });
    cell.appendChild(eventsDiv);
    grid.appendChild(cell);
  }

  const remainingCells = (weeks * 7) - totalCells;
  for(let i=0; i < remainingCells; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = "border-r border-b border-gray-100 bg-gray-50/30";
    grid.appendChild(emptyCell);
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// --- Announcement Logic ---
function renderAnnouncementFilters() {
  const container = document.getElementById('announcement-filters');
  if(!container) return;

  container.innerHTML = announcementFilters.map(filter => {
    const isActive = activeFilter === filter;
    const activeClass = isActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200';
    const icon = iconMap[filter] || 'hash';

    return `
                  <button onclick="setAnnouncementFilter('${filter}')"
                      class="${activeClass} px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-2">
                      ${filter === 'All' ? '' : `<i data-lucide="${icon}" class="w-3 h-3"></i>`}
                      ${filter}
                  </button>
              `;
  }).join('');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function setAnnouncementFilter(filter) {
  activeFilter = filter;
  renderAnnouncementFilters();
  renderAnnouncements();
}

function renderAnnouncements() {
  const list = document.getElementById('announcements-list');
  if(!list) return;

  const filtered = activeFilter === 'All'
    ? announcements
    : announcements.filter(a => a.category === activeFilter);

  list.innerHTML = filtered.map(item => `
              <div class="bg-white rounded-lg shadow-sm p-5 mb-4 border-l-4 ${categoryBorderStyles[item.category] || 'border-gray-300'} relative group hover:shadow-md transition-shadow">
                  <div class="flex justify-between items-start mb-2">
                      <div class="flex items-center gap-3">
                          <h3 class="font-semibold text-gray-800 text-lg">${item.title}</h3>
                          <span class="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${item.priorityColor}">${item.priority}</span>
                      </div>
                      <div class="flex items-center gap-2">
                          <button class="p-1 text-blue-500 hover:bg-blue-50 rounded"><i data-lucide="pencil" class="w-4 h-4"></i></button>
                          <button class="p-1 text-red-500 hover:bg-red-50 rounded"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                      </div>
                  </div>

                  <div class="flex items-center gap-3 mb-3">
                      <div class="flex items-center text-gray-500 text-sm">
                          <i data-lucide="calendar" class="w-4 h-4 mr-1.5"></i>
                          ${item.date}
                      </div>
                      <span class="${categoryBadgeStyles[item.category]} text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                           ${item.category}
                      </span>
                  </div>

                  <p class="text-gray-600 text-sm leading-relaxed">${item.description}</p>
              </div>
          `).join('');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
