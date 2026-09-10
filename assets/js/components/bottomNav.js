export function createBottomNav(onNavigate, currentActiveNav = "home") {
  const nav = document.createElement("nav");
  nav.id = "bottom-nav";
  nav.className = "md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-2";

  nav.innerHTML = `
    <div class="grid grid-cols-4 items-center max-w-md mx-auto">
      <button data-bottom-nav="home" class="mobile-nav-item flex flex-col items-center justify-center py-1 text-slate-500 hover:text-[#006B9E] transition-all ${currentActiveNav === 'home' ? 'active font-semibold' : ''}">
        <i data-lucide="home" class="nav-icon w-5 h-5 transition-transform"></i>
        <span class="text-[11px] mt-0.5">หน้าแรก</span>
      </button>

      <button data-bottom-nav="map" class="mobile-nav-item flex flex-col items-center justify-center py-1 text-slate-500 hover:text-[#006B9E] transition-all ${currentActiveNav === 'map' ? 'active font-semibold' : ''}">
        <i data-lucide="map" class="nav-icon w-5 h-5 transition-transform"></i>
        <span class="text-[11px] mt-0.5">แผนที่</span>
      </button>

      <button data-bottom-nav="saved" class="mobile-nav-item flex flex-col items-center justify-center py-1 text-slate-500 hover:text-[#006B9E] transition-all ${currentActiveNav === 'saved' ? 'active font-semibold' : ''}">
        <i data-lucide="heart" class="nav-icon w-5 h-5 transition-transform"></i>
        <span class="text-[11px] mt-0.5">บันทึกไว้</span>
      </button>

      <button data-bottom-nav="districts" class="mobile-nav-item flex flex-col items-center justify-center py-1 text-slate-500 hover:text-[#006B9E] transition-all ${currentActiveNav === 'districts' ? 'active font-semibold' : ''}">
        <i data-lucide="compass" class="nav-icon w-5 h-5 transition-transform"></i>
        <span class="text-[11px] mt-0.5">11 อำเภอ</span>
      </button>
    </div>
  `;

  nav.querySelectorAll("[data-bottom-nav]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-bottom-nav");
      nav.querySelectorAll(".mobile-nav-item").forEach(item => item.classList.remove("active", "font-semibold"));
      btn.classList.add("active", "font-semibold");
      onNavigate(target);
    });
  });

  return nav;
}
