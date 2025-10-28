// src/components/hallBooking/QuotationsTable.jsx
import React from "react";
import {
  Edit2,
  Trash2,
  Eye,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";

const QuotationsTable = ({
  quotations,
  loading,
  onEdit,
  onDelete,
  onView,
  onAccept,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading quotations...</p>
        </div>
      </div>
    );
  }

  if (!quotations || quotations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No quotations found
            </h3>
            <p className="text-gray-600">
              Get started by creating your first quotation
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: <FileText className="w-3 h-3" />,
        label: "Draft",
      },
      sent: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: <Clock className="w-3 h-3" />,
        label: "Sent",
      },
      accepted: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Accepted",
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <XCircle className="w-3 h-3" />,
        label: "Rejected",
      },
      expired: {
        bg: "bg-orange-100",
        text: "text-orange-800",
        icon: <XCircle className="w-3 h-3" />,
        label: "Expired",
      },
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
      <span
        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.icon}
        <span>{config.label}</span>
      </span>
    );
  };

  const getTypeBadge = (type) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-MY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (validUntil) => {
    const today = new Date();
    const expiryDate = new Date(validUntil);
    return today > expiryDate;
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
                  Quotation Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hall
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Valid Until
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
              {quotations.map((quotation) => (
                <tr
                  key={quotation.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-green-600">
                      {quotation.quotation_code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {quotation.customer?.name_english}
                      </div>
                      <div className="text-xs text-gray-500">
                        {quotation.customer?.customer_code}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {quotation.hall?.hall_name}
                    </div>
                    {quotation.event_date && (
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(quotation.event_date)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(quotation.quotation_type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      RM {parseFloat(quotation.total_amount).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(quotation.valid_until)}
                    </div>
                    {isExpired(quotation.valid_until) &&
                      quotation.status === "sent" && (
                        <div className="text-xs text-red-600 mt-1">Expired</div>
                      )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(quotation.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onView(quotation)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {quotation.status === "draft" && (
                        <>
                          <button
                            onClick={() => onEdit(quotation)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(quotation)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {quotation.status === "sent" &&
                        !isExpired(quotation.valid_until) && (
                          <button
                            onClick={() => onAccept(quotation)}
                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                            title="Accept & Create Booking"
                          >
                            Accept
                          </button>
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
        {quotations.map((quotation) => (
          <div
            key={quotation.id}
            className="bg-white rounded-xl shadow-md p-4 space-y-3 animate-fade-in"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-bold text-green-600">
                    {quotation.quotation_code}
                  </span>
                  {getTypeBadge(quotation.quotation_type)}
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  {quotation.customer?.name_english}
                </h3>
                <p className="text-xs text-gray-500">
                  {quotation.customer?.customer_code}
                </p>
              </div>
              <div>{getStatusBadge(quotation.status)}</div>
            </div>

            {/* Details */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-start justify-between text-sm">
                <span className="text-gray-600">Hall:</span>
                <span className="font-medium text-gray-900 text-right">
                  {quotation.hall?.hall_name}
                </span>
              </div>
              {quotation.event_date && (
                <div className="flex items-start justify-between text-sm">
                  <span className="text-gray-600">Event Date:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(quotation.event_date)}
                  </span>
                </div>
              )}
              <div className="flex items-start justify-between text-sm">
                <span className="text-gray-600">Valid Until:</span>
                <span
                  className={`font-medium ${
                    isExpired(quotation.valid_until)
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  {formatDate(quotation.valid_until)}
                  {isExpired(quotation.valid_until) &&
                    quotation.status === "sent" &&
                    " (Expired)"}
                </span>
              </div>
              <div className="flex items-start justify-between text-sm pt-2 border-t">
                <span className="text-gray-700 font-semibold">
                  Total Amount:
                </span>
                <span className="text-lg font-bold text-gray-900">
                  RM {parseFloat(quotation.total_amount).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 pt-3 border-t">
              <button
                onClick={() => onView(quotation)}
                className="flex-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition-colors flex items-center justify-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              {quotation.status === "draft" && (
                <>
                  <button
                    onClick={() => onEdit(quotation)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(quotation)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
              {quotation.status === "sent" &&
                !isExpired(quotation.valid_until) && (
                  <button
                    onClick={() => onAccept(quotation)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Accept</span>
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default QuotationsTable;
