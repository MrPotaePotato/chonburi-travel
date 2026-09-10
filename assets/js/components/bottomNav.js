import { i18n } from '../data/i18n.js';

export function createBottomNav(onNavigate, currentActiveNav = "home", currentLang = "th") {
  const t = i18n[currentLang] || i18n.th;
  const nav = document.createElement("nav");
  nav.id = "bottom-nav";
  nav.className = "lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-2 transition-colors";

  nav.innerHTML = `
    <div class="grid grid-cols-4 items-center max-w-md mx-auto">
      <button data-bottom-nav="home" class="mobile-nav-item flex flex-col items-center justify-center py-1 text-slate-500 dark:text-slate-400 hover:text-[#006B9E] transition-all ${currentActiveNav === 'home' ? 'active font-semibold' : ''}">
        <i data-lucide="home" class="nav-icon w-5 h-5 transition-transform"></i>
        <span class="text-[11px] mt-0.5">${t.mobileNavHome}</span>
      </button>

      <button data-bottom-nav="map" class="mobile-nav-item flex flex-col items-center justify-center py-1 text-slate-500 dark:text-slate-400 hover:text-[#006B9E] transition-all ${currentActiveNav === 'map' ? 'active font-semibold' : ''}">
        <i data-lucide="map" class="nav-icon w-5 h-5 transition-transform"></i>
        <span class="text-[11px] mt-0.5">${t.mobileNavMap}</span>
      </button>

      <button data-bottom-nav="saved" class="mobile-nav-item flex flex-col items-center justify-center py-1 text-slate-500 dark:text-slate-400 hover:text-[#006B9E] transition-all ${currentActiveNav === 'saved' ? 'active font-semibold' : ''}">
        <i data-lucide="heart" class="nav-icon w-5 h-5 transition-transform"></i>
        <span class="text-[11px] mt-0.5">${t.mobileNavSaved}</span>
      </button>

      <button data-bottom-nav="districts" class="mobile-nav-item flex flex-col items-center justify-center py-1 text-slate-500 dark:text-slate-400 hover:text-[#006B9E] transition-all ${currentActiveNav === 'districts' ? 'active font-semibold' : ''}">
        <i data-lucide="compass" class="nav-icon w-5 h-5 transition-transform"></i>
        <span class="text-[11px] mt-0.5">${t.mobileNavDistricts}</span>
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
