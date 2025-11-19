// src/components/layout/Sidebar.jsx - White Background with Red Accents
import React, { useState } from "react";
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
  ChevronDown,
  ChevronUp,
  Flame,
  Utensils,
  ChefHat,
  Package,
  Heart,
  BarChart3,
  ClipboardList,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const { t } = useTranslation();

  // State for dropdown menus
  const [openDropdowns, setOpenDropdowns] = useState({
    templeOps: false,
    donations: false,
    specialOccasions: false,
    hallManagement: false,
    bookings: false,
    quotations: false,
    invoices: false,
    dinnerPackages: false,
  });

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const navigation = [
    { name: t("sidebar.dashboard"), href: "/", icon: Home, roles: ["all"] },

    // ==========================================
    // TEMPLE OPERATIONS - Dropdown
    // ==========================================
    {
      name: t("dashboard.temple_operations") || "Temple Operations",
      icon: Flame,
      roles: ["super_admin", "temple_staff"],
      isDropdown: true,
      dropdownKey: "templeOps",
      subItems: [
        {
          name: t("sidebar.devotees"),
          href: "/temple/devotees",
          icon: Users,
        },
        {
          name: t("sidebar.donations"),
          icon: DollarSign,
          isDropdown: true,
          dropdownKey: "donations",
          subItems: [
            {
              name: "Blessing Tiles 瓷砖",
              href: "/temple/donations/blessing-tiles",
            },
            {
              name: "General Donations 香油",
              href: "/temple/donations/general",
            },
            {
              name: "Voucher Donations 券类",
              href: "/temple/donations/voucher",
            },
            {
              name: "Buddha Lamp 佛前灯",
              href: "/temple/donations/buddha-lamp",
            },
          ],
        },
        {
          name: t("sidebar.pagoda_lights"),
          href: "/temple/pagoda-lights",
          icon: Lightbulb,
        },
        {
          name: "Special Occasions",
          icon: Heart,
          isDropdown: true,
          dropdownKey: "specialOccasions",
          subItems: [
            { name: "Wesak Day 卫塞节", href: "/temple/special/wesak" },
            { name: "Guanyin 观音诞", href: "/temple/special/guanyin" },
            { name: "Mazu 妈祖诞", href: "/temple/special/mazu" },
            { name: "Shui Wei 水尾诞", href: "/temple/special/shui-wei" },
            { name: "Chinese New Year 农历新年", href: "/temple/special/cny" },
            { name: "Dharma Assembly 法会", href: "/temple/special/dharma" },
          ],
        },
        {
          name: "Temple Reports",
          href: "/temple/reports",
          icon: BarChart3,
        },
      ],
    },

    // ==========================================
    // HALL MANAGEMENT - Dropdown
    // ==========================================
    {
      name: t("sidebar.hall_booking") || "Hall Management",
      icon: Building2,
      roles: ["super_admin", "hall_manager"],
      isDropdown: true,
      dropdownKey: "hallManagement",
      subItems: [
        {
          name: "Calendar View",
          href: "/hall/calendar",
          icon: Calendar,
        },
        {
          name: t("sidebar.customers"),
          href: "/hall/customers",
          icon: Users,
        },
        {
          name: t("sidebar.bookings"),
          icon: Calendar,
          isDropdown: true,
          dropdownKey: "bookings",
          subItems: [
            { name: "All Bookings", href: "/hall/bookings" },
            { name: "Pending", href: "/hall/bookings/pending" },
            { name: "Confirmed", href: "/hall/bookings/confirmed" },
            { name: "Completed", href: "/hall/bookings/completed" },
            { name: "Cancelled", href: "/hall/bookings/cancelled" },
          ],
        },
        {
          name: t("sidebar.quotations"),
          icon: FileText,
          isDropdown: true,
          dropdownKey: "quotations",
          subItems: [
            { name: "All Quotations", href: "/hall/quotations" },
            { name: "Requests", href: "/hall/quotations/requests" },
            { name: "Create", href: "/hall/quotations/create" },
          ],
        },
        {
          name: "Invoices",
          icon: ClipboardList,
          isDropdown: true,
          dropdownKey: "invoices",
          subItems: [
            { name: "All Invoices", href: "/hall/invoices" },
            { name: "Pending", href: "/hall/invoices/pending" },
            { name: "Paid", href: "/hall/invoices/paid" },
            { name: "Overdue", href: "/hall/invoices/overdue" },
          ],
        },
        {
          name: t("sidebar.dinner_packages"),
          icon: Utensils,
          isDropdown: true,
          dropdownKey: "dinnerPackages",
          subItems: [
            {
              name: "Package Bookings",
              href: "/hall/dinner-packages/bookings",
            },
            { name: "Package Setup", href: "/hall/dinner-packages" },
            { name: "Vendor Mgmt", href: "/hall/catering-vendors" },
          ],
        },
        {
          name: "Hall Reports",
          href: "/hall/reports",
          icon: BarChart3,
        },
      ],
    },

    // ==========================================
    // MASTER SETUP
    // ==========================================
    {
      type: "header",
      label: t("sidebar.system"),
      roles: ["super_admin"],
    },
    {
      name: t("sidebar.billing_items"),
      href: "/hall/billing-items",
      icon: Package,
      roles: ["super_admin"],
    },
    {
      name: t("sidebar.halls"),
      href: "/hall/halls",
      icon: Building2,
      roles: ["super_admin"],
    },
    {
      name: t("sidebar.catering_vendors"),
      href: "/hall/catering-vendors",
      icon: ChefHat,
      roles: ["super_admin"],
    },
    // Settings
    { type: "divider" },
    {
      name: t("sidebar.settings"),
      href: "/settings",
      icon: Settings,
      roles: ["all"],
    },
  ];

  const canAccess = (roles) => {
    if (!roles) return true;
    if (roles.includes("all")) return true;
    return roles.includes(user?.role);
  };

  const isActive = (href) => {
    return location.pathname === href;
  };

  // Check if any child is active
  const hasActiveChild = (subItems) => {
    if (!subItems) return false;
    return subItems.some((item) => {
      if (item.href && location.pathname.startsWith(item.href)) return true;
      if (item.subItems) return hasActiveChild(item.subItems);
      return false;
    });
  };

  // Render navigation item recursively
  const renderNavItem = (item, index, level = 0) => {
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
              className="px-4 pt-5 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider"
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
              className="my-3 mx-4 border-t border-gray-200"
            />
          )}
        </AnimatePresence>
      );
    }

    // Dropdown item
    if (item.isDropdown) {
      const Icon = item.icon;
      const isOpen_dropdown = openDropdowns[item.dropdownKey];
      const hasActive = hasActiveChild(item.subItems);

      return (
        <motion.li
          key={`${item.name}-${level}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <button
            onClick={() => toggleDropdown(item.dropdownKey)}
            className={`
              relative flex items-center w-full space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200
              ${level > 0 ? "ml-2" : ""}
              ${
                hasActive
                  ? "bg-red-50 text-red-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }
              ${!isOpen && "justify-center"}
              group
            `}
          >
            {/* Icon */}
            {Icon && (
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${
                  hasActive
                    ? "text-red-600"
                    : "text-gray-500 group-hover:text-red-600"
                }`}
              />
            )}

            {/* Label */}
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm overflow-hidden flex-1 text-left"
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Arrow Icon */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {isOpen_dropdown ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Sub-items */}
          <AnimatePresence>
            {isOpen && isOpen_dropdown && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-4 mt-1 space-y-0.5 overflow-hidden"
              >
                {item.subItems?.map((subItem, subIndex) =>
                  renderNavItem(subItem, subIndex, level + 1)
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.li>
      );
    }

    // Regular link
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <motion.li
        key={`${item.name}-${level}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link
          to={item.href}
          className={`
            relative flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200
            ${level > 0 ? "ml-2" : ""}
            ${
              active
                ? "bg-red-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-50"
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
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-800 rounded-r-full"
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            />
          )}

          {/* Icon */}
          {Icon && (
            <Icon
              className={`w-5 h-5 flex-shrink-0 ${
                active ? "text-white" : "text-gray-500 group-hover:text-red-600"
              }`}
            />
          )}

          {/* Label */}
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-medium overflow-hidden"
              >
                {item.name}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </motion.li>
    );
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
          fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          shadow-xl
          flex flex-col
        `}
      >
        {/* Logo Section - Fixed at top */}
        <div className="relative h-20 flex items-center justify-between px-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-amber-50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            {/* Enhanced Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              {/* Logo Container */}
              <div className="relative w-11 h-11 bg-gradient-to-br from-red-600 via-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                {/* Temple Icon */}
                <Building2 className="w-6 h-6 text-white" />
                {/* Corner Decorations */}
                <div className="absolute -top-0.5 -left-0.5 w-2 h-2 border-t-2 border-l-2 border-amber-400 rounded-tl-lg"></div>
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 border-t-2 border-r-2 border-amber-400 rounded-tr-lg"></div>
                <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 border-b-2 border-l-2 border-amber-400 rounded-bl-lg"></div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-b-2 border-r-2 border-amber-400 rounded-br-lg"></div>
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
                      <h1 className="text-base font-bold text-red-700 tracking-wide">
                        {t("sidebar.temple_name")}
                      </h1>
                      <p className="text-xs text-amber-600 font-medium">
                        {t("sidebar.temple_name_chinese")}
                      </p>
                    </div>
                    <motion.div
                      animate={{
                        y: [0, -2, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Flame className="w-4 h-4 text-red-500" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle button - Desktop only */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <motion.div
              animate={{ rotate: isOpen ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </motion.div>
          </motion.button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <style>{`
            /* Custom scrollbar */
            nav::-webkit-scrollbar {
              width: 6px;
            }
            nav::-webkit-scrollbar-track {
              background: #f3f4f6;
              border-radius: 10px;
            }
            nav::-webkit-scrollbar-thumb {
              background: #d1d5db;
              border-radius: 10px;
            }
            nav::-webkit-scrollbar-thumb:hover {
              background: #9ca3af;
            }
          `}</style>
          <motion.ul className="space-y-1">
            {navigation.map((item, index) => renderNavItem(item, index))}
          </motion.ul>
        </nav>

        {/* User Info */}
        <AnimatePresence>
          {isOpen && user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-3 border-t border-gray-200 bg-gray-50 flex-shrink-0"
            >
              <div className="flex items-center space-x-3 p-2.5 rounded-lg bg-white border border-gray-200 shadow-sm">
                {/* Avatar */}
                <div className="relative w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow">
                  <span className="text-white font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                {/* User Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate capitalize">
                    {user.role?.replace("_", " ")}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </>
  );
};

export default Sidebar;
