import { NAV_ITEMS } from '../utils/content';

export function SiteNav({ darkMode }: { darkMode: boolean }) {
  return (
    <nav
      className={`flex items-center justify-between px-6 py-3 border-b ${
        darkMode
          ? 'bg-gray-900 border-gray-700 text-white'
          : 'bg-white border-gray-200 text-gray-900'
      }`}
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
    >
      <div className="flex items-center gap-2">
        <div className="font-bold text-xl tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
          The Labor Wire
        </div>
      </div>
      <div className="hidden md:flex items-center gap-4 text-sm">
        {NAV_ITEMS.map((item) => (
          <span
            key={item}
            className={`cursor-pointer hover:underline ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
      <div className="md:hidden text-sm font-medium">Menu</div>
    </nav>
  );
}
