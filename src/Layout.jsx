import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, PawPrint, Syringe, Stethoscope, Menu, X, User, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Dashboard", icon: Home, page: "Dashboard" },
  { name: "Animals", icon: PawPrint, page: "Animals" },
  { name: "Vaccinations", icon: Syringe, page: "Vaccinations" },
  { name: "Health Records", icon: Stethoscope, page: "HealthRecords" },
];

// Pages that are considered "root" tab pages
const ROOT_PAGES = navItems.map(item => createPageUrl(item.page));
const isRootPage = (pathname) =>
  pathname === '/' || ROOT_PAGES.includes(pathname);

// Derive a human-readable title from the page name
const PAGE_TITLES = {
  AnimalDetail: "Animal Detail",
  Profile: "Profile",
};

function getPageTitle(currentPageName) {
  return PAGE_TITLES[currentPageName] || currentPageName?.replace(/([A-Z])/g, ' $1').trim() || "";
}

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Tab history: maps page key → last visited path
  const tabHistory = useRef(
    Object.fromEntries(navItems.map(item => [item.page, createPageUrl(item.page)]))
  );

  // Update tab history whenever path changes — only track root-owned paths
  useEffect(() => {
    const path = location.pathname;
    // Find which tab "owns" the current page based on currentPageName
    const owningTab = navItems.find(item => item.page === currentPageName);
    if (owningTab) {
      tabHistory.current[owningTab.page] = path;
    }
  }, [location.pathname, currentPageName]);

  // Determine if we're on a child (non-root) page
  const isChildPage = !isRootPage(location.pathname);

  // Find the active tab key (root-level match)
  const activeTabPage = navItems.find(item =>
    location.pathname === createPageUrl(item.page) ||
    (location.pathname === '/' && item.page === 'Dashboard') ||
    currentPageName === item.page
  )?.page;

  const handleTabClick = (item) => {
    setMobileMenuOpen(false);
    const rootPath = createPageUrl(item.page);
    if (activeTabPage === item.page) {
      // Already on this tab — go to root and scroll to top
      navigate(rootPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to last-seen path for this tab
      const dest = tabHistory.current[item.page] || rootPath;
      navigate(dest);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex-col z-50">
        <div className="p-6 border-b border-gray-100">
          <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
              <span className="text-xl">🐄</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-lg">Herd Health Hub</h1>
              <p className="text-xs text-gray-500">Animal Health Manager</p>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <li key={item.page}>
                  <Link
                    to={createPageUrl(item.page)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 font-medium shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-amber-600' : ''}`} />
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌾</span>
              <span className="font-medium text-gray-700">Farm Tip</span>
            </div>
            <p className="text-xs text-gray-600">
              Regular health checkups help catch issues early. Schedule monthly inspections!
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center justify-between px-4 py-3 h-14">
          {isChildPage ? (
            /* Child page: Back button + page title */
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="-ml-2"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <span className="font-semibold text-gray-800 text-base absolute left-1/2 -translate-x-1/2">
                {getPageTitle(currentPageName)}
              </span>
              {/* Placeholder to balance flex layout */}
              <div className="w-9" />
            </>
          ) : (
            /* Root page: logo + profile + menu */
            <>
              <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <span className="text-lg">🐄</span>
                </div>
                <span className="font-bold text-gray-800">Herd Health Hub</span>
              </Link>
              <div className="flex items-center gap-2">
                <Link to={createPageUrl("Profile")}>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu (only on root pages) */}
        <AnimatePresence>
          {mobileMenuOpen && !isChildPage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-100 bg-white overflow-hidden"
            >
              <nav className="p-2">
                {navItems.map((item) => {
                  const isActive = currentPageName === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => handleTabClick(item)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-amber-50 text-amber-700 font-medium' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 select-none"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = activeTabPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleTabClick(item)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors select-none ${
                  isActive ? 'text-amber-600' : 'text-gray-500'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-amber-600' : ''}`} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}