// src/components/templeOperations/DevoteesTable.jsx
import React from "react";
import { Edit2, Trash2, Eye, Phone, Mail, Calendar } from "lucide-react";

const DevoteesTable = ({ devotees, loading, onEdit, onDelete, onView }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading devotees...</p>
        </div>
      </div>
    );
  }

  if (!devotees || devotees.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Devotees Found
          </h3>
          <p className="text-gray-600 mb-6">
            Start by adding your first devotee to the system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-primary-800 to-primary-900 text-white">
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Code
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                IC Number
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                City
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Status
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {devotees.map((devotee, index) => (
              <tr
                key={devotee.id}
                className="hover:bg-gray-50 transition-colors duration-150 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800">
                    {devotee.devotee_code}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {devotee.name_english}
                    </p>
                    {devotee.name_chinese && (
                      <p className="text-sm text-gray-500">
                        {devotee.name_chinese}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">
                    {devotee.ic_number}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="w-3 h-3 mr-2 text-gray-400" />
                      {devotee.phone}
                    </div>
                    {devotee.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-3 h-3 mr-2 text-gray-400" />
                        {devotee.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">{devotee.city}</span>
                </td>
                <td className="px-6 py-4">
                  {devotee.is_active ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onView(devotee)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(devotee)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(devotee)}
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

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-100">
        {devotees.map((devotee, index) => (
          <div
            key={devotee.id}
            className="p-4 hover:bg-gray-50 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800">
                    {devotee.devotee_code}
                  </span>
                  {devotee.is_active ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                      Inactive
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">
                  {devotee.name_english}
                </h3>
                {devotee.name_chinese && (
                  <p className="text-sm text-gray-500">
                    {devotee.name_chinese}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                IC: {devotee.ic_number}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                {devotee.phone}
              </div>
              {devotee.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  {devotee.email}
                </div>
              )}
              <div className="text-sm text-gray-600">📍 {devotee.city}</div>
            </div>

            <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => onView(devotee)}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button
                onClick={() => onEdit(devotee)}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(devotee)}
                className="flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevoteesTable;
