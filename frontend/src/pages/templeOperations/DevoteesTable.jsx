// src/pages/templeOperations/DevoteesTable.jsx
import React from "react";
import { useTranslation } from "react-i18next"; // ADD THIS
import { Edit2, Trash2, Eye, Phone, Mail, Calendar } from "lucide-react";

const DevoteesTable = ({ devotees, loading, onEdit, onDelete, onView }) => {
  const { t } = useTranslation(); // ADD THIS

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
          <p className="mt-4 text-gray-600 font-medium">{t("devotees_page.loading")}</p>
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
            {t("devotees_page.no_devotees_found")}
          </h3>
          <p className="text-gray-600 mb-6">{t("devotees_page.start_by_adding")}</p>
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
                {t("devotees_page.code")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                {t("devotees_page.name")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                {t("devotees_page.ic_number")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                {t("devotees_page.contact")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                {t("devotees_page.city")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                {t("common.status")}
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                {t("common.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {devotees.map((devotee, index) => (
              <tr
                key={devotee.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {devotee.devotee_code}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">
                    {devotee.name_english}
                  </div>
                  {devotee.name_chinese && (
                    <div className="text-sm text-gray-500">{devotee.name_chinese}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{devotee.ic_number}</td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{devotee.phone}</div>
                  {devotee.email && (
                    <div className="text-xs text-gray-500">{devotee.email}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{devotee.city}</td>
                <td className="px-6 py-4">
                  {devotee.is_active ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {t("common.active")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                      {t("common.inactive")}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onView(devotee)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      title={t("common.view")}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(devotee)}
                      className="p-1.5 text-gray-600 hover:text-primary-800 hover:bg-primary-50 rounded transition-colors"
                      title={t("common.edit")}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(devotee)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      title={t("common.delete")}
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
      <div className="lg:hidden divide-y divide-gray-200">
        {devotees.map((devotee) => (
          <div key={devotee.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {devotee.devotee_code?.slice(-2) || "??"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-1">
                  {devotee.is_active ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {t("common.active")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                      {t("common.inactive")}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">{devotee.name_english}</h3>
                {devotee.name_chinese && (
                  <p className="text-sm text-gray-500">{devotee.name_chinese}</p>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                {t("devotees_page.ic_number")}: {devotee.ic_number}
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
                <span>{t("common.view")}</span>
              </button>
              <button
                onClick={() => onEdit(devotee)}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>{t("common.edit")}</span>
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
