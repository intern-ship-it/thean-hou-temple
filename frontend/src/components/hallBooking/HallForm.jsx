// src/components/hallBooking/HallForm.jsx
import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Building2 } from "lucide-react";

const HallForm = ({ hall, onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState({
    hall_name: "",
    hall_code: "",
    capacity: "",
    location: "",
    description: "",
    internal_price: "",
    external_price: "",
    facilities: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (hall) {
      setFormData({
        hall_name: hall.hall_name || "",
        hall_code: hall.hall_code || "",
        capacity: hall.capacity || "",
        location: hall.location || "",
        description: hall.description || "",
        internal_price: hall.internal_price || "",
        external_price: hall.external_price || "",
        facilities: hall.facilities || "",
        is_active: hall.is_active !== undefined ? hall.is_active : true,
      });
    }
  }, [hall]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.hall_name.trim())
      newErrors.hall_name = "Hall name is required";
    if (!formData.hall_code.trim())
      newErrors.hall_code = "Hall code is required";
    if (!formData.capacity || formData.capacity < 1)
      newErrors.capacity = "Valid capacity is required";
    if (!formData.internal_price || formData.internal_price < 0)
      newErrors.internal_price = "Internal price is required";
    if (!formData.external_price || formData.external_price < 0)
      newErrors.external_price = "External price is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {hall ? "Edit Hall" : "Add New Hall"}
              </h2>
              <p className="text-sm text-indigo-100">
                Configure hall details and pricing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hall Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hall Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="hall_name"
                    value={formData.hall_name}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.hall_name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Grand Hall A"
                  />
                  {errors.hall_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.hall_name}
                    </p>
                  )}
                </div>

                {/* Hall Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hall Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="hall_code"
                    value={formData.hall_code}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.hall_code ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., HALL-A"
                  />
                  {errors.hall_code && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.hall_code}
                    </p>
                  )}
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Capacity (people) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.capacity ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="500"
                  />
                  {errors.capacity && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.capacity}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Ground Floor, West Wing"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Internal Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Internal Price (Members){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      RM
                    </span>
                    <input
                      type="number"
                      name="internal_price"
                      value={formData.internal_price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      disabled={loading}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.internal_price
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="1500.00"
                    />
                  </div>
                  {errors.internal_price && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.internal_price}
                    </p>
                  )}
                </div>

                {/* External Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    External Price (Non-Members){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      RM
                    </span>
                    <input
                      type="number"
                      name="external_price"
                      value={formData.external_price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      disabled={loading}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.external_price
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="2000.00"
                    />
                  </div>
                  {errors.external_price && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.external_price}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Details
              </h3>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Brief description of the hall..."
                />
              </div>

              {/* Facilities */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Facilities
                </label>
                <textarea
                  name="facilities"
                  value={formData.facilities}
                  onChange={handleChange}
                  disabled={loading}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Air conditioning, Stage, Sound system, Projector, WiFi..."
                />
              </div>

              {/* Active Status */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Hall is Active (Available for booking)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{hall ? "Update" : "Save"} Hall</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HallForm;
