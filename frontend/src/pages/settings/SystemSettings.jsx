import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSystemSettings,
  updateSystemSetting,
  clearError,
} from "../../features/systemSettings/systemSettingsSlice";
import { Settings, Edit, Save, X, Plus, Trash2 } from "lucide-react";

const SystemSettings = () => {
  const dispatch = useDispatch();
  const { settings, loading, error } = useSelector(
    (state) => state.systemSettings
  );

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState(null);

  useEffect(() => {
    dispatch(fetchSystemSettings());
  }, [dispatch]);

  const handleEdit = (setting) => {
    setEditingId(setting.id);
    setEditValue(JSON.parse(JSON.stringify(setting.value))); // Deep copy
  };

  const handleSave = async (setting) => {
    await dispatch(
      updateSystemSetting({
        id: setting.id,
        data: {
          setting_value: editValue,
        },
      })
    );
    setEditingId(null);
    setEditValue(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue(null);
  };

  const handleAddItem = () => {
    setEditValue([...editValue, { value: "", label: "", description: "" }]);
  };

  const handleRemoveItem = (index) => {
    const newValue = [...editValue];
    newValue.splice(index, 1);
    setEditValue(newValue);
  };

  const handleItemChange = (index, field, value) => {
    const newValue = [...editValue];
    newValue[index][field] = value;
    setEditValue(newValue);
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#A60000] via-[#800000] to-[#FFB200] rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#FFD54F] to-[#FFB200] rounded-2xl flex items-center justify-center shadow-lg">
            <Settings className="w-8 h-8 text-[#800000]" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-wide">
              System Settings
            </h1>
            <p className="text-[#FFD54F] font-medium">
              Configure booking system options
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 flex items-center justify-between">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Settings List */}
      <div className="grid gap-6">
        {loading && !settings.length ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-12 h-12 border-4 border-[#A60000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        ) : (
          settings.map((setting) => (
            <div
              key={setting.id}
              className="bg-white rounded-2xl shadow-xl p-6 border border-[#FFD54F]/20"
            >
              {/* Setting Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#800000]">
                    {setting.label}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {setting.description}
                  </p>
                </div>
                {editingId === setting.id ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSave(setting)}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={loading}
                      className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit(setting)}
                    className="px-4 py-2 bg-[#A60000] text-white rounded-xl hover:bg-[#800000] flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {/* Setting Value */}
              <div className="bg-[#FFF8F6] rounded-xl p-4">
                {editingId === setting.id ? (
                  // EDIT MODE
                  <div>
                    {setting.type === "json" && Array.isArray(editValue) ? (
                      <div className="space-y-3">
                        {editValue.map((item, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-4 border border-[#FFD54F]/30 relative"
                          >
                            <button
                              onClick={() => handleRemoveItem(index)}
                              className="absolute top-2 right-2 p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-2 gap-3 pr-8">
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                  Value
                                </label>
                                <input
                                  type="text"
                                  value={item.value || ""}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                  Label
                                </label>
                                <input
                                  type="text"
                                  value={item.label || ""}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "label",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                              </div>
                              {item.description !== undefined && (
                                <div className="col-span-2">
                                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Description
                                  </label>
                                  <input
                                    type="text"
                                    value={item.description || ""}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  />
                                </div>
                              )}
                              {item.start_time !== undefined && (
                                <>
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                      Start Time
                                    </label>
                                    <input
                                      type="time"
                                      value={item.start_time || ""}
                                      onChange={(e) =>
                                        handleItemChange(
                                          index,
                                          "start_time",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                      End Time
                                    </label>
                                    <input
                                      type="time"
                                      value={item.end_time || ""}
                                      onChange={(e) =>
                                        handleItemChange(
                                          index,
                                          "end_time",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={handleAddItem}
                          className="w-full py-3 border-2 border-dashed border-[#FFD54F] rounded-lg text-[#A60000] font-semibold hover:bg-[#FFF8F6] flex items-center justify-center space-x-2"
                        >
                          <Plus className="w-5 h-5" />
                          <span>Add Item</span>
                        </button>
                      </div>
                    ) : (
                      // Simple value (number, text)
                      <input
                        type={setting.type === "number" ? "number" : "text"}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                      />
                    )}
                  </div>
                ) : (
                  // VIEW MODE
                  <div>
                    {setting.type === "json" && Array.isArray(setting.value) ? (
                      <div className="space-y-2">
                        {setting.value.map((item, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-3 border border-[#FFD54F]/30"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-semibold text-gray-900">
                                  {item.label}
                                </span>
                                <span className="text-sm text-gray-500 ml-2">
                                  ({item.value})
                                </span>
                              </div>
                              {item.start_time && item.end_time && (
                                <span className="text-sm text-gray-600">
                                  {item.start_time} - {item.end_time}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="font-mono text-gray-900 font-semibold text-lg">
                        {setting.value}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SystemSettings;
