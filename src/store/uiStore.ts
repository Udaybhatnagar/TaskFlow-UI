import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;
  toggleDarkMode: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const applyTheme = (dark: boolean) => {
  if (dark) {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      darkMode: true,
      sidebarOpen: true,
      toggleDarkMode: () =>
        set((s) => {
          const next = !s.darkMode;
          applyTheme(next);
          return { darkMode: next };
        }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    {
      name: 'ttm-ui',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.darkMode);
      },
    }
  )
);
