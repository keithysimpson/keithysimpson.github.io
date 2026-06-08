
// Definitions for each zoom level: name, time span, starting "years ago" (start_ya), and background color
const LEVELS = [
    { name: "Universe", span: "13.8 billion years", start_ya: 13.8e9, color: "#e3e3e3" },
    { name: "Earth", span: "4.6 billion years", start_ya: 4.6e9, color: "#96e0ffff" },
    { name: "Life on Earth", span: "3.8 billion years", start_ya: 3.8e9, color: "#cbffddff" },
    { name: "Complex life", span: "540 million years", start_ya: 540e6, color: "#83ff78ff" },
    { name: "Age of Dinosaurs", span: "230 million years", start_ya: 230e6, color: "#e4fd9dff" },
    { name: "Age of Mammals", span: "65 million years", start_ya: 65e6, color: "#ffff7eff" },
    // human ape split
    { name: "Human-ape split", span: "6 million years", start_ya: 6e6, color: "#ffdfa9ff" },
    { name: "Human prehistory", span: "300,000 years", start_ya: 300e3, color: "#ffc191ff" },
    { name: "Civilisation", span: "12,000 years", start_ya: 12e3, color: "#ffcccc" },
    { name: "Recorded history", span: "3,500 years", start_ya: 3.5e3, color: "#ff9393ff" },
    { name: "Common era", span: "2,000 years", start_ya: 2e3, color: "#ecc4ff" },
    { name: "Last 500 years", span: "500 years", start_ya: 500, color: "#b48bffff" },
    { name: "Last 250 years", span: "250 years", start_ya: 250, color: "#c4d1ff" },
    { name: "Last 100 years", span: "100 years", start_ya: 100, color: "#81cfffff" },
    { name: "Last 50 years", span: "50 years", start_ya: 50, color: "#c4fffa" },
    { name: "Last 25 years", span: "25 years", start_ya: 25, color: "#8dfff5ff" },
];

// (Notch labels removed — replaced by numbered dots)



// --- ACTIVE CATEGORIES & MERGED EVENT LIST ---
// Track which categories are enabled. Default: only 'key_events'.
let activeCategories = new Set(['key_events']);

// Load saved category preferences from localStorage
try {
    const saved = localStorage.getItem('timeline_active_categories');
    if (saved) {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) activeCategories = new Set(parsed);
    }
} catch (e) { /* ignore corrupt data */ }

// Build the merged ALL_EVENTS array from active categories
let ALL_EVENTS = [];
function rebuildEvents() {
    ALL_EVENTS = [];
    EVENT_CATEGORIES.forEach(cat => {
    if (activeCategories.has(cat.id)) {
        cat.events.forEach(e => {
            e._categoryId = cat.id;
        });
        ALL_EVENTS.push(...cat.events);
    }
    });
    if (typeof userCategories !== 'undefined') {
    userCategories.forEach(cat => {
        if (activeCategories.has(cat.id)) {
        ALL_EVENTS.push(...cat.events);
        }
    });
    }
}
rebuildEvents();

// Current year used for converting calendar years to "years ago"
const currentYearGlobal = new Date().getFullYear();

// Prepare events: convert cal_year to ya and sort chronologically
function prepareEvents() {
    ALL_EVENTS.forEach(e => {
    if (typeof e.ya === 'undefined' && typeof e.cal_year !== 'undefined') {
        e.ya = currentYearGlobal - e.cal_year;
    }
    if (typeof e.end_ya === 'undefined' && typeof e.end_cal_year !== 'undefined') {
        e.end_ya = currentYearGlobal - e.end_cal_year;
    }
    });
    ALL_EVENTS.sort((a, b) => b.ya - a.ya);
}
prepareEvents();

let currentLevel = 0;
let buildSettingsUI;

// Dynamically calculate what increment of years each tick mark should represent
// based on the total time span (spanYa) currently visible
function getTickStep(spanYa) {
    if (spanYa === 0) return 1;
    const magnitude = Math.pow(10, Math.floor(Math.log10(spanYa)));
    const steps = [0.1, 0.2, 0.25, 0.5, 1, 2, 2.5, 5, 10].map(s => s * magnitude);
    const targetTicks = 8;
    const roughStep = spanYa / targetTicks;
    let bestStep = steps[0];
    for (const s of steps) {
    if (Math.abs(s - roughStep) < Math.abs(bestStep - roughStep)) {
        bestStep = s;
    }
    }
    return bestStep;
}

// Convert a "years ago" value into a readable string format (e.g., "1.2 BYA", "500 BCE")
function formatTickLabel(ya, roundBCE = false) {
    if (ya === 0) return "Today";

    let timeLabel = "";
    if (ya >= 1e9) {
    timeLabel = Number((ya / 1e9).toFixed(2)).toString() + " BYA";
    } else if (ya >= 1e6) {
    timeLabel = Number((ya / 1e6).toFixed(2)).toString() + " MYA";
    } else if (ya >= 1e3) {
    timeLabel = Number((ya / 1e3).toFixed(2)).toString() + " KYA";
    } else {
    timeLabel = ya + " ya";
    }

    if (ya <= 6000 && ya > 0) {
    const currentYear = new Date().getFullYear();
    let y = currentYear - ya;
    let ceLabel = "";
    if (y > 0) {
        ceLabel = y + " CE";
    } else {
        ceLabel = Math.abs(y - 1) + " BCE";
    }

    if (roundBCE) {
        return ceLabel + "<br>(" + timeLabel + ")";
    } else {
        return timeLabel + "<br>(" + ceLabel + ")";
    }
    }

    return timeLabel;
}

// Get the usable vertical height of the timeline rail
function railH() {
    return (document.getElementById('rail-col').offsetHeight || 500) - 28;
}

// Map a specific "years ago" value to a vertical pixel position on the rail
function dotY(ya, startYa, rH) {
    return rH - (ya / startYa) * rH;
}

// Build the numbered zoom dots in the header bar
function buildZoomDots() {
    const container = document.getElementById('zoom-dots');
    LEVELS.forEach((l, i) => {
    const dot = document.createElement('div');
    dot.className = 'zoom-dot';
    dot.textContent = i + 1;
    dot.dataset.level = i;
    // Use the level's color; darken slightly for better contrast with white text
    dot.style.background = l.color;
    // For very light colors, use dark text
    dot.style.color = isLightColor(l.color) ? '#555' : '#fff';
    dot.addEventListener('click', () => {
        currentLevel = i;
        render(currentLevel);
        updateZoomDots();
    });
    container.appendChild(dot);
    });
    updateZoomDots();
}

// Determine if a hex color is "light" (for text contrast)
function isLightColor(hex) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
}

// Get the color for an event, cycling through colors for overlapping events if no custom color is defined
function getEventColor(e) {
    if (e.color) return e.color;

    // Find the category for this event to check if it has a custom color
    let catColor = null;
    if (e._categoryId) {
        // First check static hardcoded categories
        const staticCat = EVENT_CATEGORIES.find(c => c.id === e._categoryId);
        if (staticCat && staticCat.color) {
            catColor = staticCat.color;
        } else if (typeof userCategories !== 'undefined') {
            // Then check user categories
            const cat = userCategories.find(c => c._firestoreId === e._categoryId);
            if (cat && cat.color) {
                catColor = cat.color;
            }
        }
    }

    const offset = e.offset || 0;

    // If there is an offset (i.e. it overlaps with another event), cycle colors so they are distinguishable!
    // If there is no offset (offset === 0), we can use the category's custom color if it exists, or fall back to the default color.
    if (offset > 0) {
    if (e.type === 'milestone') {
        const milestoneColors = [
        '#ffc86b', // Yellow/Amber (default)
        '#648cff', // Blue
        '#5dcaa5', // Teal/Green
        '#9b5de5', // Purple
        '#ff6b6b', // Coral/Red
        '#00f5d4', // Turquoise
        '#ff54b0'  // Magenta
        ];
        return milestoneColors[offset % milestoneColors.length];
    } else if (e.type === 'epoch') {
        const epochColors = [
        '#5dcaa5', // Teal/Green (default)
        '#ff9f43', // Orange
        '#9b5de5', // Purple
        '#ff6b6b', // Coral/Red
        '#648cff', // Blue
        '#00f5d4', // Turquoise
        '#ff54b0'  // Magenta
        ];
        return epochColors[offset % epochColors.length];
    } else {
        const defaultColors = [
        '#648cff', // Blue (default)
        '#5dcaa5', // Teal/Green
        '#ff9f43', // Orange
        '#9b5de5', // Purple
        '#ff6b6b', // Coral/Red
        '#00f5d4', // Turquoise
        '#ff54b0'  // Magenta
        ];
        return defaultColors[offset % defaultColors.length];
    }
    }

    // Offset is 0 (no overlap) — use category color, or default
    if (catColor) return catColor;

    if (e.type === 'milestone') {
    return '#ffc86b';
    } else if (e.type === 'epoch') {
    return '#5dcaa5';
    } else {
    return '#648cff';
    }
}

let highlightedEventName = null;

function toggleHighlight(name) {
    if (highlightedEventName === name) {
    highlightedEventName = null;
    } else {
    highlightedEventName = name;
    }
    updateHighlights();
}

function updateHighlights() {
    const app = document.getElementById('app');
    const allCards = document.querySelectorAll('.event-item');
    const allDots = document.querySelectorAll('.rail-dot, .rail-period');
    const allPaths = document.querySelectorAll('#connectors-svg path');

    if (!highlightedEventName) {
    app.classList.remove('has-highlight');
    allCards.forEach(c => {
        c.classList.remove('highlighted');
        c.style.removeProperty('--event-color');
    });
    allDots.forEach(d => {
        d.classList.remove('highlighted');
        d.style.removeProperty('--event-color');
    });
    allPaths.forEach(p => {
        p.classList.remove('highlighted');
    });
    return;
    }

    app.classList.add('has-highlight');

    const eventObj = ALL_EVENTS.find(e => e.name === highlightedEventName);
    const color = eventObj ? getEventColor(eventObj) : '#648cff';

    allCards.forEach(c => {
    if (c.dataset.name === highlightedEventName) {
        c.classList.add('highlighted');
        c.style.setProperty('--event-color', color);
    } else {
        c.classList.remove('highlighted');
        c.style.removeProperty('--event-color');
    }
    });

    allDots.forEach(d => {
    if (d.dataset.name === highlightedEventName) {
        d.classList.add('highlighted');
        d.style.setProperty('--event-color', color);
    } else {
        d.classList.remove('highlighted');
        d.style.removeProperty('--event-color');
    }
    });

    allPaths.forEach(p => {
    if (p.getAttribute('data-name') === highlightedEventName) {
        p.classList.add('highlighted');
    } else {
        p.classList.remove('highlighted');
    }
    });
}

// Highlight the active dot and update back/forward button states
function updateZoomDots() {
    const dots = document.querySelectorAll('.zoom-dot');
    dots.forEach((d, i) => {
    d.classList.toggle('active', i === currentLevel);
    });
    const backBtn = document.getElementById('nav-back');
    const fwdBtn = document.getElementById('nav-forward');
    backBtn.classList.toggle('disabled', currentLevel === 0);
    fwdBtn.classList.toggle('disabled', currentLevel === LEVELS.length - 1);
}

// Helper function to collect all rendered timeline elements currently in the DOM
function getItems() {
    const rail = document.getElementById('rail-col');
    const inner = document.getElementById('events-inner');
    const dots = {}, periods = {}, conns = {}, cards = {}, divs = {};
    rail.querySelectorAll('.rail-dot').forEach(el => dots[el.dataset.name] = el);
    rail.querySelectorAll('.rail-period').forEach(el => periods[el.dataset.name] = el);
    rail.querySelectorAll('.conn-line').forEach(el => conns[el.dataset.name] = el);
    inner.querySelectorAll('.event-item').forEach(el => cards[el.dataset.name] = el);
    inner.querySelectorAll('.ev-divider').forEach(el => divs[el.dataset.name] = el);
    return { dots, periods, conns, cards, divs };
}

// Calculate dynamic offsets for visible events to prevent horizontal overlapping on the rail
function calculateOffsets(visibleEvents, startYa, rH) {
    // 1. Map each event to its vertical range [start, end]
    const eventsWithRanges = visibleEvents.map(e => {
    const y1 = rH - (e.ya / startYa) * rH;
    let start, end;
    if (typeof e.end_ya !== 'undefined') {
        const y2 = rH - (e.end_ya / startYa) * rH;
        start = Math.min(y1, y2) - 1; // 1px padding
        end = Math.max(y1, y2) + 1;   // 1px padding
    } else {
        start = y1 - 4; // 7px dot + small padding
        end = y1 + 4;
    }
    return { event: e, start, end };
    });

    // 2. Sort by start coordinate ascending (past to present)
    eventsWithRanges.sort((a, b) => a.start - b.start);

    // 3. Greedy interval coloring to assign offsets
    const activeIntervals = []; // Array of {end, offset}
    eventsWithRanges.forEach(item => {
    const currentStart = item.start;
    
    // Remove active intervals that no longer overlap with currentStart
    for (let i = activeIntervals.length - 1; i >= 0; i--) {
        if (activeIntervals[i].end <= currentStart) {
        activeIntervals.splice(i, 1);
        }
    }

    // Find the smallest available offset (non-negative integer)
    const usedOffsets = new Set(activeIntervals.map(x => x.offset));
    let offset = 0;
    while (usedOffsets.has(offset)) {
        offset++;
    }

    // Assign the offset to the event object
    item.event.offset = offset;

    // Add this interval to the active list
    activeIntervals.push({ end: item.end, offset: offset });
    });
}

let connectorTimer = null;

// Main UI update function: Calculates positions, renders elements, and triggers transitions
function render(levelIdx) {
    const svg = document.getElementById('connectors-svg');
    if (svg) svg.classList.remove('visible');
    if (connectorTimer) clearTimeout(connectorTimer);

    const startYa = LEVELS[levelIdx].start_ya;
    const rH = railH();
    const rail = document.getElementById('rail-col');
    const inner = document.getElementById('events-inner');

    // Determine which events/periods should be visible at the current zoom level.
    // An event is visible if its 'years ago' (ya) or end time fits within the current level's start time (startYa),
    // AND its visibleFrom threshold allows it (defaulting to 5% of its years ago time).
    const visible = ALL_EVENTS.filter(e => {
    const threshold = 0.02;
    const vFrom = e.visibleFrom !== undefined ? e.visibleFrom : (e.ya / threshold);
    const until = e.visibleUntil !== undefined ? e.visibleUntil : LEVELS.length - 1;
    const inTimeRange = e.ya <= startYa || (typeof e.end_ya !== 'undefined' && e.end_ya <= startYa);
    return inTimeRange && startYa <= vFrom && levelIdx <= until;
    });

    // Calculate dynamic offsets for visible events
    calculateOffsets(visible, startYa, rH);

    const visibleNames = new Set(visible.map(e => e.name));

    // Update the header title with the current level's name and total time span
    document.getElementById('level-name').textContent =
    LEVELS[levelIdx].name + ' · ' + LEVELS[levelIdx].span;

    // --- Update Level Backgrounds ---
    // Scale and position the colored blocks on the timeline rail based on the current zoom level's start and end times.
    LEVELS.forEach((l, i) => {
    const bg = document.getElementById('bg-' + i);
    let tTop = l.start_ya;
    let tBot = i + 1 < LEVELS.length ? LEVELS[i + 1].start_ya : 0;

    let yT = dotY(tTop, startYa, rH);
    let yB = dotY(tBot, startYa, rH);

    let viewYT = Math.max(-5000, Math.min(rH + 5000, yT));
    let viewYB = Math.max(-5000, Math.min(rH + 5000, yB));

    bg.style.top = viewYT + 'px';
    bg.style.height = Math.max(0, viewYB - viewYT) + 'px';
    });

    const { dots, periods, conns, cards, divs } = getItems();
    const SLIDE_MS = 500;
    const FADE_MS = 350;

    // --- TICKS ---
    // Generate the ruler lines/ticks along the left timeline rail. 
    // First, get all existing ticks from the DOM to recycle or remove them.
    const ticks = {};
    rail.querySelectorAll('.rail-tick').forEach(el => ticks[el.dataset.ya] = el);

    // Determine the ideal step size between ticks for the current zoom level
    const step = getTickStep(startYa);
    let targetTicksYa = [];
    let count = 0;
    const currentYear = new Date().getFullYear();

    // Calculate which tick marks are actually needed based on the current zoom level
    if (startYa <= 3500) {
    // Special logic for recent history: align ticks to nice round numbers based on the calendar year
    let startCE = currentYear - startYa;
    let firstVisual = Math.floor(currentYear / step) * step;
    let lastVisual = Math.ceil(startCE / step) * step;

    for (let vYear = firstVisual; vYear >= lastVisual; vYear -= step) {
        let y;
        if (vYear > 0) y = vYear;
        else if (vYear < 0) y = vYear + 1;
        else y = 1;

        y = Number(y.toPrecision(12));
        let ya = Number((currentYear - y).toPrecision(12));

        if (ya <= startYa && ya > 0) targetTicksYa.push(ya);
        if (++count > 50) break;
    }
    } else {
    // General logic for deep history: space ticks evenly based on 'years ago'
    for (let y = Math.floor(startYa / step) * step; y > 0; y -= step) {
        let val = Number(y.toPrecision(12));
        if (val <= startYa && val > 0) targetTicksYa.push(val);
        if (++count > 50) break;
    }
    }
    const visibleTicks = new Set(targetTicksYa.map(String));

    // Hide and mark for removal any existing ticks that are no longer needed
    Object.entries(ticks).forEach(([yaStr, tick]) => {
    if (visibleTicks.has(yaStr)) return;
    tick.style.opacity = '0';
    setTimeout(() => tick.remove(), SLIDE_MS + 50);
    });

    // Render the newly calculated ticks (or update the positions of existing ones)
    targetTicksYa.forEach(ya => {
    const yaStr = String(ya);
    const dy = dotY(ya, startYa, rH);

    if (!ticks[yaStr]) {
        const tick = document.createElement('div');
        tick.className = 'rail-tick';
        tick.dataset.ya = yaStr;
        tick.style.top = dy + 'px';
        tick.style.opacity = '0';

        const lbl = document.createElement('div');
        lbl.className = 'rail-tick-label';
        lbl.innerHTML = formatTickLabel(ya, startYa <= 3500);
        tick.appendChild(lbl);

        rail.appendChild(tick);

        requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            tick.style.opacity = '1';
        });
        });
    } else {
        ticks[yaStr].style.top = dy + 'px';
        ticks[yaStr].style.opacity = '1';
        ticks[yaStr].querySelector('.rail-tick-label').innerHTML = formatTickLabel(ya, startYa <= 3500);
    }
    });

    // --- EXIT ANIMATIONS ---
    // Handle timeline markers (dots/periods) and their text cards that are scrolling out of the current zoom level's range.
    // Behavior: Slide smoothly to the top of the rail, then fade out and remove from the DOM to free resources.
    [...Object.entries(dots), ...Object.entries(periods)].forEach(([name, dot]) => {
    if (visibleNames.has(name)) return;
    const conn = conns[name];
    const card = cards[name];
    const div = divs[name];

    dot.style.top = '0px';
    if (conn) conn.style.top = '0px';

    setTimeout(() => {
        dot.style.opacity = '0';
        if (conn) conn.style.opacity = '0';
        if (card) card.style.opacity = '0';
    }, SLIDE_MS - FADE_MS);

    setTimeout(() => {
        dot.remove();
        if (conn) conn.remove();
        if (card) card.remove();
        if (div) div.remove();
    }, SLIDE_MS + 50);
    });

    // --- EVENT CARDS PLACEMENT ---
    // Compute the vertical positions for each event's text card.
    // To prevent overlapping text cards, each card is "nudged" down if it collides with the card above it.

    let positions = visible.map(e => {
    const dy = dotY(e.ya, startYa, rH); // Ideal anchor point matching the dot on the rail
    let labelDy = dy;
    if (typeof e.end_ya !== 'undefined') {
        const dyEnd = dotY(e.end_ya, startYa, rH);
        labelDy = dy + (dyEnd - dy) / 2;
    }
    return { e, dy, labelDy };
    });

    // Sort by labelDy so that layout collision detection processes cards strictly top-to-bottom
    positions.sort((a, b) => a.labelDy - b.labelDy);

    const usedY = []; // Keeps track of occupied vertical spaces
    const ITEM_H = 44; // Estimated card height in pixels

    positions.forEach(pos => {
    let iy = pos.labelDy - 14; // Start attempting to place the card slightly above its anchor position
    // Push the card down if its top overlaps with the bottom of any previously placed card
    for (const u of usedY) { if (iy < u + ITEM_H) iy = u + ITEM_H; }
    iy = Math.max(0, iy); // Prevent cards from going off the very top of the screen
    usedY.push(iy);
    pos.iy = iy;
    });

    // Expand the scrollable container to fit the lowest positioned card
    inner.style.minHeight = ((usedY[usedY.length - 1] || 0) + 80) + 'px';

    // --- ENTER + UPDATE ANIMATIONS ---
    // Iterate over our newly calculated positions to either update existing elements or create new ones
    positions.forEach(({ e, dy, labelDy, iy }) => {
    const hasEnd = typeof e.end_ya !== 'undefined';
    const existingEl = hasEnd ? periods[e.name] : dots[e.name];
    const isNew = !existingEl;

    let dyEnd = dy;
    let periodH = 0;
    if (hasEnd) {
        dyEnd = dotY(e.end_ya, startYa, rH);
        periodH = Math.max(2, dyEnd - dy);
    }

    if (isNew) {
        // Create new visual elements (dot/period, connecting line, text card, divider).
        // They are created initially at the top of the rail with 0 opacity, 
        // allowing CSS transitions to slide them into position and fade them in via requestAnimationFrame below.
        const dot = document.createElement('div');
        dot.className = (hasEnd ? 'rail-period ' : 'rail-dot ') + (e.type || 'default');
        dot.style.background = getEventColor(e);
        if (typeof e.offset !== 'undefined') {
        if (hasEnd) {
            dot.style.left = `calc(50% + ${2 + e.offset * 6}px)`;
        } else {
            dot.style.left = `calc(50% + ${e.offset * 6}px)`;
        }
        }
        dot.style.top = '0px';
        if (hasEnd) dot.style.height = periodH + 'px';
        dot.style.opacity = '0';
        dot.dataset.name = e.name;
        dot.addEventListener('click', (ev) => {
        ev.stopPropagation();
        toggleHighlight(e.name);
        });
        rail.appendChild(dot);

        const conn = document.createElement('div');
        conn.className = 'conn-line';
        conn.style.top = '0px';
        conn.style.opacity = '0';
        conn.dataset.name = e.name;
        rail.appendChild(conn);

        const card = document.createElement('div');
        card.className = 'event-item';
        card.style.top = iy + 'px';
        card.style.opacity = '0';
        card.dataset.name = e.name;
        let actionsHtml = '';
        if (e._userEvent) {
        card.classList.add('user-event');
        actionsHtml = `
            <div class="ev-actions" onclick="event.stopPropagation()">
            <button class="ev-action-btn edit-evt-btn" title="Edit Event" onclick="openEditEventModal('${e._categoryId}', ${e._eventIndex})">
                <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="ev-action-btn delete-evt-btn" title="Delete Event" onclick="handleDeleteEvent('${e._categoryId}', ${e._eventIndex}, '${escapeHtml(e.name)}')">
                <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
            </div>
        `;
        }
        card.innerHTML = `<div class="ev-time">${e.time}</div><div class="ev-name">${e.name}</div><div class="ev-desc">${e.desc}</div>${actionsHtml}`;
        card.addEventListener('click', (ev) => {
        ev.stopPropagation();
        toggleHighlight(e.name);
        });
        inner.appendChild(card);

        const div = document.createElement('div');
        div.className = 'ev-divider';
        div.style.top = (iy + ITEM_H - 2) + 'px';
        div.dataset.name = e.name;
        inner.appendChild(div);

        // Next frame: slide into position and fade in
        requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            dot.style.top = dy + 'px';
            conn.style.top = labelDy + 'px';
            dot.style.opacity = '1';
            conn.style.opacity = '1';
            card.style.opacity = '1';
        });
        });
    } else {
        // Existing dot/period: just update position
        existingEl.style.top = dy + 'px';
        if (hasEnd) existingEl.style.height = periodH + 'px';
        existingEl.style.background = getEventColor(e);
        if (typeof e.offset !== 'undefined') {
        if (hasEnd) {
            existingEl.style.left = `calc(50% + ${2 + e.offset * 6}px)`;
        } else {
            existingEl.style.left = `calc(50% + ${e.offset * 6}px)`;
        }
        }
        existingEl.style.opacity = '1';
        if (conns[e.name]) { conns[e.name].style.top = labelDy + 'px'; conns[e.name].style.opacity = '1'; }
        if (cards[e.name]) { cards[e.name].style.top = iy + 'px'; cards[e.name].style.opacity = '1'; }
        if (divs[e.name]) { divs[e.name].style.top = (iy + ITEM_H - 2) + 'px'; }
    }
    });
    // Synchronize highlighting on all elements after layout changes
    updateHighlights();

    // After the slide/fade transition completes, redraw and fade connectors in
    connectorTimer = setTimeout(() => {
    drawConnectors();
    if (svg) {
        requestAnimationFrame(() => svg.classList.add('visible'));
    }
    }, 560);
}

buildZoomDots();

// Create the background color blocks for the timeline rail that signify eras
function buildLevelBGs() {
    const layer = document.getElementById('level-bg-layer');
    LEVELS.forEach((l, i) => {
    const bg = document.createElement('div');
    bg.className = 'level-bg';
    bg.id = 'bg-' + i;
    bg.style.background = l.color;
    layer.appendChild(bg);
    });
}
buildLevelBGs();

// Back / Forward navigation buttons
document.getElementById('nav-back').addEventListener('click', () => {
    if (currentLevel > 0) {
    currentLevel--;
    render(currentLevel);
    updateZoomDots();
    }
});
document.getElementById('nav-forward').addEventListener('click', () => {
    if (currentLevel < LEVELS.length - 1) {
    currentLevel++;
    render(currentLevel);
    updateZoomDots();
    }
});

// --- Drag-to-scrub across zoom dots (mouse + touch) ---
(function setupDragScrub() {
    const track = document.getElementById('zoom-dots');
    let dragging = false;

    function levelFromPointer(clientX) {
    const dots = track.querySelectorAll('.zoom-dot');
    if (!dots.length) return currentLevel;
    // Find the dot whose center is closest to the pointer
    let best = 0, bestDist = Infinity;
    dots.forEach((d, i) => {
        const rect = d.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const dist = Math.abs(clientX - cx);
        if (dist < bestDist) { bestDist = dist; best = i; }
    });
    return best;
    }

    function applyLevel(clientX) {
    const newLevel = levelFromPointer(clientX);
    if (newLevel !== currentLevel) {
        currentLevel = newLevel;
        render(currentLevel);
        updateZoomDots();
    }
    }

    // Pointer events (covers both mouse and touch)
    track.addEventListener('pointerdown', (e) => {
    dragging = true;
    track.setPointerCapture(e.pointerId);
    applyLevel(e.clientX);
    });

    track.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    applyLevel(e.clientX);
    });

    track.addEventListener('pointerup', (e) => {
    dragging = false;
    track.releasePointerCapture(e.pointerId);
    });

    track.addEventListener('pointercancel', (e) => {
    dragging = false;
    });

    // Prevent default touch behavior (scrolling) while dragging the track
    track.style.touchAction = 'none';
})();

// --- Draw connector lines from rail dots/periods to their event cards ---
// Uses an SVG overlay on the body area. Lines are redrawn whenever
// the events column is scrolled or the window is resized.
function drawConnectors() {
    const svg = document.getElementById('connectors-svg');
    const body = document.getElementById('body');
    const eventsCol = document.getElementById('events-col');
    if (!svg || !body || !eventsCol) return;

    const bodyRect = body.getBoundingClientRect();
    // Size the SVG to match the body area
    svg.setAttribute('width', bodyRect.width);
    svg.setAttribute('height', bodyRect.height);

    let paths = `<defs>
<filter id="line-glow" filterUnits="userSpaceOnUse" 
x="-10" y="-10" width="${bodyRect.width + 20}" height="${bodyRect.height + 20}">
<feGaussianBlur stdDeviation="2" result="blur"/>
<feMerge>
    <feMergeNode in="blur"/>
    <feMergeNode in="SourceGraphic"/>
</feMerge>
</filter>
</defs>`;
    const rail = document.getElementById('rail-col');

    // Iterate over all visible events and draw a line from each rail element to its card
    ALL_EVENTS.forEach(e => {
    const hasEnd = typeof e.end_ya !== 'undefined';
    const railEl = hasEnd
        ? rail.querySelector(`.rail-period[data-name="${CSS.escape(e.name)}"]`)
        : rail.querySelector(`.rail-dot[data-name="${CSS.escape(e.name)}"]`);
    const cardEl = document.querySelector(`.event-item[data-name="${CSS.escape(e.name)}"]`);

    if (!railEl || !cardEl) return;
    // Skip fading-out elements
    if (parseFloat(railEl.style.opacity) === 0 || parseFloat(cardEl.style.opacity) === 0) return;

    const railRect = railEl.getBoundingClientRect();
    const cardRect = cardEl.getBoundingClientRect();

    // Start point: right edge of the rail dot/period, vertically centered
    const x1 = railRect.right - bodyRect.left;
    const y1 = railRect.top + railRect.height / 2 - bodyRect.top;

    // End point: left edge of the card, vertically near the top (at the event name)
    const x2 = cardRect.left - bodyRect.left;
    const y2 = cardRect.top + 14 - bodyRect.top;

    // Skip lines that would go off-screen
    if (y1 < -50 || y1 > bodyRect.height + 50) return;
    if (y2 < -50 || y2 > bodyRect.height + 50) return;

    // Determine the line color based on the event's custom color or type, including overlapping color cycling
    const color = getEventColor(e);

    // Draw a cubic bezier curve for a smooth, organic connector
    const cpx = x1 + (x2 - x1) * 0.5;
    const isHighlighted = (e.name === highlightedEventName);
    paths += `<path data-name="${e.name}" class="${isHighlighted ? 'highlighted' : ''}" d="M${x1},${y1} C${cpx},${y1} ${cpx},${y2} ${x2},${y2}" stroke="${color}" filter="url(#line-glow)" />`;
    });

    svg.innerHTML = paths;
}

// Redraw connectors when events column is scrolled
document.getElementById('events-col').addEventListener('scroll', drawConnectors);
// Redraw connectors on window resize
window.addEventListener('resize', drawConnectors);


// ─── FIREBASE / UI SYNC HELPERS ──────────────────────────────────────────

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

function getAuthBoxHTML() {
    if (typeof currentFirebaseUser === 'undefined' || !currentFirebaseUser) {
    return `
        <div class="auth-box">
        <div class="auth-header">
            <span class="auth-status-badge">
            <span class="status-dot"></span> Checking connection...
            </span>
        </div>
        </div>
    `;
    }

    if (currentFirebaseUser.isAnonymous) {
    return `
        <div class="auth-box">
        <div class="auth-header">
            <span class="auth-status-badge anon">
            <span class="status-dot"></span> Guest Account
            </span>
        </div>
        <div class="auth-user-info">
            Your custom categories are saved on this device. Sign in with Google to sync them across your devices.
        </div>
        <button class="google-signin-btn" id="google-signin-btn">
            <svg viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.89 3.02c.92-2.78 3.53-4.54 6.72-4.54z"/><path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.43c-.28 1.44-1.09 2.67-2.3 3.49l3.57 2.77c2.09-1.93 3.79-4.77 3.79-8.41z"/><path fill="#FBBC05" d="M5.28 14.54c-.24-.72-.37-1.49-.37-2.27s.13-1.55.37-2.27L1.39 7.56C.5 9.34 0 11.3 0 12.27s.5 2.93 1.39 4.71l3.89-3.02z"/><path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.57-2.77c-.99.66-2.26 1.06-4.39 1.06-3.19 0-5.8-1.76-6.72-4.54L1.39 16.86C3.37 20.75 7.35 23 12 23z"/></svg> Sign in with Google
        </button>
        </div>
    `;
    } else {
    const email = currentFirebaseUser.email || 'Google User';
    return `
        <div class="auth-box">
        <div class="auth-header">
            <span class="auth-status-badge google">
            <span class="status-dot"></span> Synced
            </span>
            <button class="signout-link" id="signout-btn">Sign out</button>
        </div>
        <div class="auth-user-info">
            Signed in as <span class="auth-user-email">${escapeHtml(email)}</span>. Your custom categories are backed up and synced.
        </div>
        </div>
    `;
    }
}

async function handleGoogleSignIn() {
    try {
    const btn = document.getElementById('google-signin-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Connecting...';
    }
    await signInWithGoogle();
    } catch (err) {
    console.error('Google Sign-In failed', err);
    alert('Failed to sign in with Google: ' + err.message);
    } finally {
    const btn = document.getElementById('google-signin-btn');
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<svg viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.89 3.02c.92-2.78 3.53-4.54 6.72-4.54z"/><path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.43c-.28 1.44-1.09 2.67-2.3 3.49l3.57 2.77c2.09-1.93 3.79-4.77 3.79-8.41z"/><path fill="#FBBC05" d="M5.28 14.54c-.24-.72-.37-1.49-.37-2.27s.13-1.55.37-2.27L1.39 7.56C.5 9.34 0 11.3 0 12.27s.5 2.93 1.39 4.71l3.89-3.02z"/><path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.57-2.77c-.99.66-2.26 1.06-4.39 1.06-3.19 0-5.8-1.76-6.72-4.54L1.39 16.86C3.37 20.75 7.35 23 12 23z"/></svg> Sign in with Google`;
    }
    }
}

async function handleSignOut() {
    if (confirm('Are you sure you want to sign out? Your custom categories will be loaded from a new temporary session.')) {
    try {
        await firebaseSignOut();
    } catch (err) {
        console.error('Sign-Out failed', err);
    }
    }
}

let activePickrInstance = null;

function closeCustomModal() {
    document.getElementById('custom-modal').classList.remove('open');
    document.getElementById('custom-modal-overlay').classList.remove('open');
    document.getElementById('modal-body').innerHTML = '';
    if (activePickrInstance) {
    activePickrInstance.destroyAndRemove();
    activePickrInstance = null;
    }
}

async function reloadAndRefresh() {
    if (typeof loadUserCategories === 'function') {
    await loadUserCategories();
    }
    await refreshAfterFirestoreChange();
}

async function refreshAfterFirestoreChange() {
    const rail = document.getElementById('rail-col');
    const inner = document.getElementById('events-inner');
    rail.querySelectorAll('.rail-dot, .rail-period, .conn-line').forEach(el => el.remove());
    inner.querySelectorAll('.event-item, .ev-divider').forEach(el => el.remove());
    rebuildEvents();
    prepareEvents();
    render(currentLevel);
}

function syncUserCategoryPreferences() {
    const savedStr = localStorage.getItem('timeline_active_categories');
    if (savedStr) {
    try {
        const saved = JSON.parse(savedStr);
        if (Array.isArray(saved)) {
        if (typeof userCategories !== 'undefined') {
            userCategories.forEach(cat => {
            if (saved.includes(cat.id)) {
                activeCategories.add(cat.id);
            }
            });
        }
        }
    } catch (e) {
        if (typeof userCategories !== 'undefined') {
        userCategories.forEach(cat => activeCategories.add(cat.id));
        }
    }
    } else {
    activeCategories.add('key_events');
    if (typeof userCategories !== 'undefined') {
        userCategories.forEach(cat => activeCategories.add(cat.id));
    }
    }
    localStorage.setItem('timeline_active_categories', JSON.stringify([...activeCategories]));
}

function openCreateCategoryModal() {
    if (activePickrInstance) {
    activePickrInstance.destroyAndRemove();
    activePickrInstance = null;
    }

    const modal = document.getElementById('custom-modal');
    const overlay = document.getElementById('custom-modal-overlay');
    document.getElementById('modal-title').textContent = 'New Category';
    
    document.getElementById('modal-body').innerHTML = `
    <form id="category-form" onsubmit="event.preventDefault()">
        <div class="form-group">
        <label class="form-label" for="cat-name">Category Name</label>
        <input type="text" class="form-input" id="cat-name" required placeholder="e.g. My Travel History">
        </div>
        <div class="form-group">
        <label class="form-label" for="cat-desc">Description</label>
        <input type="text" class="form-input" id="cat-desc" placeholder="e.g. Trips and vacations">
        </div>
        <div class="form-group">
        <label class="form-label">Category Theme Color</label>
        <div class="color-picker-wrapper">
            <div class="color-preview" id="cat-color-preview" style="background: #648cff;"></div>
            <div id="cat-color-picker"></div>
        </div>
        </div>
        <div class="modal-footer">
        <button type="button" class="modal-btn modal-btn-secondary" id="modal-cancel-btn">Cancel</button>
        <button type="submit" class="modal-btn modal-btn-primary" id="modal-submit-btn">Create</button>
        </div>
    </form>
    `;
    
    const colorPreview = document.getElementById('cat-color-preview');
    activePickrInstance = Pickr.create({
    el: '#cat-color-picker',
    theme: 'nano',
    default: '#648cff',
    swatches: [
        '#648cff',
        '#ff6b6b',
        '#4ecdc4',
        '#a66cff',
        '#ff9f43',
        '#2ecc71',
        '#f1c40f',
        '#e74c3c'
    ],
    components: {
        preview: true,
        opacity: false,
        hue: true,
        interaction: {
        input: true,
        clear: false,
        save: false
        }
    }
    });
    
    activePickrInstance.on('change', (color) => {
    colorPreview.style.background = color.toHEXA().toString();
    });
    
    modal.classList.add('open');
    overlay.classList.add('open');
    
    document.getElementById('category-form').addEventListener('submit', async () => {
    const name = document.getElementById('cat-name').value.trim();
    const desc = document.getElementById('cat-desc').value.trim();
    const color = activePickrInstance.getColor().toHEXA().toString();
    
    if (!name) return;
    
    const submitBtn = document.getElementById('modal-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    try {
        const newCatId = await fbCreateCategory(name, desc, color);
        activeCategories.add('user_' + newCatId);
        localStorage.setItem('timeline_active_categories', JSON.stringify([...activeCategories]));
        
        closeCustomModal();
        await reloadAndRefresh();
        if (document.getElementById('settings-panel').classList.contains('open')) {
        buildSettingsUI();
        }
    } catch (err) {
        console.error('Create category failed', err);
        alert('Failed to create category: ' + err.message);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create';
    }
    });
    
    document.getElementById('modal-cancel-btn').addEventListener('click', closeCustomModal);
}

function openEditCategoryModal(catId) {
    const cat = userCategories.find(c => c._firestoreId === catId);
    if (!cat) return;
    
    if (activePickrInstance) {
    activePickrInstance.destroyAndRemove();
    activePickrInstance = null;
    }

    const modal = document.getElementById('custom-modal');
    const overlay = document.getElementById('custom-modal-overlay');
    document.getElementById('modal-title').textContent = 'Edit Category';
    
    document.getElementById('modal-body').innerHTML = `
    <form id="category-form" onsubmit="event.preventDefault()">
        <div class="form-group">
        <label class="form-label" for="cat-name">Category Name</label>
        <input type="text" class="form-input" id="cat-name" required value="${escapeHtml(cat.name)}">
        </div>
        <div class="form-group">
        <label class="form-label" for="cat-desc">Description</label>
        <input type="text" class="form-input" id="cat-desc" value="${escapeHtml(cat.desc)}">
        </div>
        <div class="form-group">
        <label class="form-label">Category Theme Color</label>
        <div class="color-picker-wrapper">
            <div class="color-preview" id="cat-color-preview" style="background: ${cat.color};"></div>
            <div id="cat-color-picker"></div>
        </div>
        </div>
        <div class="modal-footer">
        <button type="button" class="modal-btn modal-btn-secondary" id="modal-cancel-btn">Cancel</button>
        <button type="submit" class="modal-btn modal-btn-primary" id="modal-submit-btn">Save</button>
        </div>
    </form>
    `;
    
    const colorPreview = document.getElementById('cat-color-preview');
    activePickrInstance = Pickr.create({
    el: '#cat-color-picker',
    theme: 'nano',
    default: cat.color || '#648cff',
    swatches: [
        '#648cff',
        '#ff6b6b',
        '#4ecdc4',
        '#a66cff',
        '#ff9f43',
        '#2ecc71',
        '#f1c40f',
        '#e74c3c'
    ],
    components: {
        preview: true,
        opacity: false,
        hue: true,
        interaction: {
        input: true,
        clear: false,
        save: false
        }
    }
    });
    
    activePickrInstance.on('change', (color) => {
    colorPreview.style.background = color.toHEXA().toString();
    });
    
    modal.classList.add('open');
    overlay.classList.add('open');
    
    document.getElementById('category-form').addEventListener('submit', async () => {
    const name = document.getElementById('cat-name').value.trim();
    const desc = document.getElementById('cat-desc').value.trim();
    const color = activePickrInstance.getColor().toHEXA().toString();
    
    if (!name) return;
    
    const submitBtn = document.getElementById('modal-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    try {
        await fbUpdateCategory(catId, { name, desc, color });
        closeCustomModal();
        await reloadAndRefresh();
        if (document.getElementById('settings-panel').classList.contains('open')) {
        buildSettingsUI();
        }
    } catch (err) {
        console.error('Update category failed', err);
        alert('Failed to update category: ' + err.message);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save';
    }
    });
    
    document.getElementById('modal-cancel-btn').addEventListener('click', closeCustomModal);
}

async function handleDeleteCategory(catId) {
    const cat = userCategories.find(c => c._firestoreId === catId);
    if (!cat) return;
    
    if (confirm(`Are you sure you want to delete the category "${cat.name}" and all its events? This cannot be undone.`)) {
    try {
        await fbDeleteCategory(catId);
        activeCategories.delete('user_' + catId);
        localStorage.setItem('timeline_active_categories', JSON.stringify([...activeCategories]));
        await reloadAndRefresh();
        if (document.getElementById('settings-panel').classList.contains('open')) {
        buildSettingsUI();
        }
    } catch (err) {
        console.error('Delete category failed', err);
        alert('Failed to delete category: ' + err.message);
    }
    }
}

function openCreateEventModal(catId) {
    if (activePickrInstance) {
    activePickrInstance.destroyAndRemove();
    activePickrInstance = null;
    }

    const modal = document.getElementById('custom-modal');
    const overlay = document.getElementById('custom-modal-overlay');
    document.getElementById('modal-title').textContent = 'Add Event';
    
    document.getElementById('modal-body').innerHTML = `
    <form id="event-form" onsubmit="event.preventDefault()">
        <div class="form-group">
        <label class="form-label" for="evt-name">Event Name</label>
        <input type="text" class="form-input" id="evt-name" required placeholder="e.g. Invention of printing press">
        </div>
        <div class="form-group">
        <label class="form-label" for="evt-desc">Description</label>
        <input type="text" class="form-input" id="evt-desc" placeholder="e.g. Gutenberg starts publishing">
        </div>
        
        <div class="form-group">
        <label class="form-label">Date Mode</label>
        <div style="display: flex; gap: 16px; margin-bottom: 8px;">
            <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer;">
            <input type="radio" name="evt-date-type" value="cal" checked> Calendar Year (BCE/CE)
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer;">
            <input type="radio" name="evt-date-type" value="ya"> Years Ago (deep history)
            </label>
        </div>
        </div>
        
        <div id="cal-date-inputs">
        <div class="form-row">
            <div class="form-group">
            <label class="form-label" for="evt-cal-year">Start Year (negative for BCE)</label>
            <input type="number" class="form-input" id="evt-cal-year" placeholder="e.g. 1440 or -500">
            </div>
            <div class="form-group">
            <label class="form-label" for="evt-end-cal-year">End Year (optional)</label>
            <input type="number" class="form-input" id="evt-end-cal-year" placeholder="e.g. 1450">
            </div>
        </div>
        </div>
        
        <div id="ya-date-inputs" style="display: none;">
        <div class="form-row">
            <div class="form-group">
            <label class="form-label" for="evt-ya">Start Years Ago</label>
            <input type="number" class="form-input" id="evt-ya" placeholder="e.g. 150000">
            </div>
            <div class="form-group">
            <label class="form-label" for="evt-end-ya">End Years Ago (optional)</label>
            <input type="number" class="form-input" id="evt-end-ya" placeholder="e.g. 100000">
            </div>
        </div>
        </div>

        <div class="form-group">
        <label class="form-label" for="evt-visible-from">Show on Timeline From Zoom Level</label>
        <select class="form-input" id="evt-visible-from">
            <option value="">Default (Show automatically)</option>
            ${LEVELS.map(l => `<option value="${l.start_ya}">${l.name} (${l.span})</option>`).join('')}
        </select>
        </div>

        <div class="form-group">
        <label class="form-label">Custom Event Color (Optional)</label>
        <div class="color-picker-wrapper">
            <div class="color-preview" id="evt-color-preview" style="background: transparent; border: 1.5px dashed rgba(0, 0, 0, 0.25);"></div>
            <div id="evt-color-picker"></div>
            <label style="font-size: 12px; color: #666; cursor: pointer; display: flex; align-items: center; gap: 4px;">
            <input type="checkbox" id="evt-use-color"> Use custom color
            </label>
        </div>
        </div>

        <div class="modal-footer">
        <button type="button" class="modal-btn modal-btn-secondary" id="modal-cancel-btn">Cancel</button>
        <button type="submit" class="modal-btn modal-btn-primary" id="modal-submit-btn">Add Event</button>
        </div>
    </form>
    `;
    
    const dateRadios = document.getElementsByName('evt-date-type');
    const calInputs = document.getElementById('cal-date-inputs');
    const yaInputs = document.getElementById('ya-date-inputs');
    
    const toggleDateInputs = () => {
    const selected = Array.from(dateRadios).find(r => r.checked).value;
    if (selected === 'cal') {
        calInputs.style.display = 'block';
        yaInputs.style.display = 'none';
    } else {
        calInputs.style.display = 'none';
        yaInputs.style.display = 'block';
    }
    };
    
    dateRadios.forEach(r => r.addEventListener('change', toggleDateInputs));
    
    const colorPreview = document.getElementById('evt-color-preview');
    const useColorCheck = document.getElementById('evt-use-color');
    
    activePickrInstance = Pickr.create({
    el: '#evt-color-picker',
    theme: 'nano',
    default: '#ffffff',
    swatches: [
        '#ffffff',
        '#648cff',
        '#ff6b6b',
        '#4ecdc4',
        '#a66cff',
        '#ff9f43',
        '#2ecc71',
        '#f1c40f',
        '#e74c3c'
    ],
    components: {
        preview: true,
        opacity: false,
        hue: true,
        interaction: {
        input: true,
        clear: false,
        save: false
        }
    }
    });
    
    activePickrInstance.on('change', (color) => {
    useColorCheck.checked = true;
    colorPreview.style.background = color.toHEXA().toString();
    colorPreview.style.borderStyle = 'solid';
    });
    
    useColorCheck.addEventListener('change', () => {
    if (useColorCheck.checked) {
        colorPreview.style.background = activePickrInstance.getColor().toHEXA().toString();
        colorPreview.style.borderStyle = 'solid';
    } else {
        colorPreview.style.background = 'transparent';
        colorPreview.style.borderStyle = 'dashed';
    }
    });
    
    modal.classList.add('open');
    overlay.classList.add('open');
    
    document.getElementById('event-form').addEventListener('submit', async () => {
    const name = document.getElementById('evt-name').value.trim();
    const desc = document.getElementById('evt-desc').value.trim();
    const dateType = Array.from(dateRadios).find(r => r.checked).value;
    
    if (!name) return;
    
    const evt = { name, desc };
    
    if (dateType === 'cal') {
        const startStr = document.getElementById('evt-cal-year').value;
        const endStr = document.getElementById('evt-end-cal-year').value;
        if (!startStr) {
        alert('Please specify a start year.');
        return;
        }
        evt.cal_year = parseInt(startStr, 10);
        if (endStr) {
        evt.end_cal_year = parseInt(endStr, 10);
        }
    } else {
        const startStr = document.getElementById('evt-ya').value;
        const endStr = document.getElementById('evt-end-ya').value;
        if (!startStr) {
        alert('Please specify start years ago.');
        return;
        }
        evt.ya = parseFloat(startStr);
        if (endStr) {
        evt.end_ya = parseFloat(endStr);
        }
    }
    
    const isEpoch = (dateType === 'cal' && evt.end_cal_year !== undefined) || (dateType === 'ya' && evt.end_ya !== undefined);
    evt.type = isEpoch ? 'epoch' : 'milestone';
    
    if (useColorCheck.checked) {
        evt.color = activePickrInstance.getColor().toHEXA().toString();
    }
    
    const visibleFromVal = document.getElementById('evt-visible-from').value;
    if (visibleFromVal) {
        evt.visibleFrom = parseFloat(visibleFromVal);
    }
    
    const submitBtn = document.getElementById('modal-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    try {
        await fbAddEvent(catId, evt);
        closeCustomModal();
        await reloadAndRefresh();
        if (document.getElementById('settings-panel').classList.contains('open')) {
        buildSettingsUI();
        }
    } catch (err) {
        console.error('Add event failed', err);
        alert('Failed to add event: ' + err.message);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Event';
    }
    });
    
    document.getElementById('modal-cancel-btn').addEventListener('click', closeCustomModal);
}

function openEditEventModal(catId, eventIndex) {
    const cat = userCategories.find(c => c._firestoreId === catId);
    if (!cat) return;
    const evt = cat.events[eventIndex];
    if (!evt) return;
    
    if (activePickrInstance) {
    activePickrInstance.destroyAndRemove();
    activePickrInstance = null;
    }

    const modal = document.getElementById('custom-modal');
    const overlay = document.getElementById('custom-modal-overlay');
    document.getElementById('modal-title').textContent = 'Edit Event';
    
    const isCalMode = evt.cal_year !== undefined;
    
    document.getElementById('modal-body').innerHTML = `
    <form id="event-form" onsubmit="event.preventDefault()">
        <div class="form-group">
        <label class="form-label" for="evt-name">Event Name</label>
        <input type="text" class="form-input" id="evt-name" required value="${escapeHtml(evt.name)}">
        </div>
        <div class="form-group">
        <label class="form-label" for="evt-desc">Description</label>
        <input type="text" class="form-input" id="evt-desc" value="${escapeHtml(evt.desc || '')}">
        </div>
        
        <div class="form-group">
        <label class="form-label">Date Mode</label>
        <div style="display: flex; gap: 16px; margin-bottom: 8px;">
            <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer;">
            <input type="radio" name="evt-date-type" value="cal" ${isCalMode ? 'checked' : ''}> Calendar Year (BCE/CE)
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer;">
            <input type="radio" name="evt-date-type" value="ya" ${!isCalMode ? 'checked' : ''}> Years Ago (deep history)
            </label>
        </div>
        </div>
        
        <div id="cal-date-inputs" style="display: ${isCalMode ? 'block' : 'none'};">
        <div class="form-row">
            <div class="form-group">
            <label class="form-label" for="evt-cal-year">Start Year (negative for BCE)</label>
            <input type="number" class="form-input" id="evt-cal-year" value="${evt.cal_year !== undefined ? evt.cal_year : ''}" placeholder="e.g. 1969 or -500">
            </div>
            <div class="form-group">
            <label class="form-label" for="evt-end-cal-year">End Year (optional)</label>
            <input type="number" class="form-input" id="evt-end-cal-year" value="${evt.end_cal_year !== undefined ? evt.end_cal_year : ''}" placeholder="e.g. 1972">
            </div>
        </div>
        </div>
        
        <div id="ya-date-inputs" style="display: ${!isCalMode ? 'block' : 'none'};">
        <div class="form-row">
            <div class="form-group">
            <label class="form-label" for="evt-ya">Start Years Ago</label>
            <input type="number" class="form-input" id="evt-ya" value="${evt.ya !== undefined ? evt.ya : ''}" placeholder="e.g. 150000">
            </div>
            <div class="form-group">
            <label class="form-label" for="evt-end-ya">End Years Ago (optional)</label>
            <input type="number" class="form-input" id="evt-end-ya" value="${evt.end_ya !== undefined ? evt.end_ya : ''}" placeholder="e.g. 100000">
            </div>
        </div>
        </div>

        <div class="form-group">
        <label class="form-label" for="evt-visible-from">Show on Timeline From Zoom Level</label>
        <select class="form-input" id="evt-visible-from">
            <option value="">Default (Show automatically)</option>
            ${LEVELS.map(l => {
                const selected = (evt.visibleFrom !== undefined && evt.visibleFrom == l.start_ya) ? 'selected' : '';
                return `<option value="${l.start_ya}" ${selected}>${l.name} (${l.span})</option>`;
            }).join('')}
        </select>
        </div>

        <div class="form-group">
        <label class="form-label">Custom Event Color (Optional)</label>
        <div class="color-picker-wrapper">
            <div class="color-preview" id="evt-color-preview" style="background: ${evt.color || 'transparent'}; border: ${evt.color ? '1.5px solid rgba(0,0,0,0.15)' : '1.5px dashed rgba(0, 0, 0, 0.25)'};"></div>
            <div id="evt-color-picker"></div>
            <label style="font-size: 12px; color: #666; cursor: pointer; display: flex; align-items: center; gap: 4px;">
            <input type="checkbox" id="evt-use-color" ${evt.color ? 'checked' : ''}> Use custom color
            </label>
        </div>
        </div>

        <div class="modal-footer">
        <button type="button" class="modal-btn modal-btn-secondary" id="modal-cancel-btn">Cancel</button>
        <button type="submit" class="modal-btn modal-btn-primary" id="modal-submit-btn">Save</button>
        </div>
    </form>
    `;
    
    const dateRadios = document.getElementsByName('evt-date-type');
    const calInputs = document.getElementById('cal-date-inputs');
    const yaInputs = document.getElementById('ya-date-inputs');
    
    const toggleDateInputs = () => {
    const selected = Array.from(dateRadios).find(r => r.checked).value;
    if (selected === 'cal') {
        calInputs.style.display = 'block';
        yaInputs.style.display = 'none';
    } else {
        calInputs.style.display = 'none';
        yaInputs.style.display = 'block';
    }
    };
    
    dateRadios.forEach(r => r.addEventListener('change', toggleDateInputs));
    
    const colorPreview = document.getElementById('evt-color-preview');
    const useColorCheck = document.getElementById('evt-use-color');
    
    activePickrInstance = Pickr.create({
    el: '#evt-color-picker',
    theme: 'nano',
    default: evt.color || '#ffffff',
    swatches: [
        '#ffffff',
        '#648cff',
        '#ff6b6b',
        '#4ecdc4',
        '#a66cff',
        '#ff9f43',
        '#2ecc71',
        '#f1c40f',
        '#e74c3c'
    ],
    components: {
        preview: true,
        opacity: false,
        hue: true,
        interaction: {
        input: true,
        clear: false,
        save: false
        }
    }
    });
    
    activePickrInstance.on('change', (color) => {
    useColorCheck.checked = true;
    colorPreview.style.background = color.toHEXA().toString();
    colorPreview.style.borderStyle = 'solid';
    });
    
    useColorCheck.addEventListener('change', () => {
    if (useColorCheck.checked) {
        colorPreview.style.background = activePickrInstance.getColor().toHEXA().toString();
        colorPreview.style.borderStyle = 'solid';
    } else {
        colorPreview.style.background = 'transparent';
        colorPreview.style.borderStyle = 'dashed';
    }
    });
    
    modal.classList.add('open');
    overlay.classList.add('open');
    
    document.getElementById('event-form').addEventListener('submit', async () => {
    const name = document.getElementById('evt-name').value.trim();
    const desc = document.getElementById('evt-desc').value.trim();
    const dateType = Array.from(dateRadios).find(r => r.checked).value;
    
    if (!name) return;
    
    const newEvt = { name, desc };
    
    if (dateType === 'cal') {
        const startStr = document.getElementById('evt-cal-year').value;
        const endStr = document.getElementById('evt-end-cal-year').value;
        if (!startStr) {
        alert('Please specify a start year.');
        return;
        }
        newEvt.cal_year = parseInt(startStr, 10);
        if (endStr) {
        newEvt.end_cal_year = parseInt(endStr, 10);
        }
    } else {
        const startStr = document.getElementById('evt-ya').value;
        const endStr = document.getElementById('evt-end-ya').value;
        if (!startStr) {
        alert('Please specify start years ago.');
        return;
        }
        newEvt.ya = parseFloat(startStr);
        if (endStr) {
        newEvt.end_ya = parseFloat(endStr);
        }
    }
    
    const isEpoch = (dateType === 'cal' && newEvt.end_cal_year !== undefined) || (dateType === 'ya' && newEvt.end_ya !== undefined);
    newEvt.type = isEpoch ? 'epoch' : 'milestone';
    
    if (useColorCheck.checked) {
        newEvt.color = activePickrInstance.getColor().toHEXA().toString();
    }
    
    const visibleFromVal = document.getElementById('evt-visible-from').value;
    if (visibleFromVal) {
        newEvt.visibleFrom = parseFloat(visibleFromVal);
    }
    
    const submitBtn = document.getElementById('modal-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    try {
        await fbUpdateEvent(catId, eventIndex, newEvt);
        closeCustomModal();
        await reloadAndRefresh();
        if (document.getElementById('settings-panel').classList.contains('open')) {
        buildSettingsUI();
        }
    } catch (err) {
        console.error('Update event failed', err);
        alert('Failed to update event: ' + err.message);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save';
    }
    });
    
    document.getElementById('modal-cancel-btn').addEventListener('click', closeCustomModal);
}

async function handleDeleteEvent(catId, eventIndex, eventName) {
    if (confirm(`Are you sure you want to delete the event "${eventName}"? This cannot be undone.`)) {
    try {
        await fbDeleteEvent(catId, eventIndex);
        await reloadAndRefresh();
        if (document.getElementById('settings-panel').classList.contains('open')) {
        buildSettingsUI();
        }
    } catch (err) {
        console.error('Delete event failed', err);
        alert('Failed to delete event: ' + err.message);
    }
    }
}

// Attach custom modal closers on background overlay/close button
document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('custom-modal-overlay');
    const closeBtn = document.getElementById('modal-close-btn');
    if (modalOverlay) modalOverlay.addEventListener('click', closeCustomModal);
    if (closeBtn) closeBtn.addEventListener('click', closeCustomModal);
});

// Expose functions globally for HTML inline handlers (on event cards / click triggers)
window.openEditEventModal = openEditEventModal;
window.handleDeleteEvent = handleDeleteEvent;
window.openCreateEventModal = openCreateEventModal;
window.openEditCategoryModal = openEditCategoryModal;
window.handleDeleteCategory = handleDeleteCategory;
window.handleGoogleSignIn = handleGoogleSignIn;
window.handleSignOut = handleSignOut;

// --- SETTINGS PANEL LOGIC ---
(function setupSettings() {
    const btn = document.getElementById('settings-btn');
    const overlay = document.getElementById('settings-overlay');
    const panel = document.getElementById('settings-panel');
    const closeBtn = document.getElementById('settings-close');
    const body = document.getElementById('settings-body');

    function openSettings() {
    overlay.classList.add('open');
    panel.classList.add('open');
    buildSettingsUI();
    }

    function closeSettings() {
    overlay.classList.remove('open');
    panel.classList.remove('open');
    }

    btn.addEventListener('click', openSettings);
    overlay.addEventListener('click', closeSettings);
    closeBtn.addEventListener('click', closeSettings);

    function saveAndRefresh() {
    localStorage.setItem('timeline_active_categories', JSON.stringify([...activeCategories]));
    // Clear existing DOM elements before rebuilding
    const rail = document.getElementById('rail-col');
    const inner = document.getElementById('events-inner');
    rail.querySelectorAll('.rail-dot, .rail-period, .conn-line').forEach(el => el.remove());
    inner.querySelectorAll('.event-item, .ev-divider').forEach(el => el.remove());
    // Rebuild the event list and re-render
    rebuildEvents();
    prepareEvents();
    render(currentLevel);
    }

    buildSettingsUI = function() {
    let html = '';

    // Add Account Section
    html += getAuthBoxHTML();

    html += '<div class="settings-section-label">Show on timeline</div>';

    // 1. Hardcoded Categories
    EVENT_CATEGORIES.forEach(cat => {
        const checked = activeCategories.has(cat.id);
        html += `
        <div class="category-row public-category" data-cat-id="${cat.id}">
            <div class="cat-check ${checked ? 'checked' : ''}">
            <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>
            </div>
            <div class="cat-info">
            <div class="cat-name">${escapeHtml(cat.name)}</div>
            <div class="cat-desc">${escapeHtml(cat.desc)}</div>
            </div>
            <div class="cat-count">${cat.events.length} events</div>
        </div>`;
    });

    // 2. User-created Custom Categories
    if (typeof userCategories !== 'undefined' && userCategories.length > 0) {
        html += '<div class="settings-divider"></div>';
        html += '<div class="settings-section-label">Your Custom Categories</div>';
        
        userCategories.forEach(cat => {
        const checked = activeCategories.has(cat.id);
        html += `
            <div class="category-row user-category" data-cat-id="${cat.id}">
            <div class="cat-check ${checked ? 'checked' : ''}">
                <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>
            </div>
            <div class="cat-info">
                <div class="cat-name-row">
                <span class="cat-name" style="color: ${cat.color};">${escapeHtml(cat.name)}</span>
                <span class="cat-badge" style="background: ${cat.color}1e; color: ${cat.color};">Custom</span>
                </div>
                <div class="cat-desc">${escapeHtml(cat.desc)}</div>
                <div class="cat-actions" onclick="event.stopPropagation()">
                <button class="cat-action-btn add-evt-btn" data-action="add-event" data-firestore-id="${cat._firestoreId}">+ Add event</button>
                <button class="cat-action-btn edit-cat-btn" data-action="edit-category" data-firestore-id="${cat._firestoreId}" title="Edit Category">
                    <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                </button>
                <button class="cat-action-btn delete-cat-btn" data-action="delete-category" data-firestore-id="${cat._firestoreId}" title="Delete Category">
                    <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
                </div>
            </div>
            <div class="cat-count">${cat.events.length} events</div>
            </div>`;
        });
    }

    html += '<div class="settings-divider"></div>';
    
    // Add "+ New category" button
    html += `
        <button class="create-cat-trigger-btn" id="create-cat-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        New Category
        </button>
    `;
    
    html += '<button class="none-btn" id="cat-none-btn">None</button>';

    body.innerHTML = html;

    // Attach listeners for Google sign in / out
    const googleBtn = document.getElementById('google-signin-btn');
    if (googleBtn) googleBtn.addEventListener('click', handleGoogleSignIn);
    const signoutBtn = document.getElementById('signout-btn');
    if (signoutBtn) signoutBtn.addEventListener('click', handleSignOut);

    // Attach click handlers to category rows for selection (toggle checkboxes)
    body.querySelectorAll('.category-row').forEach(row => {
        row.addEventListener('click', () => {
        const id = row.dataset.catId;
        if (activeCategories.has(id)) {
            activeCategories.delete(id);
        } else {
            activeCategories.add(id);
        }
        // Update the checkbox visual immediately
        const check = row.querySelector('.cat-check');
        check.classList.toggle('checked', activeCategories.has(id));
        saveAndRefresh();
        });
    });

    // Attach click handlers to custom category actions
    body.querySelectorAll('[data-action="add-event"]').forEach(btn => {
        btn.addEventListener('click', () => {
        openCreateEventModal(btn.dataset.firestoreId);
        });
    });
    body.querySelectorAll('[data-action="edit-category"]').forEach(btn => {
        btn.addEventListener('click', () => {
        openEditCategoryModal(btn.dataset.firestoreId);
        });
    });
    body.querySelectorAll('[data-action="delete-category"]').forEach(btn => {
        btn.addEventListener('click', () => {
        handleDeleteCategory(btn.dataset.firestoreId);
        });
    });

    // "+ New Category" button
    document.getElementById('create-cat-btn').addEventListener('click', openCreateCategoryModal);

    // "None" button clears all categories
    document.getElementById('cat-none-btn').addEventListener('click', () => {
        activeCategories.clear();
        body.querySelectorAll('.cat-check').forEach(c => c.classList.remove('checked'));
        saveAndRefresh();
    });
    }
    window.buildSettingsUI = buildSettingsUI;
})();

// Global click listener to clear active highlight when clicking outside events/controls
document.addEventListener('click', (ev) => {
    if (
    !ev.target.closest('.event-item') &&
    !ev.target.closest('.rail-dot') &&
    !ev.target.closest('.rail-period') &&
    !ev.target.closest('.settings-btn') &&
    !ev.target.closest('.settings-panel') &&
    !ev.target.closest('.zoom-dot') &&
    !ev.target.closest('.nav-btn')
    ) {
    highlightedEventName = null;
    updateHighlights();
    }
});

setTimeout(() => render(0), 60);

// Initialize Firebase authentication flow
if (typeof initAuth === 'function') {
    initAuth(() => {
    // First successful auth state changed: rebuild, prepare, and re-render
    rebuildEvents();
    prepareEvents();
    render(currentLevel);
    });
}
