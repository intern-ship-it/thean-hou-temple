// src/components/hallBooking/QuotationForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../../features/hallBooking/customersSlice";
import { fetchHalls } from "../../features/hallBooking/hallsSlice";
import { fetchBillingItems } from "../../features/hallBooking/billingItemsSlice";
import { X, Save, Loader2, FileText, Plus, Trash2 } from "lucide-react";

const QuotationForm = ({ quotation, onSubmit, onClose, loading }) => {
  const dispatch = useDispatch();

  const { customers } = useSelector((state) => state.customers);
  const { halls } = useSelector((state) => state.halls);
  const { items: billingItems } = useSelector((state) => state.billingItems);

  const [formData, setFormData] = useState({
    customer_id: "",
    hall_id: "",
    quotation_type: "standard",
    event_date: "",
    time_slot: "morning",
    valid_until: "",
    notes: "",
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [errors, setErrors] = useState({});

  // Load data on mount
  useEffect(() => {
    dispatch(fetchCustomers({ per_page: 100 }));
    dispatch(fetchHalls());
    dispatch(fetchBillingItems());
  }, [dispatch]);

  // Set default valid_until (30 days from now)
  useEffect(() => {
    if (!formData.valid_until) {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      setFormData((prev) => ({
        ...prev,
        valid_until: date.toISOString().split("T")[0],
      }));
    }
  }, [formData.valid_until]);

  // Load existing quotation data
  useEffect(() => {
    if (quotation) {
      setFormData({
        customer_id: quotation.customer_id || "",
        hall_id: quotation.hall_id || "",
        quotation_type: quotation.quotation_type || "standard",
        event_date: quotation.event_date || "",
        time_slot: quotation.time_slot || "morning",
        valid_until: quotation.valid_until || "",
        notes: quotation.notes || "",
      });

      if (quotation.quotation_items) {
        setSelectedItems(
          quotation.quotation_items.map((item) => ({
            billing_item_id: item.billing_item.id,
            item_name: item.billing_item.item_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            remarks: item.remarks || "",
          }))
        );
      }
    }
  }, [quotation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
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
    selectedItems.forEach((item) => {
      total += item.quantity * item.unit_price;
    });
    return total.toFixed(2);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.customer_id) newErrors.customer_id = "Customer is required";
    if (!formData.hall_id) newErrors.hall_id = "Hall is required";
    if (selectedItems.length === 0)
      newErrors.items = "At least one item is required";

    // Check if any item is incomplete
    selectedItems.forEach((item, index) => {
      if (!item.billing_item_id) {
        newErrors[`item_${index}`] = "Please select an item";
      }
    });

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

      onSubmit(submitData);
    }
  };

  const selectedCustomer = customers.find(
    (c) => c.id === parseInt(formData.customer_id)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {quotation ? "Edit Quotation" : "Create New Quotation"}
              </h2>
              <p className="text-sm text-green-100">
                Generate a quote for the customer
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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

                {/* Quotation Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quotation Type
                  </label>
                  <select
                    name="quotation_type"
                    value={formData.quotation_type}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="standard">Standard Hall Rental</option>
                    <option value="dinner_package">Dinner Package</option>
                  </select>
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Time Slot */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time Slot (Optional)
                  </label>
                  <select
                    name="time_slot"
                    value={formData.time_slot}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="morning">Morning (9:00 AM - 2:00 PM)</option>
                    <option value="evening">
                      Evening (6:00 PM - 11:00 PM)
                    </option>
                  </select>
                </div>

                {/* Valid Until */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    name="valid_until"
                    value={formData.valid_until}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Quotation will expire after this date
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quotation Items
                </h3>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
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
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Remarks (Optional)
                        </label>
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) =>
                            handleItemChange(index, "remarks", e.target.value)
                          }
                          placeholder="Additional notes for this item..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {errors.items && (
                <p className="mt-2 text-sm text-red-600">{errors.items}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Terms and conditions, special notes, or additional information..."
                />
              </div>
            </div>

            {/* Total */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  Estimated Total:
                </span>
                <span className="text-2xl font-bold text-green-600">
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
            className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{quotation ? "Update" : "Create"} Quotation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotationForm;
