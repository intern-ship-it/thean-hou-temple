// src/components/hallBooking/BookingsTable.jsx
import React from "react";
import {
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const BookingsTable = ({ bookings, loading, onEdit, onDelete, onView }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No bookings found
            </h3>
            <p className="text-gray-600">
              Get started by creating your first booking
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "Pending",
      },
      confirmed: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Confirmed",
      },
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Completed",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <XCircle className="w-3 h-3" />,
        label: "Cancelled",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.icon}
        <span>{config.label}</span>
      </span>
    );
  };

  const getBookingTypeBadge = (type) => {
    if (type === "dinner_package") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          Dinner Package
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Standard
      </span>
    );
  };

  const getPaymentStatus = (booking) => {
    if (booking.fully_paid) {
      return (
        <span className="inline-flex items-center space-x-1 text-xs font-medium text-green-600">
          <CheckCircle className="w-3 h-3" />
          <span>Fully Paid</span>
        </span>
      );
    } else if (booking.fifty_percent_paid) {
      return (
        <span className="inline-flex items-center space-x-1 text-xs font-medium text-blue-600">
          <AlertCircle className="w-3 h-3" />
          <span>50% Paid</span>
        </span>
      );
    } else if (booking.deposit_paid) {
      return (
        <span className="inline-flex items-center space-x-1 text-xs font-medium text-yellow-600">
          <AlertCircle className="w-3 h-3" />
          <span>Deposit Paid</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 text-xs font-medium text-red-600">
        <XCircle className="w-3 h-3" />
        <span>Unpaid</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-MY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTimeSlotLabel = (slot) => {
    return slot === "morning" ? "9:00 AM - 2:00 PM" : "6:00 PM - 11:00 PM";
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Booking Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Event Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-purple-600">
                      {booking.booking_code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {booking.customer?.name_english}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.customer?.customer_code}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(booking.event_date)}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-2 text-gray-400" />
                        {getTimeSlotLabel(booking.time_slot)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.hall?.hall_name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getBookingTypeBadge(booking.booking_type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-semibold text-gray-900">
                      <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                      RM {parseFloat(booking.total_amount).toFixed(2)}
                    </div>
                    {booking.remaining_balance > 0 && (
                      <div className="text-xs text-red-600">
                        Balance: RM{" "}
                        {parseFloat(booking.remaining_balance).toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatus(booking)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onView(booking)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() => onEdit(booking)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(booking)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-xl shadow-md p-4 space-y-3 animate-fade-in"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-bold text-purple-600">
                    {booking.booking_code}
                  </span>
                  {getBookingTypeBadge(booking.booking_type)}
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  {booking.customer?.name_english}
                </h3>
                <p className="text-xs text-gray-500">
                  {booking.customer?.customer_code}
                </p>
              </div>
              <div>{getStatusBadge(booking.status)}</div>
            </div>

            {/* Event Details */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center text-sm text-gray-700">
                <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span>{formatDate(booking.event_date)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <Clock className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span>{getTimeSlotLabel(booking.time_slot)}</span>
              </div>
              <div className="flex items-start text-sm text-gray-700">
                <Users className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>{booking.hall?.hall_name}</span>
              </div>
              {booking.guest_count && (
                <div className="flex items-center text-sm text-gray-700">
                  <Users className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span>{booking.guest_count} guests</span>
                </div>
              )}
            </div>

            {/* Financial Info */}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Total Amount:
                </span>
                <span className="text-lg font-bold text-gray-900">
                  RM {parseFloat(booking.total_amount).toFixed(2)}
                </span>
              </div>
              {booking.remaining_balance > 0 && (
                <div className="flex items-center justify-between text-xs text-red-600">
                  <span>Balance:</span>
                  <span className="font-semibold">
                    RM {parseFloat(booking.remaining_balance).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="mt-2">{getPaymentStatus(booking)}</div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 pt-3 border-t">
              <button
                onClick={() => onView(booking)}
                className="flex-1 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg font-medium hover:bg-purple-100 transition-colors flex items-center justify-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              {booking.status === "pending" && (
                <>
                  <button
                    onClick={() => onEdit(booking)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(booking)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BookingsTable;
