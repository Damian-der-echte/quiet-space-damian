const state = {
  role: "student",
  route: getInitialRoute(),
  selectedRoom: "",
  selectedSeat: "",
  bookingStep: 1,
  bookingComplete: false,
  selectedFloor: "eg",
  selectedStudent: "Sara Yilmaz",
  studentQuery: "",
  reservationTab: "list",
  teacherFilter: "Alle",
  testPassed: window.localStorage.getItem("quietspace-rule-test-passed") === "true",
  rightsTarget: null,
  sidebarCollapsed: false,
  showOutlets: false,
  longTermEnabled: false,
  longTermApproval: "none",
  longTermTeacher: "",
  reservationView: "week",
  reservationPage: "list",
  editingReservationIndex: null,
  selectedCalendarDate: "2026-09-09",
  pendingBookingAfterTest: false,
  teacherBlockMode: false,
  bookingDraft: {
    date: "2026-09-09",
    start: "13:00",
    end: "14:30",
    weekdays: ["Mo", "Mi", "Fr"],
    weeks: 4,
    longTermStart: "2026-09-14",
    longTermEnd: "2026-10-09",
    teacher: "",
    purpose: "Prüfungsvorbereitung",
  },
};

function getInitialRoute() {
  const route = window.location.hash.replace("#", "");
  if (route.startsWith("booking-room-")) return "booking";
  return ["start", "rules", "booking", "reservations", "map", "help", "students"].includes(route) ? route : "start";
}

function syncRouteHash() {
  const nextHash = state.route === "booking" && state.bookingStep === 2 && state.selectedRoom ? `#booking-room-${state.selectedRoom}` : `#${state.route}`;
  if (window.location.hash !== nextHash) {
    window.history.replaceState(null, "", nextHash);
  }
}

function applyDeepLink() {
  const hash = window.location.hash.replace("#", "");
  if (!hash.startsWith("booking-room-")) return;
  const roomId = hash.replace("booking-room-", "");
  if (rooms.some((room) => room.id === roomId)) {
    state.route = "booking";
    state.selectedRoom = roomId;
    state.selectedSeat = "";
    state.bookingComplete = false;
    state.bookingStep = 2;
  }
}

const rooms = [
  { id: "A01", name: "QuietSpace A01", floor: "ug", floorLabel: "UG", area: "Techniktrakt", image: "extra.jpg", free: 3, total: 6, features: ["Einzelplätze", "leise", "Steckdosen"] },
  { id: "E06", name: "QuietSpace E06", floor: "eg", floorLabel: "EG", area: "Eingang Süd", image: "E06.jpg", free: 5, total: 8, features: ["Laptopplätze", "Steckdosen", "sehr ruhig"] },
  { id: "E08", name: "QuietSpace E08", floor: "eg", floorLabel: "EG", area: "Eingang Nord", image: "E08.jpg", free: 5, total: 6, features: ["Fokusplätze", "Strom direkt am Tisch", "Akustiktrennwände"] },
  { id: "E12", name: "QuietSpace E12", floor: "eg", floorLabel: "EG", area: "Bibliothek", image: "E12.jpg", free: 4, total: 6, features: ["Sofaecke", "Fensterplätze", "ruhig"] },
  { id: "101", name: "QuietSpace 101", floor: "og1", floorLabel: "1. OG", area: "Informatikgang", image: "101.jpg", free: 4, total: 6, features: ["Monitor", "Tageslicht", "Steckdosen"] },
  { id: "114", name: "QuietSpace 114", floor: "og1", floorLabel: "1. OG", area: "Lernzone Ost", image: "104.jpg", free: 6, total: 10, features: ["Gruppennähe", "lange Tische", "Whiteboard"] },
  { id: "207", name: "QuietSpace 207", floor: "og2", floorLabel: "2. OG", area: "Lehrpersonenflügel", image: "201.jpg", free: 5, total: 8, features: ["besonders ruhig", "Einzelarbeit", "Fenster"] },
  { id: "224", name: "QuietSpace 224", floor: "og2", floorLabel: "2. OG", area: "Nordflügel", image: "204.jpg", free: 4, total: 6, features: ["Langzeitreservation", "Steckdosen"] },
  { id: "H4", name: "QuietSpace H4", floor: "og3", floorLabel: "3. OG", area: "H-Gebäude", image: "H4.jpg", free: 3, total: 4, features: ["kurze Lernphasen", "Sofas", "Steckdosen"] },
  { id: "310", name: "QuietSpace 310", floor: "og3", floorLabel: "3. OG", area: "Verwaltung", image: "108.jpg", free: 3, total: 4, features: ["Sitzungsnähe", "klein", "ruhig"] },
];

const floors = [
  { id: "ug", label: "UG", title: "Untergeschoss", note: "Technikraum, Lager und ruhige Einzelplätze" },
  { id: "eg", label: "EG", title: "Erdgeschoss", note: "Eingang, Empfang, Bibliothek und QuietSpaces" },
  { id: "og1", label: "1. OG", title: "Erster Stock", note: "Informatikräume, Lernzone und Gruppenplätze" },
  { id: "og2", label: "2. OG", title: "Zweiter Stock", note: "Lehrpersonenbereich und besonders ruhige Räume" },
  { id: "og3", label: "3. OG", title: "Dritter Stock", note: "Verwaltung, Sitzungszimmer und kleine Lernräume" },
];

const seatsByRoom = {
  A01: makeSeats("A01", 6, [2, 4, 6], [1], [6]),
  E06: makeSeats("E06", 8, [1, 2, 4, 6, 8], [1, 5], [7]),
  E08: makeSeats("E08", 6, [1, 2, 3, 4, 5, 6], [2], []),
  E12: makeSeats("E12", 6, [1, 3, 5], [4], []),
  101: makeSeats("101", 6, [2, 3, 6], [5], []),
  114: makeSeats("114", 10, [1, 2, 5, 6, 9, 10], [3, 8], []),
  207: makeSeats("207", 8, [1, 4, 5, 8], [2], []),
  224: makeSeats("224", 6, [1, 2, 3, 4, 5, 6], [5], []),
  H4: makeSeats("H4", 4, [1, 2, 3, 4], [], []),
  310: makeSeats("310", 4, [1, 4], [2], []),
};

const roomLayouts = {
  default: {
    windows: [
      { className: "top-left", label: "Fenster" },
      { className: "top-right", label: "Fenster" },
      { className: "right-upper", label: "Fenster" },
      { className: "right-lower", label: "Fenster" },
      { className: "bottom-left", label: "Fenster" },
      { className: "bottom-right", label: "Fenster" },
    ],
    details: [
      { type: "door", className: "door-main", label: "Tür" },
      { type: "board", className: "board-main", label: "Whiteboard" },
      { type: "shelf", className: "shelf-main", label: "Regal" },
      { type: "shelf", className: "shelf-side", label: "Regal" },
      { type: "carpet", className: "carpet-main", label: "Teppich" },
      { type: "sofa", className: "sofa-left", label: "Sofa" },
      { type: "sofa", className: "sofa-right", label: "Sofa" },
      { type: "plant", className: "plant-one", label: "Pflanze" },
      { type: "plant", className: "plant-two", label: "Pflanze" },
      { type: "plant", className: "plant-three", label: "Pflanze" },
      { type: "plant", className: "plant-four", label: "Pflanze" },
      { type: "plant", className: "plant-five", label: "Pflanze" },
      { type: "lamp", className: "lamp-one", label: "Lampe" },
      { type: "lamp", className: "lamp-two", label: "Lampe" },
      { type: "bin", className: "bin-main", label: "Abfall" },
      { type: "outlet", className: "wall-outlet outlet-a", label: "Steckdose" },
      { type: "outlet", className: "wall-outlet outlet-b", label: "Steckdose" },
      { type: "outlet", className: "wall-outlet outlet-c", label: "Steckdose" },
      { type: "outlet", className: "wall-outlet outlet-d", label: "Steckdose" },
    ],
    seats: [
      { left: 18, top: 31, rotation: -4 },
      { left: 34, top: 25, rotation: 3 },
      { left: 54, top: 31, rotation: -2 },
      { left: 72, top: 28, rotation: 4 },
      { left: 23, top: 56, rotation: 3 },
      { left: 41, top: 65, rotation: -3 },
      { left: 59, top: 55, rotation: 2 },
      { left: 76, top: 63, rotation: -4 },
      { left: 47, top: 43, rotation: 1 },
      { left: 66, top: 45, rotation: -2 },
    ],
  },
};

const reservations = [
  { person: "Lernende Person", room: "E06", seat: "2", date: "2026-09-09", start: "13:00", end: "14:30", time: "Heute, 13:00-14:30", status: "Reserviert" },
  { person: "Lernende Person", room: "101", seat: "5", date: "2026-09-09", start: "09:00", end: "10:00", time: "Heute, 09:00-10:00", status: "Eingecheckt" },
  { person: "Lernende Person", room: "E12", seat: "3", date: "2026-09-10", start: "15:15", end: "16:30", time: "Do, 15:15-16:30", status: "Reserviert" },
  { person: "Lernende Person", room: "207", seat: "1", date: "2026-09-11", start: "08:00", end: "09:30", time: "Fr, 08:00-09:30", status: "Reserviert" },
  { person: "Lernende Person", room: "H4", seat: "4", date: "2026-09-04", start: "10:00", end: "11:00", time: "Letzte Woche, 10:00-11:00", status: "Eingecheckt" },
  { person: "Leo Meier", room: "H4", seat: "1", date: "2026-09-09", start: "12:00", end: "12:45", time: "Heute, 12:00-12:45", status: "Verpasst" },
  { person: "Sara Yilmaz", room: "E06", seat: "4", date: "2026-09-09", start: "15:00", end: "16:00", time: "Heute, 15:00-16:00", status: "Reserviert" },
  { person: "Martin Keller", room: "E06", seat: "7", date: "2026-09-09", start: "06:00", end: "18:00", time: "Mo-Di, ganztags", status: "Sperre", comment: "Steckdose defekt" },
];

const students = [
  { name: "Sara Yilmaz", klass: "Med22a", warnings: 0, status: "Berechtigt", room: "E06", note: "Nutzt QuietSpaces vor Prüfungen regelmässig." },
  { name: "Leo Meier", klass: "Inf23b", warnings: 1, status: "Berechtigt", room: "H4", note: "Eine verpasste Reservation wegen Stundenplanänderung." },
  { name: "Mira Huber", klass: "Inf24a", warnings: 2, status: "Gesperrt", room: "-", note: "Berechtigung bis zur Rücksprache entzogen." },
  { name: "Noah Frei", klass: "Med21c", warnings: 0, status: "Berechtigt", room: "101", note: "Regeltest bestanden." },
];

function makeSeats(roomId, total, outletNumbers, bookedNumbers, blockedNumbers) {
  return Array.from({ length: total }, (_, index) => {
    const number = index + 1;
    return {
      id: `${roomId}-${number}`,
      label: String(number),
      outlet: outletNumbers.includes(number),
      status: blockedNumbers.includes(number) ? "blocked" : bookedNumbers.includes(number) ? "booked" : "free",
      zone: number % 3 === 0 ? "Fensterplatz" : number % 2 === 0 ? "Sofa-Nähe" : "Einzeltisch",
    };
  });
}

function getSeatsForRoom(roomId) {
  return seatsByRoom[roomId] || [];
}

const seatBlockStorageKey = "quietspace-seat-blocks";

function restoreSeatBlocks() {
  try {
    const savedBlocks = JSON.parse(window.localStorage.getItem(seatBlockStorageKey) || "{}");
    Object.entries(savedBlocks).forEach(([roomId, blockedSeatLabels]) => {
      if (!Array.isArray(blockedSeatLabels)) return;
      getSeatsForRoom(roomId).forEach((seat) => {
        if (seat.status !== "booked") seat.status = blockedSeatLabels.includes(seat.label) ? "blocked" : "free";
      });
    });
  } catch (error) {
    window.localStorage.removeItem(seatBlockStorageKey);
  }
}

function saveSeatBlocks() {
  const blockedByRoom = Object.fromEntries(Object.entries(seatsByRoom).map(([roomId, seats]) => [
    roomId,
    seats.filter((seat) => seat.status === "blocked").map((seat) => seat.label),
  ]));
  window.localStorage.setItem(seatBlockStorageKey, JSON.stringify(blockedByRoom));
}

restoreSeatBlocks();

function getRoomStats(roomId) {
  const seats = getSeatsForRoom(roomId);
  const blocked = seats.filter((seat) => seat.status === "blocked").length;
  const booked = seats.filter((seat) => seat.status === "booked").length;
  const powered = seats.filter((seat) => seat.outlet).length;
  return {
    total: seats.length,
    available: seats.length - blocked,
    blocked,
    booked,
    powered,
  };
}

function timeToMinutes(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("de-CH", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

const teachers = ["Frau Keller", "Herr Baumann", "Frau Rossi", "Herr Meier"];

const roomBlueprints = {
  A01: { accent: "Techniktrakt", plants: [[8,18],[84,18],[10,72]], fixtures: [["whiteboard",28,8,30,6],["shelf",72,10,16,8],["sofa",64,72,22,9],["door",4,88,15,7]] },
  E06: { accent: "Eingang Süd", plants: [[8,16],[88,18],[8,77],[86,74],[47,82]], fixtures: [["window",22,2,24,4],["window",55,2,26,4],["sofa",68,68,20,9],["shelf",6,38,8,24],["door",42,90,16,7],["whiteboard",35,10,28,6]] },
  E12: { accent: "Bibliothek", plants: [[10,15],[88,15],[12,78],[84,78],[52,18],[50,82]], fixtures: [["shelf",5,28,10,32],["shelf",84,28,10,32],["sofa",35,70,30,10],["window",28,2,44,4],["door",43,90,14,7],["carpet",35,38,30,22]] },
  "101": { accent: "Informatikgang", plants: [[8,16],[89,76],[49,82]], fixtures: [["window",18,2,25,4],["window",58,2,25,4],["whiteboard",32,10,36,6],["shelf",84,34,9,24],["door",5,88,15,7],["carpet",38,62,24,15]] },
  "114": { accent: "Lernzone Ost", plants: [[7,14],[92,14],[8,80],[91,79],[31,82],[69,82]], fixtures: [["window",20,2,22,4],["window",58,2,22,4],["whiteboard",36,9,28,6],["shelf",5,35,8,28],["shelf",87,35,8,28],["door",43,90,14,7]] },
  "207": { accent: "Lehrpersonenflügel", plants: [[8,16],[89,16],[9,78],[88,78]], fixtures: [["window",18,2,24,4],["window",58,2,24,4],["sofa",68,70,22,9],["shelf",6,40,9,22],["whiteboard",35,10,30,6],["door",42,90,16,7]] },
  "224": { accent: "Nordflügel", plants: [[8,18],[89,18],[8,78],[89,78],[48,82]], fixtures: [["window",22,2,24,4],["window",55,2,24,4],["whiteboard",35,9,30,6],["shelf",85,35,9,26],["sofa",10,69,20,9],["door",42,90,16,7]] },
  H4: { accent: "H-Gebäude", plants: [[10,16],[87,18],[10,80],[86,80],[48,16]], fixtures: [["window",28,2,44,4],["sofa",20,70,24,10],["sofa",58,70,24,10],["shelf",84,34,9,24],["door",42,90,16,7],["carpet",38,43,24,18]] },
  "310": { accent: "Verwaltung", plants: [[9,17],[88,17],[10,79],[87,78]], fixtures: [["window",28,2,44,4],["whiteboard",35,10,30,6],["shelf",6,36,9,26],["sofa",68,70,20,9],["door",42,90,16,7],["carpet",38,47,24,16]] },
};

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const sidebar = document.querySelector("#sidebar");

function render(focusSelector = "") {
  syncRouteHash();
  document.body.classList.toggle("teacher", state.role === "teacher");
  document.body.classList.toggle("sidebar-collapsed", state.sidebarCollapsed);
  document.body.classList.toggle("sidebar-open", !state.sidebarCollapsed);
  const roleSelect = document.querySelector("#roleSelect");
  if (roleSelect) roleSelect.value = state.role;
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.route === state.route));

  const views = {
    start: renderStart,
    rules: renderRules,
    booking: renderBooking,
    reservations: renderReservations,
    map: renderMap,
    help: renderHelp,
    students: renderStudents,
  };

  app.innerHTML = (views[state.route] || renderStart)();
  bindViewEvents();
  if (focusSelector) {
    const focusTarget = focusSelector === "#app" ? (app.querySelector("h1, h2") || app) : document.querySelector(focusSelector);
    if (focusTarget) {
      if (focusSelector === "#app" && focusTarget !== app) focusTarget.setAttribute("tabindex", "-1");
      focusTarget.focus();
      if ("selectionStart" in focusTarget) {
        const end = focusTarget.value.length;
        focusTarget.setSelectionRange(end, end);
      }
    }
  }
}

function pageHeader(kicker, title, text, action = "") {
  return `
    <div class="screen-header">
      <div>
        <p class="eyebrow">${kicker}</p>
        <h1>${title}</h1>
        <p class="muted">${text}</p>
      </div>
      ${action}
    </div>`;
}

function renderStart() {
  return `
    <section class="screen">
      <section class="start-hero">
        <p class="eyebrow">Startseite</p>
        <h1>QuietSpace</h1>
        <p class="start-text">
          QuietSpace ist eine webbasierte Anwendung für ruhige Lernräume in der Schule.
          Lernende können verfügbare Arbeitsplätze ansehen, einen Raum und Platz auswählen,
          Reservationen verwalten und vor der ersten Buchung die Regeln mit einem kurzen Test bestätigen.
        </p>
        <p class="start-text">
          Lehrpersonen erhalten zusätzlich eine Übersicht über Buchungen, Check-ins, verpasste Reservationen,
          gesperrte Arbeitsplätze und die Berechtigung der Lernenden.
        </p>
      </section>
    </section>`;
}

function renderRules() {
  const action = state.testPassed
    ? `<span class="status checked">Regeltest bestanden</span>`
    : `<button class="primary" data-action="open-test">Regeltest starten</button>`;

  const rules = [
    ["Ruhe einhalten", "Sprich nicht und telefoniere nicht. Audio ist nur mit Kopfhörern und ohne hörbare Geräusche erlaubt."],
    ["Reservation respektieren", "Nutze nur den Platz und Zeitraum, den du reserviert hast."],
    ["Pünktlich einchecken", "Checke innerhalb von 5 Minuten nach Beginn deiner Reservation ein."],
    ["Nicht benötigte Buchungen stornieren", "Gib deinen Platz frühzeitig frei, wenn du ihn nicht mehr brauchst."],
    ["Arbeitsplatz sauber hinterlassen", "Nimm Abfall, Papier und persönliche Gegenstände nach der Nutzung mit."],
    ["Essen vermeiden", "Im QuietSpace sind nur Getränke in verschliessbaren Behältern erlaubt."],
    ["Andere nicht stören", "Vermeide lautes Tippen, Videos, Spiele oder andere störende Aktivitäten."],
    ["Ausstattung sorgfältig behandeln", "Tische, Stühle, Steckdosen und weitere Einrichtungen dürfen nicht beschädigt oder zweckentfremdet werden."],
    ["Plätze nicht blockieren", "Reserviere keine zusätzlichen Plätze für Freunde, Taschen oder Materialien."],
    ["Anweisungen beachten", "Hinweise von Lehrpersonen sowie temporäre Sperrungen einzelner Plätze oder Räume sind verbindlich."],
  ];

  return `
    <section class="screen">
      ${pageHeader("Regeln", "QuietSpace-Regeln", "Lies die Regeln aufmerksam. Vor der ersten Reservation muss der Regeltest mit mindestens 75 Prozent bestanden werden.", action)}
      <section class="panel rules-panel">
        <div class="screen-header">
          <div>
            <h2>10 Regeln für den QuietSpace</h2>
            <p class="muted">Die Regeln sorgen dafür, dass der Raum ruhig, fair und für alle nutzbar bleibt.</p>
          </div>
        </div>
        <ul class="rule-list rule-list-ten">
          ${rules.map((rule, index) => `<li><span class="rule-icon">${index + 1}</span><div><strong>${rule[0]}</strong><p class="muted">${rule[1]}</p></div></li>`).join("")}
        </ul>
        <div class="rule-test-note">
          <strong>${state.testPassed ? "Regeltest abgeschlossen" : "Regeltest"}</strong>
          <p class="muted">${state.testPassed ? "Du hast den Test bestanden. Er kann nicht erneut gestartet werden." : "Der Test enthält drei Fragen und insgesamt vier Punkte. Bei der ersten Frage sind zwei Antworten richtig."}</p>
        </div>
      </section>
    </section>`;
}

function renderBooking() {
  const selectedRoom = rooms.find((room) => room.id === state.selectedRoom);
  const selectedSeat = getSeatsForRoom(state.selectedRoom).find((seat) => seat.id === state.selectedSeat);
  const steps = ["Raum wählen", "Platz auswählen", "Datum & Zeit", "Zusammenfassung", "Bestätigung"];
  const content = [
    renderBookingRoomStep,
    renderBookingSeatStep,
    renderBookingTimeStep,
    renderBookingSummaryStep,
    renderBookingConfirmationStep,
  ][state.bookingStep - 1]({ selectedRoom, selectedSeat });

  return `
    <section class="screen">
      ${pageHeader(state.role === "teacher" ? "Buchen Lehrpersonen" : "Buchen", "Arbeitsplatz reservieren", state.role === "teacher" ? "Lehrpersonen können buchen, bestehende Buchungen bearbeiten oder Plätze als Sperre markieren." : "Wähle Raum, Tisch, Datum und Zeit. Danach prüfst du die Zusammenfassung und bestätigst die Reservation.")}
      <div class="stepper">
        ${steps.map((label, index) => `<div class="step ${index + 1 === state.bookingStep ? "active" : index + 1 < state.bookingStep ? "done" : ""}"><span class="step-number">${index + 1}</span><span>${label}</span></div>`).join("")}
      </div>
      ${content}
    </section>`;
}

function renderBookingRoomStep() {
  return `
    <section class="panel">
      <div class="screen-header">
        <div>
          <h2>Raum wählen</h2>
          <p class="muted">Die Verfügbarkeitszahl berücksichtigt nur von Lehrpersonen gesperrte Plätze. Bereits reservierte Plätze sind im Raumplan trotzdem nicht auswählbar.</p>
        </div>
      </div>
      <div class="grid three">
        ${rooms.map(roomCard).join("")}
      </div>
    </section>`;
}

function renderBookingSeatStep({ selectedRoom }) {
  if (!selectedRoom) {
    state.bookingStep = 1;
    return renderBookingRoomStep();
  }
  const stats = getRoomStats(selectedRoom.id);
  return `
    <section class="panel">
      <div class="screen-header">
        <div>
          <h2>Platz in ${selectedRoom.name} auswählen</h2>
          <p class="muted">${selectedRoom.floorLabel} · ${stats.available}/${stats.total} Plätze nutzbar · ${stats.powered} Plätze mit Strom · ${stats.blocked} gesperrt</p>
        </div>
        <button class="secondary" data-action="booking-back">Raum ändern</button>
      </div>
      <div class="room-toolbar">
        <label class="switch-line"><input id="outletToggle" type="checkbox" ${state.showOutlets ? "checked" : ""}><span class="switch-ui"></span><span>Kabel-/Strom-Icons anzeigen</span></label>
        ${state.role === "teacher" ? `<button class="${state.teacherBlockMode ? "danger" : "secondary"}" data-action="toggle-seat-block-mode" type="button" aria-pressed="${state.teacherBlockMode}">${state.teacherBlockMode ? "Sperrmodus beenden" : "Plätze sperren / freigeben"}</button>` : ""}
        <div class="room-status-chips"><span>${stats.available}/${stats.total} nutzbar</span><span>${stats.powered} mit Strom</span><span>${stats.booked} aktuell belegt</span></div>
      </div>
      ${state.role === "teacher" && state.teacherBlockMode ? `<div class="seat-block-instructions" role="status"><strong>Sperrmodus aktiv</strong><span>Klicke auf einen freien Platz, um ihn zu sperren. Klicke auf einen gesperrten Platz, um ihn wieder freizugeben. Bereits reservierte Plätze können nicht verändert werden.</span></div>` : ""}
      <div class="booking-layout seat-step-layout">
        <figure class="selected-room-photo">
          <img src="roomes_images/${selectedRoom.image}" alt="${selectedRoom.name}">
          <figcaption><strong>${selectedRoom.name}</strong><span>${selectedRoom.area} · ${selectedRoom.floorLabel}</span></figcaption>
        </figure>
        <div class="seat-map ${state.showOutlets ? "show-outlets" : ""}">
          <div class="map-title-row"><div><h3>Detaillierter Raumplan</h3><p class="muted">Möblierung und Pflanzen sind raumspezifisch dargestellt.</p></div><span class="plan-room-label">${selectedRoom.id}</span></div>
          ${renderBookingRoomPlan(selectedRoom)}
          <div class="legend detailed-legend">
            <span class="free">frei auswählbar</span><span class="busy">bereits reserviert</span><span class="blocked">durch Lehrperson gesperrt</span><span class="legend-plant">Pflanze</span><span class="legend-window">Fenster</span><span class="legend-sofa">Sofa/Mobiliar</span><span class="socket-legend">Stromanschluss</span>
          </div>
        </div>
      </div>
    </section>`;
}

function renderBookingTimeStep({ selectedRoom, selectedSeat }) {
  if (!selectedRoom) { state.bookingStep = 1; return renderBookingRoomStep(); }
  if (!selectedSeat) { state.bookingStep = 2; return renderBookingSeatStep({ selectedRoom }); }
  const draft = state.bookingDraft;
  return `
    <section class="panel booking-time-panel">
      <div class="screen-header">
        <div><h2>Datum und Zeit wählen</h2><p class="muted">Die Tagesansicht zeigt den Zeitraum von 06:00 bis 18:00 in einer Outlook-ähnlichen Zeitachse.</p></div>
        <button class="secondary" data-action="booking-back">Platz ändern</button>
      </div>
      <div class="booking-time-layout">
        <div class="booking-form-column">
          <div class="booking-mode-card">
            <label class="switch-line emphasis"><input type="checkbox" id="longTermToggle" ${state.longTermEnabled ? "checked" : ""}><span class="switch-ui"></span><span>Langzeitreservation</span></label>
            <p class="muted">Für regelmässige Lernzeiten über mehrere Wochen. Langzeitreservationen benötigen eine Freigabe durch eine Lehrperson.</p>
          </div>
          <div id="singleBookingFields" ${state.longTermEnabled ? "hidden" : ""}>
            <div class="form-grid">
              <label class="field"><span>Datum</span><input id="bookingDate" type="date" value="${draft.date}"></label>
              <label class="field"><span>Start</span><input id="bookingStart" type="time" min="06:00" max="18:00" value="${draft.start}"></label>
              <label class="field"><span>Ende</span><input id="bookingEnd" type="time" min="06:00" max="18:00" value="${draft.end}"></label>
            </div>
          </div>
          <div id="longTermFields" class="longterm-panel" ${state.longTermEnabled ? "" : "hidden"}>
            <div class="longterm-heading"><div><strong>Wiederholung festlegen</strong><p class="muted">Wähle Tage, Zeitraum und zuständige Lehrperson.</p></div><span class="approval-pill ${state.longTermApproval}">${state.longTermApproval === "approved" ? "Freigegeben" : state.longTermApproval === "pending" ? "Freigabe ausstehend" : "Noch nicht angefragt"}</span></div>
            <div class="weekday-picker">
              ${["Mo","Di","Mi","Do","Fr"].map(day => `<label><input type="checkbox" name="longDay" value="${day}" ${draft.weekdays.includes(day) ? "checked" : ""}><span>${day}</span></label>`).join("")}
            </div>
            <div class="form-grid">
              <label class="field"><span>Beginn der Serie</span><input id="longStartDate" type="date" value="${draft.longTermStart}"></label>
              <label class="field"><span>Ende der Serie</span><input id="longEndDate" type="date" value="${draft.longTermEnd}"></label>
              <label class="field"><span>Zeit von</span><input id="longStartTime" type="time" min="06:00" max="18:00" value="${draft.start}"></label>
              <label class="field"><span>Zeit bis</span><input id="longEndTime" type="time" min="06:00" max="18:00" value="${draft.end}"></label>
              <label class="field"><span>Lehrperson für Freigabe</span><select id="longTeacher"><option value="">Bitte wählen</option>${teachers.map(t => `<option ${draft.teacher === t ? "selected" : ""}>${t}</option>`).join("")}</select></label>
              <label class="field"><span>Zweck</span><select id="longPurpose"><option>Prüfungsvorbereitung</option><option>Projektarbeit</option><option>Nachhilfe</option><option>Individuelle Lernzeit</option></select></label>
            </div>
            <label class="field"><span>Begründung / Notiz</span><textarea id="longNote" rows="3" placeholder="Warum brauchst du die wiederkehrende Reservation?">Regelmässige ruhige Lernzeit.</textarea></label>
            <div class="approval-actions">
              ${state.role === "student" ? `<button class="secondary" type="button" data-action="request-approval">Lehrperson benachrichtigen</button>` : ""}
              ${state.role === "teacher" && state.longTermApproval === "pending" ? `<button class="primary" type="button" data-action="approve-longterm">Langzeitreservation freigeben</button>` : ""}
            </div>
          </div>
          <div class="action-row booking-next-row"><button class="primary" data-action="booking-next">Weiter zur Zusammenfassung</button></div>
        </div>
        <div class="outlook-wrap">
          <div class="outlook-head"><div><strong>${formatDate(draft.date)}</strong><span>${selectedRoom.name} · Tisch ${selectedSeat.label}</span></div><span class="outlook-badge">06:00–18:00</span></div>
          ${outlookDayCalendar(selectedRoom, selectedSeat)}
        </div>
      </div>
    </section>`;
}


function planIcon(type, title = "") {
  const common = `class="plan-svg-icon" viewBox="0 0 24 24" aria-hidden="true"`;
  const label = title ? `<span class="sr-only">${title}</span>` : "";
  const icons = {
    plant: `<svg ${common}><path d="M12 21v-8"/><path d="M12 13c-4 0-7-2.4-7-6 4 0 7 2 7 6Z"/><path d="M12 13c4 0 7-2.4 7-6-4 0-7 2-7 6Z"/><path d="M8 21h8"/></svg>`,
    table: `<svg ${common}><rect x="4" y="6" width="16" height="9" rx="2"/><path d="M7 15v6M17 15v6"/></svg>`,
    chair: `<svg ${common}><path d="M7 11h10v6H7z"/><path d="M8 11V6h8v5M8 17v4M16 17v4"/></svg>`,
    computer: `<svg ${common}><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6M12 16v4"/></svg>`,
    power: `<svg ${common}><path d="M9 3v6M15 3v6"/><path d="M7 8h10v3a5 5 0 0 1-5 5v5"/></svg>`,
    lamp: `<svg ${common}><path d="M7 18h10M12 18v3M8 14l4-9 4 9H8Z"/></svg>`,
    shelf: `<svg ${common}><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 9h16M4 15h16M9 3v6M14 9v6M8 15v6"/></svg>`,
    whiteboard: `<svg ${common}><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21l2-4M16 21l-2-4M8 9h8M8 12h5"/></svg>`,
    pinboard: `<svg ${common}><rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="8" cy="8" r="1"/><circle cx="16" cy="11" r="1"/><path d="M8 9v5M16 12v4"/></svg>`,
    divider: `<svg ${common}><path d="M5 3v18M19 3v18M5 5h14M5 19h14"/><path d="M8 8h8v8H8z"/></svg>`,
    sofa: `<svg ${common}><path d="M5 10V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2"/><path d="M4 10h16a2 2 0 0 1 2 2v6H2v-6a2 2 0 0 1 2-2Z"/><path d="M5 18v3M19 18v3"/></svg>`,
    storage: `<svg ${common}><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M5 10h14M10 6h4M10 14h4"/></svg>`,
    tv: `<svg ${common}><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
    printer: `<svg ${common}><path d="M7 8V3h10v5"/><rect x="4" y="8" width="16" height="9" rx="2"/><path d="M7 14h10v7H7z"/><circle cx="17" cy="11" r="1"/></svg>`,
    stairs: `<svg ${common}><path d="M3 19h5v-4h4v-4h4V7h5"/><path d="M15 3h6v6"/></svg>`,
    lift: `<svg ${common}><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M12 7v10M9 10l3-3 3 3M9 14l3 3 3-3"/></svg>`,
    wc: `<svg ${common}><circle cx="8" cy="6" r="2"/><path d="M8 8v6M5 12h6M7 14l-1 7M9 14l1 7"/><circle cx="17" cy="6" r="2"/><path d="M17 8v6M14 11h6M16 14l-1 7M18 14l1 7"/></svg>`,
    fire: `<svg ${common}><path d="M10 3h4v4h2l2 3v11H6V10l2-3h2V3Z"/><path d="M9 14h6M9 17h6"/></svg>`,
    locker: `<svg ${common}><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M12 3v18M8 8h1M15 8h1"/></svg>`,
    door: `<svg ${common}><path d="M5 21V4h12v17M8 21V7h6v14"/><circle cx="12" cy="14" r="1"/></svg>`,
    window: `<svg ${common}><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M12 5v14M3 12h18"/></svg>`,
    books: `<svg ${common}><path d="M4 5h4v14H4zM9 3h4v16H9zM14 6h5v13h-5z"/></svg>`,
  };
  return `<span class="plan-icon-wrap">${icons[type] || icons.table}${label}</span>`;
}

function getRoomPlanSpec(roomId) {
  const specs = {
    A01: {
      theme: "lounge",
      windows: [{ side: "top", from: 35, span: 30 }],
      door: { side: "bottom", at: 12 },
      items: [
        { kind: "shelf", c: 1, r: 2, cs: 1, rs: 12 },
        { kind: "shelf", c: 24, r: 2, cs: 1, rs: 10 },
        { kind: "sofa", c: 3, r: 4, cs: 5, rs: 5 },
        { kind: "sofa", c: 3, r: 10, cs: 4, rs: 3 },
        { kind: "table", c: 8, r: 7, cs: 4, rs: 3 },
        { kind: "plant", c: 8, r: 2, cs: 2, rs: 2 },
        { kind: "plant", c: 21, r: 2, cs: 2, rs: 2 },
        { kind: "plant", c: 21, r: 13, cs: 2, rs: 2 },
        { kind: "studytable", c: 14, r: 5, cs: 7, rs: 5, seatRefs: ["1","2","3","4","5","6"] },
        { kind: "lamp", c: 2, r: 2, cs: 1, rs: 2 },
      ],
      seats: [
        { label: "1", c: 15, r: 3 }, { label: "2", c: 18, r: 3 },
        { label: "3", c: 15, r: 10 }, { label: "4", c: 18, r: 10 },
        { label: "5", c: 12, r: 6 }, { label: "6", c: 21, r: 6 },
      ],
    },
    E06: {
      theme: "focus",
      windows: [{ side: "top", from: 37, span: 28 }],
      door: { side: "bottom", at: 46 },
      items: [
        { kind: "shelf", c: 1, r: 2, cs: 1, rs: 12 },
        { kind: "focusdesk", c: 2, r: 2, cs: 5, rs: 2, seatRefs: ["1"] },
        { kind: "focusdesk", c: 2, r: 5, cs: 5, rs: 2, seatRefs: ["2"] },
        { kind: "focusdesk", c: 2, r: 8, cs: 5, rs: 2, seatRefs: ["3"] },
        { kind: "focusdesk", c: 2, r: 11, cs: 5, rs: 2, seatRefs: ["4"] },
        { kind: "focusdesk", c: 18, r: 2, cs: 5, rs: 2, seatRefs: ["5"] },
        { kind: "focusdesk", c: 18, r: 5, cs: 5, rs: 2, seatRefs: ["6"] },
        { kind: "focusdesk", c: 18, r: 8, cs: 5, rs: 2, seatRefs: ["7"] },
        { kind: "focusdesk", c: 18, r: 11, cs: 5, rs: 2, seatRefs: ["8"] },
        { kind: "plant", c: 8, r: 2, cs: 2, rs: 2 },
        { kind: "plant", c: 15, r: 13, cs: 2, rs: 2 },
        { kind: "pinboard", c: 23, r: 3, cs: 1, rs: 5 },
      ],
      seats: [
        { label: "1", c: 7, r: 2 }, { label: "2", c: 7, r: 5 }, { label: "3", c: 7, r: 8 }, { label: "4", c: 7, r: 11 },
        { label: "5", c: 16, r: 2 }, { label: "6", c: 16, r: 5 }, { label: "7", c: 16, r: 8 }, { label: "8", c: 16, r: 11 },
      ],
    },
    E08: {
      theme: "power-focus",
      windows: [{ side: "top", from: 38, span: 26 }],
      door: { side: "bottom", at: 46 },
      items: [
        { kind: "focusdesk", c: 2, r: 3, cs: 5, rs: 2, seatRefs: ["1"] },
        { kind: "focusdesk", c: 2, r: 7, cs: 5, rs: 2, seatRefs: ["2"] },
        { kind: "focusdesk", c: 2, r: 11, cs: 5, rs: 2, seatRefs: ["3"] },
        { kind: "focusdesk", c: 18, r: 3, cs: 5, rs: 2, seatRefs: ["4"] },
        { kind: "focusdesk", c: 18, r: 7, cs: 5, rs: 2, seatRefs: ["5"] },
        { kind: "focusdesk", c: 18, r: 11, cs: 5, rs: 2, seatRefs: ["6"] },
        { kind: "plant", c: 8, r: 2, cs: 2, rs: 2 },
        { kind: "plant", c: 14, r: 13, cs: 2, rs: 2 },
        { kind: "shelf", c: 24, r: 3, cs: 1, rs: 8 },
      ],
      seats: [
        { label: "1", c: 7, r: 3 }, { label: "2", c: 7, r: 7 }, { label: "3", c: 7, r: 11 },
        { label: "4", c: 16, r: 3 }, { label: "5", c: 16, r: 7 }, { label: "6", c: 16, r: 11 },
      ],
    },
    E12: {
      theme: "open-study",
      windows: [{ side: "top", from: 12, span: 27 }, { side: "top", from: 48, span: 32 }],
      door: { side: "left", at: 72 },
      items: [
        { kind: "studytable", c: 3, r: 4, cs: 6, rs: 4, seatRefs: ["1","2"] },
        { kind: "studytable", c: 10, r: 6, cs: 6, rs: 4, seatRefs: ["3","4"] },
        { kind: "studytable", c: 17, r: 8, cs: 5, rs: 4, seatRefs: ["5","6"] },
        { kind: "plant", c: 2, r: 2, cs: 2, rs: 2 },
        { kind: "plant", c: 9, r: 2, cs: 2, rs: 2 },
        { kind: "plant", c: 16, r: 2, cs: 2, rs: 2 },
        { kind: "plant", c: 21, r: 13, cs: 2, rs: 2 },
        { kind: "shelf", c: 1, r: 6, cs: 1, rs: 7 },
        { kind: "whiteboard", c: 23, r: 4, cs: 1, rs: 6 },
      ],
      seats: [
        { label: "1", c: 4, r: 2 }, { label: "2", c: 5, r: 8 },
        { label: "3", c: 11, r: 4 }, { label: "4", c: 12, r: 10 },
        { label: "5", c: 18, r: 6 }, { label: "6", c: 19, r: 12 },
      ],
    },
    "101": {
      theme: "library",
      windows: [{ side: "top", from: 30, span: 34 }],
      door: { side: "bottom", at: 14 },
      items: [
        { kind: "shelf", c: 1, r: 2, cs: 2, rs: 12 },
        { kind: "shelf", c: 23, r: 2, cs: 2, rs: 12 },
        { kind: "sofa", c: 4, r: 2, cs: 3, rs: 3 },
        { kind: "plant", c: 4, r: 12, cs: 2, rs: 2 },
        { kind: "plant", c: 20, r: 13, cs: 2, rs: 2 },
        { kind: "studytable", c: 8, r: 4, cs: 8, rs: 8, seatRefs: ["1","2","3","4","5","6"] },
        { kind: "focusdesk", c: 19, r: 4, cs: 3, rs: 3 },
        { kind: "focusdesk", c: 19, r: 9, cs: 3, rs: 3 },
        { kind: "lamp", c: 5, r: 6, cs: 1, rs: 2 },
      ],
      seats: [
        { label: "1", c: 6, r: 4 }, { label: "2", c: 6, r: 7 }, { label: "3", c: 6, r: 10 },
        { label: "4", c: 16, r: 4 }, { label: "5", c: 16, r: 7 }, { label: "6", c: 16, r: 10 },
      ],
    },
    "114": {
      theme: "computer",
      windows: [{ side: "top", from: 36, span: 28 }],
      door: { side: "bottom", at: 16 },
      items: [
        ...[2,4,6,8,10].map((r, i) => ({ kind: "computerdesk", c: 2, r, cs: 5, rs: 2, seatRefs: [String(i + 1)] })),
        ...[2,4,6,8,10].map((r, i) => ({ kind: "computerdesk", c: 18, r, cs: 5, rs: 2, seatRefs: [String(i + 6)] })),
        { kind: "plant", c: 8, r: 2, cs: 2, rs: 2 },
        { kind: "plant", c: 14, r: 13, cs: 2, rs: 2 },
        { kind: "storage", c: 23, r: 12, cs: 1, rs: 3 },
      ],
      seats: [
        { label: "1", c: 7, r: 2 }, { label: "2", c: 7, r: 4 }, { label: "3", c: 7, r: 6 }, { label: "4", c: 7, r: 8 }, { label: "5", c: 7, r: 10 },
        { label: "6", c: 16, r: 2 }, { label: "7", c: 16, r: 4 }, { label: "8", c: 16, r: 6 }, { label: "9", c: 16, r: 8 }, { label: "10", c: 16, r: 10 },
      ],
    },
    "207": {
      theme: "project",
      windows: [{ side: "top", from: 34, span: 30 }],
      door: { side: "left", at: 75 },
      items: [
        { kind: "whiteboard", c: 23, r: 3, cs: 2, rs: 9 },
        { kind: "pinboard", c: 1, r: 3, cs: 2, rs: 8 },
        { kind: "studytable", c: 8, r: 5, cs: 8, rs: 6, seatRefs: ["1","2","3","4","5","6","7","8"] },
        { kind: "plant", c: 3, r: 2, cs: 2, rs: 2 },
        { kind: "plant", c: 20, r: 12, cs: 2, rs: 2 },
        { kind: "storage", c: 20, r: 3, cs: 2, rs: 3 },
      ],
      seats: [
        { label: "1", c: 8, r: 3 }, { label: "2", c: 11, r: 3 }, { label: "3", c: 14, r: 3 },
        { label: "4", c: 8, r: 11 }, { label: "5", c: 11, r: 11 }, { label: "6", c: 14, r: 11 },
        { label: "7", c: 6, r: 6 }, { label: "8", c: 16, r: 6 },
      ],
    },
    "224": {
      theme: "booths",
      windows: [{ side: "top", from: 39, span: 24 }],
      door: { side: "bottom", at: 12 },
      items: [
        { kind: "booth", c: 2, r: 2, cs: 5, rs: 3, seatRefs: ["1"] },
        { kind: "booth", c: 2, r: 6, cs: 5, rs: 3, seatRefs: ["2"] },
        { kind: "booth", c: 2, r: 10, cs: 5, rs: 3, seatRefs: ["3"] },
        { kind: "booth", c: 18, r: 2, cs: 5, rs: 3, seatRefs: ["4"] },
        { kind: "booth", c: 18, r: 6, cs: 5, rs: 3, seatRefs: ["5"] },
        { kind: "booth", c: 18, r: 10, cs: 5, rs: 3, seatRefs: ["6"] },
        { kind: "plant", c: 9, r: 2, cs: 2, rs: 2 },
        { kind: "plant", c: 14, r: 13, cs: 2, rs: 2 },
        { kind: "storage", c: 22, r: 13, cs: 2, rs: 2 },
      ],
      seats: [
        { label: "1", c: 7, r: 2 }, { label: "2", c: 7, r: 6 }, { label: "3", c: 7, r: 10 },
        { label: "4", c: 16, r: 2 }, { label: "5", c: 16, r: 6 }, { label: "6", c: 16, r: 10 },
      ],
    },
    H4: {
      theme: "flex",
      windows: [{ side: "top", from: 31, span: 38 }],
      door: { side: "left", at: 76 },
      items: [
        { kind: "whiteboard", c: 1, r: 3, cs: 2, rs: 8 },
        { kind: "tv", c: 23, r: 3, cs: 2, rs: 7 },
        { kind: "studytable", c: 4, r: 3, cs: 6, rs: 4, seatRefs: ["1"] },
        { kind: "studytable", c: 14, r: 3, cs: 6, rs: 4, seatRefs: ["2"] },
        { kind: "studytable", c: 4, r: 10, cs: 6, rs: 4, seatRefs: ["3"] },
        { kind: "studytable", c: 14, r: 10, cs: 6, rs: 4, seatRefs: ["4"] },
        { kind: "plant", c: 3, r: 2, cs: 2, rs: 2 },
        { kind: "plant", c: 20, r: 12, cs: 2, rs: 2 },
        { kind: "storage", c: 21, r: 3, cs: 1, rs: 5 },
      ],
      seats: [
        { label: "1", c: 10, r: 4 }, { label: "2", c: 12, r: 4 },
        { label: "3", c: 10, r: 11 }, { label: "4", c: 12, r: 11 },
      ],
    },
    "310": {
      theme: "meeting",
      windows: [{ side: "top", from: 35, span: 32 }],
      door: { side: "left", at: 74 },
      items: [
        { kind: "whiteboard", c: 1, r: 4, cs: 2, rs: 7 },
        { kind: "studytable", c: 8, r: 5, cs: 8, rs: 6, seatRefs: ["1","2","3","4"] },
        { kind: "plant", c: 4, r: 3, cs: 2, rs: 2 },
        { kind: "plant", c: 18, r: 4, cs: 2, rs: 2 },
        { kind: "pinboard", c: 22, r: 5, cs: 2, rs: 5 },
      ],
      seats: [
        { label: "1", c: 9, r: 3 }, { label: "2", c: 13, r: 3 },
        { label: "3", c: 9, r: 11 }, { label: "4", c: 13, r: 11 },
      ],
    },
  };
  return specs[roomId] || specs.E06;
}

function renderBookingRoomPlan(room) {
  const spec = getRoomPlanSpec(room.id);
  const roomSeats = getSeatsForRoom(room.id);
  const byLabel = Object.fromEntries(roomSeats.map((seat) => [seat.label, seat]));

  const renderItem = (item) => {
    const refs = item.seatRefs || [];
    const powered = refs.some((label) => byLabel[label]?.outlet);
    const iconMap = {
      shelf: "shelf", sofa: "sofa", table: "table", studytable: "table",
      focusdesk: "table", computerdesk: "computer", booth: "divider", plant: "plant",
      lamp: "lamp", whiteboard: "whiteboard", pinboard: "pinboard", storage: "storage", tv: "tv"
    };
    const titleMap = {
      shelf: "Bücherregal", sofa: "Lounge-Sitzplatz", table: "Beistelltisch", studytable: "Arbeitstisch",
      focusdesk: "Fokus-Arbeitsplatz", computerdesk: "Computerarbeitsplatz", booth: "Akustik-Fokusbox",
      plant: "Pflanze", lamp: "Arbeitsleuchte", whiteboard: "Whiteboard", pinboard: "Pinnwand",
      storage: "Stauraum", tv: "Bildschirm"
    };
    return `
      <span class="room-fixture fixture-${item.kind}" style="grid-column:${item.c} / span ${item.cs};grid-row:${item.r} / span ${item.rs}" title="${titleMap[item.kind] || item.kind}">
        ${planIcon(iconMap[item.kind] || "table", titleMap[item.kind] || item.kind)}
        ${powered ? `<span class="fixture-power ${state.showOutlets ? "visible" : ""}" title="Strom an diesem Tisch">${planIcon("power", "Stromanschluss")}</span>` : ""}
      </span>`;
  };

  const renderWindow = (item) => `<span class="room-edge-window ${item.side}" style="--from:${item.from}%;--span:${item.span}%" title="Fenster"></span>`;
  const door = spec.door ? `<span class="room-edge-door ${spec.door.side}" style="--at:${spec.door.at}%" title="Tür">${planIcon("door", "Tür")}</span>` : "";

  return `
    <div class="room-plan-shell room-theme-${spec.theme} ${state.showOutlets ? "show-outlets" : ""}" aria-label="Detaillierter Raumplan ${room.name}">
      ${spec.windows.map(renderWindow).join("")}
      ${door}
      <div class="room-plan-grid">
        ${spec.items.map(renderItem).join("")}
        ${spec.seats.map((slot) => {
          const seat = byLabel[slot.label];
          if (!seat) return "";
          return seatButton(seat, `grid-column:${slot.c} / span 2;grid-row:${slot.r} / span 2;`);
        }).join("")}
      </div>
    </div>`;
}


function outlookDayCalendar(room, seat) {
  const rows = [];
  for (let hour = 6; hour <= 18; hour += 1) rows.push(`${String(hour).padStart(2,"0")}:00`);
  const events = [
    { start: "08:30", end: "09:30", title: "Belegt", kind: "busy" },
    { start: "11:00", end: "12:15", title: "Belegt", kind: "busy" },
    { start: state.bookingDraft.start, end: state.bookingDraft.end, title: "Deine Auswahl", kind: "selected" },
    { start: "16:15", end: "17:00", title: "Belegt", kind: "busy" },
  ];
  const scale = 64;
  const startBase = 6 * 60;
  return `<div class="outlook-day">
    <div class="outlook-times">${rows.slice(0,-1).map(time => `<div>${time}</div>`).join("")}</div>
    <div class="outlook-day-grid">
      ${Array.from({length:24},(_,i)=>`<span class="half-hour-line" style="top:${i*32}px"></span>`).join("")}
      ${events.map(event => {
        const top = ((timeToMinutes(event.start)-startBase)/60)*scale;
        const height = Math.max(30,((timeToMinutes(event.end)-timeToMinutes(event.start))/60)*scale);
        return `<div class="calendar-event ${event.kind}" style="top:${top}px;height:${height}px"><strong>${event.title}</strong><span>${event.start}–${event.end}</span></div>`;
      }).join("")}
    </div>
  </div>`;
}

function renderBookingSummaryStep({ selectedRoom, selectedSeat }) {
  if (!selectedRoom) { state.bookingStep = 1; return renderBookingRoomStep(); }
  if (!selectedSeat) { state.bookingStep = 2; return renderBookingSeatStep({ selectedRoom }); }
  const d = state.bookingDraft;
  const canConfirm = !state.longTermEnabled || state.longTermApproval === "approved" || state.role === "teacher";
  return `
    <section class="panel summary-panel">
      <div class="screen-header"><div><p class="eyebrow">Schritt 4</p><h2>Reservation prüfen</h2><p class="muted">Alle wichtigen Angaben kompakt auf einen Blick.</p></div><button class="secondary" data-action="booking-back">Zeit ändern</button></div>
      <div class="summary-hero-card">
        <img src="roomes_images/${selectedRoom.image}" alt="${selectedRoom.name}">
        <div><span class="summary-kicker">${state.longTermEnabled ? "Langzeitreservation" : "Einzelreservation"}</span><h3>${selectedRoom.name} · Tisch ${selectedSeat.label}</h3><p>${selectedRoom.floorLabel} · ${selectedRoom.area}</p></div>
        <span class="summary-status ${canConfirm ? "ready" : "pending"}">${canConfirm ? "Bereit" : "Freigabe ausstehend"}</span>
      </div>
      <div class="summary-grid-cards">
        <article><span>Zeitraum</span><strong>${state.longTermEnabled ? `${d.start}–${d.end}` : `${formatDate(d.date)}, ${d.start}–${d.end}`}</strong></article>
        <article><span>${state.longTermEnabled ? "Wochentage" : "Platz"}</span><strong>${state.longTermEnabled ? d.weekdays.join(", ") : `${selectedRoom.id}-${selectedSeat.label}`}</strong></article>
        <article><span>${state.longTermEnabled ? "Serie" : "Strom"}</span><strong>${state.longTermEnabled ? `${d.longTermStart} bis ${d.longTermEnd}` : selectedSeat.outlet ? "Am Platz vorhanden" : "Kein Stromanschluss"}</strong></article>
        <article><span>${state.longTermEnabled ? "Freigabe" : "Status"}</span><strong>${state.longTermEnabled ? `${d.teacher || "Keine Lehrperson"} · ${state.longTermApproval === "approved" ? "freigegeben" : "ausstehend"}` : "Wird nach Bestätigung reserviert"}</strong></article>
      </div>
      ${!canConfirm ? `<div class="warning">Die Langzeitreservation kann erst bestätigt werden, wenn eine Lehrperson sie freigegeben hat.</div>` : ""}
      <div class="action-row summary-actions"><button class="primary" data-action="booking-confirm" ${canConfirm ? "" : "disabled"}>${state.longTermEnabled ? "Langzeitreservation bestätigen" : "Reservation bestätigen"}</button><button class="secondary" data-action="booking-back">Angaben bearbeiten</button></div>
    </section>`;
}

function renderBookingConfirmationStep({ selectedRoom, selectedSeat }) {
  const d = state.bookingDraft;
  return `
    <section class="panel confirmation-panel">
      <div class="confirmation-check">✓</div>
      <p class="eyebrow">Bestätigung</p>
      <h2>${state.longTermEnabled ? "Langzeitreservation erfolgreich erstellt" : "Reservation erfolgreich erstellt"}</h2>
      <p class="muted">${state.longTermEnabled ? "Die freigegebene Serie wird in deinem Kalender angezeigt." : "Dein Lernplatz ist für den gewählten Zeitraum reserviert."}</p>
      <div class="summary-grid-cards confirmation-grid">
        <article><span>Raum</span><strong>${selectedRoom ? selectedRoom.name : "-"}</strong></article>
        <article><span>Platz</span><strong>Tisch ${selectedSeat ? selectedSeat.label : "-"}</strong></article>
        <article><span>Zeit</span><strong>${d.start}–${d.end}</strong></article>
        <article><span>${state.longTermEnabled ? "Serie" : "Datum"}</span><strong>${state.longTermEnabled ? `${d.weekdays.join(", ")} · bis ${d.longTermEnd}` : formatDate(d.date)}</strong></article>
      </div>
      <div class="action-row confirmation-actions"><button class="primary" data-route="reservations">Meine Reservationen</button><button class="secondary" data-action="booking-reset">Weitere Reservation</button></div>
    </section>`;
}

function renderReservations() {
  const indexed = reservations.map((item, index) => ({ ...item, _index: index }));
  const visible = state.role === "teacher" ? indexed : indexed.filter((item) => item.person === "Lernende Person");
  const upcoming = visible.filter((item) => item.status === "Reserviert").length;

  if (state.reservationPage === "edit") {
    return renderReservationEdit();
  }

  return `
    <section class="screen reservations-screen">
      ${pageHeader(
        "Meine Reservationen",
        state.role === "teacher" ? "Reservationsübersicht" : "Deine Lernzeiten",
        state.role === "teacher"
          ? "Buchungen verwalten, anpassen und bei Bedarf stornieren."
          : "Deine Reservationen werden standardmässig als Liste angezeigt. Die Kalenderansicht ist eine separate Ansicht."
      )}

      <section class="reservation-welcome">
        <div>
          <span class="eyebrow">Dein Überblick</span>
          <h2>${upcoming} kommende ${upcoming === 1 ? "Reservation" : "Reservationen"}</h2>
          <p>Bearbeite Datum, Zeit, Raum und Platz über die Updateseite oder wechsle oben in die Kalenderansicht.</p>
        </div>
        <button class="primary" data-route="booking">Neue Reservation</button>
      </section>

      <section class="panel reservation-switch-panel">
        <div class="reservation-page-switch">
          <button class="tab-button ${state.reservationPage === "list" ? "active" : ""}" data-res-panel="list">Reservationen</button>
          <button class="tab-button ${state.reservationPage === "calendar" ? "active" : ""}" data-res-panel="calendar">Kalenderansicht</button>
        </div>
      </section>

      ${state.reservationPage === "calendar" ? `
        <section class="panel outlook-calendar-panel">
          <div class="calendar-toolbar">
            <div class="calendar-view-switch">
              <button class="tab-button ${state.reservationView === "day" ? "active" : ""}" data-calendar-view="day">Tag</button>
              <button class="tab-button ${state.reservationView === "week" ? "active" : ""}" data-calendar-view="week">Woche</button>
              <button class="tab-button ${state.reservationView === "month" ? "active" : ""}" data-calendar-view="month">Monat</button>
            </div>
            <div class="calendar-date-controls">
              <button class="secondary" data-action="calendar-prev" aria-label="Vorheriger Zeitraum">‹</button>
              <input id="calendarDatePicker" type="date" value="${state.selectedCalendarDate}">
              <button class="secondary" data-action="calendar-next" aria-label="Nächster Zeitraum">›</button>
            </div>
          </div>
          ${renderReservationCalendar(visible)}
        </section>
      ` : `
        <div class="reservation-section-title">
          <div><h2>Deine Buchungen</h2><p class="muted">Einchecken, updaten oder stornieren.</p></div>
          <span class="status checked">${visible.length} Einträge</span>
        </div>
        ${renderReservationList(visible)}
      `}
    </section>`;
}

function renderReservationDashboard(items, next, activeCount, checkedCount, outletCount) {
  if (!next) {
    return `
      <section class="reservation-hero">
        <div>
          <p class="eyebrow">Keine Reservationen</p>
          <h2>Noch kein Arbeitsplatz reserviert</h2>
          <p class="muted">Wähle im Menü Buchen einen Raum und anschliessend einen freien Platz.</p>
        </div>
        <button class="primary" data-route="booking">Jetzt buchen</button>
      </section>`;
  }

  const room = rooms.find((item) => item.id === next.room);
  return `
    <section class="reservation-hero">
      <div class="next-reservation">
        <p class="eyebrow">Nächste Reservation</p>
        <div class="next-title">
          <h2>${next.room}, Tisch ${next.seat}</h2>
          ${statusBadge(next.status)}
        </div>
        <p class="reservation-time">${next.time}</p>
        <div class="reservation-meta">
          <span>${room ? room.floorLabel : "Etage"} · ${room ? room.area : "QuietSpace"}</span>
          <span>${room && room.features.includes("Steckdosen") ? "Steckdose am Platz" : "Ruhiger Arbeitsplatz"}</span>
          <span>Check-in 5 Minuten vor Start</span>
        </div>
        <div class="checkin-progress">
          <span style="width:68%"></span>
        </div>
        <div class="action-row">
          <button class="primary" data-action="qr-checkin">QR Check-in anzeigen</button>
          <button class="secondary" data-action="show-route">Route im Lageplan</button>
        </div>
      </div>
      <div class="reservation-stats">
        <div class="stat-card"><strong>${activeCount}</strong><span>Aktive Buchungen</span></div>
        <div class="stat-card"><strong>${checkedCount}</strong><span>Erfolgreiche Check-ins</span></div>
        <div class="stat-card"><strong>${outletCount}</strong><span>Mit Steckdose</span></div>
        <div class="stat-card"><strong>${items.length}</strong><span>Einträge total</span></div>
      </div>
    </section>`;
}

function renderMap() {
  const floor = floors.find((item) => item.id === state.selectedFloor) || floors[1];
  const floorRooms = rooms.filter((room) => room.floor === floor.id);
  return `
    <section class="screen">
      ${pageHeader("Lageplan", "Schulhaus Lindenhof", "Der Lageplan ist als echtes Gebäuderaster aufgebaut: Räume und Gang belegen getrennte Flächen und können sich nicht überlappen. Fenster werden nur an sinnvollen Aussenfassaden gezeigt.")}
      <div class="map-layout">
        <section class="panel">
          <h2>Etagen</h2>
          <p class="muted">Wähle eine Etage. Die Raumpositionen unterscheiden sich bewusst je Stockwerk.</p>
          <div class="floor-list">
            ${floors.map((item) => `<button class="floor-card ${state.selectedFloor === item.id ? "active" : ""}" data-floor="${item.id}"><strong>${item.label}</strong><span>${item.title}</span><small>${item.note}</small></button>`).join("")}
          </div>
          <h2 style="margin-top:18px">QuietSpaces auf dieser Etage</h2>
          <div class="grid">
            ${floorRooms.map((room) => { const stats = getRoomStats(room.id); return `<button class="room-card ${state.selectedRoom === room.id ? "active" : ""}" data-room="${room.id}"><strong>${room.name}</strong><span class="muted">${room.area}</span><span>${stats.available}/${stats.total} nutzbar · ${stats.powered} mit Strom</span></button>`; }).join("")}
          </div>
        </section>
        <section class="panel map-main-panel">
          <div class="screen-header"><div><h2>Lageplan ${floor.label}</h2><p class="muted">${floor.title}: ${floor.note}</p></div><span class="status checked">${floorRooms.length} QuietSpaces</span></div>
          ${renderDetailedSchoolMap(floor.id)}
          <div class="school-map-legend">
            ${[["quiet","QuietSpace"],["learning","Lernbereich"],["service","Service / Nebenraum"],["lounge","Aufenthalt"],["corridor","Gang"],["window","Aussenfenster"],["plant","Pflanze"],["power","Strom"],["stairs","Treppe"],["lift","Lift"],["fire","Brandschutz"]].map(([type,label]) => `<span>${planIcon(type === "quiet" ? "table" : type === "learning" ? "books" : type === "service" ? "storage" : type === "lounge" ? "sofa" : type === "corridor" ? "door" : type, label)}<b>${label}</b></span>`).join("")}
          </div>
        </section>
      </div>
    </section>`;
}

function renderDetailedSchoolMap(floorId) {
  const plans = {
    ug: {
      exitSide: null,
      spaces: [
        { id:"A01", kind:"quiet", c:1, r:1, cs:4, rs:3, windows:["top","left"], icons:["shelf","sofa","table","plant","power"] },
        { label:"Werkzone", note:"Projekt- und Materialarbeit", kind:"learning", c:5, r:1, cs:4, rs:3, windows:["top"], icons:["table","whiteboard","storage","plant"] },
        { label:"Technik", note:"Geräte · Anschlüsse", kind:"service", c:9, r:1, cs:3, rs:3, windows:[], icons:["storage","power","printer"] },
        { label:"Lager", note:"Material", kind:"service", c:12, r:1, cs:3, rs:3, windows:["top","right"], icons:["storage","locker"] },
        { label:"Einzellernzone", note:"ruhige Tische", kind:"learning", c:1, r:6, cs:5, rs:5, windows:["bottom","left"], icons:["table","chair","plant","power"] },
        { label:"Medienraum", note:"Computer · Recherche", kind:"learning", c:6, r:6, cs:4, rs:5, windows:["bottom"], icons:["computer","computer","power","plant"] },
        { label:"Treppe", kind:"core", c:10, r:6, cs:2, rs:5, windows:[], icons:["stairs"] },
        { label:"Lift", kind:"core", c:12, r:6, cs:1, rs:3, windows:[], icons:["lift"] },
        { label:"Schliessfächer", kind:"service", c:13, r:6, cs:2, rs:5, windows:["bottom","right"], icons:["locker","locker"] },
      ]
    },
    eg: {
      exitSide: "right",
      spaces: [
        { id:"E06", kind:"quiet", c:1, r:1, cs:4, rs:3, windows:["top","left"], icons:["table","divider","plant","power"] },
        { id:"E08", kind:"quiet", c:5, r:1, cs:4, rs:3, windows:["top"], icons:["table","divider","power","plant"] },
        { label:"Empfang", note:"Information", kind:"service", c:9, r:1, cs:2, rs:3, windows:[], icons:["table","storage","plant"] },
        { label:"Bibliothek", note:"Recherche · Bücher", kind:"learning", c:11, r:1, cs:4, rs:3, windows:["top","right"], icons:["books","shelf","table","plant"] },
        { id:"E12", kind:"quiet", c:1, r:6, cs:4, rs:5, windows:["bottom","left"], icons:["table","table","plant","whiteboard"] },
        { label:"Ruhezone", note:"Sofa · Lesen", kind:"lounge", c:5, r:6, cs:4, rs:5, windows:["bottom"], icons:["sofa","table","plant","books"] },
        { label:"Treppe", kind:"core", c:9, r:6, cs:2, rs:5, windows:[], icons:["stairs","fire"] },
        { label:"Lift", kind:"core", c:11, r:6, cs:1, rs:3, windows:[], icons:["lift"] },
        { label:"WC", kind:"service", c:12, r:6, cs:3, rs:2, windows:["right"], icons:["wc"] },
        { label:"Material", note:"Reinigung · Lager", kind:"service", c:12, r:8, cs:3, rs:3, windows:["bottom","right"], icons:["storage","locker"] },
      ]
    },
    og1: {
      exitSide: null,
      spaces: [
        { id:"101", kind:"quiet", c:1, r:1, cs:5, rs:3, windows:["top","left"], icons:["shelf","table","chair","plant","power"] },
        { label:"Lernatelier", note:"Teamarbeit", kind:"learning", c:6, r:1, cs:3, rs:3, windows:["top"], icons:["table","whiteboard","plant"] },
        { label:"Drucker", kind:"service", c:9, r:1, cs:2, rs:3, windows:[], icons:["printer","storage"] },
        { id:"114", kind:"quiet", c:11, r:1, cs:4, rs:3, windows:["top","right"], icons:["computer","computer","power","plant"] },
        { label:"Computerlabor", note:"Unterricht", kind:"learning", c:1, r:6, cs:4, rs:5, windows:["bottom","left"], icons:["computer","computer","whiteboard","power"] },
        { label:"Gruppenraum", note:"6 Plätze", kind:"learning", c:5, r:6, cs:4, rs:5, windows:["bottom"], icons:["table","chair","pinboard","plant"] },
        { label:"Treppe", kind:"core", c:9, r:6, cs:2, rs:5, windows:[], icons:["stairs","fire"] },
        { label:"Lift", kind:"core", c:11, r:6, cs:1, rs:3, windows:[], icons:["lift"] },
        { label:"Material", kind:"service", c:12, r:6, cs:3, rs:5, windows:["bottom","right"], icons:["storage","locker","printer"] },
      ]
    },
    og2: {
      exitSide: null,
      spaces: [
        { label:"Lehrpersonen", note:"Arbeitsraum", kind:"service", c:1, r:1, cs:3, rs:3, windows:["top","left"], icons:["table","computer","storage"] },
        { id:"207", kind:"quiet", c:4, r:1, cs:4, rs:3, windows:["top"], icons:["table","whiteboard","pinboard","plant"] },
        { label:"Kopierer", kind:"service", c:8, r:1, cs:2, rs:3, windows:[], icons:["printer","storage"] },
        { label:"Lounge", note:"Pausenbereich", kind:"lounge", c:10, r:1, cs:5, rs:3, windows:["top","right"], icons:["sofa","table","plant","books"] },
        { id:"224", kind:"quiet", c:1, r:6, cs:4, rs:5, windows:["bottom","left"], icons:["divider","table","lamp","power"] },
        { label:"Lernzone Nord", note:"Einzelarbeit", kind:"learning", c:5, r:6, cs:4, rs:5, windows:["bottom"], icons:["table","chair","plant","power"] },
        { label:"Treppe", kind:"core", c:9, r:6, cs:2, rs:5, windows:[], icons:["stairs","fire"] },
        { label:"Lift", kind:"core", c:11, r:6, cs:1, rs:3, windows:[], icons:["lift"] },
        { label:"Archiv", kind:"service", c:12, r:6, cs:3, rs:5, windows:["bottom","right"], icons:["storage","shelf","locker"] },
      ]
    },
    og3: {
      exitSide: null,
      spaces: [
        { label:"Verwaltung", note:"Büros", kind:"service", c:1, r:1, cs:3, rs:3, windows:["top","left"], icons:["computer","storage","plant"] },
        { id:"310", kind:"quiet", c:4, r:1, cs:3, rs:3, windows:["top"], icons:["table","whiteboard","plant"] },
        { label:"Sitzungszimmer", note:"Besprechung", kind:"learning", c:7, r:1, cs:4, rs:3, windows:["top"], icons:["table","chair","whiteboard"] },
        { label:"Archiv", kind:"service", c:11, r:1, cs:4, rs:3, windows:["top","right"], icons:["storage","shelf","locker"] },
        { id:"H4", kind:"quiet", c:1, r:6, cs:6, rs:5, windows:["bottom","left"], icons:["table","table","whiteboard","tv","plant"] },
        { label:"Projektatelier", note:"Flexible Tische", kind:"learning", c:7, r:6, cs:3, rs:5, windows:["bottom"], icons:["table","whiteboard","pinboard","plant"] },
        { label:"Treppe", kind:"core", c:10, r:6, cs:2, rs:5, windows:[], icons:["stairs","fire"] },
        { label:"Lift", kind:"core", c:12, r:6, cs:1, rs:3, windows:[], icons:["lift"] },
        { label:"Lager", kind:"service", c:13, r:6, cs:2, rs:5, windows:["bottom","right"], icons:["storage","locker"] },
      ]
    }
  };
  const cfg = plans[floorId] || plans.eg;

  const roomCard = (space) => {
    const room = space.id ? rooms.find((r) => r.id === space.id) : null;
    const stats = room ? getRoomStats(room.id) : null;
    const windows = (space.windows || []).map(side => `<span class="school-space-window ${side}"></span>`).join("");
    const contentIcons = (space.icons || []).map(type => planIcon(type, type)).join("");
    const tag = room ? "button" : "div";
    const roomAttr = room ? `data-room="${room.id}"` : "";
    return `<${tag} class="school-space school-${space.kind}" ${roomAttr} style="grid-column:${space.c} / span ${space.cs};grid-row:${space.r} / span ${space.rs}">
      ${windows}
      <div class="school-space-title">${room ? `<span>${room.id}</span><strong>${room.name}</strong><small>${stats.available}/${stats.total} nutzbar · ${stats.powered} Strom</small>` : `<strong>${space.label}</strong>${space.note ? `<small>${space.note}</small>` : ""}`}</div>
      <div class="school-space-icons">${contentIcons}</div>
      <span class="school-room-door">${planIcon("door","Tür")}</span>
    </${tag}>`;
  };

  return `<div class="school-floor-grid">
    ${cfg.spaces.map(roomCard).join("")}
    <div class="school-main-corridor" style="grid-column:1 / span 14;grid-row:4 / span 2">
      <div class="corridor-detail c1">${planIcon("plant","Pflanze")}</div>
      <div class="corridor-detail c2">${planIcon("sofa","Sitzbank")}</div>
      <div class="corridor-detail c3">${planIcon("fire","Feuerlöscher")}</div>
      <div class="corridor-detail c4">${planIcon("plant","Pflanze")}</div>
      ${cfg.exitSide === "right" ? `<span class="school-exit right"><b>Ausgang</b>${planIcon("door","Ausgang")}</span>` : ""}
    </div>
  </div>`;
}

function renderHelp() {
  const topics = [
    { title: "Startseite", intro: "Dein Einstieg und Überblick über QuietSpace.", details: `<p>Die Startseite erklärt den Zweck von QuietSpace und führt dich zu den wichtigsten Funktionen. Von hier gelangst du zu den Regeln, zur Buchung, zu deinen Reservationen, zum Lageplan und zur Hilfe.</p><p>Lehrpersonen sehen zusätzlich Verwaltungsfunktionen für Reservationen, Plätze und Lernende.</p>` },
    { title: "Regeln", intro: "Verhaltensregeln, Regeltest und Freischaltung fürs Buchen.", details: `<p>Die Regeln sorgen dafür, dass alle Personen ruhig, fair und sorgfältig miteinander lernen können. Sie erklären unter anderem den Check-in, das rechtzeitige Stornieren und den korrekten Umgang mit Arbeitsplätzen.</p><p>Lernende müssen den Regeltest einmal mit mindestens 3 von 4 Punkten bestehen. Ohne bestandenen Test ist das Buchen eines Platzes gesperrt.</p>` },
    { title: "Buchen", intro: "Einen passenden Arbeitsplatz Schritt für Schritt reservieren.", details: `<p>Beim Buchen wählst du zuerst einen Raum und danach einen freien Tisch. Anschließend legst du Datum, Startzeit und Endzeit fest und kontrollierst alle Angaben in der Zusammenfassung.</p><ol><li>Raum auswählen</li><li>Freien Platz auswählen</li><li>Datum und Zeit angeben</li><li>Zusammenfassung prüfen</li><li>Reservation bestätigen</li></ol><p>Die Endzeit muss nach der Startzeit liegen. Langzeitreservationen benötigen bei Lernenden zusätzlich die Freigabe einer Lehrperson. Lehrpersonen können im Raumplan außerdem den Sperrmodus aktivieren und einzelne Plätze sperren oder freigeben.</p><div class="help-video"><h3>Video: Buchen</h3><video controls preload="metadata" playsinline aria-label="Erklärvideo zum Buchen eines QuietSpace-Platzes"><source src="regeln.mp4" type="video/mp4">Dein Browser unterstützt dieses Video nicht.</video><p>Das Video kann direkt hier abgespielt und über die Videosteuerung im Vollbildmodus angesehen werden. Die wesentlichen Buchungsschritte stehen zusätzlich als Text direkt oberhalb des Videos.</p></div>` },
    { title: "Reservationen", intro: "Buchungen ansehen und verwalten.", details: `<p>Dieser Bereich zeigt deine Buchungen als übersichtliche Liste oder im Kalender. Du siehst Raum, Platz, Datum, Uhrzeit und den aktuellen Status.</p><p>Du kannst einchecken sowie bestehende Reservationen aktualisieren oder stornieren. Lehrpersonen erhalten eine erweiterte Übersicht über alle Reservationen und Sperren.</p>` },
    { title: "Lageplan", intro: "Räume und Orientierungspunkte im Gebäude finden.", details: `<p>Der Lageplan zeigt die QuietSpace-Räume nach Stockwerk und stellt ihre Position im Gebäude dar. Türen, Fenster, Gänge, Treppen, Ausgänge und weitere Orientierungspunkte helfen dir, den gewählten Raum schneller zu finden.</p><p>Wähle ein Stockwerk, um dessen Räume und Wege anzuzeigen.</p>` },
    { title: "Hilfe", intro: "Erklärungen zu allen Bereichen und wichtigen Abläufen.", details: `<p>Die Hilfe beantwortet die wichtigsten Fragen zur Bedienung von QuietSpace. Öffne einen Themenbereich über den Knopf „Mehr Informationen“, um eine ausführliche Erklärung zu sehen.</p><p>Hier findest du außerdem Hinweise zum Regeltest, zur Platzbuchung, zu Sperren, zum Check-in und zum Verwarnungssystem.</p>` },
  ];
  return `
    <section class="screen">
      ${pageHeader("Hilfe", state.role === "teacher" ? "Hilfe für Lehrpersonen" : "Hilfe für Lernende", "Alle Menüpunkte deiner aktuellen Ansicht kurz erklärt.")}
      <section class="warning consequence-warning"><strong>Verwarnungen haben Konsequenzen</strong><p>Wer Reservationen wiederholt verpasst, Regeln missachtet oder Plätze unnötig blockiert, kann Verwarnungen erhalten. Bei mehreren Verwarnungen kann eine Lehrperson die Buchungsberechtigung vorübergehend sperren. Während einer Sperre können keine neuen Reservationen erstellt werden. Die Freigabe erfolgt nach Rücksprache mit einer Lehrperson.</p></section>
      <div class="help-menu-grid">${topics.map((topic,i)=>`<article class="help-menu-card"><span>${String(i+1).padStart(2,"0")}</span><div><h2>${topic.title}</h2><p>${topic.intro}</p><details class="help-details"><summary>Mehr Informationen</summary><div class="help-details-content">${topic.details}</div></details></div></article>`).join("")}</div>
    </section>`;
}

function renderStudents() {
  if (state.role !== "teacher") {
    state.route = "start";
    return renderStart();
  }
  const query = state.studentQuery.trim().toLowerCase();
  const filteredStudents = students.filter((student) => `${student.name} ${student.klass} ${student.status}`.toLowerCase().includes(query));
  const selected = students.find((student) => student.name === state.selectedStudent) || filteredStudents[0] || students[0];
  return `
    <section class="screen">
      ${pageHeader("Schüleransicht", "Lernende verwalten", "Lehrpersonen sehen Berechtigung, Verwarnungen und wichtige Informationen pro Lernenden.")}
      <div class="student-layout">
        <section class="panel">
          <label class="field"><span>Schüler suchen</span><input id="studentSearch" type="search" placeholder="Name oder Klasse" value="${state.studentQuery}"></label>
          <div class="student-list" style="margin-top:14px">
            ${filteredStudents.map((student) => `
              <button class="student-card ${selected.name === student.name ? "active" : ""}" data-student="${student.name}">
                <strong>${student.name}</strong>
                <span>${student.klass} · ${student.status}</span>
                <span class="muted">${student.warnings} Verwarnung(en)</span>
              </button>`).join("") || `<p class="muted">Keine passenden Lernenden gefunden.</p>`}
          </div>
        </section>
        <section class="panel">
          <h2>${selected.name}</h2>
          <div class="grid two">
            <div class="card"><strong>Klasse</strong><p>${selected.klass}</p></div>
            <div class="card"><strong>Berechtigung</strong><p>${selected.status}</p></div>
            <div class="card"><strong>Verwarnungen</strong><p>${selected.warnings}</p></div>
            <div class="card"><strong>Letzter Raum</strong><p>${selected.room}</p></div>
          </div>
          <h3 style="margin-top:18px">Notiz</h3>
          <p class="muted">${selected.note}</p>
          <div class="action-row">
            <button class="primary" data-action="rights" data-rights="give">Rechte geben</button>
            <button class="danger" data-action="rights" data-rights="remove">Rechte entziehen</button>
          </div>
        </section>
      </div>
    </section>`;
}

function roomCard(room) {
  const stats = getRoomStats(room.id);
  return `
    <button class="room-card ${state.selectedRoom === room.id ? "active" : ""}" data-room="${room.id}">
      <img class="room-visual" src="roomes_images/${room.image}" alt="${room.name}">
      <span class="room-card-copy"><span class="room-card-title"><strong>${room.name}</strong><em>${stats.available}/${stats.total}</em></span><span class="muted">${room.floorLabel} · ${room.area}</span><span class="room-card-metrics"><b>${stats.available}/${stats.total} nutzbar</b><b>${stats.powered} mit Strom</b><b>${stats.blocked} gesperrt</b></span><span>${room.features.join(" · ")}</span></span>
    </button>`;
}

function seatButton(seat, style = "") {
  const manageable = state.role === "teacher" && state.teacherBlockMode && seat.status !== "booked";
  const selectable = seat.status === "free" || manageable;
  return `
    <button class="seat room-seat ${seat.status} ${state.selectedSeat === seat.id ? "active" : ""} ${seat.outlet ? "has-outlet" : ""}"
      data-seat="${seat.id}" style="${style}" ${selectable ? "" : "disabled"} aria-label="Tisch ${seat.label}: ${seat.status === "free" ? "frei" : seat.status === "booked" ? "belegt" : "gesperrt"}${manageable ? "; zum Ändern anklicken" : ""}">
      <span class="seat-number">${seat.label}</span>
      <small>${seat.zone}</small>
      <small>${seat.status === "free" ? "frei" : seat.status === "booked" ? "belegt" : "gesperrt"}</small>
    </button>`;
}

function calendarGrid() {
  const rows = [
    ["08:00", "frei", "Frei"],
    ["09:00", "busy", "Belegt"],
    ["10:00", "free", "Frei"],
    ["11:00", "free", "Frei"],
    ["13:00", "selected", "Ausgewählt"],
    ["14:00", "selected", "Ausgewählt"],
    ["15:00", "free", "Frei"],
  ];
  return `<div class="calendar-grid">${rows.map(([time, klass, label]) => `<div class="time-cell">${time}</div><button class="slot ${klass}">${label}</button>`).join("")}</div>`;
}

function renderReservationList(items) {
  return `<div class="reservation-list modern-reservation-list">
    ${items.map((item) => {
      const room = rooms.find((roomItem) => roomItem.id === item.room);
      const seatInfo = getSeatsForRoom(item.room).find((seat) => seat.label === item.seat);
      return `<article class="reservation-card reservation-card-rich">
        <img class="reservation-room-image" src="roomes_images/${room ? room.image : "E06.jpg"}" alt="${room ? room.name : item.room}">
        <div class="reservation-copy">
          <div class="reservation-title-row">
            <div><span class="eyebrow">${formatDate(item.date)}</span><h2>${room ? room.name : item.room}</h2></div>
            ${statusBadge(item.status)}
          </div>
          <p class="reservation-time">${item.start || ""}–${item.end || ""} · Tisch ${item.seat}</p>
          <div class="reservation-meta">
            <span>${room ? room.floorLabel : ""} · ${room ? room.area : "QuietSpace"}</span>
            <span>${seatInfo?.outlet ? "Strom am Platz" : "Standardplatz"}</span>
            <span>${item.status === "Eingecheckt" ? "Check-in erfolgt" : "Check-in ab 5 Minuten vor Start"}</span>
          </div>
          ${item.comment ? `<p class="warning compact-warning">${item.comment}</p>` : ""}
          <div class="reservation-card-actions">
            ${item.status === "Reserviert" ? `<button class="primary" data-action="checkin" data-res-index="${item._index}">Einchecken</button>` : ""}
            ${item.status !== "Sperre" && item.status !== "Verpasst" ? `<button class="secondary" data-action="update-booking" data-res-index="${item._index}">Updaten</button>` : ""}
            ${item.status === "Reserviert" ? `<button class="danger" data-action="cancel" data-res-index="${item._index}">Stornieren</button>` : ""}
          </div>
        </div>
      </article>`;
    }).join("")}
  </div>`;
}


function renderReservationEdit() {
  const index = Number(state.editingReservationIndex);
  const item = reservations[index];
  if (!item) {
    state.reservationPage = "list";
    state.editingReservationIndex = null;
    return renderReservations();
  }
  const room = rooms.find((r) => r.id === item.room) || rooms[0];
  const seats = getSeatsForRoom(room.id);
  const purpose = item.purpose || "Individuelle Lernzeit";
  const note = item.note || "";
  return `
    <section class="screen reservation-edit-screen">
      ${pageHeader("Reservation updaten", `${room.name} · Tisch ${item.seat}`, "Passe deine Reservation an. Änderungen werden erst mit Speichern übernommen.", `<button class="secondary" data-action="reservation-edit-back">Zurück</button>`)}
      <div class="reservation-edit-layout">
        <section class="panel reservation-edit-card">
          <div class="reservation-edit-preview">
            <img src="roomes_images/${room.image}" alt="${room.name}">
            <div><span class="eyebrow">Aktuelle Reservation</span><h2>${room.name}</h2><p>${formatDate(item.date)} · ${item.start}–${item.end}</p></div>
          </div>
          <div class="form-grid reservation-edit-form">
            <label class="field"><span>Raum</span><select id="reservationEditRoom">${rooms.map(r => `<option value="${r.id}" ${r.id === item.room ? "selected" : ""}>${r.name} · ${r.floorLabel}</option>`).join("")}</select></label>
            <label class="field"><span>Platz</span><select id="reservationEditSeat">${seats.map(seat => `<option value="${seat.label}" ${seat.label === item.seat ? "selected" : ""} ${seat.status === "blocked" ? "disabled" : ""}>Tisch ${seat.label}${seat.outlet ? " · Strom" : ""}${seat.status === "blocked" ? " · gesperrt" : ""}</option>`).join("")}</select></label>
            <label class="field"><span>Datum</span><input id="reservationEditDate" type="date" value="${item.date}"></label>
            <label class="field"><span>Start</span><input id="reservationEditStart" type="time" min="06:00" max="18:00" value="${item.start}"></label>
            <label class="field"><span>Ende</span><input id="reservationEditEnd" type="time" min="06:00" max="18:00" value="${item.end}"></label>
            <label class="field"><span>Zweck</span><select id="reservationEditPurpose"><option ${purpose === "Individuelle Lernzeit" ? "selected" : ""}>Individuelle Lernzeit</option><option ${purpose === "Prüfungsvorbereitung" ? "selected" : ""}>Prüfungsvorbereitung</option><option ${purpose === "Projektarbeit" ? "selected" : ""}>Projektarbeit</option><option ${purpose === "Nachhilfe" ? "selected" : ""}>Nachhilfe</option></select></label>
          </div>
          <label class="field"><span>Notiz</span><textarea id="reservationEditNote" rows="4" placeholder="Optionaler Hinweis zur Reservation">${note}</textarea></label>
          <div class="reservation-edit-info"><strong>Hinweis</strong><p>Die Reservation muss zwischen 06:00 und 18:00 liegen. Gesperrte Plätze können nicht ausgewählt werden.</p></div>
          <div class="action-row"><button class="primary" data-action="save-reservation-update" data-res-index="${index}">Änderungen speichern</button><button class="secondary" data-action="reservation-edit-back">Abbrechen</button></div>
        </section>
      </div>
    </section>`;
}

function renderReservationCalendar(items) {
  if (state.reservationView === "month") return renderMonthCalendar(items);
  if (state.reservationView === "day") return renderDayReservationCalendar(items);
  return renderWeekReservationCalendar(items);
}


function renderWeekReservationCalendar(items) {
  const selected = new Date(`${state.selectedCalendarDate}T12:00:00`);
  const day = selected.getDay() || 7;
  const monday = new Date(selected);
  monday.setDate(selected.getDate() - day + 1);
  const labels = ["Mo", "Di", "Mi", "Do", "Fr"];
  const days = labels.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return [label, date.toISOString().slice(0, 10)];
  });
  const startBase = 6 * 60, scale = 52;
  return `<div class="week-calendar"><div class="week-corner"></div>${days.map(([d,date])=>`<div class="week-day-head"><strong>${d}</strong><span>${new Intl.DateTimeFormat("de-CH",{day:"2-digit",month:"2-digit"}).format(new Date(`${date}T12:00:00`))}</span></div>`).join("")}
    <div class="week-time-axis">${Array.from({length:13},(_,i)=>`<span>${String(i+6).padStart(2,"0")}:00</span>`).join("")}</div>
    ${days.map(([d,date])=>`<div class="week-day-column">${Array.from({length:24},(_,i)=>`<i style="top:${i*26}px"></i>`).join("")}${items.filter(x=>x.date===date).map(item=>{const top=((timeToMinutes(item.start)-startBase)/60)*scale; const h=Math.max(26,((timeToMinutes(item.end)-timeToMinutes(item.start))/60)*scale); return `<div class="week-event ${item.status.toLowerCase()}" style="top:${top}px;height:${h}px"><strong>${item.room} · ${item.seat}</strong><span>${item.start}–${item.end}</span></div>`}).join("")}</div>`).join("")}</div>`;
}

function renderDayReservationCalendar(items) {
  const date = state.selectedCalendarDate;
  const startBase=6*60, scale=60;
  return `<div class="day-res-calendar"><div class="day-res-head"><strong>${formatDate(date)}</strong><span>06:00–18:00</span></div><div class="day-res-body"><div class="day-res-times">${Array.from({length:13},(_,i)=>`<span>${String(i+6).padStart(2,"0")}:00</span>`).join("")}</div><div class="day-res-grid">${Array.from({length:24},(_,i)=>`<i style="top:${i*30}px"></i>`).join("")}${items.filter(x=>x.date===date).map(item=>{const top=((timeToMinutes(item.start)-startBase)/60)*scale;const h=Math.max(30,((timeToMinutes(item.end)-timeToMinutes(item.start))/60)*scale);return `<div class="day-res-event" style="top:${top}px;height:${h}px"><strong>${item.room} · Tisch ${item.seat}</strong><span>${item.start}–${item.end}</span></div>`}).join("")}</div></div></div>`;
}

function renderMonthCalendar(items) {
  const selected = new Date(`${state.selectedCalendarDate}T12:00:00`);
  const year = selected.getFullYear();
  const month = selected.getMonth();
  const first = new Date(year, month, 1, 12);
  const last = new Date(year, month + 1, 0, 12);
  const offset = (first.getDay() || 7) - 1;
  const cells = [];
  const prevLast = new Date(year, month, 0, 12).getDate();
  for (let i = offset - 1; i >= 0; i -= 1) cells.push({ day: prevLast - i, muted: true });
  for (let d = 1; d <= last.getDate(); d += 1) cells.push({ day: d, muted: false, date: `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}` });
  let next = 1;
  while (cells.length % 7 !== 0 || cells.length < 35) cells.push({ day: next++, muted: true });
  const title = new Intl.DateTimeFormat("de-CH", { month: "long", year: "numeric" }).format(selected);
  return `<div class="month-title">${title}</div><div class="month-calendar"><div class="month-weekdays">${["Mo","Di","Mi","Do","Fr","Sa","So"].map(d=>`<strong>${d}</strong>`).join("")}</div><div class="month-grid">${cells.map(cell=>`<div class="month-day ${cell.muted?"muted-day":""}"><span>${cell.day}</span>${cell.date?items.filter(x=>x.date===cell.date).slice(0,3).map(item=>`<div class="month-event">${item.start} ${item.room}-${item.seat}</div>`).join(""):""}</div>`).join("")}</div></div>`;
}

function statusBadge(status) {
  const map = {
    Reserviert: "reserved",
    Eingecheckt: "checked",
    Verpasst: "missed",
    Sperre: "blocked",
    Storniert: "cancelled",
  };
  const icons = {
    Reserviert: "●",
    Eingecheckt: "✓",
    Verpasst: "!",
    Sperre: "×",
    Storniert: "−",
  };
  return `<span class="status ${map[status] || "reserved"}"><span class="status-icon" aria-hidden="true">${icons[status] || "●"}</span><span>${status}</span></span>`;
}

function bindViewEvents() {
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.onclick = () => {
      const targetRoute = button.dataset.route;
      if (targetRoute === "booking" && state.role === "student" && !state.testPassed) {
        state.pendingBookingAfterTest = true;
        openRuleTest();
        return;
      }
      state.route = targetRoute;
      if (state.route === "booking" && state.bookingComplete) { state.bookingStep = 1; state.bookingComplete = false; }
      sidebar.classList.remove("open");
      render("#app");
    };
  });
  document.querySelectorAll("[data-room]").forEach((button) => { button.onclick = () => { state.selectedRoom = button.dataset.room; const room = rooms.find((item)=>item.id===state.selectedRoom); if(room) state.selectedFloor=room.floor; if(state.route==="booking"){state.selectedSeat="";state.bookingComplete=false;state.bookingStep=2;} render(state.route === "booking" ? "#app" : ""); }; });
  document.querySelectorAll("[data-floor]").forEach((button) => { button.onclick=()=>{state.selectedFloor=button.dataset.floor; const firstRoom=rooms.find(room=>room.floor===state.selectedFloor); if(firstRoom) state.selectedRoom=firstRoom.id; render();}; });
  document.querySelectorAll("[data-seat]").forEach((button) => { button.onclick=()=>{
    const seat = Object.values(seatsByRoom).flat().find((item) => item.id === button.dataset.seat);
    if (state.role === "teacher" && state.teacherBlockMode) {
      if (!seat || seat.status === "booked") { showToast("Bereits reservierte Plätze können nicht gesperrt werden."); return; }
      seat.status = seat.status === "blocked" ? "free" : "blocked";
      if (state.selectedSeat === seat.id) state.selectedSeat = "";
      saveSeatBlocks();
      showToast(`Tisch ${seat.label} wurde ${seat.status === "blocked" ? "gesperrt" : "freigegeben"}.`);
      render();
      return;
    }
    state.selectedSeat=button.dataset.seat; if(state.route==="booking"){state.bookingComplete=false;state.bookingStep=3;} render("#app");
  }; });
  document.querySelectorAll("[data-tab]").forEach((button) => { button.onclick=()=>{state.reservationTab=button.dataset.tab;render();}; });
  document.querySelectorAll("[data-calendar-view]").forEach((button)=>{button.onclick=()=>{state.reservationView=button.dataset.calendarView;render();};});
  document.querySelectorAll("[data-res-panel]").forEach((button)=>{button.onclick=()=>{state.reservationPage=button.dataset.resPanel;render();};});
  document.querySelectorAll("[data-student]").forEach((button) => { button.onclick=()=>{state.selectedStudent=button.dataset.student;render();}; });
  document.querySelectorAll("[data-action]").forEach((button) => { button.onclick=()=>handleAction(button); });
  const outletToggle=document.querySelector("#outletToggle"); if(outletToggle) outletToggle.onchange=()=>{state.showOutlets=outletToggle.checked;render();};
  const longTerm=document.querySelector("#longTermToggle"); if(longTerm) longTerm.onchange=()=>{state.longTermEnabled=longTerm.checked; if(!state.longTermEnabled) state.longTermApproval="none"; render();};
  const datePicker=document.querySelector("#calendarDatePicker"); if(datePicker) datePicker.onchange=()=>{state.selectedCalendarDate=datePicker.value;render();};
  const editRoom=document.querySelector("#reservationEditRoom"); if(editRoom) editRoom.onchange=()=>{const seatSelect=document.querySelector("#reservationEditSeat"); const seats=getSeatsForRoom(editRoom.value); if(seatSelect) seatSelect.innerHTML=seats.map(seat=>`<option value="${seat.label}" ${seat.status === "blocked" ? "disabled" : ""}>Tisch ${seat.label}${seat.outlet ? " · Strom" : ""}${seat.status === "blocked" ? " · gesperrt" : ""}</option>`).join("");};
  const studentSearch=document.querySelector("#studentSearch"); if(studentSearch) studentSearch.oninput=()=>{state.studentQuery=studentSearch.value;render("#studentSearch");};
}

function handleAction(button) {
  const action = button.dataset.action;
  const messages = {
    checkin: "Du bist eingecheckt. Viel Erfolg beim Lernen!",
    cancel: "Reservation wurde storniert und der Zeitraum wieder freigegeben.",
    "export-calendar": "Kalenderdatei wurde für den Prototyp vorbereitet.",
    "update-booking": "Buchung kann jetzt angepasst werden.",
    "teacher-cancel": "Buchung wurde durch die Lehrperson storniert.",
  };
  if (action === "open-test") { openRuleTest(); return; }
  if (action === "toggle-seat-block-mode") {
    if (state.role !== "teacher") return;
    state.teacherBlockMode = !state.teacherBlockMode;
    state.selectedSeat = "";
    showToast(state.teacherBlockMode ? "Sperrmodus aktiviert." : "Sperrmodus beendet.");
    render();
    return;
  }
  if (action === "update-booking") {
    state.editingReservationIndex = Number(button.dataset.resIndex);
    state.reservationPage = "edit";
    render();
    return;
  }
  if (action === "reservation-edit-back") {
    state.editingReservationIndex = null;
    state.reservationPage = "list";
    render();
    return;
  }
  if (action === "save-reservation-update") {
    const index = Number(button.dataset.resIndex);
    const item = reservations[index];
    if (!item) return;
    const roomId = document.querySelector("#reservationEditRoom")?.value || item.room;
    const seat = document.querySelector("#reservationEditSeat")?.value || item.seat;
    const date = document.querySelector("#reservationEditDate")?.value || item.date;
    const start = document.querySelector("#reservationEditStart")?.value || item.start;
    const end = document.querySelector("#reservationEditEnd")?.value || item.end;
    if (timeToMinutes(start) < 360 || timeToMinutes(end) > 1080 || timeToMinutes(end) <= timeToMinutes(start)) {
      showToast("Bitte wähle eine gültige Zeit zwischen 06:00 und 18:00.");
      return;
    }
    const chosenSeat = getSeatsForRoom(roomId).find(s => s.label === seat);
    if (!chosenSeat || chosenSeat.status === "blocked") {
      showToast("Dieser Platz ist gesperrt. Bitte wähle einen anderen Platz.");
      return;
    }
    item.room = roomId;
    item.seat = seat;
    item.date = date;
    item.start = start;
    item.end = end;
    item.time = `${formatDate(date)}, ${start}-${end}`;
    item.purpose = document.querySelector("#reservationEditPurpose")?.value || "Individuelle Lernzeit";
    item.note = document.querySelector("#reservationEditNote")?.value || "";
    state.editingReservationIndex = null;
    state.reservationPage = "list";
    showToast("Reservation wurde aktualisiert.");
    render();
    return;
  }
  if (action === "checkin") {
    const index = Number(button.dataset.resIndex);
    if (reservations[index]) reservations[index].status = "Eingecheckt";
    showToast("Du bist eingecheckt. Viel Erfolg beim Lernen!");
    render();
    return;
  }
  if (action === "cancel") {
    const index = Number(button.dataset.resIndex);
    if (reservations[index]) reservations[index].status = "Storniert";
    showToast("Reservation wurde storniert.");
    render();
    return;
  }
  if (action === "booking-next") {
    if (state.bookingStep === 3) {
      captureBookingDraft();
      if (!validateBookingDraft()) return;
    }
    state.bookingStep = Math.min(5, state.bookingStep + 1); render("#app"); return;
  }
  if (action === "booking-back") { state.bookingComplete=false; state.bookingStep=Math.max(1,state.bookingStep-1); render("#app"); return; }
  if (action === "request-approval") {
    captureBookingDraft();
    if (!validateBookingDraft()) return;
    if (!state.bookingDraft.teacher) { showToast("Bitte wähle zuerst eine Lehrperson aus."); return; }
    if (!state.bookingDraft.weekdays.length) { showToast("Bitte wähle mindestens einen Wochentag aus."); return; }
    state.longTermApproval="pending"; showToast(`${state.bookingDraft.teacher} wurde benachrichtigt. Die Freigabe ist ausstehend.`); render(); return;
  }
  if (action === "approve-longterm") { captureBookingDraft(); state.longTermApproval="approved"; showToast("Langzeitreservation wurde durch die Lehrperson freigegeben."); render(); return; }
  if (action === "booking-confirm") {
    if (!validateBookingDraft()) return;
    if (state.longTermEnabled && state.longTermApproval !== "approved" && state.role !== "teacher") { showToast("Die Langzeitreservation benötigt zuerst eine Freigabe."); return; }
    state.bookingComplete=true; state.bookingStep=5; showToast(state.longTermEnabled ? "Langzeitreservation wurde erstellt." : "Reservation wurde erstellt."); render("#app"); return;
  }
  if (action === "booking-reset") { state.selectedRoom="";state.selectedSeat="";state.bookingStep=1;state.bookingComplete=false;state.longTermEnabled=false;state.longTermApproval="none";render();return; }
  if (action === "calendar-prev" || action === "calendar-next") {
    const d=new Date(`${state.selectedCalendarDate}T12:00:00`);
    const direction = action === "calendar-next" ? 1 : -1;
    if (state.reservationView === "month") d.setMonth(d.getMonth() + direction);
    else d.setDate(d.getDate() + direction * (state.reservationView === "week" ? 7 : 1));
    state.selectedCalendarDate=d.toISOString().slice(0,10); render(); return;
  }
  if (action === "rights") { state.rightsTarget=button.dataset.rights; document.querySelector("#noteDialog").showModal(); return; }
  showToast(messages[action] || "Aktion ausgeführt.");
}


function captureBookingDraft() {
  const get = (id) => document.querySelector(id);
  if (get("#bookingDate")) state.bookingDraft.date = get("#bookingDate").value;
  if (get("#bookingStart")) state.bookingDraft.start = get("#bookingStart").value;
  if (get("#bookingEnd")) state.bookingDraft.end = get("#bookingEnd").value;
  if (get("#longStartDate")) state.bookingDraft.longTermStart = get("#longStartDate").value;
  if (get("#longEndDate")) state.bookingDraft.longTermEnd = get("#longEndDate").value;
  if (get("#longStartTime")) state.bookingDraft.start = get("#longStartTime").value;
  if (get("#longEndTime")) state.bookingDraft.end = get("#longEndTime").value;
  if (get("#longTeacher")) state.bookingDraft.teacher = get("#longTeacher").value;
  state.bookingDraft.weekdays = [...document.querySelectorAll('input[name="longDay"]:checked')].map(input => input.value);
}

function validateBookingDraft() {
  const draft = state.bookingDraft;
  if (!draft.start || !draft.end) {
    showToast("Bitte gib eine Start- und Endzeit an.");
    return false;
  }
  const startMinutes = timeToMinutes(draft.start);
  const endMinutes = timeToMinutes(draft.end);
  if (!Number.isFinite(startMinutes) || !Number.isFinite(endMinutes)) {
    showToast("Bitte gib gültige Uhrzeiten an.");
    return false;
  }
  if (startMinutes < 360 || endMinutes > 1080) {
    showToast("Reservationen sind nur zwischen 06:00 und 18:00 möglich.");
    return false;
  }
  if (endMinutes <= startMinutes) {
    showToast("Die Endzeit muss nach der Startzeit liegen, zum Beispiel 14:00 bis 15:00.");
    return false;
  }
  if (state.longTermEnabled) {
    if (!draft.longTermStart || !draft.longTermEnd) {
      showToast("Bitte gib Beginn und Ende der Serie an.");
      return false;
    }
    if (draft.longTermEnd < draft.longTermStart) {
      showToast("Das Ende der Serie muss am oder nach dem Beginn liegen.");
      return false;
    }
  } else if (!draft.date) {
    showToast("Bitte wähle ein Datum aus.");
    return false;
  }
  if (!state.longTermEnabled && state.selectedRoom && state.selectedSeat) {
    const hasConflict = reservations.some((item) =>
      item.room === state.selectedRoom &&
      item.seat === state.selectedSeat.split("-").pop() &&
      item.date === draft.date &&
      !["Storniert", "Verpasst"].includes(item.status) &&
      startMinutes < timeToMinutes(item.end) &&
      endMinutes > timeToMinutes(item.start)
    );
    if (hasConflict) {
      showToast("Dieser Platz ist im gewählten Zeitraum bereits belegt. Bitte wähle eine andere Zeit oder einen anderen Platz.");
      return false;
    }
  }
  return true;
}

function openRuleTest() {
  if (state.testPassed) {
    showToast("Der Regeltest wurde bereits bestanden und kann nicht wiederholt werden.");
    return;
  }

  const questions = [
    {
      type: "multiple",
      text: "Welche zwei Verhaltensweisen gehören zu den QuietSpace-Regeln?",
      answers: [
        "Im Raum ruhig bleiben und andere nicht stören",
        "Nicht benötigte Reservationen frühzeitig stornieren",
        "Plätze für Freunde freihalten",
        "Telefonate leise am Platz führen",
      ],
      correct: [0, 1],
      points: 2,
      hint: "Wähle genau zwei Antworten aus.",
    },
    {
      type: "single",
      text: "Bis wann musst du nach Beginn deiner Reservation einchecken?",
      answers: ["Innerhalb von 5 Minuten", "Innerhalb von 15 Minuten", "Erst beim Verlassen des Raums", "Ein Check-in ist nicht nötig"],
      correct: 0,
      points: 1,
    },
    {
      type: "single",
      text: "Was sollst du tun, wenn du eine Reservation nicht mehr benötigst?",
      answers: ["Den Platz trotzdem blockiert lassen", "Die Reservation frühzeitig stornieren", "Einen zweiten Platz reservieren", "Nichts, der Platz wird automatisch frei"],
      correct: 1,
      points: 1,
    },
  ];

  let currentQuestion = 0;
  const answers = [[], null, null];
  const list = document.querySelector(".quiz-list");
  const submitButton = document.querySelector("#submitRuleTest");
  const dialog = document.querySelector("#ruleTestDialog");

  function renderQuestion() {
    const question = questions[currentQuestion];
    const inputType = question.type === "multiple" ? "checkbox" : "radio";
    const saved = answers[currentQuestion];

    list.innerHTML = `
      <div class="quiz-progress" aria-label="Frage ${currentQuestion + 1} von ${questions.length}">
        <span>Frage ${currentQuestion + 1} von ${questions.length}</span>
        <div class="quiz-progress-bar"><span style="width:${((currentQuestion + 1) / questions.length) * 100}%"></span></div>
      </div>
      <div class="quiz-question quiz-question-current">
        <span class="quiz-points">${question.points} ${question.points === 1 ? "Punkt" : "Punkte"}</span>
        <h3>${question.text}</h3>
        ${question.hint ? `<p class="muted">${question.hint}</p>` : ""}
        <div class="quiz-answers">
          ${question.answers.map((answer, index) => {
            const checked = question.type === "multiple" ? Array.isArray(saved) && saved.includes(index) : saved === index;
            return `<label class="quiz-answer"><input type="${inputType}" name="ruleQuestion" value="${index}" ${checked ? "checked" : ""}><span>${answer}</span></label>`;
          }).join("")}
        </div>
      </div>`;

    submitButton.textContent = currentQuestion === questions.length - 1 ? "Test auswerten" : "Weiter";
  }

  submitButton.onclick = () => {
    const question = questions[currentQuestion];
    const checked = [...list.querySelectorAll('input[name="ruleQuestion"]:checked')].map((input) => Number(input.value));

    if (question.type === "multiple") {
      if (checked.length !== 2) {
        showToast("Bitte wähle bei dieser Frage genau zwei Antworten aus.");
        return;
      }
      answers[currentQuestion] = checked;
    } else {
      if (checked.length !== 1) {
        showToast("Bitte wähle eine Antwort aus.");
        return;
      }
      answers[currentQuestion] = checked[0];
    }

    if (currentQuestion < questions.length - 1) {
      currentQuestion += 1;
      renderQuestion();
      return;
    }

    let score = 0;
    const firstAnswer = [...answers[0]].sort((a, b) => a - b);
    const firstCorrect = [...questions[0].correct].sort((a, b) => a - b);
    if (firstAnswer.length === firstCorrect.length && firstAnswer.every((value, index) => value === firstCorrect[index])) {
      score += 2;
    }
    if (answers[1] === questions[1].correct) score += 1;
    if (answers[2] === questions[2].correct) score += 1;

    state.testPassed = score >= 3;
    dialog.close();

    if (state.testPassed) {
      window.localStorage.setItem("quietspace-rule-test-passed", "true");
      showToast(`Bestanden: ${score}/4 Punkte. Reservationen sind jetzt freigeschaltet.`);
      if (state.pendingBookingAfterTest) {
        state.pendingBookingAfterTest = false;
        state.route = "booking";
        state.bookingStep = 1;
      }
    } else {
      state.pendingBookingAfterTest = false;
      const explanations = [];
      if (!(firstAnswer.length === firstCorrect.length && firstAnswer.every((value, index) => value === firstCorrect[index]))) {
        explanations.push("Richtig ist: ruhig bleiben und nicht benötigte Reservationen frühzeitig stornieren");
      }
      if (answers[1] !== questions[1].correct) explanations.push("Der Check-in muss innerhalb von 5 Minuten erfolgen");
      if (answers[2] !== questions[2].correct) explanations.push("Eine nicht mehr benötigte Reservation muss frühzeitig storniert werden");
      showToast(`Nicht bestanden: ${score}/4 Punkte. ${explanations.join(". ")}. Du kannst den Test erneut versuchen.`, 9000);
    }
    render();
  };

  renderQuestion();
  dialog.showModal();
}

function showToast(message, duration = 4000) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), duration);
}

document.querySelector("#openMenu").addEventListener("click", () => {
  if (window.matchMedia("(max-width: 900px)").matches) {
    sidebar.classList.add("open");
    return;
  }

  state.sidebarCollapsed = false;
  render();
});

document.querySelector("#closeMenu").addEventListener("click", () => {
  if (window.matchMedia("(max-width: 900px)").matches) {
    sidebar.classList.remove("open");
    return;
  }

  state.sidebarCollapsed = true;
  render();
});

document.querySelector("#roleSelect").addEventListener("change", (event) => {
  state.role = event.target.value;
  if (state.role !== "teacher") state.teacherBlockMode = false;
  if (state.role === "student" && state.route === "students") {
    state.route = "start";
  }
  render();
});

document.querySelector("#confirmRights").addEventListener("click", (event) => {
  event.preventDefault();
  document.querySelector("#noteDialog").close();
  showToast(state.rightsTarget === "remove" ? "Rechte wurden mit Notiz entzogen." : "Rechte wurden mit Notiz freigegeben.");
});

window.addEventListener("hashchange", () => {
  state.route = getInitialRoute();
  applyDeepLink();
  render();
});

applyDeepLink();
render();
