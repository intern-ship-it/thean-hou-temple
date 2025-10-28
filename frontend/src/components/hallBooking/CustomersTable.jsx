// src/components/hallBooking/CustomersTable.jsx
import React from "react";
import {
  Edit2,
  Trash2,
  Eye,
  User,
  Phone,
  Mail,
  MapPin,
  Loader2,
} from "lucide-react";

const CustomersTable = ({ customers, loading, onEdit, onDelete, onView }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (!customers || customers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No customers found
            </h3>
            <p className="text-gray-600">
              Get started by adding your first customer
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getCustomerTypeBadge = (type) => {
    if (type === "internal") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Internal
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        External
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Inactive
      </span>
    );
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
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
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-blue-600">
                      {customer.customer_code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name_english}
                      </div>
                      {customer.name_chinese && (
                        <div className="text-sm text-gray-500">
                          {customer.name_chinese}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getCustomerTypeBadge(customer.customer_type)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.contact_number}
                      </div>
                      {customer.email && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {customer.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {customer.city && customer.state ? (
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.city}, {customer.state}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(customer.is_active)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onView(customer)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(customer)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(customer)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-xl shadow-md p-4 space-y-3 animate-fade-in"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-bold text-blue-600">
                    {customer.customer_code}
                  </span>
                  {getCustomerTypeBadge(customer.customer_type)}
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  {customer.name_english}
                </h3>
                {customer.name_chinese && (
                  <p className="text-sm text-gray-500">
                    {customer.name_chinese}
                  </p>
                )}
              </div>
              <div>{getStatusBadge(customer.is_active)}</div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center text-sm text-gray-700">
                <User className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span>{customer.contact_person}</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span>{customer.contact_number}</span>
              </div>
              {customer.email && (
                <div className="flex items-center text-sm text-gray-700">
                  <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
              )}
              {customer.city && customer.state && (
                <div className="flex items-center text-sm text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span>
                    {customer.city}, {customer.state}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 pt-3 border-t">
              <button
                onClick={() => onView(customer)}
                className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button
                onClick={() => onEdit(customer)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(customer)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CustomersTable;
