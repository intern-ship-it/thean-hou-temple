// src/components/layout/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Home,
  Users,
  Lightbulb,
  DollarSign,
  Building2,
  Calendar,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  Utensils,
  ChefHat,
  Package,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const { t } = useTranslation();

  const navigation = [
    { name: t("sidebar.dashboard"), href: "/", icon: Home, roles: ["all"] }, // CHANGED

    // Temple Operations
    {
      name: t("sidebar.devotees"), // CHANGED
      href: "/temple/devotees",
      icon: Users,
      roles: ["super_admin", "temple_staff"],
    },
    {
      name: t("sidebar.pagoda_lights"), // CHANGED
      href: "/temple/pagoda-lights",
      icon: Lightbulb,
      roles: ["super_admin", "temple_staff"],
    },
    {
      name: t("sidebar.donations"), // CHANGED
      href: "/temple/donations",
      icon: DollarSign,
      roles: ["super_admin", "temple_staff"],
    },

    // Hall Booking
    {
      name: t("sidebar.customers"), // CHANGED
      href: "/hall/customers",
      icon: Users,
      roles: ["super_admin", "hall_manager"],
    },
    {
      name: t("sidebar.bookings"), // CHANGED
      href: "/hall/bookings",
      icon: Calendar,
      roles: ["super_admin", "hall_manager"],
    },
    {
      name: t("sidebar.quotations"), // CHANGED
      href: "/hall/quotations",
      icon: FileText,
      roles: ["super_admin", "hall_manager"],
    },
    // ==========================================
    // MASTER SETUP
    // ==========================================
    {
      type: "header",
      label: t("sidebar.system"), // CHANGED from "🔧 MASTER SETUP"
      roles: ["super_admin"],
    },
    {
      name: t("sidebar.billing_items"), // CHANGED from "Billing Items"
      href: "/hall/billing-items",
      icon: Package,
      roles: ["super_admin"],
    },
    {
      name: t("sidebar.dinner_packages"), // CHANGED from "Dinner Packages"
      href: "/hall/dinner-packages",
      icon: Utensils,
      roles: ["super_admin"],
    },
    {
      name: t("sidebar.catering_vendors"), // CHANGED from "Catering Vendors"
      href: "/hall/catering-vendors",
      icon: ChefHat,
      roles: ["super_admin"],
    },
    // Settings
    { type: "divider" },
    {
      name: t("sidebar.settings"), // CHANGED
      href: "/settings",
      icon: Settings,
      roles: ["all"],
    },
  ];

  const canAccess = (roles) => {
    if (!roles) return true; // Items without roles are accessible to all
    if (roles.includes("all")) return true;
    return roles.includes(user?.role);
  };

  const isActive = (href) => {
    return location.pathname === href;
  };

  // Animation variants
  const sidebarVariants = {
    open: {
      width: "16rem",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      width: "5rem",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`
          fixed top-0 left-0 z-50 h-screen bg-gradient-to-b from-red-900 via-red-800 to-red-950 border-r-4 border-amber-500
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          shadow-2xl
            flex flex-col
        `}
      >
        {/* Decorative Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>

        {/* Logo Section - Fixed at top */}
        <div className="relative h-20 flex items-center justify-between px-4 border-b-2 border-amber-500/30 flex-shrink-0">
          <div className="flex items-center space-x-3">
            {/* Enhanced Logo with Animation */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-amber-400 rounded-xl blur-lg opacity-50 animate-pulse"></div>

              {/* Logo Container */}
              <div className="relative w-10 h-10 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-2xl border-2 border-amber-300">
                {/* Temple Icon */}
                <Building2 className="w-6 h-6 text-red-900" />
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white rounded-tl"></div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white rounded-tr"></div>
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white rounded-bl"></div>
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white rounded-br"></div>
              </div>
            </motion.div>

            {/* Temple Name */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center space-x-2">
                    <div>
                      <h1 className="text-base font-bold text-amber-300   tracking-wide">
                        {t("sidebar.temple_name")}
                      </h1>
                      <p className="text-xs text-amber-200 font-medium">
                        {t("sidebar.temple_name_chinese")}
                      </p>
                    </div>
                    <motion.div
                      animate={{
                        y: [0, -3, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Flame className="w-4 h-4 text-amber-400" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle button - Desktop only */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 transition-colors border border-amber-500/30"
          >
            <motion.div
              animate={{ rotate: isOpen ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <ChevronLeft className="w-5 h-5 text-amber-300" />
              ) : (
                <ChevronRight className="w-5 h-5 text-amber-300" />
              )}
            </motion.div>
          </motion.button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <style>{`
            /* Custom scrollbar */
            nav::-webkit-scrollbar {
              width: 6px;
            }
            nav::-webkit-scrollbar-track {
              background: rgba(127, 29, 29, 0.2);
              border-radius: 10px;
            }
            nav::-webkit-scrollbar-thumb {
              background: rgba(217, 119, 6, 0.5);
              border-radius: 10px;
            }
            nav::-webkit-scrollbar-thumb:hover {
              background: rgba(217, 119, 6, 0.8);
            }
          `}</style>
          <motion.ul className="space-y-1.5">
            {navigation.map((item, index) => {
              if (!canAccess(item.roles)) return null;

              // Section Header
              if (item.type === "header") {
                return (
                  <AnimatePresence key={`header-${index}`}>
                    {isOpen && (
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="px-4 pt-4 pb-2 text-xs font-bold text-amber-400 uppercase tracking-wider"
                      >
                        {item.label}
                      </motion.li>
                    )}
                  </AnimatePresence>
                );
              }

              // Divider
              if (item.type === "divider") {
                return (
                  <AnimatePresence key={`divider-${index}`}>
                    {isOpen && (
                      <motion.li
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="my-3 mx-4 border-t-2 border-amber-500/30"
                      />
                    )}
                  </AnimatePresence>
                );
              }

              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.href}
                    className={`
                      relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
                      ${
                        active
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/50 scale-105"
                          : "text-amber-100 hover:bg-red-800/50 hover:text-amber-300"
                      }
                      ${!isOpen && "justify-center"}
                      group
                    `}
                    title={!isOpen ? item.name : ""}
                  >
                    {/* Active Indicator */}
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Icon with Animation */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 ${
                          active ? "text-red-900" : "group-hover:text-amber-300"
                        }`}
                      />
                    </motion.div>

                    {/* Label */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="font-semibold text-sm whitespace-nowrap overflow-hidden"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Hover Effect */}
                    {!active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>

        {/* User Info with Enhanced Design */}
        <AnimatePresence>
          {isOpen && user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-3 border-t-2 border-amber-500/30 bg-red-950/50 backdrop-blur-sm flex-shrink-0"
            >
              <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20">
                {/* Avatar with Animation */}
                <motion.div whileHover={{ scale: 1.1 }} className="relative">
                  <div className="absolute inset-0 bg-amber-400 rounded-full blur animate-pulse"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center border-2 border-amber-300 shadow-lg">
                    <span className="text-red-900 font-bold text-base">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </motion.div>

                {/* User Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-amber-100 truncate">{user.name}</p>
                  <p className="text-xs text-amber-300 truncate capitalize flex items-center">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    {user.role?.replace("_", " ")}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent pointer-events-none"></div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
