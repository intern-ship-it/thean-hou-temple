// src/components/hallBooking/BookingForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../../features/hallBooking/customersSlice";
import {
  fetchHalls,
  checkAvailability,
} from "../../features/hallBooking/hallsSlice";
import { fetchBillingItems } from "../../features/hallBooking/billingItemsSlice";
import { fetchDinnerPackages } from "../../features/hallBooking/dinnerPackagesSlice";
import { fetchCateringVendors } from "../../features/hallBooking/cateringVendorsSlice";
import {
  X,
  Save,
  Loader2,
  Calendar,
  Clock,
  Users,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";

const BookingForm = ({ booking, onSubmit, onClose, loading }) => {
  const dispatch = useDispatch();

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
    hall_id: "",
    booking_type: "standard",
    event_date: "",
    time_slot: "morning",
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

  // Load data on mount
  useEffect(() => {
    dispatch(fetchCustomers({ per_page: 100 }));
    dispatch(fetchHalls());
    dispatch(fetchBillingItems());
    dispatch(fetchDinnerPackages());
    dispatch(fetchCateringVendors());
  }, [dispatch]);

  // Load existing booking data
  useEffect(() => {
    if (booking) {
      setFormData({
        customer_id: booking.customer_id || "",
        hall_id: booking.hall_id || "",
        booking_type: booking.booking_type || "standard",
        event_date: booking.event_date || "",
        time_slot: booking.time_slot || "morning",
        start_time: booking.start_time || "09:00",
        end_time: booking.end_time || "14:00",
        event_type: booking.event_type || "",
        guest_count: booking.guest_count || "",
        status: booking.status || "pending",
        special_requests: booking.special_requests || "",
        internal_notes: booking.internal_notes || "",
      });

      if (booking.booking_items) {
        setSelectedItems(
          booking.booking_items.map((item) => ({
            billing_item_id: item.billing_item.id,
            item_name: item.billing_item.item_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            remarks: item.remarks || "",
          }))
        );
      }

      if (booking.dinner_package) {
        setDinnerPackageData({
          dinner_package_id: booking.dinner_package.package.id,
          catering_vendor_id: booking.dinner_package.vendor.id,
          number_of_tables: booking.dinner_package.number_of_tables,
          special_menu_requests:
            booking.dinner_package.special_menu_requests || "",
        });
      }
    }
  }, [booking]);

  // Auto-set time based on time slot
  useEffect(() => {
    if (formData.time_slot === "morning") {
      setFormData((prev) => ({
        ...prev,
        start_time: "09:00",
        end_time: "14:00",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        start_time: "18:00",
        end_time: "23:00",
      }));
    }
  }, [formData.time_slot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }

    // Reset availability when date/hall/time changes
    if (["event_date", "hall_id", "time_slot"].includes(name)) {
      setAvailabilityChecked(false);
    }
  };

  const handleCheckAvailability = async () => {
    if (!formData.hall_id || !formData.event_date || !formData.time_slot) {
      setErrors({
        ...errors,
        availability: "Please select hall, date, and time slot first",
      });
      return;
    }

    await dispatch(
      checkAvailability({
        hall_id: formData.hall_id,
        event_date: formData.event_date,
        time_slot: formData.time_slot,
      })
    );
    setAvailabilityChecked(true);
  };

  const handleAddItem = () => {
    setSelectedItems([
      ...selectedItems,
      {
        billing_item_id: "",
        item_name: "",
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
    newItems[index][field] = value;

    // Auto-fill price when item is selected
    if (field === "billing_item_id") {
      const item = billingItems.find((bi) => bi.id === parseInt(value));
      if (item) {
        const customer = customers.find(
          (c) => c.id === parseInt(formData.customer_id)
        );
        const customerType = customer?.customer_type || "external";
        newItems[index].item_name = item.item_name;
        newItems[index].unit_price =
          customerType === "internal"
            ? item.internal_price
            : item.external_price;
      }
    }

    setSelectedItems(newItems);
  };

  const calculateTotal = () => {
    let total = 0;

    // Add items total
    selectedItems.forEach((item) => {
      total += item.quantity * item.unit_price;
    });

    // Add dinner package total
    if (
      formData.booking_type === "dinner_package" &&
      dinnerPackageData.dinner_package_id
    ) {
      const pkg = dinnerPackages.find(
        (p) => p.id === parseInt(dinnerPackageData.dinner_package_id)
      );
      if (pkg) {
        total += pkg.price_per_table * dinnerPackageData.number_of_tables;
      }
    }

    return total.toFixed(2);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.customer_id) newErrors.customer_id = "Customer is required";
    if (!formData.hall_id) newErrors.hall_id = "Hall is required";
    if (!formData.event_date) newErrors.event_date = "Event date is required";
    if (!formData.time_slot) newErrors.time_slot = "Time slot is required";
    if (selectedItems.length === 0)
      newErrors.items = "At least one billing item is required";

    // Check if any item is incomplete
    selectedItems.forEach((item, index) => {
      if (!item.billing_item_id) {
        newErrors[`item_${index}`] = "Please select an item";
      }
    });

    // Dinner package validation
    if (formData.booking_type === "dinner_package") {
      if (!dinnerPackageData.dinner_package_id) {
        newErrors.dinner_package_id = "Dinner package is required";
      }
      if (!dinnerPackageData.catering_vendor_id) {
        newErrors.catering_vendor_id = "Catering vendor is required";
      }
      if (dinnerPackageData.number_of_tables < 50) {
        newErrors.number_of_tables = "Minimum 50 tables required";
      }
    }

    if (!availabilityChecked && !booking) {
      newErrors.availability = "Please check availability first";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const submitData = {
        ...formData,
        items: selectedItems.map((item) => ({
          billing_item_id: item.billing_item_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          remarks: item.remarks,
        })),
      };

      if (formData.booking_type === "dinner_package") {
        submitData.dinner_package = dinnerPackageData;
      }

      onSubmit(submitData);
    }
  };

  const selectedCustomer = customers.find(
    (c) => c.id === parseInt(formData.customer_id)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {booking ? "Edit Booking" : "Create New Booking"}
              </h2>
              <p className="text-sm text-purple-100">
                Fill in the booking details below
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
          className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto"
        >
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.customer_id ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.customer_code} - {customer.name_english}
                      </option>
                    ))}
                  </select>
                  {selectedCustomer && (
                    <p className="mt-1 text-xs text-gray-500">
                      Type:{" "}
                      <span className="font-semibold capitalize">
                        {selectedCustomer.customer_type}
                      </span>
                    </p>
                  )}
                  {errors.customer_id && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.customer_id}
                    </p>
                  )}
                </div>

                {/* Booking Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Booking Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="booking_type"
                    value={formData.booking_type}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="standard">Standard Hall Rental</option>
                    <option value="dinner_package">
                      Dinner Package (Min 50 tables)
                    </option>
                  </select>
                </div>

                {/* Hall */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hall <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="hall_id"
                    value={formData.hall_id}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.hall_id ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Hall</option>
                    {halls.map((hall) => (
                      <option key={hall.id} value={hall.id}>
                        {hall.hall_name} (Capacity: {hall.capacity})
                      </option>
                    ))}
                  </select>
                  {errors.hall_id && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.hall_id}
                    </p>
                  )}
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    disabled={loading}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.event_date ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.event_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.event_date}
                    </p>
                  )}
                </div>

                {/* Time Slot */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time Slot <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="time_slot"
                    value={formData.time_slot}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="morning">Morning (9:00 AM - 2:00 PM)</option>
                    <option value="evening">
                      Evening (6:00 PM - 11:00 PM)
                    </option>
                  </select>
                </div>

                {/* Check Availability Button */}
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={handleCheckAvailability}
                    disabled={
                      !formData.hall_id || !formData.event_date || loading
                    }
                    className="px-6 py-3 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span>Check Availability</span>
                  </button>

                  {availabilityChecked && availability && (
                    <div
                      className={`mt-2 p-3 rounded-lg ${
                        availability.is_available ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      <p
                        className={`text-sm font-medium ${
                          availability.is_available
                            ? "text-green-800"
                            : "text-red-800"
                        }`}
                      >
                        {availability.is_available
                          ? "✓ Hall is available for selected date and time"
                          : "✗ Hall is not available. Please choose another date or time."}
                      </p>
                    </div>
                  )}

                  {errors.availability && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.availability}
                    </p>
                  )}
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Type
                  </label>
                  <input
                    type="text"
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleChange}
                    placeholder="e.g., Wedding, Birthday, Corporate Event"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Guest Count
                  </label>
                  <input
                    type="number"
                    name="guest_count"
                    value={formData.guest_count}
                    onChange={handleChange}
                    min="1"
                    placeholder="Expected number of guests"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Billing Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Billing Items
                </h3>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>

              {selectedItems.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">
                    No items added yet. Click "Add Item" to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedItems.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div className="md:col-span-5">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Item
                          </label>
                          <select
                            value={item.billing_item_id}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "billing_item_id",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="">Select Item</option>
                            {billingItems.map((bi) => (
                              <option key={bi.id} value={bi.id}>
                                {bi.item_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "quantity",
                                parseInt(e.target.value) || 1
                              )
                            }
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Unit Price
                          </label>
                          <input
                            type="number"
                            value={item.unit_price}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "unit_price",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Subtotal
                          </label>
                          <input
                            type="text"
                            value={`RM ${(
                              item.quantity * item.unit_price
                            ).toFixed(2)}`}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                          />
                        </div>
                        <div className="md:col-span-1 flex items-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {errors.items && (
                <p className="mt-2 text-sm text-red-600">{errors.items}</p>
              )}
            </div>

            {/* Dinner Package (only if booking_type is dinner_package) */}
            {formData.booking_type === "dinner_package" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Dinner Package Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Package <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={dinnerPackageData.dinner_package_id}
                      onChange={(e) =>
                        setDinnerPackageData({
                          ...dinnerPackageData,
                          dinner_package_id: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.dinner_package_id
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Package</option>
                      {dinnerPackages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.package_name} - RM {pkg.price_per_table}/table
                        </option>
                      ))}
                    </select>
                    {errors.dinner_package_id && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.dinner_package_id}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Catering Vendor <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={dinnerPackageData.catering_vendor_id}
                      onChange={(e) =>
                        setDinnerPackageData({
                          ...dinnerPackageData,
                          catering_vendor_id: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.catering_vendor_id
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Vendor</option>
                      {cateringVendors.map((vendor) => (
                        <option key={vendor.id} value={vendor.id}>
                          {vendor.vendor_name} ({vendor.vendor_type})
                        </option>
                      ))}
                    </select>
                    {errors.catering_vendor_id && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.catering_vendor_id}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Tables <span className="text-red-500">*</span>{" "}
                      (Min: 50)
                    </label>
                    <input
                      type="number"
                      value={dinnerPackageData.number_of_tables}
                      onChange={(e) =>
                        setDinnerPackageData({
                          ...dinnerPackageData,
                          number_of_tables: parseInt(e.target.value) || 50,
                        })
                      }
                      min="50"
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.number_of_tables
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.number_of_tables && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.number_of_tables}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Special Menu Requests
                    </label>
                    <textarea
                      value={dinnerPackageData.special_menu_requests}
                      onChange={(e) =>
                        setDinnerPackageData({
                          ...dinnerPackageData,
                          special_menu_requests: e.target.value,
                        })
                      }
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="Any special dietary requirements or menu preferences..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    name="special_requests"
                    value={formData.special_requests}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="Any special requests or requirements..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Internal Notes
                  </label>
                  <textarea
                    name="internal_notes"
                    value={formData.internal_notes}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="Internal notes (not visible to customer)..."
                  />
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  Estimated Total:
                </span>
                <span className="text-2xl font-bold text-purple-600">
                  RM {calculateTotal()}
                </span>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-end space-x-3 rounded-b-2xl">
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
            className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{booking ? "Update" : "Create"} Booking</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
