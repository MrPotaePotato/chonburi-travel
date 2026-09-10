import { DISTRICTS } from './data/districts.js';
import { PLACES } from './data/places.js';
import { createNavbar } from './components/navbar.js';
import { createBottomNav } from './components/bottomNav.js';
import { initInteractiveMap, renderMapMarkers } from './components/map.js';
import { generateTripItinerary } from './components/planner.js';

// Application State
const state = {
  currentView: 'home', // 'home' | 'districts' | 'district-detail' | 'map' | 'place-detail' | 'hotels' | 'eat-drink' | 'photo-spots' | 'trip-planner' | 'saved'
  selectedDistrictId: null,
  selectedPlaceId: null,
  savedPlaceIds: JSON.parse(localStorage.getItem('chonburi_saved_places') || '[]'),
  searchQuery: '',
  mapFilter: {
    districts: [],
    categories: []
  },
  plannerConfig: {
    days: 2,
    interests: ['sea', 'cafe', 'restaurant', 'photo']
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  const headerContainer = document.getElementById('header-container');
  const bottomNavContainer = document.getElementById('bottom-nav-container');

  // Render Header Navbar
  const navbarEl = createNavbar((targetView) => {
    navigateTo(targetView);
  }, (query) => {
    state.searchQuery = query;
    if (state.currentView === 'home' || state.currentView === 'districts') {
      renderCurrentView();
    }
  });
  headerContainer.replaceWith(navbarEl);

  // Initial Route Check or Home
  handleHashChange();
  window.addEventListener('hashchange', handleHashChange);

  updateBottomNav();
  refreshLucideIcons();
}

function updateBottomNav() {
  const container = document.getElementById('bottom-nav-container');
  if (!container) return;
  const bottomNav = createBottomNav((target) => {
    navigateTo(target);
  }, state.currentView);
  container.innerHTML = '';
  container.appendChild(bottomNav);
  refreshLucideIcons();
}

function handleHashChange() {
  const hash = window.location.hash.replace('#', '') || 'home';
  if (hash.startsWith('district/')) {
    const did = hash.replace('district/', '');
    state.selectedDistrictId = did;
    state.currentView = 'district-detail';
  } else if (hash.startsWith('place/')) {
    const pid = hash.replace('place/', '');
    state.selectedPlaceId = pid;
    state.currentView = 'place-detail';
  } else {
    state.currentView = hash;
  }
  renderCurrentView();
  updateBottomNav();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateTo(view, param = null) {
  if (view === 'district-detail' && param) {
    window.location.hash = `district/${param}`;
  } else if (view === 'place-detail' && param) {
    window.location.hash = `place/${param}`;
  } else {
    window.location.hash = view;
  }
}

function renderCurrentView() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = '';

  switch (state.currentView) {
    case 'home':
      main.appendChild(createHomeView());
      break;
    case 'districts':
      main.appendChild(createDistrictsView());
      break;
    case 'district-detail':
      main.appendChild(createDistrictDetailView(state.selectedDistrictId));
      break;
    case 'map':
      main.appendChild(createMapView());
      break;
    case 'place-detail':
      main.appendChild(createPlaceDetailView(state.selectedPlaceId));
      break;
    case 'hotels':
      main.appendChild(createHotelsView());
      break;
    case 'eat-drink':
      main.appendChild(createEatDrinkView());
      break;
    case 'photo-spots':
      main.appendChild(createPhotoSpotsView());
      break;
    case 'trip-planner':
      main.appendChild(createTripPlannerView());
      break;
    case 'saved':
      main.appendChild(createSavedView());
      break;
    default:
      main.appendChild(createHomeView());
  }

  refreshLucideIcons();
}

function refreshLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/* ==========================================================================
   1. HOME VIEW
   ========================================================================== */
function createHomeView() {
  const container = document.createElement('div');
  container.className = 'space-y-16 pb-20';

  // 1. HERO SECTION
  container.innerHTML = `
    <!-- HERO SECTION -->
    <section class="relative min-h-[520px] sm:min-h-[580px] flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl mx-4 sm:mx-8 mt-4 bg-slate-900">
      <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80" 
           alt="Chonburi Sea" 
           class="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000">
      <div class="absolute inset-0 bg-gradient-to-t from-[#172B3A] via-[#172B3A]/40 to-transparent"></div>
      
      <div class="relative z-10 text-center max-w-4xl mx-auto px-4 py-12">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full hero-badge text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <i data-lucide="sparkles" class="w-4 h-4 text-[#F4B942]"></i> CONCEPT: CHONBURI — More Than The Sea
        </div>
        
        <h1 class="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-md">
          DISCOVER CHONBURI
        </h1>
        <p class="text-lg sm:text-2xl text-cyan-100 font-light mb-8 max-w-2xl mx-auto">
          เที่ยวชลบุรีในแบบที่เป็นคุณ • สำรวจความหลากหลายของ 11 อำเภอ
        </p>

        <!-- Search Bar Big -->
        <div class="bg-white/95 backdrop-blur-md p-2 sm:p-3 rounded-2xl sm:rounded-full shadow-2xl max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 border border-white/50">
          <div class="flex items-center gap-2 w-full px-4 py-2 sm:py-0">
            <i data-lucide="search" class="w-5 h-5 text-[#006B9E] shrink-0"></i>
            <input type="text" id="hero-search-input" placeholder="คุณอยากไปเที่ยวที่ไหนในชลบุรี? (หาดบางแสน, คาเฟ่, โรงแรม...)" class="w-full bg-transparent text-sm sm:text-base text-slate-800 focus:outline-none placeholder-slate-400">
          </div>
          <button id="hero-search-btn" class="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#006B9E] to-[#00A8C6] hover:from-[#005680] hover:to-[#008ba4] text-white font-semibold rounded-xl sm:rounded-full shadow-lg shadow-[#006B9E]/30 transition-all shrink-0">
            ค้นหาเลย
          </button>
        </div>

        <!-- Quick Category Tags -->
        <div class="flex flex-wrap items-center justify-center gap-2 mt-6">
          <button data-[#category="sea"] class="quick-cat-btn px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/20 transition-all">
            🏖️ ทะเล
          </button>
          <button data-category="nature" class="quick-cat-btn px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/20 transition-all">
            🌿 ธรรมชาติ
          </button>
          <button data-category="cafe" class="quick-cat-btn px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/20 transition-all">
            ☕ คาเฟ่
          </button>
          <button data-category="restaurant" class="quick-cat-btn px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/20 transition-all">
            🍜 ร้านอาหาร
          </button>
          <button data-category="hotel" class="quick-cat-btn px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/20 transition-all">
            🏨 ที่พัก
          </button>
        </div>
      </div>
    </section>

    <!-- 2. EXPLORE 11 DISTRICTS SECTION -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <span class="text-[#00A8C6] font-bold text-xs uppercase tracking-wider block mb-1">LOCAL DISCOVERY</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#172B3A]">EXPLORE 11 DISTRICTS</h2>
          <p class="text-slate-500 text-sm mt-1">สำรวจเสน่ห์ที่แตกต่างของชลบุรีทั้ง 11 อำเภอ</p>
        </div>
        <button id="view-all-districts-btn" class="mt-4 md:mt-0 text-[#006B9E] font-bold text-sm hover:underline flex items-center gap-1">
          ดูทั้งหมด 11 อำเภอ <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- District Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        ${DISTRICTS.slice(0, 8).map(d => `
          <div data-district-id="${d.id}" class="district-card group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm card-hover cursor-pointer flex flex-col justify-between">
            <div>
              <div class="relative h-44 overflow-hidden">
                <img src="${d.cover}" alt="${d.nameTh}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div class="absolute bottom-3 left-4 right-4 text-white">
                  <h3 class="text-xl font-bold">${d.nameTh}</h3>
                  <p class="text-xs text-cyan-200 font-light">${d.nameEn}</p>
                </div>
                <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#006B9E] shadow-sm">
                  ${d.placesCount} สถานที่
                </span>
              </div>
              <div class="p-4">
                <p class="text-xs text-slate-600 line-clamp-2 mb-3">${d.shortDesc}</p>
                <div class="flex flex-wrap gap-1">
                  ${d.tags.map(t => `<span class="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">${t}</span>`).join('')}
                </div>
              </div>
            </div>
            <div class="px-4 pb-4 pt-2 border-t border-slate-50 flex items-center justify-between text-xs text-[#006B9E] font-bold">
              <span>สำรวจอำเภอ</span>
              <i data-lucide="chevron-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- 3. TRENDING PLACES -->
    <section class="bg-white py-12 border-y border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <span class="text-[#F4B942] font-bold text-xs uppercase tracking-wider block mb-1">POPULAR DESTINATIONS</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-[#172B3A]">TRENDING PLACES</h2>
            <p class="text-slate-500 text-sm mt-1">สถานที่ท่องเที่ยวยอดนิยมที่ไม่ควรพลาด</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${PLACES.filter(p => p.isTrending).slice(0, 6).map(p => {
            const districtObj = DISTRICTS.find(d => d.id === p.districtId);
            return `
              <div data-place-id="${p.id}" class="place-card bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 card-hover cursor-pointer group flex flex-col justify-between">
                <div>
                  <div class="relative h-48 overflow-hidden">
                    <img src="${p.cover}" alt="${p.nameTh}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                    <button data-bookmark-id="${p.id}" class="bookmark-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors shadow-md">
                      <i data-lucide="heart" class="w-4 h-4 ${state.savedPlaceIds.includes(p.id) ? 'fill-red-500 text-red-500' : ''}"></i>
                    </button>
                    <span class="absolute bottom-3 left-3 bg-[#006B9E] text-white px-2.5 py-1 rounded-lg text-xs font-semibold">
                      ${districtObj ? districtObj.nameTh : 'ชลบุรี'}
                    </span>
                  </div>
                  <div class="p-5">
                    <div class="flex items-center justify-between mb-1">
                      <h3 class="font-bold text-base text-[#172B3A] group-hover:text-[#006B9E] transition-colors">${p.nameTh}</h3>
                      <div class="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i> ${p.rating}
                      </div>
                    </div>
                    <p class="text-xs text-slate-500 line-clamp-2 mb-3">${p.shortDesc}</p>
                    <div class="flex flex-wrap gap-1">
                      ${p.tags.map(t => `<span class="text-[10px] px-2 py-0.5 bg-white text-slate-600 rounded-md font-medium border border-slate-200/60">${t}</span>`).join('')}
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>

    <!-- 4. EXPLORE BY TYPE -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-10">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-[#172B3A]">EXPLORE BY CATEGORY</h2>
        <p class="text-slate-500 text-sm mt-1">เลือกท่องเที่ยวตามไลฟ์สไตล์และความสนใจของคุณ</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <div data-cat-nav="sea" class="cat-card p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border border-blue-100 rounded-2xl text-center card-hover cursor-pointer group">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-[#00A8C6] text-white flex items-center justify-center text-2xl shadow-lg shadow-[#00A8C6]/30 group-hover:scale-110 transition-transform mb-3">
            🏖️
          </div>
          <h3 class="font-bold text-[#172B3A]">ทะเล & ชายหาด</h3>
          <p class="text-xs text-slate-500 mt-1">บางแสน พัทยา เกาะล้าน</p>
        </div>

        <div data-cat-nav="nature" class="cat-card p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl text-center card-hover cursor-pointer group">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform mb-3">
            🌿
          </div>
          <h3 class="font-bold text-[#172B3A]">ธรรมชาติ & เขา</h3>
          <p class="text-xs text-slate-500 mt-1">เขาเขียว อ่างเก็บน้ำ</p>
        </div>

        <div data-cat-nav="cafe" class="cat-card p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl text-center card-hover cursor-pointer group">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-[#F4B942] text-white flex items-center justify-center text-2xl shadow-lg shadow-[#F4B942]/30 group-hover:scale-110 transition-transform mb-3">
            ☕
          </div>
          <h3 class="font-bold text-[#172B3A]">คาเฟ่สุดชิค</h3>
          <p class="text-xs text-slate-500 mt-1">Specialty & Sea View</p>
        </div>

        <div data-cat-nav="hotel" class="cat-card p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl text-center card-hover cursor-pointer group">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-[#006B9E] text-white flex items-center justify-center text-2xl shadow-lg shadow-[#006B9E]/30 group-hover:scale-110 transition-transform mb-3">
            🏨
          </div>
          <h3 class="font-bold text-[#172B3A]">ที่พัก & รีสอร์ท</h3>
          <p class="text-xs text-slate-500 mt-1">ติดทะเล วิวสวย</p>
        </div>
      </div>
    </section>

    <!-- 5. INTERACTIVE MAP PREVIEW -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-[#172B3A] rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-8 mb-6">
          <div>
            <span class="text-[#00A8C6] font-bold text-xs uppercase tracking-wider block mb-1">INTERACTIVE MAP</span>
            <h2 class="text-2xl sm:text-4xl font-extrabold">แผนที่ท่องเที่ยวชลบุรี 11 อำเภอ</h2>
            <p class="text-slate-300 text-sm mt-2 max-w-xl">ค้นหาพิกัดสถานที่ท่องเที่ยว ร้านอาหาร คาเฟ่ และที่พัก ได้อย่างแม่นยำบนแผนที่โต้ตอบ</p>
          </div>
          <button id="open-full-map-btn" class="px-6 py-3 bg-[#00A8C6] hover:bg-[#0094b0] text-white font-bold rounded-xl shadow-lg shadow-[#00A8C6]/30 transition-all flex items-center gap-2 shrink-0">
            <i data-lucide="map" class="w-5 h-5"></i> เปิดแผนที่เต็มรูปแบบ
          </button>
        </div>
        <div id="home-map-preview" class="w-full h-80 rounded-2xl overflow-hidden border border-slate-700 shadow-inner"></div>
      </div>
    </section>

    <!-- 6. TRIP PLANNER TEASER -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-r from-[#006B9E] to-[#00A8C6] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div class="space-y-4 text-center md:text-left">
          <span class="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">SMART TRAVEL PLANNER</span>
          <h2 class="text-3xl sm:text-4xl font-black">วางแผนเที่ยวชลบุรีอัตโนมัติ</h2>
          <p class="text-cyan-100 text-sm sm:text-base max-w-lg">มีเวลาเที่ยวกี่วัน? ชอบแนวไหน? ให้ระบบจัดตารางเวลาการท่องเที่ยวทั้ง 11 อำเภอให้คุณในคลิกเดียว</p>
        </div>
        <button id="home-planner-btn" class="px-8 py-4 bg-[#F4B942] hover:bg-[#e0a330] text-[#172B3A] font-extrabold text-base rounded-2xl shadow-xl hover:scale-105 transition-all shrink-0 flex items-center gap-2">
          <i data-lucide="compass" class="w-5 h-5"></i> เริ่มจัดทริปเลย
        </button>
      </div>
    </section>
  `;

  // Event Listeners for Home
  setTimeout(() => {
    initInteractiveMap('home-map-preview', PLACES.slice(0, 10), (placeId) => {
      navigateTo('place-detail', placeId);
    });
  }, 100);

  const heroSearchBtn = container.querySelector('#hero-search-btn');
  const heroSearchInput = container.querySelector('#hero-search-input');
  if (heroSearchBtn && heroSearchInput) {
    heroSearchBtn.addEventListener('click', () => {
      const q = heroSearchInput.value.trim();
      if (q) {
        state.searchQuery = q;
        navigateTo('map');
      }
    });
  }

  container.querySelectorAll('.district-card').forEach(card => {
    card.addEventListener('click', () => {
      const did = card.getAttribute('data-district-id');
      navigateTo('district-detail', did);
    });
  });

  container.querySelectorAll('.place-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.bookmark-btn')) return;
      const pid = card.getAttribute('data-place-id');
      navigateTo('place-detail', pid);
    });
  });

  container.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pid = btn.getAttribute('data-bookmark-id');
      toggleBookmark(pid);
    });
  });

  const viewAllDistrictsBtn = container.querySelector('#view-all-districts-btn');
  if (viewAllDistrictsBtn) {
    viewAllDistrictsBtn.addEventListener('click', () => navigateTo('districts'));
  }

  const openFullMapBtn = container.querySelector('#open-full-map-btn');
  if (openFullMapBtn) {
    openFullMapBtn.addEventListener('click', () => navigateTo('map'));
  }

  const homePlannerBtn = container.querySelector('#home-planner-btn');
  if (homePlannerBtn) {
    homePlannerBtn.addEventListener('click', () => navigateTo('trip-planner'));
  }

  container.querySelectorAll('.cat-card, .quick-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cat-nav') || btn.getAttribute('data-category');
      if (cat === 'hotel') navigateTo('hotels');
      else if (cat === 'cafe' || cat === 'restaurant') navigateTo('eat-drink');
      else {
        state.mapFilter.categories = [cat];
        navigateTo('map');
      }
    });
  });

  return container;
}

/* ==========================================================================
   2. EXPLORE 11 DISTRICTS VIEW
   ========================================================================== */
function createDistrictsView() {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8';

  container.innerHTML = `
    <div class="text-center max-w-3xl mx-auto">
      <span class="text-[#00A8C6] font-bold text-xs uppercase tracking-wider">CHONBURI 11 DISTRICTS</span>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-[#172B3A] mt-1">สำรวจชลบุรีทั้ง 11 อำเภอ</h1>
      <p class="text-slate-500 text-sm sm:text-base mt-2">ชลบุรีไม่ได้มีแค่ทะเลพัทยาหรือบางแสน แต่ละอำเภอมีเรื่องราว วัฒนธรรม และธรรมชาติที่เป็นเอกลักษณ์</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${DISTRICTS.map(d => `
        <div data-district-id="${d.id}" class="district-full-card bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md card-hover cursor-pointer group flex flex-col justify-between">
          <div>
            <div class="relative h-52 overflow-hidden">
              <img src="${d.cover}" alt="${d.nameTh}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-[#172B3A]/80 via-transparent to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4 text-white">
                <span class="text-xs text-[#00A8C6] font-bold uppercase tracking-wider block">${d.nameEn}</span>
                <h3 class="text-2xl font-bold">${d.nameTh}</h3>
              </div>
            </div>
            <div class="p-5">
              <p class="text-sm text-slate-600 line-clamp-3 mb-4">${d.fullDesc}</p>
              
              <div class="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl text-center text-xs mb-4">
                <div>
                  <span class="block font-bold text-[#006B9E] text-sm">${d.placesCount}</span>
                  <span class="text-slate-400 text-[10px]">สถานที่</span>
                </div>
                <div>
                  <span class="block font-bold text-[#006B9E] text-sm">${d.cafesCount}</span>
                  <span class="text-slate-400 text-[10px]">คาเฟ่</span>
                </div>
                <div>
                  <span class="block font-bold text-[#006B9E] text-sm">${d.restaurantsCount}</span>
                  <span class="text-slate-400 text-[10px]">ร้านอาหาร</span>
                </div>
                <div>
                  <span class="block font-bold text-[#006B9E] text-sm">${d.hotelsCount}</span>
                  <span class="text-slate-400 text-[10px]">ที่พัก</span>
                </div>
              </div>

              <div class="flex flex-wrap gap-1">
                ${d.tags.map(t => `<span class="text-xs px-2.5 py-1 rounded-lg bg-cyan-50 text-[#006B9E] font-medium">${t}</span>`).join('')}
              </div>
            </div>
          </div>
          <div class="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-sm text-[#006B9E] font-bold">
            <span>เข้าชมหน้าอำเภอ ${d.nameTh}</span>
            <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('.district-full-card').forEach(card => {
    card.addEventListener('click', () => {
      const did = card.getAttribute('data-district-id');
      navigateTo('district-detail', did);
    });
  });

  return container;
}

/* ==========================================================================
   3. DISTRICT DETAIL VIEW (/district/:id)
   ========================================================================== */
function createDistrictDetailView(districtId) {
  const district = DISTRICTS.find(d => d.id === districtId) || DISTRICTS[0];
  const districtPlaces = PLACES.filter(p => p.districtId === district.id);

  const container = document.createElement('div');
  container.className = 'space-y-12 pb-20';

  container.innerHTML = `
    <!-- District Hero -->
    <section class="relative h-[360px] sm:h-[420px] flex items-end justify-center bg-slate-900">
      <img src="${district.cover}" alt="${district.nameTh}" class="absolute inset-0 w-full h-full object-cover opacity-60">
      <div class="absolute inset-0 bg-gradient-to-t from-[#172B3A] via-[#172B3A]/30 to-transparent"></div>
      
      <div class="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 text-white">
        <button id="back-to-districts-btn" class="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold hover:bg-white/30 transition-all">
          <i data-lucide="arrow-left" class="w-4 h-4"></i> ย้อนกลับไป 11 อำเภอ
        </button>
        <span class="text-[#00A8C6] font-bold text-xs uppercase tracking-widest block">${district.nameEn}</span>
        <h1 class="text-4xl sm:text-5xl font-black">${district.nameTh}</h1>
        <p class="text-cyan-100 text-sm sm:text-base mt-2 max-w-2xl">${district.tagline}</p>
      </div>
    </section>

    <!-- District Overview Stats -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl p-6 shadow-md border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div class="p-4 border-r border-slate-100 last:border-0">
          <span class="text-3xl font-extrabold text-[#006B9E]">${district.placesCount}</span>
          <span class="block text-xs text-slate-500 font-medium mt-1">สถานที่ท่องเที่ยว</span>
        </div>
        <div class="p-4 border-r border-slate-100 last:border-0">
          <span class="text-3xl font-extrabold text-[#00A8C6]">${district.cafesCount}</span>
          <span class="block text-xs text-slate-500 font-medium mt-1">คาเฟ่สุดชิค</span>
        </div>
        <div class="p-4 border-r border-slate-100 last:border-0">
          <span class="text-3xl font-extrabold text-[#F4B942]">${district.restaurantsCount}</span>
          <span class="block text-xs text-slate-500 font-medium mt-1">ร้านอาหาร</span>
        </div>
        <div class="p-4">
          <span class="text-3xl font-extrabold text-emerald-600">${district.hotelsCount}</span>
          <span class="block text-xs text-slate-500 font-medium mt-1">ที่พัก & รีสอร์ท</span>
        </div>
      </div>

      <div class="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h3 class="font-bold text-lg text-[#172B3A] mb-2">เกี่ยวกับอำเภอ${district.nameTh}</h3>
        <p class="text-sm text-slate-600 leading-relaxed">${district.fullDesc}</p>
      </div>
    </section>

    <!-- District Places Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <h2 class="text-2xl font-bold text-[#172B3A]">สถานที่แนะนำใน${district.nameTh}</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${districtPlaces.map(p => `
          <div data-place-id="${p.id}" class="place-card bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm card-hover cursor-pointer group flex flex-col justify-between">
            <div>
              <div class="relative h-48 overflow-hidden">
                <img src="${p.cover}" alt="${p.nameTh}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-[#006B9E]">
                  ⭐ ${p.rating}
                </span>
              </div>
              <div class="p-5">
                <h3 class="font-bold text-base text-[#172B3A] group-hover:text-[#006B9E] transition-colors">${p.nameTh}</h3>
                <p class="text-xs text-slate-500 line-clamp-2 mt-1 mb-3">${p.shortDesc}</p>
                <div class="flex flex-wrap gap-1">
                  ${p.tags.map(t => `<span class="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">${t}</span>`).join('')}
                </div>
              </div>
            </div>
            <div class="px-5 py-3 border-t border-slate-50 flex items-center justify-between text-xs text-[#006B9E] font-semibold">
              <span>ดูข้อมูลสถานที่</span>
              <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  const backBtn = container.querySelector('#back-to-districts-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => navigateTo('districts'));
  }

  container.querySelectorAll('.place-card').forEach(card => {
    card.addEventListener('click', () => {
      const pid = card.getAttribute('data-place-id');
      navigateTo('place-detail', pid);
    });
  });

  return container;
}

/* ==========================================================================
   4. MAP PAGE WITH FILTER SIDEBAR
   ========================================================================== */
function createMapView() {
  const container = document.createElement('div');
  container.className = 'flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden';

  container.innerHTML = `
    <!-- Sidebar Filter -->
    <aside class="w-full lg:w-80 bg-white border-r border-slate-200 p-5 overflow-y-auto shrink-0 shadow-lg z-10 space-y-6">
      <div>
        <h2 class="font-extrabold text-xl text-[#172B3A]">🗺️ แผนที่สถานที่</h2>
        <p class="text-xs text-slate-500 mt-0.5">ค้นหาและกรองสถานที่ทั้ง 11 อำเภอ</p>
      </div>

      <!-- Quick Search input -->
      <div>
        <label class="text-xs font-bold text-slate-700 block mb-1.5">ค้นหาชื่อสถานที่</label>
        <div class="relative">
          <input type="text" id="map-search-input" value="${state.searchQuery}" placeholder="ค้นหา..." class="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#006B9E]">
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i>
        </div>
      </div>

      <!-- District Filter Checklist -->
      <div>
        <label class="text-xs font-bold text-slate-700 block mb-2">อำเภอ (11 อำเภอ)</label>
        <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          ${DISTRICTS.map(d => `
            <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-[#006B9E]">
              <input type="checkbox" value="${d.id}" class="map-district-checkbox rounded text-[#006B9E] focus:ring-[#006B9E]" ${state.mapFilter.districts.includes(d.id) ? 'checked' : ''}>
              <span>${d.nameTh}</span>
            </label>
          `).join('')}
        </div>
      </div>

      <!-- Category Filter Checklist -->
      <div>
        <label class="text-xs font-bold text-slate-700 block mb-2">ประเภทสถานที่</label>
        <div class="space-y-1.5">
          <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" value="sea" class="map-cat-checkbox rounded text-[#006B9E]" ${state.mapFilter.categories.includes('sea') ? 'checked' : ''}>
            <span>🏖️ ทะเล & ชายหาด</span>
          </label>
          <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" value="nature" class="map-cat-checkbox rounded text-[#006B9E]" ${state.mapFilter.categories.includes('nature') ? 'checked' : ''}>
            <span>🌿 ธรรมชาติ & ภูเขา</span>
          </label>
          <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" value="cafe" class="map-cat-checkbox rounded text-[#006B9E]" ${state.mapFilter.categories.includes('cafe') ? 'checked' : ''}>
            <span>☕ คาเฟ่</span>
          </label>
          <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" value="restaurant" class="map-cat-checkbox rounded text-[#006B9E]" ${state.mapFilter.categories.includes('restaurant') ? 'checked' : ''}>
            <span>🍜 ร้านอาหาร</span>
          </label>
          <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" value="hotel" class="map-cat-checkbox rounded text-[#006B9E]" ${state.mapFilter.categories.includes('hotel') ? 'checked' : ''}>
            <span>🏨 ที่พัก & รีสอร์ท</span>
          </label>
          <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" value="photo" class="map-cat-checkbox rounded text-[#006B9E]" ${state.mapFilter.categories.includes('photo') ? 'checked' : ''}>
            <span>📸 จุดถ่ายรูป</span>
          </label>
          <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" value="history" class="map-cat-checkbox rounded text-[#006B9E]" ${state.mapFilter.categories.includes('history') ? 'checked' : ''}>
            <span>🏛️ ประวัติศาสตร์ & พิพิธภัณฑ์</span>
          </label>
        </div>
      </div>

      <button id="reset-map-filters-btn" class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors">
        รีเซ็ตตัวกรองทั้งหมด
      </button>
    </aside>

    <!-- Map Leaflet Container -->
    <main class="flex-1 relative w-full h-full bg-slate-200">
      <div id="full-interactive-map" class="w-full h-full"></div>
    </main>
  `;

  const getFilteredPlaces = () => {
    return PLACES.filter(p => {
      // Search query
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const matchName = p.nameTh.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q);
        if (!matchName) return false;
      }
      // Districts
      if (state.mapFilter.districts.length > 0) {
        if (!state.mapFilter.districts.includes(p.districtId)) return false;
      }
      // Categories
      if (state.mapFilter.categories.length > 0) {
        if (!state.mapFilter.categories.includes(p.category)) return false;
      }
      return true;
    });
  };

  setTimeout(() => {
    initInteractiveMap('full-interactive-map', getFilteredPlaces(), (placeId) => {
      navigateTo('place-detail', placeId);
    });
  }, 100);

  const updateMap = () => {
    renderMapMarkers(getFilteredPlaces(), (placeId) => {
      navigateTo('place-detail', placeId);
    });
  };

  const mapSearchInput = container.querySelector('#map-search-input');
  if (mapSearchInput) {
    mapSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      updateMap();
    });
  }

  container.querySelectorAll('.map-district-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const selected = Array.from(container.querySelectorAll('.map-district-checkbox:checked')).map(el => el.value);
      state.mapFilter.districts = selected;
      updateMap();
    });
  });

  container.querySelectorAll('.map-cat-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const selected = Array.from(container.querySelectorAll('.map-cat-checkbox:checked')).map(el => el.value);
      state.mapFilter.categories = selected;
      updateMap();
    });
  });

  const resetBtn = container.querySelector('#reset-map-filters-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.searchQuery = '';
      state.mapFilter.districts = [];
      state.mapFilter.categories = [];
      container.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
      if (mapSearchInput) mapSearchInput.value = '';
      updateMap();
    });
  }

  return container;
}

/* ==========================================================================
   5. PLACE DETAIL VIEW (/place/:id)
   ========================================================================== */
function createPlaceDetailView(placeId) {
  const place = PLACES.find(p => p.id === placeId) || PLACES[0];
  const districtObj = DISTRICTS.find(d => d.id === place.districtId);
  const nearbyPlaces = PLACES.filter(p => p.districtId === place.districtId && p.id !== place.id).slice(0, 3);

  const container = document.createElement('div');
  container.className = 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8';

  container.innerHTML = `
    <!-- Top Nav Back Button -->
    <div class="flex items-center justify-between">
      <button id="back-from-place-btn" class="inline-flex items-center gap-2 text-sm font-semibold text-[#006B9E] hover:underline">
        <i data-lucide="arrow-left" class="w-4 h-4"></i> ย้อนกลับ
      </button>
      <button id="detail-bookmark-btn" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50">
        <i data-lucide="heart" class="w-4 h-4 ${state.savedPlaceIds.includes(place.id) ? 'fill-red-500 text-red-500' : ''}"></i>
        <span>${state.savedPlaceIds.includes(place.id) ? 'บันทึกแล้ว' : 'บันทึกสถานที่'}</span>
      </button>
    </div>

    <!-- Place Hero Banner -->
    <div class="relative h-[320px] sm:h-[450px] rounded-3xl overflow-hidden shadow-2xl">
      <img src="${place.cover}" alt="${place.nameTh}" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-[#172B3A] via-transparent to-transparent"></div>
      <div class="absolute bottom-6 left-6 right-6 text-white">
        <span class="bg-[#00A8C6] text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
          ${districtObj ? districtObj.nameTh : 'ชลบุรี'}
        </span>
        <h1 class="text-3xl sm:text-5xl font-black mt-2">${place.nameTh}</h1>
        <p class="text-cyan-100 text-sm sm:text-base mt-1">${place.nameEn}</p>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Details -->
      <div class="lg:col-span-2 space-y-6">
        <div class="flex items-center gap-4 border-b border-slate-100 pb-4">
          <div class="flex items-center gap-1 text-amber-500 font-extrabold text-lg">
            <i data-lucide="star" class="w-5 h-5 fill-amber-400"></i> ${place.rating}
          </div>
          <span class="text-slate-300">•</span>
          <span class="text-slate-500 text-sm">${place.reviewsCount || 500}+ รีวิว</span>
        </div>

        <div>
          <h3 class="font-bold text-lg text-[#172B3A] mb-2">รายละเอียดสถานที่</h3>
          <p class="text-slate-600 text-sm leading-relaxed">${place.fullDesc}</p>
        </div>

        <!-- Detail Meta Table -->
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
          <h4 class="font-bold text-sm text-[#172B3A]">ข้อมูลที่เป็นประโยชน์</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="flex items-start gap-3">
              <i data-lucide="clock" class="w-4 h-4 text-[#006B9E] shrink-0 mt-0.5"></i>
              <div>
                <span class="font-bold block text-slate-700">เวลาเปิด-ปิด</span>
                <span class="text-slate-500">${place.openHours || 'เปิดทุกวัน'}</span>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <i data-lucide="ticket" class="w-4 h-4 text-[#006B9E] shrink-0 mt-0.5"></i>
              <div>
                <span class="font-bold block text-slate-700">ค่าเข้าชม</span>
                <span class="text-slate-500">${place.entranceFee || 'เข้าชมฟรี'}</span>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <i data-lucide="car" class="w-4 h-4 text-[#006B9E] shrink-0 mt-0.5"></i>
              <div>
                <span class="font-bold block text-slate-700">ที่จอดรถ</span>
                <span class="text-slate-500">${place.parking || 'มีที่จอดรถ'}</span>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <i data-lucide="accessibility" class="w-4 h-4 text-[#006B9E] shrink-0 mt-0.5"></i>
              <div>
                <span class="font-bold block text-slate-700">Accessibility</span>
                <span class="text-slate-500">${place.accessibility || 'รองรับรถเข็น'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Location & Google Maps button -->
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
          <h4 class="font-bold text-base text-[#172B3A] flex items-center gap-2">
            <i data-lucide="map-pin" class="w-5 h-5 text-[#006B9E]"></i> ตำแหน่งที่ตั้ง
          </h4>
          <p class="text-xs text-slate-600">${place.address}</p>
          
          <div id="place-mini-map" class="w-full h-44 rounded-xl overflow-hidden border border-slate-100"></div>

          <a href="https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}" target="_blank" class="w-full py-3 bg-[#006B9E] hover:bg-[#005680] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all">
            <i data-lucide="navigation" class="w-4 h-4"></i> เปิดใน Google Maps →
          </a>
        </div>
      </div>
    </div>

    <!-- Nearby Places -->
    ${nearbyPlaces.length > 0 ? `
      <div class="pt-8 border-t border-slate-200 space-y-4">
        <h3 class="font-bold text-xl text-[#172B3A]">สถานที่ใกล้เคียงใน${districtObj ? districtObj.nameTh : 'ชลบุรี'}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          ${nearbyPlaces.map(np => `
            <div data-nearby-id="${np.id}" class="nearby-card bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-all">
              <img src="${np.cover}" alt="${np.nameTh}" class="w-full h-36 object-cover">
              <div class="p-3">
                <h4 class="font-bold text-sm text-[#172B3A]">${np.nameTh}</h4>
                <p class="text-xs text-slate-500 line-clamp-1 mt-1">${np.shortDesc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;

  setTimeout(() => {
    initInteractiveMap('place-mini-map', [place], null);
  }, 100);

  const backBtn = container.querySelector('#back-from-place-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => window.history.back());
  }

  const bookmarkBtn = container.querySelector('#detail-bookmark-btn');
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', () => {
      toggleBookmark(place.id);
      renderCurrentView();
    });
  }

  container.querySelectorAll('.nearby-card').forEach(card => {
    card.addEventListener('click', () => {
      const nid = card.getAttribute('data-nearby-id');
      navigateTo('place-detail', nid);
    });
  });

  return container;
}

/* ==========================================================================
   6. HOTELS PAGE
   ========================================================================== */
function createHotelsView() {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8';

  const hotels = PLACES.filter(p => p.category === 'hotel');

  container.innerHTML = `
    <div class="text-center max-w-2xl mx-auto space-y-2">
      <span class="text-[#00A8C6] font-bold text-xs uppercase tracking-wider">WHERE TO STAY</span>
      <h1 class="text-3xl font-extrabold text-[#172B3A]">ที่พัก & รีสอร์ทในชลบุรี</h1>
      <p class="text-slate-500 text-sm">คัดสรรที่พักคุณภาพ วิวสวย ติดทะเล ครอบคลุมทั้ง 11 อำเภอ</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${hotels.map(h => {
        const districtObj = DISTRICTS.find(d => d.id === h.districtId);
        return `
          <div data-place-id="${h.id}" class="hotel-card bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md card-hover cursor-pointer group flex flex-col justify-between">
            <div>
              <div class="relative h-52 overflow-hidden">
                <img src="${h.cover}" alt="${h.nameTh}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <span class="absolute top-3 left-3 bg-[#006B9E] text-white px-2.5 py-1 rounded-lg text-xs font-semibold">
                  📍 ${districtObj ? districtObj.nameTh : 'ชลบุรี'}
                </span>
                <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-amber-500">
                  ★ ${h.rating}
                </span>
              </div>
              <div class="p-5">
                <div class="flex items-center justify-between mb-1">
                  <h3 class="font-bold text-lg text-[#172B3A]">${h.nameTh}</h3>
                  <span class="text-xs font-bold text-[#00A8C6]">${h.priceRange || '฿฿'}</span>
                </div>
                <p class="text-xs text-slate-500 line-clamp-2 mb-4">${h.shortDesc}</p>
                
                <div class="flex flex-wrap gap-1.5">
                  ${(h.amenities || ["Wi-Fi", "Parking", "Pool"]).map(a => `
                    <span class="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">✓ ${a}</span>
                  `).join('')}
                </div>
              </div>
            </div>
            <div class="px-5 py-3 border-t border-slate-50 flex items-center justify-between text-xs text-[#006B9E] font-bold">
              <span>เช็ครายละเอียดที่พัก</span>
              <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  container.querySelectorAll('.hotel-card').forEach(card => {
    card.addEventListener('click', () => {
      const pid = card.getAttribute('data-place-id');
      navigateTo('place-detail', pid);
    });
  });

  return container;
}

/* ==========================================================================
   7. EAT & DRINK VIEW
   ========================================================================== */
function createEatDrinkView() {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8';

  const eatPlaces = PLACES.filter(p => p.category === 'cafe' || p.category === 'restaurant');

  container.innerHTML = `
    <div class="text-center max-w-2xl mx-auto space-y-2">
      <span class="text-[#F4B942] font-bold text-xs uppercase tracking-wider">EAT & DRINK</span>
      <h1 class="text-3xl font-extrabold text-[#172B3A]">กิน & ดื่ม ในชลบุรี</h1>
      <p class="text-slate-500 text-sm">ลิ้มรสก๋วยเตี๋ยวบ้านบึง ร้านอาหารทะเลสดๆ และคาเฟ่ถ่ายรูปสวย</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${eatPlaces.map(p => {
        const districtObj = DISTRICTS.find(d => d.id === p.districtId);
        return `
          <div data-place-id="${p.id}" class="eat-card bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md card-hover cursor-pointer group flex flex-col justify-between">
            <div>
              <div class="relative h-48 overflow-hidden">
                <img src="${p.cover}" alt="${p.nameTh}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <span class="absolute top-3 left-3 bg-[#00A8C6] text-white px-2.5 py-1 rounded-lg text-xs font-semibold">
                  ${p.category === 'cafe' ? '☕ คาเฟ่' : '🍜 ร้านอาหาร'}
                </span>
                <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-amber-500">
                  ★ ${p.rating}
                </span>
              </div>
              <div class="p-5">
                <h3 class="font-bold text-base text-[#172B3A]">${p.nameTh}</h3>
                <p class="text-xs text-slate-400 font-medium mb-2">📍 ${districtObj ? districtObj.nameTh : 'ชลบุรี'}</p>
                <p class="text-xs text-slate-500 line-clamp-2 mb-3">${p.shortDesc}</p>
                <div class="flex flex-wrap gap-1">
                  ${p.tags.map(t => `<span class="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded font-medium">${t}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  container.querySelectorAll('.eat-card').forEach(card => {
    card.addEventListener('click', () => {
      const pid = card.getAttribute('data-place-id');
      navigateTo('place-detail', pid);
    });
  });

  return container;
}

/* ==========================================================================
   8. PHOTO SPOTS VIEW
   ========================================================================== */
function createPhotoSpotsView() {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8';

  const photoSpots = PLACES.filter(p => p.isPhotoSpot);

  container.innerHTML = `
    <div class="text-center max-w-2xl mx-auto space-y-2">
      <span class="text-[#00A8C6] font-bold text-xs uppercase tracking-wider">📸 PHOTO SPOTS</span>
      <h1 class="text-3xl font-extrabold text-[#172B3A]">มุมถ่ายรูปสวยชลบุรี</h1>
      <p class="text-slate-500 text-sm">“มุมไหนของชลบุรีที่คุณอยากเก็บไว้ในความทรงจำ?”</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${photoSpots.map(p => {
        const districtObj = DISTRICTS.find(d => d.id === p.districtId);
        return `
          <div data-place-id="${p.id}" class="photo-card relative h-80 rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
            <img src="${p.cover}" alt="${p.nameTh}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
            
            <div class="absolute top-4 left-4">
              <span class="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                📍 ${districtObj ? districtObj.nameTh : 'ชลบุรี'}
              </span>
            </div>

            <div class="absolute bottom-5 left-5 right-5 text-white">
              <h3 class="text-xl font-bold mb-1">${p.nameTh}</h3>
              <p class="text-xs text-cyan-200 line-clamp-1 mb-2">${p.shortDesc}</p>
              <div class="flex flex-wrap gap-1">
                ${p.tags.map(t => `<span class="text-[10px] px-2 py-0.5 bg-white/20 backdrop-blur-md rounded text-white font-medium">${t}</span>`).join('')}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  container.querySelectorAll('.photo-card').forEach(card => {
    card.addEventListener('click', () => {
      const pid = card.getAttribute('data-place-id');
      navigateTo('place-detail', pid);
    });
  });

  return container;
}

/* ==========================================================================
   9. TRIP PLANNER VIEW
   ========================================================================== */
function createTripPlannerView() {
  const container = document.createElement('div');
  container.className = 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8';

  container.innerHTML = `
    <div class="text-center max-w-2xl mx-auto space-y-2">
      <span class="text-[#00A8C6] font-bold text-xs uppercase tracking-wider">PLAN YOUR TRIP</span>
      <h1 class="text-3xl font-extrabold text-[#172B3A]">ระบบออกแบบทริปท่องเที่ยวชลบุรี</h1>
      <p class="text-slate-500 text-sm">ตอบคำถาม 2 ข้อ แล้วระบบจะจัดแผนการท่องเที่ยวแบบละเอียดให้คุณทันที</p>
    </div>

    <!-- Planner Form Container -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
      <!-- Q1: Duration -->
      <div>
        <label class="font-bold text-slate-800 text-sm block mb-3">1. คุณมีเวลาเที่ยวกี่วัน?</label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button data-days="1" class="day-select-btn py-3 px-4 rounded-2xl border-2 font-bold text-sm transition-all ${state.plannerConfig.days === 1 ? 'border-[#006B9E] bg-cyan-50 text-[#006B9E]' : 'border-slate-200 text-slate-700'}">
            1 DAY (วันเดียวเที่ยวเพลิน)
          </button>
          <button data-days="2" class="day-select-btn py-3 px-4 rounded-2xl border-2 font-bold text-sm transition-all ${state.plannerConfig.days === 2 ? 'border-[#006B9E] bg-cyan-50 text-[#006B9E]' : 'border-slate-200 text-slate-700'}">
            2 DAYS (เสาร์-อาทิตย์)
          </button>
          <button data-days="3" class="day-select-btn py-3 px-4 rounded-2xl border-2 font-bold text-sm transition-all ${state.plannerConfig.days === 3 ? 'border-[#006B9E] bg-cyan-50 text-[#006B9E]' : 'border-slate-200 text-slate-700'}">
            3 DAYS (ทริปยาววันหยุด)
          </button>
          <button data-days="4" class="day-select-btn py-3 px-4 rounded-2xl border-2 font-bold text-sm transition-all ${state.plannerConfig.days === 4 ? 'border-[#006B9E] bg-cyan-50 text-[#006B9E]' : 'border-slate-200 text-slate-700'}">
            4+ DAYS (เจาะลึก 11 อำเภอ)
          </button>
        </div>
      </div>

      <!-- Q2: Interests -->
      <div>
        <label class="font-bold text-slate-800 text-sm block mb-3">2. คุณชอบท่องเที่ยวสไตล์ไหน? (เลือกได้หลายข้อ)</label>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <label class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100">
            <input type="checkbox" value="sea" class="planner-interest-cb w-4 h-4 text-[#006B9E] rounded" ${state.plannerConfig.interests.includes('sea') ? 'checked' : ''}>
            <span class="text-xs font-semibold text-slate-700">🏖️ ทะเล & ชายหาด</span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100">
            <input type="checkbox" value="cafe" class="planner-interest-cb w-4 h-4 text-[#006B9E] rounded" ${state.plannerConfig.interests.includes('cafe') ? 'checked' : ''}>
            <span class="text-xs font-semibold text-slate-700">☕ คาเฟ่เก๋ๆ</span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100">
            <input type="checkbox" value="nature" class="planner-interest-cb w-4 h-4 text-[#006B9E] rounded" ${state.plannerConfig.interests.includes('nature') ? 'checked' : ''}>
            <span class="text-xs font-semibold text-slate-700">🌿 ธรรมชาติ & สวนสัตว์</span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100">
            <input type="checkbox" value="restaurant" class="planner-interest-cb w-4 h-4 text-[#006B9E] rounded" ${state.plannerConfig.interests.includes('restaurant') ? 'checked' : ''}>
            <span class="text-xs font-semibold text-[#006B9E]">🍜 อาหารอร่อยเด็ด</span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100">
            <input type="checkbox" value="history" class="planner-interest-cb w-4 h-4 text-[#006B9E] rounded" ${state.plannerConfig.interests.includes('history') ? 'checked' : ''}>
            <span class="text-xs font-semibold text-slate-700">🏛️ ประวัติศาสตร์ & วัด</span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100">
            <input type="checkbox" value="photo" class="planner-interest-cb w-4 h-4 text-[#006B9E] rounded" ${state.plannerConfig.interests.includes('photo') ? 'checked' : ''}>
            <span class="text-xs font-semibold text-slate-700">📸 จุดถ่ายรูปเก๋ๆ</span>
          </label>
        </div>
      </div>

      <button id="generate-itinerary-btn" class="w-full py-4 bg-[#006B9E] hover:bg-[#005680] text-white font-extrabold text-base rounded-2xl shadow-lg shadow-[#006B9E]/30 transition-all flex items-center justify-center gap-2">
        <i data-lucide="sparkles" class="w-5 h-5 text-[#F4B942]"></i> ประมวลผลสร้างแผนการเดินทาง
      </button>
    </div>

    <!-- Output Itinerary Timeline -->
    <div id="itinerary-output" class="space-y-8"></div>
  `;

  const renderGeneratedOutput = () => {
    const outputContainer = container.querySelector('#itinerary-output');
    if (!outputContainer) return;

    const itinerary = generateTripItinerary(state.plannerConfig.days, state.plannerConfig.interests);

    outputContainer.innerHTML = `
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-extrabold text-[#172B3A]">แผนการเดินทางแนะนำ (${state.plannerConfig.days} วัน)</h2>
        <button id="export-trip-btn" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5">
          <i data-lucide="share-2" class="w-4 h-4"></i> บันทึก/แชร์ทริป
        </button>
      </div>

      ${itinerary.map(day => `
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-6">
          <div class="pb-3 border-b border-slate-100">
            <h3 class="text-xl font-bold text-[#006B9E]">${day.title}</h3>
          </div>

          <div class="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-cyan-100">
            ${day.schedule.map(slot => `
              <div class="relative flex items-start gap-4 pl-8">
                <div class="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-[#00A8C6] border-2 border-white ring-2 ring-cyan-100"></div>
                <div class="shrink-0 w-20 text-xs font-bold text-[#006B9E] pt-0.5">${slot.time}</div>
                <div class="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-4 items-center">
                  <img src="${slot.place.cover}" alt="${slot.place.nameTh}" class="w-full sm:w-28 h-20 object-cover rounded-xl shrink-0">
                  <div class="flex-1 text-left">
                    <span class="text-[10px] font-bold text-[#00A8C6] uppercase">📍 ${slot.districtName}</span>
                    <h4 class="font-bold text-sm text-[#172B3A]">${slot.place.nameTh}</h4>
                    <p class="text-xs text-slate-500 line-clamp-1 mt-0.5">${slot.place.shortDesc}</p>
                  </div>
                  <button data-planner-place="${slot.place.id}" class="view-place-btn text-xs font-bold text-[#006B9E] hover:underline shrink-0">
                    ดูสถานที่ →
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    `;

    outputContainer.querySelectorAll('.view-place-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-planner-place');
        navigateTo('place-detail', pid);
      });
    });

    const exportBtn = outputContainer.querySelector('#export-trip-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        alert("คัดลอกแผนการเดินทางเรียบร้อยแล้ว! สามารถนำไปแชร์ให้เพื่อนๆ ได้เลยครับ");
      });
    }

    refreshLucideIcons();
  };

  container.querySelectorAll('.day-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = parseInt(btn.getAttribute('data-days'));
      state.plannerConfig.days = d;
      container.querySelectorAll('.day-select-btn').forEach(b => {
        b.classList.remove('border-[#006B9E]', 'bg-cyan-50', 'text-[#006B9E]');
        b.classList.add('border-slate-200', 'text-slate-700');
      });
      btn.classList.add('border-[#006B9E]', 'bg-cyan-50', 'text-[#006B9E]');
    });
  });

  const generateBtn = container.querySelector('#generate-itinerary-btn');
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      const selectedInterests = Array.from(container.querySelectorAll('.planner-interest-cb:checked')).map(el => el.value);
      state.plannerConfig.interests = selectedInterests.length > 0 ? selectedInterests : ['sea', 'cafe'];
      renderGeneratedOutput();
    });
  }

  // Render default output first time
  renderGeneratedOutput();

  return container;
}

/* ==========================================================================
   10. SAVED BOOKMARKS VIEW
   ========================================================================== */
function createSavedView() {
  const container = document.createElement('div');
  container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8';

  const savedPlaces = PLACES.filter(p => state.savedPlaceIds.includes(p.id));

  container.innerHTML = `
    <div class="text-center max-w-2xl mx-auto space-y-2">
      <span class="text-red-500 font-bold text-xs uppercase tracking-wider">SAVED PLACES</span>
      <h1 class="text-3xl font-extrabold text-[#172B3A]">สถานที่ที่คุณบันทึกไว้</h1>
      <p class="text-slate-500 text-sm">รวมสถานที่ที่คุณชื่นชอบเพื่อเตรียมพร้อมสำหรับการเดินทาง</p>
    </div>

    ${savedPlaces.length === 0 ? `
      <div class="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
        <i data-lucide="heart" class="w-12 h-12 text-slate-300 mx-auto"></i>
        <h3 class="text-lg font-bold text-slate-700">ยังไม่มีสถานที่ที่บันทึกไว้</h3>
        <p class="text-xs text-slate-400">กดไอคอนหัวใจที่การ์ดสถานที่เพื่อบันทึกไว้ดูภายหลัง</p>
        <button id="saved-explore-btn" class="px-6 py-2.5 bg-[#006B9E] text-white font-bold text-xs rounded-xl shadow-md">
          สำรวจสถานที่ท่องเที่ยว
        </button>
      </div>
    ` : `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${savedPlaces.map(p => {
          const districtObj = DISTRICTS.find(d => d.id === p.districtId);
          return `
            <div data-place-id="${p.id}" class="saved-card bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md card-hover cursor-pointer group flex flex-col justify-between">
              <div>
                <div class="relative h-48 overflow-hidden">
                  <img src="${p.cover}" alt="${p.nameTh}" class="w-full h-full object-cover">
                  <button data-remove-saved="${p.id}" class="remove-saved-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center text-red-500 shadow-md">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
                <div class="p-4">
                  <span class="text-[10px] font-bold text-[#00A8C6] uppercase">📍 ${districtObj ? districtObj.nameTh : 'ชลบุรี'}</span>
                  <h3 class="font-bold text-base text-[#172B3A]">${p.nameTh}</h3>
                  <p class="text-xs text-slate-500 line-clamp-2 mt-1">${p.shortDesc}</p>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;

  const exploreBtn = container.querySelector('#saved-explore-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => navigateTo('home'));
  }

  container.querySelectorAll('.saved-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.remove-saved-btn')) return;
      const pid = card.getAttribute('data-place-id');
      navigateTo('place-detail', pid);
    });
  });

  container.querySelectorAll('.remove-saved-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pid = btn.getAttribute('data-remove-saved');
      toggleBookmark(pid);
      renderCurrentView();
    });
  });

  return container;
}

function toggleBookmark(placeId) {
  const index = state.savedPlaceIds.indexOf(placeId);
  if (index >= 0) {
    state.savedPlaceIds.splice(index, 1);
  } else {
    state.savedPlaceIds.push(placeId);
  }
  localStorage.setItem('chonburi_saved_places', JSON.stringify(state.savedPlaceIds));
}
