// src/pages/hallBooking/CreateBooking.jsx - Clean & Easy to Understand
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  createBooking,
  clearCurrentBooking,
} from "../../features/hallBooking/bookingsSlice";
import { fetchCustomers } from "../../features/hallBooking/customersSlice";
import {
  fetchHalls,
  checkAvailability,
} from "../../features/hallBooking/hallsSlice";
import { fetchBillingItems } from "../../features/hallBooking/billingItemsSlice";
import { fetchDinnerPackages } from "../../features/hallBooking/dinnerPackagesSlice";
import { fetchCateringVendors } from "../../features/hallBooking/cateringVendorsSlice";
import {
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  Clock,
  Users,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Building2,
  FileText,
  DollarSign,
} from "lucide-react";
import { fetchBookingSettings } from "../../features/systemSettings/systemSettingsSlice";

const CreateBooking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { bookingSettings, loading: settingsLoading } = useSelector(
    (state) => state.systemSettings
  );

  // Load settings on mount
  useEffect(() => {
    dispatch(fetchBookingSettings());
  }, [dispatch]);

  const timeSlots = bookingSettings.time_slots || [];
  const bookingTypes = bookingSettings.booking_types || [];
  const customerTypes = bookingSettings.customer_types || [];
  const bookingStatuses = bookingSettings.booking_statuses || [];
  const minDinnerTables = bookingSettings.min_dinner_tables || 50;

  // Get pre-filled data from calendar selection
  const prefilledData = location.state?.prefilledData || {};

  const { loading } = useSelector((state) => state.bookings);
  const { customers } = useSelector((state) => state.customers);
  const { halls, availability } = useSelector((state) => state.halls);
  const { items: billingItems } = useSelector((state) => state.billingItems);
  const { packages: dinnerPackages } = useSelector(
    (state) => state.dinnerPackages
  );
  const { vendors: cateringVendors } = useSelector(
    (state) => state.cateringVendors
  );

  const [formData, setFormData] = useState({
    customer_id: "",
    hall_id: prefilledData.hall_id || "",
    booking_type: "standard",
    event_date: prefilledData.event_date || "",
    time_slot: prefilledData.time_slot || "morning",
    start_time: "09:00",
    end_time: "14:00",
    event_type: "",
    guest_count: "",
    status: "pending",
    special_requests: "",
    internal_notes: "",
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [dinnerPackageData, setDinnerPackageData] = useState({
    dinner_package_id: "",
    catering_vendor_id: "",
    number_of_tables: 50,
    special_menu_requests: "",
  });

  const [errors, setErrors] = useState({});
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Load data on mount
  useEffect(() => {
    dispatch(clearCurrentBooking());
    dispatch(fetchCustomers({ page: 1, per_page: 1000 }));
    dispatch(fetchHalls({ page: 1, per_page: 100 }));
    dispatch(fetchBillingItems({ page: 1, per_page: 1000 }));
    dispatch(fetchDinnerPackages({ page: 1, per_page: 100 }));
    dispatch(fetchCateringVendors({ page: 1, per_page: 100 }));
  }, [dispatch]);

  // Update end time based on time slot
  useEffect(() => {
    if (formData.time_slot === "morning") {
      setFormData((prev) => ({
        ...prev,
        start_time: "09:00",
        end_time: "14:00",
      }));
    } else if (formData.time_slot === "evening") {
      setFormData((prev) => ({
        ...prev,
        start_time: "18:00",
        end_time: "23:00",
      }));
    }
  }, [formData.time_slot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear availability check when relevant fields change
    if (["hall_id", "event_date", "time_slot"].includes(name)) {
      setAvailabilityChecked(false);
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckAvailability = async () => {
    if (!formData.hall_id || !formData.event_date || !formData.time_slot) {
      setErrors({
        hall_id: !formData.hall_id ? "Hall is required" : "",
        event_date: !formData.event_date ? "Event date is required" : "",
        time_slot: !formData.time_slot ? "Time slot is required" : "",
      });
      return;
    }

    setCheckingAvailability(true);
    try {
      await dispatch(
        checkAvailability({
          hall_id: formData.hall_id,
          event_date: formData.event_date,
          time_slot: formData.time_slot,
        })
      ).unwrap();
      setAvailabilityChecked(true);
    } catch (error) {
      setErrors({
        availability: error.message || "Failed to check availability",
      });
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleAddItem = () => {
    setSelectedItems([
      ...selectedItems,
      {
        billing_item_id: "",
        quantity: 1,
        unit_price: 0,
        remarks: "",
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...selectedItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };

    // Auto-populate unit price when billing item is selected
    if (field === "billing_item_id") {
      const item = billingItems.find((bi) => bi.id === parseInt(value));
      if (item) {
        newItems[index].unit_price = item.price_external || 0;
      }
    }

    setSelectedItems(newItems);
  };

  const handleDinnerPackageChange = (e) => {
    const { name, value } = e.target;
    setDinnerPackageData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer_id) newErrors.customer_id = "Customer is required";
    if (!formData.hall_id) newErrors.hall_id = "Hall is required";
    if (!formData.event_date) newErrors.event_date = "Event date is required";
    if (!formData.time_slot) newErrors.time_slot = "Time slot is required";
    if (!formData.start_time) newErrors.start_time = "Start time is required";
    if (!formData.end_time) newErrors.end_time = "End time is required";
    if (!formData.event_type) newErrors.event_type = "Event type is required";
    if (!formData.guest_count)
      newErrors.guest_count = "Guest count is required";

    if (!availabilityChecked) {
      newErrors.availability = "Please check hall availability first";
    }

    if (formData.booking_type === "with_dinner") {
      if (!dinnerPackageData.dinner_package_id) {
        newErrors.dinner_package = "Dinner package is required";
      }
      if (!dinnerPackageData.catering_vendor_id) {
        newErrors.catering_vendor = "Catering vendor is required";
      }
      if (
        !dinnerPackageData.number_of_tables ||
        dinnerPackageData.number_of_tables < minDinnerTables
      ) {
        newErrors.number_of_tables = `Minimum ${minDinnerTables} tables required for dinner package`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    // Calculate items total
    const itemsTotal = selectedItems.reduce((sum, item) => {
      return (
        sum + parseFloat(item.unit_price || 0) * parseInt(item.quantity || 0)
      );
    }, 0);

    // Add dinner package if applicable
    let dinnerTotal = 0;
    if (
      formData.booking_type === "with_dinner" &&
      dinnerPackageData.dinner_package_id
    ) {
      const selectedPackage = dinnerPackages.find(
        (pkg) => pkg.id === parseInt(dinnerPackageData.dinner_package_id)
      );
      if (selectedPackage) {
        dinnerTotal =
          parseFloat(selectedPackage.price_per_table) *
          parseInt(dinnerPackageData.number_of_tables || 0);
      }
    }

    // Add hall base price
    const selectedHall = halls.find((h) => h.id === parseInt(formData.hall_id));
    const hallPrice = selectedHall
      ? parseFloat(selectedHall.base_price_external || 0)
      : 0;

    return (hallPrice + itemsTotal + dinnerTotal).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      booking_items: selectedItems.filter((item) => item.billing_item_id),
    };

    if (formData.booking_type === "with_dinner") {
      submitData.dinner_package = dinnerPackageData;
    }

    try {
      await dispatch(createBooking(submitData)).unwrap();
      navigate("/hall/bookings");
    } catch (err) {
      console.error("Failed to create booking:", err);
      setErrors({ submit: err.message || "Failed to create booking" });
    }
  };

  const handleCancel = () => {
    navigate("/hall/bookings");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-sm">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create New Booking
                </h1>
                <p className="text-sm text-gray-600">
                  Fill in the details below to create a booking
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Customer & Booking Type */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Customer Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Customer <span className="text-red-500">*</span>
                </label>
                <select
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.customer_id
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.customer_code} - {customer.full_name}
                    </option>
                  ))}
                </select>
                {errors.customer_id && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.customer_id}
                  </p>
                )}
              </div>

              {/* Booking Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Booking Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="booking_type"
                  value={formData.booking_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {bookingTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Date, Time & Hall */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Date, Time & Venue
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Hall */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Hall <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="hall_id"
                    value={formData.hall_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.hall_id
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Hall</option>
                    {halls.map((hall) => (
                      <option key={hall.id} value={hall.id}>
                        {hall.hall_name} (RM {hall.base_price_external})
                      </option>
                    ))}
                  </select>
                  {errors.hall_id && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.hall_id}
                    </p>
                  )}
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.event_date
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.event_date && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.event_date}
                    </p>
                  )}
                </div>

                {/* Time Slot */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Time Slot <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="time_slot"
                    value={formData.time_slot}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.time_slot
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  {errors.time_slot && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.time_slot}
                    </p>
                  )}
                </div>
              </div>

              {/* Check Availability Button */}
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleCheckAvailability}
                  disabled={
                    !formData.hall_id ||
                    !formData.event_date ||
                    !formData.time_slot ||
                    checkingAvailability
                  }
                  className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {checkingAvailability ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Check Availability</span>
                    </>
                  )}
                </button>

                {/* Availability Status */}
                {availabilityChecked && availability?.available && (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium text-sm">
                      Hall is available!
                    </span>
                  </div>
                )}

                {availability?.available === false && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium text-sm">
                      {availability.message}
                    </span>
                  </div>
                )}
              </div>

              {errors.availability && (
                <p className="text-sm text-red-600 flex items-center bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.availability}
                </p>
              )}

              {/* Start & End Time */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Event Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Event Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleChange}
                  placeholder="e.g., Wedding, Birthday Party"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.event_type
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.event_type && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.event_type}
                  </p>
                )}
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Expected Guests <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="guest_count"
                  value={formData.guest_count}
                  onChange={handleChange}
                  min="1"
                  placeholder="Number of guests"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.guest_count
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.guest_count && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.guest_count}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 4: Additional Items */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Additional Items (Optional)
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            {selectedItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Plus className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No additional items added yet</p>
                <p className="text-xs mt-1">
                  Click "Add Item" to include extra services
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    {/* Billing Item */}
                    <div className="col-span-5">
                      <select
                        value={item.billing_item_id}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "billing_item_id",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Select Item</option>
                        {billingItems.map((bi) => (
                          <option key={bi.id} value={bi.id}>
                            {bi.item_name} - RM {bi.price_external}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        min="1"
                        placeholder="Qty"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.unit_price}
                        onChange={(e) =>
                          handleItemChange(index, "unit_price", e.target.value)
                        }
                        step="0.01"
                        placeholder="Price"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    {/* Remarks */}
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={item.remarks}
                        onChange={(e) =>
                          handleItemChange(index, "remarks", e.target.value)
                        }
                        placeholder="Notes"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    {/* Remove Button */}
                    <div className="col-span-1 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 5: Dinner Package (if applicable) */}
          {formData.booking_type === "with_dinner" && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200">
                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Dinner Package Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dinner Package */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Dinner Package <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="dinner_package_id"
                    value={dinnerPackageData.dinner_package_id}
                    onChange={handleDinnerPackageChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.dinner_package
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Package</option>
                    {dinnerPackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.package_code} - {pkg.package_name} (RM{" "}
                        {pkg.price_per_table}/table)
                      </option>
                    ))}
                  </select>
                  {errors.dinner_package && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.dinner_package}
                    </p>
                  )}
                </div>

                {/* Catering Vendor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Catering Vendor <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="catering_vendor_id"
                    value={dinnerPackageData.catering_vendor_id}
                    onChange={handleDinnerPackageChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.catering_vendor
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Vendor</option>
                    {cateringVendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.vendor_name} ({vendor.cuisine_type})
                      </option>
                    ))}
                  </select>
                  {errors.catering_vendor && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.catering_vendor}
                    </p>
                  )}
                </div>

                {/* Number of Tables */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Number of Tables <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="number_of_tables"
                    value={dinnerPackageData.number_of_tables}
                    onChange={handleDinnerPackageChange}
                    min={minDinnerTables}
                    placeholder={`Minimum ${minDinnerTables} tables`}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.number_of_tables
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.number_of_tables && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.number_of_tables}
                    </p>
                  )}
                </div>

                {/* Special Menu Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Special Menu Requests
                  </label>
                  <textarea
                    name="special_menu_requests"
                    value={dinnerPackageData.special_menu_requests}
                    onChange={handleDinnerPackageChange}
                    rows="3"
                    placeholder="Any dietary requirements..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {formData.booking_type === "with_dinner" ? "6" : "5"}
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Additional Notes (Optional)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Special Requests
                </label>
                <textarea
                  name="special_requests"
                  value={formData.special_requests}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Any special requests from customer..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Internal Notes
                </label>
                <textarea
                  name="internal_notes"
                  value={formData.internal_notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Internal notes (not visible to customer)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Total Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-red-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-8 h-8 text-red-600" />
                <span className="text-lg font-semibold text-gray-900">
                  Estimated Total
                </span>
              </div>
              <span className="text-3xl font-bold text-red-600">
                RM {calculateTotal()}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !availabilityChecked}
              className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Create Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBooking;
