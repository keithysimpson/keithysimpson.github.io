const initialEvents = [
  {
    "Date": "2022-01-23",
    "working_to_breath": "0",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "NA",
    "other_event": "birth",
    "Notes": "DOB"
  },
  {
    "Date": "2022-01-27",
    "working_to_breath": "1",
    "in_hospital": "1",
    "received_oxygen": "1",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "4 days old, addmitted to NICU, received oxygen"
  },
  {
    "Date": "2022-02-15",
    "working_to_breath": "1",
    "in_hospital": "1",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "3 weeks old, observation"
  },
  {
    "Date": "2022-06-01",
    "working_to_breath": "1",
    "in_hospital": "1",
    "received_oxygen": "1",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "june, RSV positive, on oxygen, stayed over night"
  },
  {
    "Date": "2022-07-01",
    "working_to_breath": "1",
    "in_hospital": "1",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "July"
  },
  {
    "Date": "2022-10-27",
    "working_to_breath": "1",
    "in_hospital": "1",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "27th October"
  },
  {
    "Date": "2022-11-15",
    "working_to_breath": "1",
    "in_hospital": "1",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "November"
  },
  {
    "Date": "2022-11-30",
    "working_to_breath": "1",
    "in_hospital": "1",
    "received_oxygen": "1",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "November"
  },
  {
    "Date": "2022-12-27",
    "working_to_breath": "1",
    "in_hospital": "1",
    "received_oxygen": "1",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "end of december (\"waft\" of oxygen)"
  },
  {
    "Date": "2023-01-28",
    "working_to_breath": "1",
    "in_hospital": "1",
    "received_oxygen": "1",
    "wtb_severity": "NA",
    "other_event": "began inhaler, 2x 100µg",
    "Notes": "3 nights in hospital, needed oxygen when asleep, started on inhaler (2x 100µg per day of beclametasone)"
  },
  {
    "Date": "2023-03-14",
    "working_to_breath": "1",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "NA",
    "other_event": "started nursery",
    "Notes": "blood oxygen low at times, but not obviously working as hard to breath, didn't go into hospital"
  },
  {
    "Date": "2023-03-21",
    "working_to_breath": "0",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "NA",
    "other_event": "Dr. Shah: reduced inhaler to 2x 50µg",
    "Notes": "Meet Dr. Shah in person, reduced inhaler to 2x 50µg"
  },
  {
    "Date": "2023-04-05",
    "working_to_breath": "1",
    "in_hospital": "1",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "low blood oxygen, 1 day in hospital. Phoebe and keith sick over following week"
  },
  {
    "Date": "2023-04-30",
    "working_to_breath": "0",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "Stomach bug? Sick for a few days, followed by diarrhoea. Breathing not effected"
  },
  {
    "Date": "2023-05-22",
    "working_to_breath": "1",
    "in_hospital": "1",
    "received_oxygen": "1",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "first had some cold symptoms, followed by heavy breathing on 21st May. Blood oxg fell to around 91% early in night, but averaged around 93/94. Next day (22nd) got worse so took him to hospital. Levels were low, they gave lots of blue inhaler, was discharged with blood ox of 90 when awake, and told its fine because heart rate is low and wasn't working to breath. Overnight blood ox feel into 80s, averaging around 88. Called hospital in morning and they said to bring back in. Suggested he had chest infection, gave antibiotics. Discharged again on 23rd. That night blood ox was stable at 93/94, but in morning (24th) seem to be working harder with audible wheeze (despite blood ox levels)."
  },
  {
    "Date": "2023-05-31",
    "working_to_breath": "0",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "stomach bug. sick a lot on first two days, but continued to be unwell, and occationally vomitting until 6th June. Rowan and phoebe also sick, but recoverd after day or two. Keith nauseous but not actually sick"
  },
  {
    "Date": "2023-06-19",
    "working_to_breath": "1",
    "in_hospital": "1",
    "received_oxygen": "1",
    "wtb_severity": "High",
    "other_event": "stopped nursery, inc. inhaler back to 2x 100µg",
    "Notes": "runny nose, developed into a cough, and went to hospital on day 3 with very low blood ox (was dropping to mid 80's). 3 nights in hospital, but last night was unecessary. On second night, blood ox very low without oxygen mask (low 80s) with mask brought up to ~90, then quickly recovered on 3rd day"
  },
  {
    "Date": "2023-06-29",
    "working_to_breath": "1",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "coughing a lot, sneezing, runny nose, slight working to breath but blood ox stayed 93/94 and above"
  },
  {
    "Date": "2023-09-02",
    "working_to_breath": "1",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "working to breath, gave 4 subutimol every 4 hours"
  },
  {
    "Date": "2023-10-21",
    "working_to_breath": "1",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "working to breath, at peak gave 10x subutimol every 4 hours, lowest blood ox sat was 91/92"
  },
  {
    "Date": "2024-03-04",
    "working_to_breath": "0",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "NA",
    "other_event": "started nursery",
    "Notes": "started at devon close"
  },
  {
    "Date": "2024-05-05",
    "working_to_breath": "1",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "working to breath, at peak gave 4x subutimol every 4 hours, lowest blood ox sat was 89 during afternoon nap"
  },
  {
    "Date": "2024-06-09",
    "working_to_breath": "1",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "working to breath, at peak gave 10x subutimol every 4 hours, blood ox sat was round 90/91 during sleep (sometimes dipping to 89)"
  },
  {
    "Date": "2024-07-16",
    "working_to_breath": "1",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "working to breath, at peak gave 10x subutimol every 4 hours, blood ox sat was round 90/91 during sleep (sometimes dipping to 89)"
  },
  {
    "Date": "2024-09-24",
    "working_to_breath": "1",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "working to breath, at peak gave 10x subutimol every 4 hours, blood ox sat at its lowest was round 90/91 during nap, on day 3 (visibly WTB, struggling to talk) so initally felt like a bad one, and were preparing for hospital, but then during the night it wasn't that low for long, was more around 93/94. So not the worst episode, but it came on fast, then he recovered fast."
  },
  {
    "Date": "2024-11-05",
    "working_to_breath": "1",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "working to breath, at peak gave 10x subutimol every 4 hours, came on fast, but then he recovered fast. Didn't manage to put on monitor as he was too jumpy"
  },
  {
    "Date": "2024-11-09",
    "working_to_breath": "0",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "NA",
    "other_event": "Stomach bug",
    "Notes": "stomach bug"
  },
  {
    "Date": "2024-11-27",
    "working_to_breath": "1",
    "in_hospital": "1",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "working to breath, at peak gave 10x subutimol every 4 hours, came on fast. Seemed different to previous, not so snotty, just a cough then a chest tightness (more of a lower RTI perhaps?). At night, blood ox was briefly at 91, but mainly 93/94. Then seemed bad during nap, so went to A&E, but was much better by the time seen. Gave a different steroid medicine (Dexamethasone)"
  },
  {
    "Date": "2025-01-14",
    "working_to_breath": "0",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "NA",
    "other_event": "Stomach bug",
    "Notes": "stomach bug"
  },
  {
    "Date": "2025-01-19",
    "working_to_breath": "1",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "had a cold, give subutimol but only 2 puffs every now and then. On one occasion blood ox was down to 91/92 during sleeping, but heartrate not very high, and didn't look to be WTB as badly as other occasions"
  },
  {
    "Date": "2025-03-11",
    "working_to_breath": "1",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "med",
    "other_event": "",
    "Notes": "[sneezing, runny nose, watering eyes, kept him off nursery, for 1 or two days used sabutimol, but not very much… 1 week later, still not over cold, but any heavy breathing is prob just blocked nose]"
  },
  {
    "Date": "2025-07-20",
    "working_to_breath": "1",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "low",
    "other_event": "",
    "Notes": "had a cold, was  working to breath at some points, tried to give subutimol but he mostly rejected it, only managed to give it once"
  },
  {
    "Date": "2025-09-13",
    "working_to_breath": "1",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "low",
    "other_event": "",
    "Notes": "had a cold, off school for a week"
  },
  {
    "Date": "2025-10-09",
    "working_to_breath": "1",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "med",
    "other_event": "",
    "Notes": "had an off-and-on cold, (maybe separate virus). Off school for a few weeks, leading to taking him to hospital on 24th…"
  },
  {
    "Date": "2025-11-24",
    "working_to_breath": "1",
    "in_hospital": "1",
    "received_oxygen": "0",
    "wtb_severity": "High",
    "other_event": "",
    "Notes": "working to breath, gave subutimol, blood ox sat was round 89/90 during sleep so went to A&E. Give a big burst of subutimol there 3x 10 (?), suggested he had tonsilities, so gave antibotics"
  },
  {
    "Date": "2025-12-08",
    "working_to_breath": "0",
    "in_hospital": "0",
    "received_oxygen": "0",
    "wtb_severity": "NA",
    "other_event": "started at ferry lane",
    "Notes": "started at ferry lane"
  }
];