const paths = {
  home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9"/></>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
  close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  cart: <><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 8H6"/><circle cx="10" cy="21" r="1"/><circle cx="18" cy="21" r="1"/></>,
  switch: <><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/></>,
  light: <><path d="M9 18h6m-5 3h4m-5-6a7 7 0 1 1 6 0c-.8.5-1 1.1-1 3h-4c0-1.9-.2-2.5-1-3Z"/></>,
  sensor: <><path d="M8 8a5.7 5.7 0 0 0 0 8m8-8a5.7 5.7 0 0 1 0 8M5 5a10 10 0 0 0 0 14m14-14a10 10 0 0 1 0 14"/><circle cx="12" cy="12" r="1"/></>,
  security: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
  curtains: <><path d="M4 3v18m16-18v18M4 5h16M8 5v12l4-3 4 3V5"/></>,
  hub: <><circle cx="12" cy="12" r="3"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="m7 7 3 3m7-3-3 3m-7 7 3-3m7 3-3-3"/></>,
  plug: <><path d="M8 7v5m8-5v5M6 12h12v2a6 6 0 0 1-12 0v-2Zm6 8v2"/></>,
};

export default function Icon({ name, className = 'h-5 w-5', decorative = true }) {
  return <svg aria-hidden={decorative ? 'true' : undefined} role={decorative ? undefined : 'img'} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false">{paths[name]}</svg>;
}
