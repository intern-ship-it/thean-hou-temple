// src/pages/hallBooking/Bookings.jsx - Clean White Design with Red Accents
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
      {/* Header Section - Clean White with Red Accent */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hall Bookings
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage all hall bookings and reservations
              </p>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>New Booking</span>
          </button>
        </div>

        {/* Statistics Cards - Clean & Minimal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Total Bookings */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Bookings
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {statistics?.total || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {statistics?.pending || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Confirmed */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {statistics?.confirmed || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {statistics?.completed || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar - Clean Design */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Buttons */}
          <button
            onClick={() => handleStatusFilter("")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filters.status === ""
                ? "bg-red-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleStatusFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filters.status === "pending"
                ? "bg-yellow-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => handleStatusFilter("confirmed")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filters.status === "confirmed"
                ? "bg-green-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => handleStatusFilter("completed")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filters.status === "completed"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => handleStatusFilter("cancelled")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filters.status === "cancelled"
                ? "bg-red-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Cancelled
          </button>

          <div className="ml-auto flex items-center gap-2">
            {/* Date Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-all ${
                showFilters
                  ? "bg-red-100 text-red-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="Date Filter"
            >
              <Filter className="w-5 h-5" />
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
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
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Date Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateFilters.end_date}
                  onChange={(e) =>
                    setDateFilters({ ...dateFilters, end_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleApplyDateFilter}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
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
            <p className="text-red-700 font-medium text-sm">{error}</p>
          </div>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-100 rounded transition-all"
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

      {/* View Booking Modal - Clean Design */}
      {showViewModal && viewBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Booking Details</h2>
                  <p className="text-red-100 mt-1 text-sm">
                    {viewBooking?.booking_code || "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewBooking(null);
                  }}
                  className="p-2 hover:bg-red-700 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] bg-gray-50">
              {/* Status Badge */}
              <div className="mb-6">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Customer
                  </h3>
                  <p className="text-base text-gray-900 font-semibold">
                    {viewBooking?.customer?.name_english || "N/A"}
                  </p>
                  {viewBooking?.customer?.name_chinese && (
                    <p className="text-sm text-gray-600">
                      {viewBooking.customer.name_chinese}
                    </p>
                  )}
                  <p className="text-sm text-red-600 font-medium mt-1">
                    {viewBooking?.customer?.customer_code || "N/A"}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Hall
                  </h3>
                  <p className="text-base text-gray-900 font-semibold">
                    {viewBooking?.hall?.hall_name || "N/A"}
                  </p>
                  <p className="text-sm text-red-600 font-medium mt-1">
                    {viewBooking?.hall?.hall_code || "N/A"}
                  </p>
                </div>
              </div>

              {/* Event Details */}
              <div className="bg-white rounded-lg p-5 mb-6 border border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  Event Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Event Type</p>
                    <p className="font-semibold text-gray-900 mt-0.5">
                      {viewBooking?.event_type || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Guest Count</p>
                    <p className="font-semibold text-gray-900 mt-0.5">
                      {viewBooking?.guest_count || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Event Date</p>
                    <p className="font-semibold text-gray-900 mt-0.5">
                      {viewBooking?.event_date || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time Slot</p>
                    <p className="font-semibold text-gray-900 mt-0.5">
                      {viewBooking?.time_slot === "morning"
                        ? "Morning (9AM-2PM)"
                        : "Evening (6PM-11PM)"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Time</p>
                    <p className="font-semibold text-gray-900 mt-0.5">
                      {viewBooking?.start_time || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Time</p>
                    <p className="font-semibold text-gray-900 mt-0.5">
                      {viewBooking?.end_time || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-white rounded-lg p-5 border border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  Financial Summary
                </h3>
                <div className="space-y-3">
                  {/* Breakdown Section */}
                  <div className="space-y-2 pb-3 mb-3 border-b border-gray-200">
                    {/* Hall Rental */}
                    {viewBooking?.hall_rental_amount !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
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
                        <span className="text-gray-600 text-sm">
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

                    {/* Dinner Package */}
                    {viewBooking?.booking_type === "with_dinner" &&
                      viewBooking?.dinner_package && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">
                            Dinner Package (
                            {viewBooking.dinner_package.number_of_tables}{" "}
                            tables)
                          </span>
                          <span className="font-semibold text-red-600">
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

                  {/* Subtotal */}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-900 font-semibold">
                      Subtotal
                    </span>
                    <span className="font-bold text-lg text-gray-900">
                      RM{" "}
                      {parseFloat(
                        viewBooking?.subtotal || viewBooking?.total_amount || 0
                      ).toFixed(2)}
                    </span>
                  </div>

                  {/* Discount */}
                  {viewBooking?.discount_amount > 0 && (
                    <div className="flex justify-between items-center text-red-600">
                      <span className="text-sm">
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

                  {/* Tax */}
                  {viewBooking?.tax_amount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">
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
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-gray-900 font-bold">
                      Total Amount
                    </span>
                    <span className="font-bold text-xl text-red-600">
                      RM {parseFloat(viewBooking?.total_amount || 0).toFixed(2)}
                    </span>
                  </div>

                  {/* Deposit */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium text-sm">
                      Deposit Paid
                    </span>
                    <span className="font-semibold text-gray-900">
                      RM{" "}
                      {parseFloat(viewBooking?.deposit_amount || 0).toFixed(2)}
                    </span>
                  </div>

                  {/* Balance */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-gray-900 font-bold">Balance Due</span>
                    <span className="font-bold text-xl text-red-600">
                      RM{" "}
                      {parseFloat(viewBooking?.balance_amount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setViewBooking(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(viewBooking);
                }}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all"
              >
                Edit Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && bookingToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                Delete Booking
              </h3>
              <p className="text-gray-600 text-center mb-6 text-sm">
                Are you sure you want to delete booking{" "}
                <span className="font-semibold text-red-600">
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
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all disabled:bg-red-300 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
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
