// --- EVENT CATEGORY DEFINITIONS ---

/**
 * TIMELINE EVENT SCHEMA
 * =====================
 * An event object placed inside an EVENT_CATEGORIES[].events array.
 *
 * TIMING — use ONE of the following two approaches:
 *
 *   ya         {number}  Years ago (e.g. 13.8e9, 66e6, 300e3).
 *                        Use scientific notation for large values.
 *                        For recent/historical dates, prefer cal_year instead.
 *   end_ya     {number}  [optional] End of a span, in years ago. Only used with ya.
 *
 *   cal_year   {number}  Calendar year. Negative = BCE (e.g. -27 = 27 BCE),
 *                        positive = CE (e.g. 1969 = 1969 CE).
 *   end_cal_year {number} [optional] End year of a span. Only used with cal_year.
 *
 *   Crossover guide:
 *     - Pre-history / geological / cosmic events  → use ya
 *     - Anything with a recognisable BCE/CE year  → use cal_year
 *     - ya and cal_year should NOT both be set on the same event.
 *
 * DISPLAY
 *   name       {string}  Short label shown on the timeline (keep under ~30 chars).
 *   time       {string}  Human-readable date string shown in the UI,
 *                        e.g. "13.8 bya", "66 mya", "1440 CE", "27 BCE – 476 CE".
 *   desc       {string}  One-sentence description. Can be empty string "".
 *
 * CLASSIFICATION
 *   type       {string}  [optional] semantic type that may be used for visual or organizational purposes. 
 *                        Common ones may include:
 *                          "milestone" – a discrete, important moment in time
 *                          "epoch"     – a period or era (usually has an end_ya / end_cal_year)
 *                          "invention"    – a new technology or discovery
 *                          "mass_adoption"– widespread societal uptake
 *
 * APPEARANCE
 *   color      {string}  [optional] Hex color string, e.g. "#ff6b6b".
 *                        If omitted, the category default color is used.
 *
 *   visibleFrom {number} [optional] The ya zoom level at which this event becomes
 *                        visible. Used to hide fine-grained sub-events until the
 *                        user has zoomed in to a relevant timescale.
 *                        e.g. visibleFrom: 230e6 means only show when viewing
 *                        within the last 230 million years.
 */

const EVENT_CATEGORIES = [
    {
        id: 'key_events',
        name: 'Key events',
        desc: 'Major milestones in the history of the universe, Earth, and civilisation',
        events: [
            { ya: 13.8e9, name: "Big Bang", time: "13.8 bya", desc: "Origin of space, time and matter", anti: "milestone" },
            { ya: 13.6e9, name: "First stars", time: "13.6 bya", desc: "Hydrogen ignites across the universe", type: "epoch" },
            { ya: 13.6e9, name: "Milky Way begins forming", time: "13.6 bya", desc: "Earliest stars and globular clusters assemble", type: "epoch" },
            { ya: 11e9, name: "Milky Way merger", time: "11 bya", desc: "Collision with the Gaia-Enceladus dwarf galaxy shapes the galactic halo", type: "epoch" },
            { ya: 8e9, name: "Milky Way thin disk forms", time: "8 bya", desc: "The galaxy settles into its current spiral shape", type: "epoch" },
            { ya: 4.6e9, name: "Sun forms", time: "4.6 bya", desc: "Cloud of gas and dust collapses to form the Sun", type: "milestone" },
			{ ya: 4.54e9, name: "Earth forms", time: "4.54 bya", desc: "Solar system dust gathers into a planet", type: "milestone" },
            { ya: 4.5e9, name: "Moon forms", time: "4.5 bya", desc: "Giant impact sends debris into orbit", type: "epoch", visibleFrom: 4.6e9 },
            { ya: 3.8e9, name: "First life", time: "3.8 bya", desc: "Single-celled organisms in the oceans", type: "milestone" },
            { ya: 2.4e9, name: "Great Oxygenation", time: "2.4 bya", desc: "Photosynthesis transforms the atmosphere", type: "milestone" },
            { ya: 2e9, name: "Eukaryotes", time: "2 bya", desc: "Cells with a nucleus appear", type: "epoch" },
            { ya: 700e6, name: "Multicellular life", time: "700 mya", desc: "Complex organisms emerge", type: "epoch" },
            { ya: 540e6, name: "Cambrian explosion", time: "540 mya", desc: "Rapid diversification of animal life", type: "milestone" },
            { ya: 375e6, name: "Life onto land", time: "375 mya", desc: "Tetrapods crawl from water to shore", type: "epoch" },
            { ya: 230e6, end_ya: 66e6, name: "Dinosaurs", time: "230–66 mya", desc: "Reign of the dinosaurs begins", type: "epoch", color: "#ffff00" },
            { ya: 230e6, end_ya: 228e6, visibleFrom: 230e6, name: "Earliest Dinosaurs", time: "230–228 mya", desc: "Eoraptor and Herrerasaurus", type: "epoch", color: "#ff9000" },
            { ya: 152e6, end_ya: 149e6, visibleFrom: 230e6, name: "Diplodocus", time: "152–149 mya", desc: "", type: "epoch", color: "#9305ff" },
            { ya: 155e6, end_ya: 145e6, visibleFrom: 230e6, name: "Stegosaurus", time: "155–145 mya", desc: "", type: "epoch", color: "#ff9000" },
            { ya: 69e6, end_ya: 66e6, visibleFrom: 230e6, name: "Tyrannosaurus Rex", time: "69–66 mya", desc: "", type: "epoch", color: "#aa0000" },
            { ya: 68e6, end_ya: 66e6, visibleFrom: 230e6, name: "Triceratops", time: "68–66 mya", desc: "", type: "epoch", color: "#ff9000" },
            { ya: 66e6, name: "Mass extinction", time: "66 mya", desc: "Asteroid ends the dinosaur era", type: "milestone" },
            { ya: 40e6, name: "First monkeys", time: "40 mya", desc: "Primates diverge into Simians and Tarsiers", type: "epoch", color: "#00ff90" },
            { ya: 25e6, name: "First apes", time: "25 mya", desc: "Primates diverge into Old World monkeys and apes", type: "epoch" },
            { ya: 6e6, name: "Hominin split", time: "6 mya", desc: "Human and chimp lineages diverge", type: "epoch" },
            { ya: 1.8e6, end_ya: 108e3, name: "Homo erectus", time: "1.8 million–108,000 ya", desc: "", type: "epoch", color: "#00ff90" },
            { ya: 400e3, end_ya: 40e3, name: "Neanderthals", time: "400,000–40,000 ya", desc: "", type: "epoch", color: "#f15feaff" },
            { ya: 300e3, name: "Homo sapiens", time: "300,000 ya", desc: "Modern humans evolve in Africa", type: "milestone", color: "#00ffaaff" },
            { ya: 70e3, name: "Out of Africa", time: "70,000 ya", desc: "Humans migrate across the globe", type: "milestone", color: "#00ffaaff" },
            { ya: 12e3, name: "Agriculture", time: "12,000 ya", desc: "Farming replaces hunter-gathering", type: "milestone", color: "#00ffaaff" },
            { cal_year: -12e3, end_cal_year: -3e3, name: "Stone Age", time: "12,000–3,000 BCE", desc: "Stone Age", type: "epoch", color: "#999999" },
            { cal_year: -3e3, end_cal_year: -1.2e3, name: "Bronze Age", time: "3,000–1,200 BCE", desc: "Bronze Age", type: "epoch", color: "#ffbb00" },
            { cal_year: -1.2e3, end_cal_year: -500, name: "Iron Age", time: "1,200–500 BCE", desc: "Iron Age", type: "epoch" },
            { ya: 5000, name: "Writing", time: "5,000 ya", desc: "Sumerian cuneiform; recorded history begins", type: "milestone" },
            { ya: 5000, name: "Stonehenge", time: "5,000 ya", desc: "Stonehenge", type: "milestone" },
            { ya: 4500, name: "Great Pyramid of Giza", time: "4,500 ya", desc: "Great Pyramid of Giza", type: "milestone" },
            { cal_year: -800, end_cal_year: -146, name: "Ancient Greece", time: "800–146 BCE", desc: "Philosophy, democracy, and art", type: "milestone", color: "#00ff00" },
            { cal_year: -27, end_cal_year: 476, name: "Roman Empire", time: "27 BCE – 476 CE", desc: "Conquest and engineering", type: "milestone", color: "#ff0000" },
            { cal_year: 1440, name: "Printing press", time: "1440 CE", desc: "Gutenberg democratises knowledge", type: "milestone" },
            { cal_year: 1687, name: "Newton's Principia", time: "1687 CE", desc: "Laws of motion; modern science begins", type: "epoch" },
            { cal_year: 1760, end_cal_year: 1840, name: "Industrial revolution", time: "1760s CE", desc: "Steam power transforms civilisation", type: "milestone" },
            { cal_year: 1850, name: "Germ theory", time: "~1850 CE", desc: "Disease explained; medicine transformed", type: "epoch" },
            { cal_year: 1903, name: "Powered flight", time: "1903 CE", desc: "Wright brothers' first flight", type: "milestone" },
            { cal_year: 1914, end_cal_year: 1918, name: "World War I", time: "1914–18", desc: "Major global conflict", type: "milestone" },
            { cal_year: 1939, end_cal_year: 1945, name: "World War II", time: "1939–45", desc: "Major global conflict", type: "milestone" },
            { cal_year: 1945, name: "Nuclear age", time: "1945 CE", desc: "Atomic bomb; the Cold War begins", type: "epoch" },
            { cal_year: 1969, name: "Moon landing", time: "1969 CE", desc: "Humans walk on another world", type: "milestone" },
            { cal_year: 1991, name: "World Wide Web", time: "1991 CE", desc: "Berners-Lee connects global knowledge", type: "milestone" },
            { cal_year: 2007, name: "Smartphones", time: "2007 CE", desc: "The internet fits in your pocket", type: "epoch" },
            { cal_year: 2020, name: "COVID-19", time: "2020 CE", desc: "Global pandemic halts modern life", type: "milestone" },
            { cal_year: 2022, name: "AI goes mainstream", time: "2022–23 CE", desc: "Large language models reshape culture", type: "milestone" },
        ]
    },
    {
        id: 'famous_scientists',
        name: 'Famous scientists',
        desc: 'Lifespans and key contributions of notable scientists',
        events: [
            { cal_year: -460, end_cal_year: -370, name: "Hippocrates", time: "460–370 BCE", desc: "Father of medicine; Hippocratic Oath", type: "epoch"},
            { cal_year: -384, end_cal_year: -322, name: "Aristotle", time: "384–322 BCE", desc: "Greek philosopher; foundations of biology, logic, and physics", type: "epoch"},
            { cal_year: -325, end_cal_year: -265, name: "Euclid", time: "c. 325–265 BCE", desc: "Father of geometry; Elements", type: "epoch"},
            { cal_year: -287, end_cal_year: -212, name: "Archimedes", time: "287–212 BCE", desc: "Buoyancy, levers, and early calculus concepts", type: "epoch"},
            { cal_year: -276, end_cal_year: -195, name: "Eratosthenes", time: "276–195 BCE", desc: "Calculated Earth's circumference with remarkable accuracy", type: "epoch"},
            { cal_year: 100, end_cal_year: 170, name: "Ptolemy", time: "100–170 CE", desc: "Geocentric model; astronomy and geography", type: "epoch"},
            { cal_year: 476, end_cal_year: 550, name: "Aryabhata", time: "476–550 CE", desc: "Indian mathematician and astronomer; zero, pi, and trigonometry", type: "epoch"},
            { cal_year: 780, end_cal_year: 850, name: "Al-Khwarizmi", time: "780–850 CE", desc: "Father of algebra and algorithms", type: "epoch"},
            { cal_year: 965, end_cal_year: 1040, name: "Ibn al-Haytham", time: "965–1040", desc: "Father of optics; scientific method", type: "epoch"},
            { cal_year: 973, end_cal_year: 1048, name: "Al-Biruni", time: "973–1048", desc: "Polymath; astronomy, mathematics, and history", type: "epoch"},
            { cal_year: 980, end_cal_year: 1037, name: "Ibn Sina / Avicenna", time: "980–1037", desc: "Persian polymath; medicine and philosophy", type: "epoch"},
            { cal_year: 1214, end_cal_year: 1292, name: "Roger Bacon", time: "1214–1292", desc: "English philosopher; experimental science pioneer", type: "epoch"},
            { cal_year: 1473, end_cal_year: 1543, name: "Copernicus", time: "1473–1543", desc: "Proposed the heliocentric model of the solar system", type: "epoch"},
            { cal_year: 1564, end_cal_year: 1642, name: "Galileo Galilei", time: "1564–1642", desc: "Father of observational astronomy and modern physics", type: "epoch"},
            { cal_year: 1643, end_cal_year: 1727, name: "Isaac Newton", time: "1643–1727", desc: "Laws of motion, gravity, and calculus", type: "epoch"},
            { cal_year: 1791, end_cal_year: 1867, name: "Michael Faraday", time: "1791–1867", desc: "Electromagnetic induction; electric motor foundations", type: "epoch"},
            { cal_year: 1809, end_cal_year: 1882, name: "Charles Darwin", time: "1809–1882", desc: "Theory of evolution by natural selection", type: "epoch"},
            { cal_year: 1822, end_cal_year: 1895, name: "Louis Pasteur", time: "1822–1895", desc: "Germ theory, pasteurisation, and vaccines", type: "epoch"},
            { cal_year: 1831, end_cal_year: 1879, name: "James Clerk Maxwell", time: "1831–1879", desc: "Unified electricity, magnetism, and light", type: "epoch"},
            { cal_year: 1867, end_cal_year: 1934, name: "Marie Curie", time: "1867–1934", desc: "Pioneered radioactivity research; two Nobel Prizes", type: "epoch"},
            { cal_year: 1879, end_cal_year: 1955, name: "Albert Einstein", time: "1879–1955", desc: "Relativity, E=mc², and the photoelectric effect", type: "epoch"},
            { cal_year: 1885, end_cal_year: 1962, name: "Niels Bohr", time: "1885–1962", desc: "Atomic model and quantum mechanics pioneer", type: "epoch" },
            { cal_year: 1912, end_cal_year: 1954, name: "Alan Turing", time: "1912–1954", desc: "Father of computer science and artificial intelligence", type: "epoch" },
            { cal_year: 1918, end_cal_year: 1988, name: "Richard Feynman", time: "1918–1988", desc: "Quantum electrodynamics; iconic science communicator", type: "epoch" },
            { cal_year: 1920, end_cal_year: 1958, name: "Rosalind Franklin", time: "1920–1958", desc: "X-ray crystallography of DNA structure", type: "epoch" },
            { cal_year: 1942, end_cal_year: 2018, name: "Stephen Hawking", time: "1942–2018", desc: "Black holes, cosmology, and A Brief History of Time", type: "epoch"},
            { cal_year: 1964, end_cal_year: 2026, name: "Jennifer Doudna", time: "1964–", desc: "Co-discoverer of CRISPR gene editing", type: "epoch" },
            { cal_year: 1976, end_cal_year: 2026, name: "Demis Hassabis", time: "1976–", desc: "Co-founder of DeepMind; AI research", type: "epoch" },
        ]
    },
    {
        id: 'communication_tech',
        name: 'Communication technology',
        desc: 'Key inventions in how humans share information',
        events: [
	
			// ===== proto language ==========
			{
				ya: 530e3,
				name: "Vocal 'hardware' develops",
				time: "~530,000 ya",
				desc: "Fossils shows modern-looking hyoid bone and a descended larynx, required for complex articulation",
				type: "platform",
				color: "#a66cff"
			},
	
	
			// ===== EARLY SYMBOLIC COMMUNICATION =====

			{
				ya: 75000,
				visibleFrom: 6e6,
				name: "Symbolic engraving & ochre patterns",
				time: "~75,000 ya",
				desc: "Early abstract symbols on ochre and bone; possible proto-symbolic communication",
				type: "invention",
				color: "#ff6b6b"
			},
			
			{
				ya: 40000,
				visibleFrom: 6e6,
				name: "Cave paintings",
				time: "40,000 ya",
				desc: "Earliest known visual communication",
				type: "invention",
				color: "#ff6b6b"
			},




			{
				ya: 5000,
				name: "Cuneiform writing",
				time: "~3,000 BCE",
				desc: "First writing system in Mesopotamia",
				type: "invention",
				color: "#ff6b6b"
			},

			{
				ya: 3200,
				name: "Phoenician alphabet",
				time: "~1,200 BCE",
				desc: "First widely-used phonetic alphabet",
				type: "invention",
				color: "#ff6b6b"
			},
			

			// ===== KNOWLEDGE STORAGE =====
			
			{
				ya: 6000,
				name: "Clay tokens (proto-record keeping)",
				time: "~8000–3000 BCE",
				desc: "Small clay objects used for accounting and record keeping in early farming societies",
				type: "infrastructure",
				color: "#4ecdc4"
			},

			{
				cal_year: 105,
				name: "Paper (China)",
				time: "105 CE",
				desc: "Cai Lun standardises papermaking",
				type: "infrastructure",
				color: "#4ecdc4"
			},

			{
				cal_year: 200,
				name: "Codex books",
				time: "~2nd century CE",
				desc: "Bound books replace scrolls",
				type: "infrastructure",
				color: "#4ecdc4"
			},

			// ===== MASS REPRODUCTION OF INFORMATION =====

			{
				cal_year: 700,
				name: "Woodblock printing",
				time: "~700 CE",
				desc: "Texts and images reproduced at scale in China",
				type: "invention",
				color: "#ff6b6b"
			},

			{
				cal_year: 1040,
				name: "Movable type printing",
				time: "~1040 CE",
				desc: "Bi Sheng develops movable type in China",
				type: "invention",
				color: "#ff6b6b"
			},

			{
				cal_year: 1440,
				name: "Printing press (Gutenberg)",
				time: "1440 CE",
				desc: "Movable type revolutionises information spread in Europe",
				type: "mass_adoption",
				color: "#45b7d1"
			},

			// ===== MASS MEDIA =====

			{
				cal_year: 1516,
				name: "Modern postal systems",
				time: "1516 CE",
				desc: "Organised state postal networks expand",
				type: "infrastructure",
				color: "#4ecdc4"
			},

			{
				cal_year: 1605,
				name: "Newspapers",
				time: "1605 CE",
				desc: "Regular printed news publications emerge",
				type: "mass_adoption",
				color: "#45b7d1"
			},

			{
				cal_year: 1794,
				name: "Optical telegraph",
				time: "1794 CE",
				desc: "Semaphore towers enable rapid long-distance messaging",
				type: "infrastructure",
				color: "#4ecdc4"
			},

			// ===== ELECTRONIC COMMUNICATION =====

			{
				cal_year: 1826,
				name: "Photographic camera",
				time: "1826 CE",
				desc: "First permanent photograph",
				type: "invention",
				color: "#ff6b6b"
			},

			{
				cal_year: 1837,
				name: "Telegraph",
				time: "1837 CE",
				desc: "Morse code enables instant long-distance messaging",
				type: "invention",
				color: "#ff6b6b"
			},

			{
				cal_year: 1868,
				name: "Typewriter",
				time: "1868 CE",
				desc: "Mechanical typing standardises written communication",
				type: "mass_adoption",
				color: "#45b7d1"
			},

			{
				cal_year: 1876,
				name: "Telephone",
				time: "1876 CE",
				desc: "Bell patents voice transmission over wire",
				type: "invention",
				color: "#ff6b6b"
			},

			{
				cal_year: 1888,
				name: "Moving image camera",
				time: "1888 CE",
				desc: "First practical moving image camera",
				type: "invention",
				color: "#ff6b6b"
			},

			{
				cal_year: 1895,
				name: "Radio",
				time: "1895 CE",
				desc: "Marconi demonstrates wireless telegraphy",
				type: "infrastructure",
				color: "#4ecdc4"
			},

			{
				cal_year: 1895,
				name: "Cinema",
				time: "1895 CE",
				desc: "First public film screening",
				type: "mass_adoption",
				color: "#45b7d1"
			},

			{
				cal_year: 1927,
				name: "Television",
				time: "1927 CE",
				desc: "Farnsworth demonstrates electronic TV",
				type: "mass_adoption",
				color: "#45b7d1"
			},

			// ===== DIGITAL NETWORKS =====

			{
				cal_year: 1962,
				name: "Telstar satellite",
				time: "1962 CE",
				desc: "First active communications satellite",
				type: "infrastructure",
				color: "#4ecdc4"
			},

			{
				cal_year: 1969,
				name: "ARPANET",
				time: "1969 CE",
				desc: "Precursor to the internet goes live",
				type: "infrastructure",
				color: "#4ecdc4"
			},

			{
				cal_year: 1971,
				name: "Email",
				time: "1971 CE",
				desc: "First networked email sent by Ray Tomlinson",
				type: "invention",
				color: "#ff6b6b"
			},

			{
				cal_year: 1977,
				name: "Personal computers",
				time: "1977 CE",
				desc: "Home computing becomes commercially viable",
				type: "mass_adoption",
				color: "#45b7d1"
			},

			{
				cal_year: 1983,
				name: "Early mobile phones",
				time: "1983 CE",
				desc: "Motorola DynaTAC becomes first commercial mobile phone",
				type: "invention",
				color: "#ff6b6b"
			},

			{
				cal_year: 1991,
				name: "World Wide Web (public)",
				time: "1991 CE",
				desc: "Berners-Lee opens the web to the public",
				type: "mass_adoption",
				color: "#45b7d1"
			},

			{
				cal_year: 1992,
				name: "SMS text messaging",
				time: "1992 CE",
				desc: "First text message sent over GSM",
				type: "invention",
				color: "#ff6b6b"
			},

			{
				cal_year: 1998,
				name: "Mobile phones widespread",
				time: "1998 CE",
				desc: "Mobile phones become common consumer technology",
				type: "mass_adoption",
				color: "#45b7d1"
			},

			// ===== SOCIAL / MOBILE INTERNET =====

			{
				cal_year: 2004,
				name: "Facebook",
				time: "2004 CE",
				desc: "Social networking goes mainstream",
				type: "platform",
				color: "#a66cff"
			},

			{
				cal_year: 2007,
				name: "iPhone",
				time: "2007 CE",
				desc: "Touchscreen smartphones redefine communication",
				type: "mass_adoption",
				color: "#45b7d1"
			},

			{
				cal_year: 2010,
				name: "Instagram",
				time: "2010 CE",
				desc: "Visual social media takes off",
				type: "platform",
				color: "#a66cff"
			},

			// ===== AI COMMUNICATION =====

			{
				cal_year: 2022,
				name: "ChatGPT",
				time: "2022 CE",
				desc: "Conversational AI reaches the mainstream",
				type: "platform",
				color: "#a66cff"
			}


        ]
    },
	{
		id: 'mass_extinctions',
		name: 'Mass extinctions',
		desc: 'The "Big Five" mass extinction events in Earth\'s history',
		color: "#ff1111",
		events: [
			{
				ya: 444e6,
				name: "End Ordovician",
				time: "444 mya",
				desc: "86% of species lost; glacial cycles and tectonic uplift caused CO₂ sequestration, sea-level swings, and ocean chemistry changes",
				type: "milestone"
			},
			{
				ya: 360e6,
				name: "Late Devonian",
				time: "360 mya",
				desc: "75% of species lost; rapid spread of land plants caused global cooling, disrupted ocean oxygen levels",
				type: "milestone"
			},
			{
				ya: 250e6,
				name: "End Permian",
				time: "250 mya",
				desc: "96% of species lost; Siberian volcanism caused global warming and ocean acidification",
				type: "milestone"
			},
			{
				ya: 200e6,
				name: "End Triassic",
				time: "200 mya",
				desc: "80% of species lost; underwater volcanism in Atlantic triggered global warming",
				type: "milestone"
			},
			{
				ya: 66e6,
				name: "End Cretaceous",
				time: "66 mya",
				desc: "76% of species lost; asteroid caused rapid global cooling",
				type: "milestone"
			},
		]
	},
	
	
	
	{
        id: 'medical_breakthroughs',
        name: 'Medical breakthroughs',
        desc: 'Key discoveries and innovations in the human battle against disease and mortality',
        events: [
            { ya: 7000, name: "Early Trepanation", time: "~7,000 BCE", desc: "Earliest evidence of surgical intervention (drilling holes in the skull)", type: "invention", color: "#ff6b6b" },
            { cal_year: -1500, name: "Ebers Papyrus", time: "~1500 BCE", desc: "Egyptian medical text documenting herbal remedies and anatomical knowledge", type: "infrastructure" },
            { cal_year: 1000, name: "Inoculation practiced", time: "~1000 CE", desc: "Early smallpox variolation documented in China and India", type: "invention" },
            { cal_year: 1543, name: "Vesalius's Anatomy", time: "1543 CE", desc: "De humani corporis fabrica revolutionizes the study of human anatomy", type: "milestone" },
            { cal_year: 1628, name: "Circulation of blood", time: "1628 CE", desc: "William Harvey discovers how the heart pumps blood through the body", type: "milestone" },
            { cal_year: 1796, name: "First successful vaccine", time: "1796 CE", desc: "Edward Jenner uses cowpox to create immunity against smallpox", type: "invention", color: "#ff6b6b" },
            { cal_year: 1846, name: "Surgical anesthesia", time: "1846 CE", desc: "First public demonstration of ether anesthesia transforms surgery", type: "invention" },
            { cal_year: 1865, name: "Antiseptic surgery", time: "1865 CE", desc: "Joseph Lister introduces carbolic acid to sterilize surgical instruments", type: "mass_adoption", color: "#45b7d1" },
            { cal_year: 1895, name: "X-rays discovered", time: "1895 CE", desc: "Wilhelm Röntgen discovers X-rays, birthing medical imaging", type: "invention" },
            { cal_year: 1928, name: "Penicillin discovered", time: "1928 CE", desc: "Alexander Fleming discovers the first true antibiotic", type: "milestone", color: "#a66cff" },
            { cal_year: 1940, end_cal_year: 1950, name: "Antibiotic mass production", time: "1940s CE", desc: "Penicillin is mass-produced, drastically reducing wartime and civilian infections", type: "mass_adoption", color: "#45b7d1" },
            { cal_year: 1953, name: "DNA double helix", time: "1953 CE", desc: "Franklin, Watson, and Crick unlock the structural blueprint of life", type: "milestone" },
            { cal_year: 1978, name: "First IVF baby", time: "1978 CE", desc: "In vitro fertilization opens new frontiers in reproductive medicine", type: "milestone" },
            { cal_year: 1980, name: "Smallpox eradicated", time: "1980 CE", desc: "WHO officially declares smallpox the first human disease eradicated by science", type: "epoch", color: "#00ff90" },
            { cal_year: 2003, name: "Human Genome Project", time: "2003 CE", desc: "Scientists finish sequencing 92% of the entire human genome", type: "epoch" },
            { cal_year: 2020, name: "mRNA vaccines", time: "2020 CE", desc: "First lipid-nanoparticle mRNA vaccines deployed at scale during COVID-19", type: "mass_adoption", color: "#45b7d1" }
        ]
    },
    {
        id: 'transportation_mobility',
        name: 'Transportation & mobility',
        desc: 'How humanity conquered distance across land, sea, and air',
        events: [
            { ya: 4000, name: "Horse domestication", time: "~4,000 BCE", desc: "Horses are domesticated in the Eurasian Steppe, revolutionizing land travel", type: "epoch" },
            { ya: 3500, name: "Invention of the wheel", time: "~3,500 BCE", desc: "Solid wooden disks are attached to pottery and carts in Mesopotamia", type: "invention", color: "#ff6b6b" },
            { cal_year: -3000, name: "Sailing ships", time: "~3,000 BCE", desc: "Egyptians construct hull-built boats propelled by sails", type: "infrastructure" },
            { cal_year: -2000, name: "The Spoked Wheel", time: "~2,000 BCE", desc: "The invention of wooden spokes drastically lightens wheels, enabling high-speed war chariots", type: "invention", color: "#ff6b6b" },
            { cal_year: -800, name: "Iron-rimmed wheels", time: "~800 BCE", desc: "Blacksmiths wrap wooden wheels in heated iron rims, vastly increasing durability for heavy freight", type: "milestone" },
            { cal_year: -312, name: "The Appian Way", time: "312 BCE", desc: "Construction begins on Rome's famously durable paved highway network", type: "infrastructure" },
            { cal_year: -100, name: "The Swivel Joint", time: "~100 BCE", desc: "Romans implement steerable front axles on four-wheeled wagons, radically improving maneuverability", type: "invention" },
            { cal_year: 400, name: "The Lateen Sail", time: "~400 CE", desc: "Triangular sails allow ships to harness aerodynamic lift and sail 'into the wind' (tacking)", type: "invention", color: "#ff6b6b" },
            { cal_year: 1450, name: "The Caravel & Ocean Crossing", time: "~1450 CE", desc: "Portuguese ship design and the mapping of global trade winds allow reliable, multi-directional ocean travel", type: "epoch", color: "#a66cff" },
            { cal_year: 1783, name: "Hot air balloon", time: "1783 CE", desc: "The Montgolfier brothers achieve the first sustained human flight", type: "invention" },
            { cal_year: 1804, name: "Steam locomotive", time: "1804 CE", desc: "Richard Trevithick debuts the first steam-powered railway engine", type: "invention", color: "#ff6b6b" },
            { cal_year: 1817, name: "Invention of the bicycle", time: "1817 CE", desc: "Karl von Drais invents the wooden 'Laufmaschine' (dandy horse), the proto-bicycle", type: "invention", color: "#ff6b6b" },
            { cal_year: 1830, name: "Inter-city railways open", time: "1830 CE", desc: "The Liverpool and Manchester Railway establishes modern commercial rail", type: "mass_adoption", color: "#45b7d1" },
            { cal_year: 1885, name: "Safety bicycle", time: "1885 CE", desc: "The modern chain-driven bicycle layout triggers a global cycling craze", type: "mass_adoption", color: "#45b7d1", visibleFrom: 10000 },
            { cal_year: 1886, name: "First modern automobile", time: "1886 CE", desc: "Karl Benz patents the gas-powered Motorwagen", type: "invention", color: "#ff6b6b" },
            { cal_year: 1888, name: "Pneumatic tyre", time: "1888 CE", desc: "John Boyd Dunlop patents the air-filled rubber tire, revolutionizing cycling and automotive comfort", type: "invention", color: "#ff6b6b" },
            { cal_year: 1903, name: "First plane", time: "1903 CE", desc: "Wright brothers first sustained, controlled, powered heavier-than-air flight", type: "milestone" },
            { cal_year: 1908, name: "Model T production", time: "1908 CE", desc: "Ford's assembly line makes cars affordable to the middle class", type: "mass_adoption", color: "#45b7d1" },
            { cal_year: 1952, name: "Commercial jet age", time: "1952 CE", desc: "The de Havilland Comet enters service, shrinking global travel times", type: "epoch" },
            { cal_year: 1956, name: "Containerization", time: "1956 CE", desc: "Standardized shipping containers drastically reduce global trade costs", type: "infrastructure" },
			{ cal_year: 1961, name: "First Human in space", time: "1961 CE", desc: "Yuri Gagarin was the first human in space", type: "milestone"},
			{ cal_year: 1964, name: "Bullet Train (Shinkansen)", time: "1964 CE", desc: "Japan launches high-speed rail, connecting Tokyo and Osaka at 210 km/h", type: "infrastructure" },
            { cal_year: 1968, name: "Mass Foreign Holidays", time: "1968 CE", desc: "Cheap jet charters ignite the golden age of affordable Mediterranean package tours in the UK", type: "mass_adoption", color: "#45b7d1" },
            { cal_year: 1969, name: "Moon landing", time: "1969 CE", desc: "Humanity travels to and walks on another celestial body", type: "milestone", color: "#a66cff" },
            { cal_year: 1971, name: "Mass Car Ownership", time: "1971 CE", desc: "Car ownership in the UK crosses the 50% milestone, cementing car-centric infrastructure", type: "mass_adoption", color: "#45b7d1" },
			{ cal_year: 1998, name: "ISS Assembly Begins", time: "1998 CE", desc: "The first module of the International Space Station is launched into orbit", type: "infrastructure" },
            { cal_year: 2008, name: "Tesla Roadster", time: "2008 CE", desc: "Tesla releases its first EV, proving electric cars can be high-performance and desirable", type: "invention", color: "#ff6b6b" },
			{ cal_year: 2015, name: "Rocket Landing", time: "2015 CE", desc: "SpaceX successfully lands an orbital-class rocket booster, unlocking routine reuse", type: "milestone", color: "#a66cff" },
            { cal_year: 2018, name: "Self driving taxi", time: "2018 CE", desc: "Waymo launches the world's first commercial, fully autonomous robotaxi service in Phoenix", type: "epoch", color: "#a66cff" },
            { cal_year: 2023, name: "EV Market Surge", time: "2023 CE", desc: "Hybrid and fully electric vehicles make up nearly half (47%) of all new car registrations in the UK", type: "mass_adoption", color: "#45b7d1" }
        ]
    }
];