export function createNavbar(onNavigate, onSearch) {
  const header = document.createElement("header");
  header.className = "sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm";

  header.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">
        <!-- Logo -->
        <a href="#home" id="nav-logo" class="flex items-center gap-3 cursor-pointer group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#006B9E] to-[#00A8C6] flex items-center justify-center text-white shadow-md shadow-[#006B9E]/20 group-hover:scale-105 transition-transform">
            <i data-lucide="waves" class="w-6 h-6"></i>
          </div>
          <div>
            <span class="text-xl font-bold tracking-tight text-[#172B3A] block leading-none">CHONBURI</span>
            <span class="text-xs text-[#00A8C6] font-medium tracking-widest uppercase">More Than The Sea</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-1 lg:gap-2">
          <button data-[#nav="home"] class="nav-link px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#006B9E] rounded-lg transition-colors flex items-center gap-1.5">
            <i data-lucide="home" class="w-4 h-4"></i> หน้าแรก
          </button>
          <button data-nav="districts" class="nav-link px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#006B9E] rounded-lg transition-colors flex items-center gap-1.5">
            <i data-lucide="map-pin" class="w-4 h-4"></i> 11 อำเภอ
          </button>
          <button data-nav="map" class="nav-link px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#006B9E] rounded-lg transition-colors flex items-center gap-1.5">
            <i data-lucide="map" class="w-4 h-4"></i> แผนที่
          </button>
          <button data-nav="eat-drink" class="nav-link px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#006B9E] rounded-lg transition-colors flex items-center gap-1.5">
            <i data-lucide="utensils" class="w-4 h-4"></i> กิน & ดื่ม
          </button>
          <button data-nav="hotels" class="nav-link px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#006B9E] rounded-lg transition-colors flex items-center gap-1.5">
            <i data-lucide="hotel" class="w-4 h-4"></i> ที่พัก
          </button>
          <button data-nav="photo-spots" class="nav-link px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#006B9E] rounded-lg transition-colors flex items-center gap-1.5">
            <i data-lucide="camera" class="w-4 h-4"></i> Photo Spots
          </button>
          <button data-nav="trip-planner" class="nav-link px-3.5 py-2 text-sm font-semibold text-white bg-[#006B9E] hover:bg-[#005680] rounded-xl shadow-md shadow-[#006B9E]/20 transition-all flex items-center gap-1.5 ml-2">
            <i data-lucide="compass" class="w-4 h-4"></i> จัดทริปเที่ยว
          </button>
        </nav>

        <!-- Right Quick Actions / Search & Mobile Toggle -->
        <div class="flex items-center gap-2">
          <!-- Desktop Search Trigger -->
          <div class="relative hidden sm:block w-48 lg:w-64">
            <input 
              type="text" 
              id="header-search-input"
              placeholder="ค้นหาสานที่, คาเฟ่, ที่พัก..." 
              class="w-full pl-9 pr-4 py-2 text-sm bg-slate-100/80 border border-transparent focus:border-[#00A8C6] focus:bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A8C6]/20 transition-all"
            >
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i>
          </div>

          <!-- Mobile Hamburger -->
          <button id="mobile-menu-btn" class="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
            <i data-lucide="menu" class="w-6 h-6"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Overlay -->
    <div id="mobile-drawer" class="hidden md:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm">
      <div class="fixed right-0 top-0 bottom-0 w-4/5 max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          <div class="flex items-center justify-between pb-6 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-[#006B9E] flex items-center justify-center text-white">
                <i data-lucide="waves" class="w-5 h-5"></i>
              </div>
              <span class="font-bold text-[#172B3A]">CHONBURI</span>
            </div>
            <button id="close-drawer-btn" class="p-2 text-slate-400 hover:text-slate-700">
              <i data-lucide="x" class="w-6 h-6"></i>
            </button>
          </div>

          <!-- Drawer Navigation Links -->
          <div class="py-4 space-y-1">
            <button data-nav="home" class="drawer-link w-full text-left px-4 py-3 font-medium text-slate-700 hover:bg-slate-50 hover:text-[#006B9E] rounded-xl flex items-center gap-3">
              <i data-lucide="home" class="w-5 h-5 text-[#00A8C6]"></i> หน้าแรก
            </button>
            <button data-nav="districts" class="drawer-link w-full text-left px-4 py-3 font-medium text-slate-700 hover:bg-slate-50 hover:text-[#006B9E] rounded-xl flex items-center gap-3">
              <i data-lucide="map-pin" class="w-5 h-5 text-[#00A8C6]"></i> สำรวจ 11 อำเภอ
            </button>
            <button data-nav="map" class="drawer-link w-full text-left px-4 py-3 font-medium text-slate-700 hover:bg-slate-50 hover:text-[#006B9E] rounded-xl flex items-center gap-3">
              <i data-lucide="map" class="w-5 h-5 text-[#00A8C6]"></i> แผนที่ท่องเที่ยว
            </button>
            <button data-nav="eat-drink" class="drawer-link w-full text-left px-4 py-3 font-medium text-slate-700 hover:bg-slate-50 hover:text-[#006B9E] rounded-xl flex items-center gap-3">
              <i data-lucide="utensils" class="w-5 h-5 text-[#00A8C6]"></i> กิน & ดื่ม (ร้านอาหาร/คาเฟ่)
            </button>
            <button data-nav="hotels" class="drawer-link w-full text-left px-4 py-3 font-medium text-slate-700 hover:bg-slate-50 hover:text-[#006B9E] rounded-xl flex items-center gap-3">
              <i data-lucide="hotel" class="w-5 h-5 text-[#00A8C6]"></i> ค้นหาที่พัก
            </button>
            <button data-nav="photo-spots" class="drawer-link w-full text-left px-4 py-3 font-medium text-slate-700 hover:bg-slate-50 hover:text-[#006B9E] rounded-xl flex items-center gap-3">
              <i data-lucide="camera" class="w-5 h-5 text-[#00A8C6]"></i> Photo Spots
            </button>
            <button data-nav="trip-planner" class="drawer-link w-full text-left px-4 py-3 font-medium text-white bg-[#006B9E] rounded-xl flex items-center gap-3 mt-4 shadow-md shadow-[#006B9E]/20">
              <i data-lucide="compass" class="w-5 h-5"></i> ระบบวางแผนทริป
            </button>
          </div>
        </div>

        <div class="pt-6 border-t border-slate-100 text-xs text-slate-400 text-center">
          CHONBURI — More Than The Sea © 2026
        </div>
      </div>
    </div>
  `;

  // Attach event listeners
  header.querySelectorAll("[data-nav], .drawer-link").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetNav = btn.getAttribute("data-nav");
      if (targetNav) {
        onNavigate(targetNav);
        // Close drawer if open
        header.querySelector("#mobile-drawer").classList.add("hidden");
      }
    });
  });

  const logoBtn = header.querySelector("#nav-logo");
  logoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    onNavigate("home");
  });

  const drawerBtn = header.querySelector("#mobile-menu-btn");
  const drawerClose = header.querySelector("#close-drawer-btn");
  const drawer = header.querySelector("#mobile-drawer");

  drawerBtn.addEventListener("click", () => drawer.classList.remove("hidden"));
  drawerClose.addEventListener("click", () => drawer.classList.add("hidden"));

  const searchInput = header.querySelector("#header-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      if (onSearch) onSearch(e.target.value);
    });
  }

  return header;
}
