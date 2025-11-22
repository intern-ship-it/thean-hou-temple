// src/pages/masterSetup/Halls.jsx - CORRECT FIELD NAMES!
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHalls } from "../../features/hallBooking/hallsSlice";
import { Building2, Users, DollarSign, Check, X } from "lucide-react";

const Halls = () => {
  const dispatch = useDispatch();

  // ✅ CORRECT: halls from Redux
  const { halls, loading } = useSelector((state) => state.halls);

  useEffect(() => {
    dispatch(fetchHalls({ per_page: 100 }));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-lg">
            <Building2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Halls Management
            </h1>
            <p className="text-gray-600 mt-1">View and manage temple halls</p>
          </div>
        </div>
      </div>

      {/* Halls Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : !halls || halls.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg text-gray-500">
          <Building2 className="w-16 h-16 mb-4 text-gray-300" />
          <p className="text-lg">No halls found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {halls.map((hall) => (
            <div
              key={hall.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Hall Header */}
              <div className="p-6 bg-gradient-to-r from-red-500 to-red-600">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {hall.hall_name}
                  </h3>
                </div>
              </div>

              {/* Hall Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span className="text-sm">Capacity</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {hall.capacity} people
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Internal Price
                    </span>
                    <div className="flex items-center gap-1 text-lg font-bold text-green-700">
                      <DollarSign className="w-5 h-5" />
                      <span>
                        RM {parseFloat(hall.internal_price || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      External Price
                    </span>
                    <div className="flex items-center gap-1 text-lg font-bold text-blue-700">
                      <DollarSign className="w-5 h-5" />
                      <span>
                        RM {parseFloat(hall.external_price || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {hall.description && (
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">{hall.description}</p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  {hall.is_active ? (
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <Check className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600 font-medium">
                      <X className="w-4 h-4" />
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Halls;
