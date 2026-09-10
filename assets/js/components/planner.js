import { PLACES } from '../data/places.js';
import { DISTRICTS } from '../data/districts.js';

export function generateTripItinerary(days = 2, selectedInterests = ['sea', 'cafe', 'restaurant', 'photo']) {
  // Filter relevant places
  let availablePlaces = PLACES.filter(p => selectedInterests.includes(p.category) || p.isTrending);

  if (availablePlaces.length < days * 4) {
    availablePlaces = [...PLACES];
  }

  const itineraryDays = [];
  const usedPlaceIds = new Set();

  const timeSlots = [
    { time: "08:30 น.", label: "มื้อเช้า & กิจกรรมต้อนรับวันใหม่", categoryPref: ["cafe", "nature", "sea"] },
    { time: "10:30 น.", label: "แลนด์มาร์คไฮไลท์ประจำวัน", categoryPref: ["sea", "history", "photo", "nature"] },
    { time: "12:30 น.", label: "รับประทานอาหารกลางวันพื้นบ้านเด็ด", categoryPref: ["restaurant", "sea"] },
    { time: "14:30 น.", label: "เช็คอินคาเฟ่เก๋ๆ & ถ่ายรูปสวย", categoryPref: ["cafe", "photo"] },
    { time: "17:00 น.", label: "ชมพระอาทิตย์ตกดิน & จุดชมวิว", categoryPref: ["photo", "sea", "nature"] },
    { time: "19:00 น.", label: "มื้อค่ำสุดชิลล์ริมทะเล / ตลาดกลางคืน", categoryPref: ["restaurant", "shopping"] }
  ];

  // Group main focus per day
  const districtFocusList = [
    ["mueang-chonburi", "bang-lamung"],
    ["si-racha", "ko-sichang"],
    ["sattahip", "bang-lamung"],
    ["phanat-nikhom", "ban-bueng", "ko-chan"]
  ];

  for (let d = 1; d <= days; d++) {
    const dayDistricts = districtFocusList[(d - 1) % districtFocusList.length];
    const dayItems = [];

    timeSlots.forEach((slot, slotIndex) => {
      // Find place matching district and category preference
      let candidate = availablePlaces.find(p => 
        !usedPlaceIds.has(p.id) && 
        dayDistricts.includes(p.districtId) && 
        slot.categoryPref.includes(p.category)
      );

      // Fallback 1: Any matching category
      if (!candidate) {
        candidate = availablePlaces.find(p => !usedPlaceIds.has(p.id) && slot.categoryPref.includes(p.category));
      }

      // Fallback 2: Any unused place
      if (!candidate) {
        candidate = availablePlaces.find(p => !usedPlaceIds.has(p.id));
      }

      if (candidate) {
        usedPlaceIds.add(candidate.id);
        const districtObj = DISTRICTS.find(dis => dis.id === candidate.districtId);

        dayItems.push({
          time: slot.time,
          titleLabel: slot.label,
          place: candidate,
          districtName: districtObj ? districtObj.nameTh : "ชลบุรี"
        });
      }
    });

    itineraryDays.push({
      dayNumber: d,
      title: `วันที่ ${d}: ค้นพบเสน่ห์${dayDistricts.map(did => (DISTRICTS.find(dt => dt.id === did) || {}).nameTh).filter(Boolean).join(" & ")}`,
      schedule: dayItems
    });
  }

  return itineraryDays;
}
