import axios from 'axios';

export const register = async (userData) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL_BASE}/api/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL_BASE}/api/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    // Return error response data if available, otherwise throw
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const getExpenses = async ({token, attributes}) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL_BASE}/api/expenseByAttribute`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: attributes
    });
    
    // Transform data: expenses are negative, payments are positive
    const expenses = response.data.expenses || [];
    return expenses.map(item => ({
      ...item,
      amount: item.expense ? -Math.abs(item.amount) : Math.abs(item.amount)
    }));
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

export const getPropertyById = async ({token, propertyId}) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL_BASE}/api/getPropertyById`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        propertyId: propertyId
      }
    });
    // Extract the property from the array and include owner info
    const property = response.data.property && Array.isArray(response.data.property) 
      ? response.data.property[0] 
      : response.data.property;
    
    return {
      ...property,
      owner: response.data.owner
    };
  } catch (error) {
    console.error("Error fetching property:", error);
    throw error;
  }
};
export const createExpense = async ({ token, expenseData }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL_BASE}/api/expense`, expenseData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
};

export const addMileage = async ({ token, mileageData }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL_BASE}/api/addMileage`, mileageData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error adding mileage:", error);
    throw error;
  }
};

export const getMileage = async ({ token, propertyId }) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL_BASE}/api/getMileage`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        propertyId: propertyId
      }
    });
    
    // API returns the array directly, or wrapped in .mileages or .data
    const mileages = Array.isArray(response.data) 
      ? response.data 
      : response.data.mileages || response.data.data || [];
    
    return mileages;
  } catch (error) {
    console.error("Error fetching mileage:", error);
    throw error;
  }
};

// Reservation API calls
export const createReservation = async ({token, reservationData}) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL_BASE}/api/createReservation`, reservationData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};

export const updateReservation = async ({token, reservationData}) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL_BASE}/api/updateReservation`, reservationData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating reservation:", error);
    throw error;
  }
};

export const deleteReservation = async ({token, reservationId}) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL_BASE}/api/deleteReservation`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        reservationId: reservationId
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting reservation:", error);
    throw error;
  }
};

export const getUsersByPropertyId = async ({token, propertyId}) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL_BASE}/api/AllUserByPropertyId`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        propertyId: propertyId
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users by property ID:", error);
    throw error;
  }
};

export const getAllReservationsByPropertyId = async ({token, propertyId}) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL_BASE}/api/getAllReservationsByPropertyId`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        propertyId: propertyId
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reservations by property ID:", error);
    throw error;
  }
};

export const getAllEventsByProperty = async ({token, propertyId}) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL_BASE}/api/getAllEventsByProperty/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching events by property:", error);
    throw error;
  }
};
export const updateInvoice = async ({token, invoiceId, invoiceData}) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL_BASE}/api/UpdateInvoice?invoiceId=${invoiceId}`, invoiceData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

export const deleteInvoice = async ({token, invoiceId}) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL_BASE}/api/DeleteInvoiceByInvoiceId?invoiceId=${invoiceId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};
export const createNewInvoice = async ({token, invoiceData}) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL_BASE}/api/createNewInvoice`, invoiceData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const getInvoicesByProperty = async ({token, propertyId}) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL_BASE}/api/GetAllInvoicesByPropertyId?propertyId=${propertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return Array.isArray(response.data) ? response.data : response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};
export const getNotPaidInvoicesByProperty = async ({token, propertyId}) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL_BASE}/api/GetAllNotPaidInvoicesByPropertyId?propertyId=${propertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return Array.isArray(response.data) ? response.data : response.data;
  } catch (error) {
    console.error("Error fetching unpaid invoices:", error);
    throw error;
  }
};

export const deleteTransaction = async ({token, id}) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL_BASE}/api/DeleteTransaction`, {
      params: {
        id: parseInt(id)
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};