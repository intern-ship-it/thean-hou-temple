// src/pages/hallBooking/Bookings.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookings,
  createBooking,
  updateBooking,
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
import BookingForm from "../../components/hallBooking/BookingForm";
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
  const { bookings, loading, error, pagination, filters, statistics } =
    useSelector((state) => state.bookings);

  const [showForm, setShowForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
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
    dispatch(clearCurrentBooking());
    setSelectedBooking(null);
    setShowForm(true);
  };

  const handleEdit = async (booking) => {
    await dispatch(fetchBookingById(booking.id));
    setSelectedBooking(booking);
    setShowForm(true);
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

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedBooking) {
        await dispatch(
          updateBooking({ id: selectedBooking.id, data: formData })
        ).unwrap();
      } else {
        await dispatch(createBooking(formData)).unwrap();
      }
      setShowForm(false);
      setSelectedBooking(null);
      dispatch(
        fetchBookings({
          page: pagination.currentPage,
          status: filters.status,
          start_date: filters.start_date,
          end_date: filters.end_date,
        })
      );
      dispatch(fetchBookingStats());
    } catch (err) {
      console.error("Failed to save booking:", err);
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
                Bookings Management
              </h1>
              <p className="text-purple-100">
                Manage hall bookings and reservations
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="font-semibold">
                {pagination.total} Total Bookings
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Pending</p>
                  <p className="text-2xl font-bold mt-1">
                    {statistics.pending}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Confirmed</p>
                  <p className="text-2xl font-bold mt-1">
                    {statistics.confirmed}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Completed</p>
                  <p className="text-2xl font-bold mt-1">
                    {statistics.completed}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Cancelled</p>
                  <p className="text-2xl font-bold mt-1">
                    {statistics.cancelled}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">This Month</p>
                  <p className="text-2xl font-bold mt-1">
                    {statistics.this_month}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between animate-fade-in">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-5 h-5 text-red-600 mt-0.5">⚠️</div>
            <div>
              <h3 className="text-sm font-semibold text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
          {/* Status Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
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
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusFilter("confirmed")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === "confirmed"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => handleStatusFilter("completed")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === "completed"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => handleStatusFilter("cancelled")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === "cancelled"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancelled
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Date Filter"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={handleRefresh}
              className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              className="hidden sm:flex items-center space-x-2 px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Export"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Export</span>
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">New Booking</span>
            </button>
          </div>
        </div>

        {/* Date Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Filter by Date Range
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateFilters.end_date}
                  onChange={(e) =>
                    setDateFilters({ ...dateFilters, end_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div className="flex items-end space-x-2">
                <button
                  onClick={handleApplyDateFilter}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
                >
                  Apply
                </button>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(filters.status || filters.start_date || filters.end_date) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-blue-800">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Active Filters:</span>
            {filters.status && (
              <span className="px-2 py-1 bg-blue-100 rounded">
                Status: {filters.status}
              </span>
            )}
            {filters.start_date && (
              <span className="px-2 py-1 bg-blue-100 rounded">
                From: {filters.start_date}
              </span>
            )}
            {filters.end_date && (
              <span className="px-2 py-1 bg-blue-100 rounded">
                To: {filters.end_date}
              </span>
            )}
          </div>
          <button
            onClick={handleClearFilters}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Table */}
      <BookingsTable
        bookings={bookings}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Pagination */}
      {pagination.lastPage > 1 && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(pagination.currentPage - 1) * pagination.perPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(
                  pagination.currentPage * pagination.perPage,
                  pagination.total
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {pagination.total}
              </span>{" "}
              bookings
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="hidden sm:flex items-center space-x-2">
                {[...Array(pagination.lastPage)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === pagination.lastPage ||
                    (page >= pagination.currentPage - 1 &&
                      page <= pagination.currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          pagination.currentPage === page
                            ? "bg-purple-600 text-white"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === pagination.currentPage - 2 ||
                    page === pagination.currentPage + 2
                  ) {
                    return <span key={page}>...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.lastPage}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <BookingForm
          booking={selectedBooking}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setSelectedBooking(null);
          }}
          loading={loading}
        />
      )}

      {/* View Modal - Placeholder */}
      {showViewModal && viewBooking && (
        <ViewBookingModal
          booking={viewBooking}
          onClose={() => {
            setShowViewModal(false);
            setViewBooking(null);
          }}
          onEdit={() => {
            setShowViewModal(false);
            handleEdit(viewBooking);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && bookingToDelete && (
        <DeleteConfirmModal
          booking={bookingToDelete}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setBookingToDelete(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

// View Modal Component
const ViewBookingModal = ({ booking, onClose, onEdit }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-MY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTimeSlotLabel = (slot) => {
    return slot === "morning" ? "9:00 AM - 2:00 PM" : "6:00 PM - 11:00 PM";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Booking Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Booking Code" value={booking.booking_code} />
                <InfoField
                  label="Status"
                  value={booking.status}
                  className="capitalize"
                />
                <InfoField
                  label="Booking Type"
                  value={
                    booking.booking_type === "dinner_package"
                      ? "Dinner Package"
                      : "Standard"
                  }
                />
                <InfoField
                  label="Customer"
                  value={booking.customer?.name_english}
                />
                <InfoField label="Hall" value={booking.hall?.hall_name} />
                <InfoField
                  label="Event Date"
                  value={formatDate(booking.event_date)}
                />
                <InfoField
                  label="Time Slot"
                  value={getTimeSlotLabel(booking.time_slot)}
                />
                <InfoField
                  label="Guest Count"
                  value={booking.guest_count || "-"}
                />
              </div>
            </div>

            {/* Financial Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="Total Amount"
                  value={`RM ${parseFloat(booking.total_amount).toFixed(2)}`}
                />
                <InfoField
                  label="Remaining Balance"
                  value={`RM ${parseFloat(booking.remaining_balance).toFixed(
                    2
                  )}`}
                />
                <InfoField
                  label="Deposit Paid"
                  value={booking.deposit_paid ? "Yes" : "No"}
                />
                <InfoField
                  label="50% Paid"
                  value={booking.fifty_percent_paid ? "Yes" : "No"}
                />
                <InfoField
                  label="Fully Paid"
                  value={booking.fully_paid ? "Yes" : "No"}
                />
              </div>
            </div>

            {/* Additional Info */}
            {(booking.special_requests || booking.internal_notes) && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Additional Information
                </h3>
                {booking.special_requests && (
                  <div className="mb-4">
                    <InfoField
                      label="Special Requests"
                      value={booking.special_requests}
                    />
                  </div>
                )}
                {booking.internal_notes && (
                  <div>
                    <InfoField
                      label="Internal Notes"
                      value={booking.internal_notes}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          {booking.status === "pending" && (
            <button
              onClick={onEdit}
              className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Edit Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ booking, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            Delete Booking?
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete booking{" "}
            <span className="font-semibold">{booking.booking_code}</span>? This
            action cannot be undone.
          </p>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Info Field Component
const InfoField = ({ label, value, className = "" }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-600 mb-1">
      {label}
    </label>
    <p className={`text-gray-900 ${className}`}>{value}</p>
  </div>
);

export default Bookings;
