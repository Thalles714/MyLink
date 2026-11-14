// Brand marks where recognisable; semantic pictograms for the client projects.
const paths = {
  github: '<path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.77c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" stroke="none"/><path d="M7.5 10v7M11 17v-7m0 3a3 3 0 0 1 6 0v4" stroke="white" stroke-width="1.8"/><circle cx="7.5" cy="7" r="1" fill="white" stroke="none"/>',
  studio: '<path d="m12 3 8 5-8 5-8-5 8-5Zm-8 9 8 5 8-5M4 16l8 5 8-5"/>',
  demo: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18m-11 4 5 3-5 3Z"/>',
  portfolio: '<path d="M5 5h14v14H5zM9 8v8m-2-5h4m3-3v8h3"/>',
  workflow: '<rect x="3" y="4" width="7" height="7" rx="2"/><rect x="14" y="13" width="7" height="7" rx="2"/><path d="M14 7h3a2 2 0 0 1 2 2v1M10 17H7a2 2 0 0 1-2-2v-1"/>',
  nitido: '<path d="M5 18V6l14 12V6M3 21h18"/>',
  clinic: '<path d="M12 20s-9-5.5-9-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-9 11-9 11Z"/><path d="M8 11h3V8h2v3h3v2h-3v3h-2v-3H8z" stroke-width="1"/>',
  solar: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  snow: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4m10 14-1-4 4-1M4 14l4 1-1 4m10-14-1 4 4 1"/>',
  water: '<path d="M12 2S5 10 5 14a7 7 0 0 0 14 0c0-4-7-12-7-12Z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
  dashboard: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 16v-4m5 4V7m5 9v-6"/>',
  game: '<path d="M7 7h10c3 0 5 10 3 11-2 1-4-3-5-3H9c-1 0-3 4-5 3-2-1 0-11 3-11Z"/><path d="M7 10v4m-2-2h4m7-1h.01m2 2h.01"/>'
};
export function projectIcon(name) {
  const key = name.includes('GitHub') ? 'github' : name.includes('LinkedIn') ? 'linkedin' : name.includes('Demo') ? 'demo' : name.includes('Sifego') ? 'studio' : name.includes('Portfólio') ? 'portfolio' : name.includes('Workflow') ? 'workflow' : name.includes('Nítido') ? 'nitido' : name.includes('Clínica') ? 'clinic' : name.includes('Sollar') ? 'solar' : name.includes('Snow') ? 'snow' : name.includes('Vazamentos') ? 'water' : name.includes('Idle') ? 'game' : 'dashboard';
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[key]}</svg>`;
}
