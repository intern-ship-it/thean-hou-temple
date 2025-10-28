// // src/components/layout/Navbar.jsx
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Menu,
//   Bell,
//   Search,
//   LogOut,
//   User,
//   Settings,
//   Flame,
//   Sparkles,
// } from "lucide-react";
// import { logout } from "../../features/auth/authSlice";

// const Navbar = ({ onMenuClick }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.auth.user);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);

//   const handleLogout = async () => {
//     await dispatch(logout());
//     navigate("/login");
//   };

//   // Mock notifications
//   const notifications = [
//     {
//       id: 1,
//       title: "New Devotee Registered",
//       message: "John Tan has been registered",
//       time: "5 min ago",
//       unread: true,
//     },
//     {
//       id: 2,
//       title: "Booking Confirmed",
//       message: "Wedding hall booking confirmed",
//       time: "1 hour ago",
//       unread: true,
//     },
//     {
//       id: 3,
//       title: "Monthly Report",
//       message: "October report is ready",
//       time: "2 hours ago",
//       unread: false,
//     },
//   ];

//   const unreadCount = notifications.filter((n) => n.unread).length;

//   return (
//     <motion.header
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ type: "spring", stiffness: 300, damping: 30 }}
//       className="h-16 bg-gradient-to-r from-white via-amber-50/30 to-white border-b-2 border-amber-200 fixed top-0 right-0 left-0 lg:left-64 z-30 shadow-lg"
//     >
//       {/* Decorative Top Border */}
//       <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>

//       <div className="h-full px-4 sm:px-6 flex items-center justify-between relative">
//         {/* Decorative Pattern Overlay */}
//         <div className="absolute inset-0 opacity-5 pointer-events-none">
//           <div className="absolute top-0 left-1/4 w-32 h-32 bg-amber-400 rounded-full blur-3xl"></div>
//           <div className="absolute top-0 right-1/4 w-32 h-32 bg-red-400 rounded-full blur-3xl"></div>
//         </div>

//         {/* Left side */}
//         <div className="flex items-center space-x-4 relative z-10">
//           {/* Mobile menu button with animation */}
//           <motion.button
//             whileHover={{ scale: 1.1, rotate: 90 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={onMenuClick}
//             className="lg:hidden p-2.5 rounded-xl bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all shadow-lg text-white"
//           >
//             <Menu className="w-5 h-5" />
//           </motion.button>

//           {/* Greeting with animation */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2 }}
//             className="hidden md:flex items-center space-x-2"
//           >
//             <motion.div
//               animate={{
//                 rotate: [0, 10, -10, 0],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 repeatDelay: 3,
//               }}
//             >
//               <Flame className="w-5 h-5 text-amber-600" />
//             </motion.div>
//             <span className="text-sm font-semibold bg-gradient-to-r from-red-700 to-amber-700 bg-clip-text text-transparent">
//               May you be blessed today
//             </span>
//           </motion.div>

//           {/* Search bar with enhanced design */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.3 }}
//             className="hidden sm:flex items-center"
//           >
//             <div className="relative group">
//               <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-red-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-700 group-hover:text-red-700 transition-colors" />
//                 <input
//                   type="text"
//                   placeholder="Search temple records..."
//                   className="pl-11 pr-4 py-2.5 w-64 lg:w-96 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/80 backdrop-blur-sm placeholder-amber-600/50 text-gray-800 font-medium transition-all"
//                 />
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Right side */}
//         <div className="flex items-center space-x-3 relative z-10">
//           {/* Decorative Element */}
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//             className="hidden lg:block"
//           >
//             <Sparkles className="w-5 h-5 text-amber-600" />
//           </motion.div>

//           {/* Notifications with enhanced design */}
//           <div className="relative">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setShowNotifications(!showNotifications)}
//               className="relative p-2.5 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 transition-all shadow-md border border-amber-300"
//             >
//               <Bell className="w-5 h-5 text-amber-800" />
//               {unreadCount > 0 && (
//                 <motion.span
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-lg"
//                 >
//                   {unreadCount}
//                 </motion.span>
//               )}
//             </motion.button>

//             {/* Notifications Dropdown */}
//             <AnimatePresence>
//               {showNotifications && (
//                 <>
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="fixed inset-0 z-40"
//                     onClick={() => setShowNotifications(false)}
//                   />
//                   <motion.div
//                     initial={{ opacity: 0, y: -10, scale: 0.95 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                     className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border-2 border-amber-200 py-2 z-50 overflow-hidden"
//                   >
//                     {/* Header */}
//                     <div className="px-4 py-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-red-50">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
//                         {unreadCount > 0 && (
//                           <span className="text-xs px-2 py-1 bg-red-500 text-white rounded-full font-bold">
//                             {unreadCount} new
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Notifications List */}
//                     <div className="max-h-96 overflow-y-auto">
//                       {notifications.map((notification, index) => (
//                         <motion.div
//                           key={notification.id}
//                           initial={{ x: -20, opacity: 0 }}
//                           animate={{ x: 0, opacity: 1 }}
//                           transition={{ delay: index * 0.05 }}
//                           className={`px-4 py-3 hover:bg-amber-50 transition-colors cursor-pointer border-l-4 ${
//                             notification.unread
//                               ? "border-amber-500 bg-amber-50/50"
//                               : "border-transparent"
//                           }`}
//                         >
//                           <div className="flex items-start justify-between">
//                             <div className="flex-1">
//                               <p className="text-sm font-semibold text-gray-900">
//                                 {notification.title}
//                               </p>
//                               <p className="text-xs text-gray-600 mt-1">
//                                 {notification.message}
//                               </p>
//                               <p className="text-xs text-amber-600 mt-1 font-medium">
//                                 {notification.time}
//                               </p>
//                             </div>
//                             {notification.unread && (
//                               <motion.div
//                                 animate={{ scale: [1, 1.2, 1] }}
//                                 transition={{ duration: 2, repeat: Infinity }}
//                                 className="w-2 h-2 bg-amber-500 rounded-full ml-2 mt-1"
//                               />
//                             )}
//                           </div>
//                         </motion.div>
//                       ))}
//                     </div>

//                     {/* Footer */}
//                     <div className="px-4 py-2 border-t border-amber-100 bg-gradient-to-r from-amber-50 to-red-50">
//                       <button className="text-xs text-amber-700 hover:text-amber-900 font-semibold">
//                         View all notifications →
//                       </button>
//                     </div>
//                   </motion.div>
//                 </>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* User menu with enhanced design */}
//           <div className="relative">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setShowUserMenu(!showUserMenu)}
//               className="flex items-center space-x-3 p-2 pr-4 rounded-xl bg-gradient-to-br from-red-100 to-amber-100 hover:from-red-200 hover:to-amber-200 transition-all shadow-md border border-amber-300"
//             >
//               {/* Avatar with glow effect */}
//               <div className="relative">
//                 <div className="absolute inset-0 bg-amber-400 rounded-full blur-md opacity-50 animate-pulse"></div>
//                 <div className="relative w-9 h-9 bg-gradient-to-br from-red-600 to-amber-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
//                   <span className="text-white font-bold text-sm">
//                     {user?.name?.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//               </div>

//               {/* User Details */}
//               <div className="hidden md:block text-left">
//                 <p className="text-sm font-bold text-gray-900">{user?.name}</p>
//                 <p className="text-xs text-amber-700 capitalize font-medium">
//                   {user?.role?.replace("_", " ")}
//                 </p>
//               </div>
//             </motion.button>

//             {/* Dropdown menu */}
//             <AnimatePresence>
//               {showUserMenu && (
//                 <>
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="fixed inset-0 z-40"
//                     onClick={() => setShowUserMenu(false)}
//                   />
//                   <motion.div
//                     initial={{ opacity: 0, y: -10, scale: 0.95 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                     className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border-2 border-amber-200 py-2 z-50 overflow-hidden"
//                   >
//                     {/* User Info Header */}
//                     <div className="px-4 py-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-red-50">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-amber-600 rounded-full flex items-center justify-center border-2 border-amber-300 shadow-lg">
//                           <span className="text-white font-bold">
//                             {user?.name?.charAt(0).toUpperCase()}
//                           </span>
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-bold text-gray-900 truncate">
//                             {user?.name}
//                           </p>
//                           <p className="text-xs text-amber-700 truncate">{user?.email}</p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Menu Items */}
//                     <div className="py-1">
//                       <motion.button
//                         whileHover={{ x: 5 }}
//                         onClick={() => {
//                           navigate("/profile");
//                           setShowUserMenu(false);
//                         }}
//                         className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-red-50 transition-all"
//                       >
//                         <User className="w-4 h-4 text-amber-600" />
//                         <span className="font-medium">Profile</span>
//                       </motion.button>

//                       <motion.button
//                         whileHover={{ x: 5 }}
//                         onClick={() => {
//                           navigate("/settings");
//                           setShowUserMenu(false);
//                         }}
//                         className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-red-50 transition-all"
//                       >
//                         <Settings className="w-4 h-4 text-amber-600" />
//                         <span className="font-medium">Settings</span>
//                       </motion.button>
//                     </div>

//                     <div className="border-t border-amber-100 mt-1"></div>

//                     {/* Logout Button */}
//                     <motion.button
//                       whileHover={{ x: 5 }}
//                       onClick={handleLogout}
//                       className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all font-semibold"
//                     >
//                       <LogOut className="w-4 h-4" />
//                       <span>Logout</span>
//                     </motion.button>
//                   </motion.div>
//                 </>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>

//       {/* Decorative Bottom Border with Animation */}
//       <motion.div
//         className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
//         animate={{
//           opacity: [0.5, 1, 0.5],
//         }}
//         transition={{
//           duration: 3,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//       />
//     </motion.header>
//   );
// };

// export default Navbar;


// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Bell,
  Search,
  LogOut,
  User,
  Settings,
  Flame,
  Sparkles,
} from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import LanguageToggle from "../common/LanguageToggle"; // ADD THIS

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const user = useSelector((state) => state.auth.user);
  const currentLanguage = useSelector((state) => state.language.currentLanguage);
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Sync i18n with Redux state
  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage, i18n]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  // Mock notifications with translation
  const notifications = [
    {
      id: 1,
      title: t("notifications.new_devotee"),
      message: t("notifications.devotee_message", { name: "John Tan" }),
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: t("notifications.booking_confirmed"),
      message: t("notifications.booking_message"),
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: t("notifications.monthly_report"),
      message: t("notifications.report_message", { month: "October" }),
      time: "2 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-16 bg-gradient-to-r from-white via-amber-50/30 to-white border-b-2 border-amber-200 fixed top-0 right-0 left-0 lg:left-64 z-30 shadow-lg"
    >
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>

      <div className="h-full px-4 sm:px-6 flex items-center justify-between relative">
        {/* Decorative Pattern Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-red-400 rounded-full blur-3xl"></div>
        </div>

        {/* Left side */}
        <div className="flex items-center space-x-4 relative z-10">
          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMenuClick}
            className="lg:hidden p-2.5 rounded-xl bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all shadow-lg text-white"
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex items-center space-x-2"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Flame className="w-5 h-5 text-amber-600" />
            </motion.div>
            <span className="text-sm font-semibold bg-gradient-to-r from-red-700 to-amber-700 bg-clip-text text-transparent">
              {t("nav.greeting")}
            </span>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden sm:flex items-center"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-red-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-700 group-hover:text-red-700 transition-colors" />
                <input
                  type="text"
                  placeholder={t("nav.search_placeholder")}
                  className="pl-11 pr-4 py-2.5 w-64 lg:w-96 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/80 backdrop-blur-sm placeholder-amber-600/50 text-gray-800 font-medium transition-all"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3 relative z-10">
          {/* Decorative Element */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="hidden lg:block"
          >
            <Sparkles className="w-5 h-5 text-amber-600" />
          </motion.div>

          {/* Language Toggle - REPLACE THE OLD LANGUAGE DROPDOWN WITH THIS */}
          <LanguageToggle />

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 transition-all shadow-md border border-amber-300"
            >
              <Bell className="w-5 h-5 text-amber-800" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-lg"
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border-2 border-amber-200 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-red-50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-900">
                          {t("nav.notifications")}
                        </h3>
                        {unreadCount > 0 && (
                          <span className="text-xs px-2 py-1 bg-red-500 text-white rounded-full font-bold">
                            {unreadCount} {t("nav.new")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className={`px-4 py-3 hover:bg-amber-50 transition-colors cursor-pointer border-l-4 ${
                            notification.unread
                              ? "border-amber-500 bg-amber-50/50"
                              : "border-transparent"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-amber-600 mt-1 font-medium">
                                {notification.time}
                              </p>
                            </div>
                            {notification.unread && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-2 h-2 bg-amber-500 rounded-full ml-2 mt-1"
                              />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="px-4 py-2 border-t border-amber-100 bg-gradient-to-r from-amber-50 to-red-50">
                      <button className="text-xs text-amber-700 hover:text-amber-900 font-semibold">
                        {t("nav.view_all")}
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 pr-4 rounded-xl bg-gradient-to-br from-red-100 to-amber-100 hover:from-red-200 hover:to-amber-200 transition-all shadow-md border border-amber-300"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 rounded-full blur-md opacity-50 animate-pulse"></div>
                <div className="relative w-9 h-9 bg-gradient-to-br from-red-600 to-amber-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-amber-700 capitalize font-medium">
                  {user?.role?.replace("_", " ")}
                </p>
              </div>
            </motion.button>

            {/* User Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border-2 border-amber-200 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-red-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-amber-600 rounded-full flex items-center justify-center border-2 border-amber-300 shadow-lg">
                          <span className="text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-amber-700 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <motion.button
                        whileHover={{ x: 5 }}
                        onClick={() => {
                          navigate("/profile");
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-red-50 transition-all"
                      >
                        <User className="w-4 h-4 text-amber-600" />
                        <span className="font-medium">{t("nav.profile")}</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ x: 5 }}
                        onClick={() => {
                          navigate("/settings");
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-red-50 transition-all"
                      >
                        <Settings className="w-4 h-4 text-amber-600" />
                        <span className="font-medium">{t("nav.settings")}</span>
                      </motion.button>
                    </div>

                    <div className="border-t border-amber-100 mt-1"></div>

                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t("nav.logout")}</span>
                    </motion.button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.header>
  );
};

export default Navbar;