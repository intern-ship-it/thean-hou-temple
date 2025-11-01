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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                Hall Bookings
              </h1>
              <p className="text-purple-100">
                Manage all hall bookings and reservations
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleAdd}
              className="w-full sm:w-auto px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Booking</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold mt-1">
                  {statistics?.total || 0}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Pending</p>
                <p className="text-2xl font-bold mt-1">
                  {statistics?.pending || 0}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-300" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Confirmed</p>
                <p className="text-2xl font-bold mt-1">
                  {statistics?.confirmed || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-300" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Completed</p>
                <p className="text-2xl font-bold mt-1">
                  {statistics?.completed || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Buttons */}
          <button
            onClick={() => handleStatusFilter("")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filters.status === ""
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleStatusFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filters.status === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => handleStatusFilter("confirmed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filters.status === "confirmed"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => handleStatusFilter("completed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filters.status === "completed"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => handleStatusFilter("cancelled")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filters.status === "cancelled"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Cancelled
          </button>

          <div className="ml-auto flex items-center gap-2">
            {/* Date Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Date Filter"
            >
              <Filter className="w-5 h-5" />
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>

            {/* Clear Filters */}
            {(filters.status || filters.start_date || filters.end_date) && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Date Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateFilters.end_date}
                  onChange={(e) =>
                    setDateFilters({ ...dateFilters, end_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleApplyDateFilter}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-600 hover:text-red-800"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Booking Details</h2>
                  <p className="text-purple-100 mt-1">
                    {viewBooking?.booking_code || "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewBooking(null);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Status Badge */}
              <div className="mb-6">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                    viewBooking?.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : viewBooking?.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : viewBooking?.status === "completed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {viewBooking?.status?.toUpperCase() || "UNKNOWN"}
                </span>
              </div>

              {/* Customer & Hall Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">
                    Customer
                  </h3>
                  <p className="text-lg text-gray-900">
                    {viewBooking?.customer?.name_english || "N/A"}
                  </p>
                  {viewBooking?.customer?.name_chinese && (
                    <p className="text-sm text-gray-600">
                      {viewBooking.customer.name_chinese}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    {viewBooking?.customer?.customer_code || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">
                    Hall
                  </h3>
                  <p className="text-lg text-gray-900">
                    {viewBooking?.hall?.hall_name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {viewBooking?.hall?.hall_code || "N/A"}
                  </p>
                </div>
              </div>

              {/* Event Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Event Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Event Type</p>
                    <p className="font-semibold text-gray-900">
                      {viewBooking?.event_type || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Guest Count</p>
                    <p className="font-semibold text-gray-900">
                      {viewBooking?.guest_count || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Event Date</p>
                    <p className="font-semibold text-gray-900">
                      {viewBooking?.event_date || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time Slot</p>
                    <p className="font-semibold text-gray-900">
                      {viewBooking?.time_slot === "morning"
                        ? "Morning (9AM-2PM)"
                        : "Evening (6PM-11PM)"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Time</p>
                    <p className="font-semibold text-gray-900">
                      {viewBooking?.start_time || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Time</p>
                    <p className="font-semibold text-gray-900">
                      {viewBooking?.end_time || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Financial Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-semibold text-gray-900">
                      RM {parseFloat(viewBooking?.total_amount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposit Paid</span>
                    <span className="font-semibold text-gray-900">
                      {viewBooking?.deposit_paid ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balance</span>
                    <span className="font-semibold text-purple-600">
                      RM{" "}
                      {parseFloat(viewBooking?.balance_amount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setViewBooking(null);
                }}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(viewBooking);
                }}
                className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Edit Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && bookingToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Delete Booking
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete booking{" "}
                <span className="font-semibold">
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
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-300 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
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
