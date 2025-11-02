// src/pages/hallBooking/Bookings.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchBookings,
  deleteBooking,
  fetchBookingById,
  fetchUpcomingBookings,
  fetchBookingStats,
  setStatus,
  setDateRange,
  clearFilters,
  clearError,
  clearCurrentBooking,
} from "../../features/hallBooking/bookingsSlice";
import BookingsTable from "../../components/hallBooking/BookingsTable";
import {
  Plus,
  Search,
  Download,
  Filter,
  RefreshCw,
  Calendar,
  Eye,
  X,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  DollarSign,
} from "lucide-react";

const Bookings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    bookings,
    loading,
    error,
    pagination,
    filters,
    statistics = {},
  } = useSelector((state) => state.bookings);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilters, setDateFilters] = useState({
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    dispatch(
      fetchBookings({
        page: 1,
        status: filters.status,
        start_date: filters.start_date,
        end_date: filters.end_date,
      })
    );
    dispatch(fetchBookingStats());
  }, [dispatch, filters.status, filters.start_date, filters.end_date]);

  const handleStatusFilter = (status) => {
    dispatch(setStatus(status));
  };

  const handleApplyDateFilter = () => {
    dispatch(setDateRange(dateFilters));
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setDateFilters({ start_date: "", end_date: "" });
  };

  const handleRefresh = () => {
    dispatch(
      fetchBookings({
        page: pagination.currentPage,
        status: filters.status,
        start_date: filters.start_date,
        end_date: filters.end_date,
      })
    );
    dispatch(fetchBookingStats());
  };

  const handleAdd = () => {
    navigate("/hall/bookings/calendar");
  };

  const handleEdit = (booking) => {
    navigate(`/hall/bookings/edit/${booking.id}`);
  };

  const handleView = async (booking) => {
    await dispatch(fetchBookingById(booking.id));
    setViewBooking(booking);
    setShowViewModal(true);
  };

  const handleDelete = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (bookingToDelete) {
      await dispatch(deleteBooking(bookingToDelete.id));
      setShowDeleteConfirm(false);
      setBookingToDelete(null);
      dispatch(fetchBookingStats());
    }
  };

  const handlePageChange = (page) => {
    dispatch(
      fetchBookings({
        page,
        status: filters.status,
        start_date: filters.start_date,
        end_date: filters.end_date,
      })
    );
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Decorative Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0icGF0dGVybiIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSIjQTYwMDAwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] -z-10"></div>

      {/* Header with Gold-Red Gradient */}
      <div className="relative bg-gradient-to-br from-[#A60000] via-[#800000] to-[#FFB200] rounded-2xl p-8 text-white shadow-2xl overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD54F] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFB200] opacity-10 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FFD54F] to-[#FFB200] rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <Calendar className="w-8 h-8 text-[#800000]" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-1 tracking-wide border-l-4 border-[#FFD54F] pl-3">
                Hall Bookings
              </h1>
              <p className="text-[#FFD54F] font-medium tracking-wide">
                Manage all hall bookings and reservations
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleAdd}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#FFD54F] to-[#FFB200] text-[#800000] font-bold rounded-xl hover:shadow-2xl hover:shadow-[#FFD54F]/50 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" strokeWidth={3} />
              <span className="tracking-wide">New Booking</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {/* Total Bookings */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-lg border border-[#FFD54F]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#FFD54F] text-sm font-medium tracking-wide">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold mt-2">
                  {statistics?.total || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#FFD54F] rounded-xl flex items-center justify-center">
                <Calendar
                  className="w-7 h-7 text-[#800000]"
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-lg border border-[#FFD54F]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#FFD54F] text-sm font-medium tracking-wide">
                  Pending
                </p>
                <p className="text-3xl font-bold mt-2">
                  {statistics?.pending || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-yellow-900" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Confirmed */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-lg border border-[#FFD54F]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#FFD54F] text-sm font-medium tracking-wide">
                  Confirmed
                </p>
                <p className="text-3xl font-bold mt-2">
                  {statistics?.confirmed || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center">
                <CheckCircle
                  className="w-7 h-7 text-green-900"
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-lg border border-[#FFD54F]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#FFD54F] text-sm font-medium tracking-wide">
                  Completed
                </p>
                <p className="text-3xl font-bold mt-2">
                  {statistics?.completed || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center">
                <CheckCircle
                  className="w-7 h-7 text-blue-900"
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl shadow-xl p-5 border border-[#FFD54F]/20">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Buttons */}
          <button
            onClick={() => handleStatusFilter("")}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all tracking-wide ${
              filters.status === ""
                ? "bg-gradient-to-r from-[#A60000] to-[#800000] text-white shadow-lg shadow-[#A60000]/30"
                : "bg-[#FFF8F6] text-gray-700 hover:bg-[#FFD54F]/20 border border-[#FFD54F]/30"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleStatusFilter("pending")}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all tracking-wide ${
              filters.status === "pending"
                ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/30"
                : "bg-[#FFF8F6] text-gray-700 hover:bg-yellow-50 border border-yellow-300/30"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => handleStatusFilter("confirmed")}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all tracking-wide ${
              filters.status === "confirmed"
                ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                : "bg-[#FFF8F6] text-gray-700 hover:bg-green-50 border border-green-300/30"
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => handleStatusFilter("completed")}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all tracking-wide ${
              filters.status === "completed"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-[#FFF8F6] text-gray-700 hover:bg-blue-50 border border-blue-300/30"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => handleStatusFilter("cancelled")}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all tracking-wide ${
              filters.status === "cancelled"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                : "bg-[#FFF8F6] text-gray-700 hover:bg-red-50 border border-red-300/30"
            }`}
          >
            Cancelled
          </button>

          <div className="ml-auto flex items-center gap-2">
            {/* Date Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2.5 text-[#A60000] hover:bg-[#FFD54F]/20 rounded-xl transition-all border border-[#FFD54F]/30"
              title="Date Filter"
            >
              <Filter className="w-5 h-5" strokeWidth={2.5} />
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2.5 text-[#A60000] hover:bg-[#FFD54F]/20 rounded-xl transition-all disabled:opacity-50 border border-[#FFD54F]/30"
              title="Refresh"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                strokeWidth={2.5}
              />
            </button>

            {/* Clear Filters */}
            {(filters.status || filters.start_date || filters.end_date) && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2.5 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all font-semibold tracking-wide"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Date Filter Panel */}
        {showFilters && (
          <div className="mt-5 pt-5 border-t border-[#FFD54F]/30">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide border-l-4 border-[#FFD54F] pl-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateFilters.start_date}
                  onChange={(e) =>
                    setDateFilters({
                      ...dateFilters,
                      start_date: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-[#FFF8F6]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide border-l-4 border-[#FFD54F] pl-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateFilters.end_date}
                  onChange={(e) =>
                    setDateFilters({ ...dateFilters, end_date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-[#FFF8F6]"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleApplyDateFilter}
                  className="w-full px-5 py-3 bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white rounded-xl hover:shadow-lg hover:shadow-[#A60000]/30 transition-all font-bold tracking-wide"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" strokeWidth={2.5} />
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Bookings Table */}
      <BookingsTable
        bookings={bookings}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />

      {/* View Booking Modal */}
      {showViewModal && viewBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-4 border-[#FFD54F]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#A60000] via-[#800000] to-[#FFB200] p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD54F] opacity-20 rounded-full blur-2xl"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-wide border-l-4 border-[#FFD54F] pl-3">
                    Booking Details
                  </h2>
                  <p className="text-[#FFD54F] mt-1 font-semibold tracking-wide">
                    {viewBooking?.booking_code || "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewBooking(null);
                  }}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] bg-[#FFF8F6]">
              {/* Status Badge */}
              <div className="mb-6">
                <span
                  className={`inline-flex items-center px-5 py-2.5 rounded-full text-sm font-bold tracking-wide shadow-lg ${
                    viewBooking?.status === "confirmed"
                      ? "bg-green-100 text-green-800 border-2 border-green-300"
                      : viewBooking?.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
                      : viewBooking?.status === "completed"
                      ? "bg-blue-100 text-blue-800 border-2 border-blue-300"
                      : "bg-red-100 text-red-800 border-2 border-red-300"
                  }`}
                >
                  {viewBooking?.status?.toUpperCase() || "UNKNOWN"}
                </span>
              </div>

              {/* Customer & Hall Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-2xl p-5 shadow-md border border-[#FFD54F]/30">
                  <h3 className="text-sm font-bold text-[#800000] mb-3 tracking-wide border-l-4 border-[#FFD54F] pl-2">
                    Customer
                  </h3>
                  <p className="text-lg text-gray-900 font-bold">
                    {viewBooking?.customer?.name_english || "N/A"}
                  </p>
                  {viewBooking?.customer?.name_chinese && (
                    <p className="text-sm text-gray-600 font-medium">
                      {viewBooking.customer.name_chinese}
                    </p>
                  )}
                  <p className="text-sm text-[#A60000] font-semibold mt-1">
                    {viewBooking?.customer?.customer_code || "N/A"}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-md border border-[#FFD54F]/30">
                  <h3 className="text-sm font-bold text-[#800000] mb-3 tracking-wide border-l-4 border-[#FFD54F] pl-2">
                    Hall
                  </h3>
                  <p className="text-lg text-gray-900 font-bold">
                    {viewBooking?.hall?.hall_name || "N/A"}
                  </p>
                  <p className="text-sm text-[#A60000] font-semibold mt-1">
                    {viewBooking?.hall?.hall_code || "N/A"}
                  </p>
                </div>
              </div>

              {/* Event Details */}
              <div className="bg-gradient-to-br from-[#FFF8F6] to-white rounded-2xl p-6 mb-6 shadow-md border border-[#FFD54F]/30">
                <h3 className="text-lg font-bold text-[#800000] mb-5 tracking-wide border-l-4 border-[#FFD54F] pl-3">
                  Event Details
                </h3>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Event Type
                    </p>
                    <p className="font-bold text-gray-900 mt-1">
                      {viewBooking?.event_type || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Guest Count
                    </p>
                    <p className="font-bold text-gray-900 mt-1">
                      {viewBooking?.guest_count || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Event Date
                    </p>
                    <p className="font-bold text-gray-900 mt-1">
                      {viewBooking?.event_date || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Time Slot
                    </p>
                    <p className="font-bold text-gray-900 mt-1">
                      {viewBooking?.time_slot === "morning"
                        ? "Morning (9AM-2PM)"
                        : "Evening (6PM-11PM)"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Start Time
                    </p>
                    <p className="font-bold text-gray-900 mt-1">
                      {viewBooking?.start_time || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      End Time
                    </p>
                    <p className="font-bold text-gray-900 mt-1">
                      {viewBooking?.end_time || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Summary - UPDATED WITH BREAKDOWN */}
              <div className="bg-gradient-to-br from-[#FFD54F]/20 to-[#FFB200]/20 rounded-2xl p-6 shadow-md border-2 border-[#FFD54F]">
                <h3 className="text-lg font-bold text-[#800000] mb-5 tracking-wide border-l-4 border-[#A60000] pl-3">
                  Financial Summary
                </h3>
                <div className="space-y-3">
                  {/* Breakdown Section */}
                  <div className="space-y-2 pb-3 mb-3 border-b-2 border-[#FFD54F]/50">
                    {/* Hall Rental */}
                    {viewBooking?.hall_rental_amount !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">
                          Hall Rental
                        </span>
                        <span className="font-semibold text-gray-900">
                          RM{" "}
                          {parseFloat(
                            viewBooking?.hall_rental_amount || 0
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Additional Items */}
                    {viewBooking?.additional_items_amount !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">
                          Additional Items
                        </span>
                        <span className="font-semibold text-gray-900">
                          RM{" "}
                          {parseFloat(
                            viewBooking?.additional_items_amount || 0
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Dinner Package - Show if exists */}
                    {viewBooking?.booking_type === "with_dinner" &&
                      viewBooking?.dinner_package && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">
                            Dinner Package (
                            {viewBooking.dinner_package.number_of_tables}{" "}
                            tables)
                          </span>
                          <span className="font-semibold text-[#A60000]">
                            RM{" "}
                            {parseFloat(
                              viewBooking.dinner_package.total_amount ||
                                viewBooking.dinner_package_amount ||
                                0
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Total Amount */}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-900 font-bold text-base">
                      Subtotal
                    </span>
                    <span className="font-bold text-xl text-[#800000]">
                      RM{" "}
                      {parseFloat(
                        viewBooking?.subtotal || viewBooking?.total_amount || 0
                      ).toFixed(2)}
                    </span>
                  </div>

                  {/* Discount (if any) */}
                  {viewBooking?.discount_amount > 0 && (
                    <div className="flex justify-between items-center text-red-600">
                      <span className="font-medium">
                        Discount{" "}
                        {viewBooking?.discount_percentage > 0 &&
                          `(${viewBooking.discount_percentage}%)`}
                      </span>
                      <span className="font-semibold">
                        - RM{" "}
                        {parseFloat(viewBooking?.discount_amount || 0).toFixed(
                          2
                        )}
                      </span>
                    </div>
                  )}

                  {/* Tax (if any) */}
                  {viewBooking?.tax_amount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">
                        Tax{" "}
                        {viewBooking?.tax_percentage > 0 &&
                          `(${viewBooking.tax_percentage}%)`}
                      </span>
                      <span className="font-semibold text-gray-900">
                        + RM{" "}
                        {parseFloat(viewBooking?.tax_amount || 0).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex justify-between items-center pt-3 border-t-2 border-[#FFD54F]">
                    <span className="text-gray-900 font-bold text-lg">
                      Total Amount
                    </span>
                    <span className="font-bold text-2xl text-[#800000]">
                      RM {parseFloat(viewBooking?.total_amount || 0).toFixed(2)}
                    </span>
                  </div>

                  {/* Deposit */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">
                      Deposit Paid
                    </span>
                    <span className="font-bold text-gray-900">
                      RM{" "}
                      {parseFloat(viewBooking?.deposit_amount || 0).toFixed(2)}
                    </span>
                  </div>

                  {/* Balance */}
                  <div className="flex justify-between items-center pt-3 border-t-2 border-[#FFD54F]">
                    <span className="text-gray-900 font-bold text-lg">
                      Balance Due
                    </span>
                    <span className="font-bold text-2xl text-[#A60000]">
                      RM{" "}
                      {parseFloat(viewBooking?.balance_amount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-[#FFF8F6] border-t-2 border-[#FFD54F]/30 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setViewBooking(null);
                }}
                className="px-6 py-3 border-2 border-[#A60000] text-[#A60000] font-bold rounded-xl hover:bg-[#A60000] hover:text-white transition-all tracking-wide"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(viewBooking);
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white font-bold rounded-xl hover:shadow-xl hover:shadow-[#A60000]/40 transition-all tracking-wide"
              >
                Edit Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && bookingToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-4 border-red-300">
            <div className="p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <Trash2 className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-3 tracking-wide">
                Delete Booking
              </h3>
              <p className="text-gray-600 text-center mb-6 font-medium">
                Are you sure you want to delete booking{" "}
                <span className="font-bold text-[#A60000]">
                  {bookingToDelete?.booking_code || "this booking"}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setBookingToDelete(null);
                  }}
                  disabled={loading}
                  className="flex-1 px-5 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all tracking-wide"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-red-500/40 transition-all disabled:from-red-300 disabled:to-red-400 flex items-center justify-center space-x-2 tracking-wide"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
