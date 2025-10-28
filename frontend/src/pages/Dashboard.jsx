// src/pages/Dashboard.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Lightbulb,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Building2,
  FileText,
  Sparkles,
  Flame,
} from "lucide-react";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  const canAccessTemple = ["super_admin", "temple_staff"].includes(user?.role);
  const canAccessHall = ["super_admin", "hall_manager"].includes(user?.role);

  // Stats data
  const templeStats = [
    {
      title: "Total Devotees",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "primary",
      link: "/temple/devotees",
      gradient: "from-red-500 to-red-700",
    },
    {
      title: "Active Pagoda Lights",
      value: "12,450",
      change: "+8%",
      trend: "up",
      icon: Lightbulb,
      color: "secondary",
      link: "/temple/pagoda-lights",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Monthly Donations",
      value: "RM 45,678",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "green",
      link: "/temple/donations",
      gradient: "from-emerald-500 to-green-700",
    },
  ];

  const hallStats = [
    {
      title: "Active Customers",
      value: "342",
      change: "+5%",
      trend: "up",
      icon: Users,
      color: "blue",
      link: "/hall/customers",
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "Confirmed Bookings",
      value: "28",
      change: "-3%",
      trend: "down",
      icon: Calendar,
      color: "purple",
      link: "/hall/bookings",
      gradient: "from-purple-500 to-purple-700",
    },
    {
      title: "Monthly Revenue",
      value: "RM 125,450",
      change: "+18%",
      trend: "up",
      icon: DollarSign,
      color: "green",
      link: "/hall/quotations",
      gradient: "from-emerald-500 to-teal-700",
    },
  ];

  const recentActivities = [
    {
      title: "New devotee registered",
      description: "John Tan - DEV1235",
      time: "5 min ago",
      icon: Users,
      color: "blue",
    },
    {
      title: "Pagoda light renewed",
      description: "Light #00234 - Mary Wong",
      time: "12 min ago",
      icon: Lightbulb,
      color: "yellow",
    },
    {
      title: "New booking confirmed",
      description: "Grand Hall - Wedding Reception",
      time: "1 hour ago",
      icon: Calendar,
      color: "green",
    },
    {
      title: "Quotation sent",
      description: "QT2025-0045 - ABC Corporation",
      time: "2 hours ago",
      icon: FileText,
      color: "purple",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section with Chinese Pattern */}
      <motion.div
        variants={itemVariants}
        className="relative bg-gradient-to-br from-red-900 via-red-800 to-amber-900 rounded-2xl p-8 sm:p-10 text-white shadow-2xl overflow-hidden"
      >
        {/* Decorative Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-300 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-300 to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Chinese Corner Decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-amber-400 rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-amber-400 rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-amber-400 rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-amber-400 rounded-br-lg"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center space-x-2 mb-3"
            >
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
              <span className="text-amber-200 text-sm font-medium tracking-wide">
                Blessed Day
              </span>
            </motion.div>
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent"
            >
              Welcome back, {user?.name}!
            </motion.h1>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-red-100 capitalize text-lg"
            >
              {user?.role?.replace("_", " ")} Dashboard
            </motion.p>
          </div>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="mt-4 sm:mt-0"
          >
            <div className="inline-flex items-center px-6 py-3 bg-white/20 rounded-xl backdrop-blur-md border border-white/30 shadow-lg">
              <Calendar className="w-5 h-5 mr-3 text-amber-300" />
              <span className="text-sm font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Temple Operations Stats */}
      {canAccessTemple && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <Building2 className="w-7 h-7 mr-3 text-red-700" />
              </motion.div>
              <span className="bg-gradient-to-r from-red-700 to-amber-700 bg-clip-text text-transparent">
                Temple Operations
              </span>
            </h2>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Flame className="w-6 h-6 text-amber-500" />
            </motion.div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templeStats.map((stat, index) => (
              <StatsCard key={index} {...stat} index={index} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Hall Booking Stats */}
      {canAccessHall && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <Building2 className="w-7 h-7 mr-3 text-blue-700" />
              </motion.div>
              <span className="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Hall Booking
              </span>
            </h2>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-6 h-6 text-purple-500" />
            </motion.div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hallStats.map((stat, index) => (
              <StatsCard key={index} {...stat} index={index} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="mr-3"
            >
              <Sparkles className="w-6 h-6 text-amber-500" />
            </motion.div>
            Quick Actions
          </h3>
          <div className="space-y-3">
            {canAccessTemple && (
              <>
                <QuickActionButton
                  title="Register Devotee"
                  icon={Users}
                  to="/temple/devotees"
                  color="primary"
                />
                <QuickActionButton
                  title="New Pagoda Light"
                  icon={Lightbulb}
                  to="/temple/pagoda-lights"
                  color="secondary"
                />
              </>
            )}
            {canAccessHall && (
              <>
                <QuickActionButton
                  title="New Booking"
                  icon={Calendar}
                  to="/hall/bookings"
                  color="blue"
                />
                <QuickActionButton
                  title="Create Quotation"
                  icon={FileText}
                  to="/hall/quotations"
                  color="purple"
                />
              </>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="mr-3"
            >
              <Flame className="w-6 h-6 text-red-500" />
            </motion.div>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <ActivityItem key={index} {...activity} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Enhanced Stats Card Component with Animations
const StatsCard = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  gradient,
  link,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring" }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={link}
        className="block bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden group"
      >
        {/* Gradient Background on Hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className={`p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
            >
              <Icon className="w-7 h-7 text-white" />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
              className={`flex items-center text-sm font-bold px-3 py-1 rounded-full ${
                trend === "up"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {change}
            </motion.div>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-2 font-medium">{title}</p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
              className="text-3xl font-bold text-gray-900"
            >
              {value}
            </motion.p>
          </div>

          {/* Decorative Corner */}
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-amber-100 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>
    </motion.div>
  );
};

// Enhanced Quick Action Button with Animations
const QuickActionButton = ({ title, icon: Icon, to, color }) => {
  const colorClasses = {
    primary:
      "hover:bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200",
    secondary:
      "hover:bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-200",
    blue: "hover:bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200",
    purple:
      "hover:bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border-purple-200",
  };

  return (
    <motion.div
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <Link
        to={to}
        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${colorClasses[color]} group shadow-sm hover:shadow-md`}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
          <span className="font-semibold">{title}</span>
        </div>
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <ArrowRight className="w-5 h-5 group-hover:text-current" />
        </motion.div>
      </Link>
    </motion.div>
  );
};

// Enhanced Activity Item with Animations
const ActivityItem = ({
  title,
  description,
  time,
  icon: Icon,
  color,
  index,
}) => {
  const colorClasses = {
    blue: "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700",
    yellow: "bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700",
    green: "bg-gradient-to-br from-green-100 to-green-200 text-green-700",
    purple: "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700",
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ x: 5 }}
      className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer"
    >
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.5 }}
        className={`p-3 rounded-xl ${colorClasses[color]} shadow-md`}
      >
        <Icon className="w-5 h-5" />
      </motion.div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 mt-0.5">{description}</p>
        <p className="text-xs text-gray-400 mt-1 flex items-center">
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-2"
          />
          {time}
        </p>
      </div>
    </motion.div>
  );
};

export default Dashboard;
