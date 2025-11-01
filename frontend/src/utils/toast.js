// src/utils/toast.js
import { toast } from "react-toastify";
import i18n from "../i18n/config";

/**
 * Toast notification utility with i18next support
 * Automatically translates messages based on current language
 */

const defaultOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

export const showToast = {
    /**
     * Show success toast
     * @param {string} messageKey - Translation key or direct message
     * @param {object} options - Additional toast options
     * @param {object} interpolation - Variables for translation interpolation
     */
    success: (messageKey, options = {}, interpolation = {}) => {
        const message = i18n.exists(messageKey)
            ? i18n.t(messageKey, interpolation)
            : messageKey;

        toast.success(message, {
            ...defaultOptions,
            ...options,
            className: "toast-success",
        });
    },

    /**
     * Show error toast
     */
    error: (messageKey, options = {}, interpolation = {}) => {
        const message = i18n.exists(messageKey)
            ? i18n.t(messageKey, interpolation)
            : messageKey;

        toast.error(message, {
            ...defaultOptions,
            autoClose: 5000, // Errors stay longer
            ...options,
            className: "toast-error",
        });
    },

    /**
     * Show warning toast
     */
    warning: (messageKey, options = {}, interpolation = {}) => {
        const message = i18n.exists(messageKey)
            ? i18n.t(messageKey, interpolation)
            : messageKey;

        toast.warning(message, {
            ...defaultOptions,
            ...options,
            className: "toast-warning",
        });
    },

    /**
     * Show info toast
     */
    info: (messageKey, options = {}, interpolation = {}) => {
        const message = i18n.exists(messageKey)
            ? i18n.t(messageKey, interpolation)
            : messageKey;

        toast.info(message, {
            ...defaultOptions,
            ...options,
            className: "toast-info",
        });
    },

    /**
     * Show promise toast (for async operations)
     * @param {Promise} promise - Promise to track
     * @param {object} messages - Object containing pending, success, and error message keys
     */
    promise: (
        promise,
        messages = {
            pending: "toast.loading",
            success: "toast.success",
            error: "toast.error",
        }
    ) => {
        return toast.promise(
            promise,
            {
                pending: {
                    render() {
                        return i18n.t(messages.pending);
                    },
                },
                success: {
                    render({ data }) {
                        return i18n.t(messages.success, data);
                    },
                },
                error: {
                    render({ data }) {
                        return i18n.t(messages.error, { error: data?.message || "Error" });
                    },
                },
            },
            defaultOptions
        );
    },
};

// Export toast for direct use if needed
export { toast };