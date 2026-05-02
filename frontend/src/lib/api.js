/**
 * Enhanced API Client with Error Logging & Debugging
 * Provides centralized error handling, logging, and request/response tracking
 */

import { api } from "./backend";

// Error logging to browser console
const logError = (context, error, details) => {
    const timestamp = new Date().toISOString();
    const errorInfo = {
        timestamp,
        context,
        message: error?.message || "Unknown error",
        status: error?.response?.status,
        data: error?.response?.data,
        details,
    };
    console.error(`[API ERROR - ${context}]`, errorInfo);
    return errorInfo;
};

const logRequest = (method, url, data) => {
    console.log(`[API REQUEST] ${method.toUpperCase()} ${url}`, data);
};

const logResponse = (method, url, status, data) => {
    console.log(`[API RESPONSE] ${method.toUpperCase()} ${url} → ${status}`, data);
};

/**
 * Validate form data before submission
 * @param {Object} data - Data to validate
 * @param {Array} requiredFields - Required field names
 * @returns {Object} - {valid: boolean, errors: {field: message}}
 */
export const validateFormData = (data, requiredFields = []) => {
    const errors = {};

    if (!data || typeof data !== "object") {
        return { valid: false, errors: { _form: "Data tidak valid" } };
    }

    // Check required fields
    for (const field of requiredFields) {
        const value = data[field];
        if (!value || (typeof value === "string" && !value.trim())) {
            errors[field] = `${field} wajib diisi`;
        }
    }

    // Check for null/undefined critical fields
    for (const [key, value] of Object.entries(data)) {
        if (value === null || value === undefined) {
            delete data[key]; // Remove null/undefined values
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {Object} options - {maxSizeMB, allowedMimes}
 * @returns {Object} - {valid: boolean, error}
 */
export const validateFile = (file, options = {}) => {
    const { maxSizeMB = 5, allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"] } = options;

    if (!file) {
        return { valid: false, error: "File tidak dipilih" };
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
        return { valid: false, error: `File terlalu besar (maks ${maxSizeMB}MB)` };
    }

    if (!allowedMimes.includes(file.type)) {
        return { valid: false, error: `Format file tidak didukung. Gunakan: ${allowedMimes.join(", ")}` };
    }

    return { valid: true };
};

/**
 * Extract error message from API response
 * @param {Error} error - Axios error object
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
    if (!error) return "Terjadi kesalahan tidak diketahui";

    // Check for network errors
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        return "Koneksi gagal. Periksa koneksi internet Anda.";
    }

    // Check for timeout
    if (error.code === "ECONNABORTED") {
        return "Permintaan timeout. Silakan coba lagi.";
    }

    // Check for validation errors (422)
    if (error.response?.status === 422) {
        const data = error.response.data;
        if (data?.errors && typeof data.errors === "object") {
            const messages = Object.values(data.errors)
                .flat()
                .filter((m) => typeof m === "string")
                .slice(0, 3); // Show max 3 errors
            if (messages.length > 0) {
                return messages.join(" • ");
            }
        }
        return data?.message || "Data tidak valid";
    }

    // Check for other HTTP errors
    if (error.response?.status) {
        const message = error.response.data?.message;
        if (message) return message;

        switch (error.response.status) {
            case 400:
                return "Permintaan tidak valid";
            case 401:
                return "Silakan login terlebih dahulu";
            case 403:
                return "Anda tidak memiliki akses";
            case 404:
                return "Data tidak ditemukan";
            case 500:
            case 502:
            case 503:
                return "Server sedang bermasalah. Silakan coba lagi nanti.";
            default:
                return `Terjadi kesalahan (${error.response.status})`;
        }
    }

    // Fallback
    return error.message || "Terjadi kesalahan tidak diketahui";
};

/**
 * Wrapped API calls with error logging and handling
 */

export const apiWrapper = {
    /**
     * POST /api/records - Create new record with optional file
     */
    createRecord: async (type, data, photoFile = null) => {
        const context = `createRecord(${type})`;
        logRequest("POST", "/records", { type, dataKeys: Object.keys(data || {}) });

        // Validate inputs
        if (!type || typeof type !== "string") {
            throw new Error("Type harus berupa string");
        }
        if (!data || typeof data !== "object") {
            throw new Error("Data harus berupa object");
        }

        // Validate file if provided
        if (photoFile) {
            const fileValidation = validateFile(photoFile);
            if (!fileValidation.valid) {
                const err = new Error(fileValidation.error);
                logError(context, err, { file: photoFile.name });
                throw err;
            }
        }

        try {
            const fd = new FormData();
            fd.append("type", type);
            fd.append("data", JSON.stringify(data));
            if (photoFile) {
                fd.append("photo", photoFile);
            }

            const res = await api.post("/records", fd);
            logResponse("POST", "/records", res.status, res.data);
            return res.data;
        } catch (error) {
            logError(context, error, { type, dataKeys: Object.keys(data) });
            throw error;
        }
    },

    /**
     * PUT /api/records/{id} - Update record with optional file
     */
    updateRecord: async (id, data, photoFile = null) => {
        const context = `updateRecord(${id})`;
        logRequest("POST", `/records/${id}`, { dataKeys: Object.keys(data || {}) });

        if (!id || typeof id !== "string") {
            throw new Error("ID tidak valid");
        }
        if (!data || typeof data !== "object") {
            throw new Error("Data harus berupa object");
        }

        if (photoFile) {
            const fileValidation = validateFile(photoFile);
            if (!fileValidation.valid) {
                const err = new Error(fileValidation.error);
                logError(context, err, { file: photoFile.name });
                throw err;
            }
        }

        try {
            const fd = new FormData();
            fd.append("data", JSON.stringify(data));
            if (photoFile) {
                fd.append("photo", photoFile);
            }

            const res = await api.post(`/records/${id}`, fd);
            logResponse("POST", `/records/${id}`, res.status, res.data);
            return res.data;
        } catch (error) {
            logError(context, error, { id, dataKeys: Object.keys(data) });
            throw error;
        }
    },

    /**
     * List records of a type
     */
    listRecords: async (type, limit = 1000) => {
        const context = `listRecords(${type})`;
        logRequest("GET", "/records", { type, limit });

        try {
            const res = await api.get("/records", { params: { type, limit } });
            logResponse("GET", "/records", res.status, { count: res.data?.length || 0 });
            return res.data;
        } catch (error) {
            logError(context, error, { type });
            throw error;
        }
    },

    /**
     * Delete a record
     */
    deleteRecord: async (id) => {
        const context = `deleteRecord(${id})`;
        logRequest("DELETE", `/records/${id}`, {});

        try {
            const res = await api.delete(`/records/${id}`);
            logResponse("DELETE", `/records/${id}`, res.status, res.data);
            return res.data;
        } catch (error) {
            logError(context, error, { id });
            throw error;
        }
    },
};

export default apiWrapper;
