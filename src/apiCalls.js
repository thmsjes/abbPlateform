import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.patch['Content-Type'] = 'application/json';
axios.defaults.headers.common.Accept = 'application/json';

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
    if (!token) {
      throw new Error('Missing auth token for expense request');
    }

    const rawPropertyId = attributes?.PropertyId ?? attributes?.propertyId;
    const parsedPropertyId = parseInt(rawPropertyId, 10);
    if (Number.isNaN(parsedPropertyId) || parsedPropertyId <= 0) {
      throw new Error('Invalid PropertyId for expense request');
    }

    const startDate = attributes?.startDate || attributes?.StartDate || attributes?.dateFrom || '';
    const endDate = attributes?.endDate || attributes?.EndDate || attributes?.dateTo || '';
    const category = attributes?.category || attributes?.Category || '';

    const payload = {
      startDate,
      endDate,
      category,
      propertyId: parsedPropertyId
    };

    const url = `${import.meta.env.VITE_API_URL_BASE}/api/expenseByAttribute`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    const response = await axios.post(url, payload, { headers });
    
    // Transform data: expenses are negative, payments are positive
    const expenses = Array.isArray(response.data)
      ? response.data
      : (response.data.expenses || response.data.data || []);
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
    const requestConfig = {
      params: {
        propertyId: propertyId
      }
    };

    if (token) {
      requestConfig.headers = {
        Authorization: `Bearer ${token}`
      };
    }

    const response = await axios.get(`${import.meta.env.VITE_API_URL_BASE}/api/getPropertyById`, requestConfig);
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

export const getUserById = async ({ token, id }) => {
  try {
    const requestConfig = {
      params: {
        id
      }
    };

    if (token) {
      requestConfig.headers = {
        Authorization: `Bearer ${token}`
      };
    }

    const response = await axios.get(`${import.meta.env.VITE_API_URL_BASE}/api/User`, requestConfig);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const createProperty = async ({ token, propertyData }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL_BASE}/api/createProperty`, propertyData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

export const createExpense = async ({ token, expenseData }) => {
  try {
    const payload = {
      description: expenseData?.description || '',
      amount: Number(expenseData?.amount || 0),
      date: expenseData?.date,
      category: expenseData?.category || '',
      propertyId: Number(expenseData?.propertyId || 0)
    };

    const response = await axios.post(`${import.meta.env.VITE_API_URL_BASE}/api/expense`, payload, {
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
    const parsedMileage = Number(mileageData?.mileage || 0);
    const parsedPropertyId = parseInt(mileageData?.propertyId, 10);

    if (Number.isNaN(parsedPropertyId) || parsedPropertyId <= 0) {
      throw new Error('Invalid propertyId for mileage request');
    }

    const payload = {
      mileage: Number.isNaN(parsedMileage) ? 0 : parsedMileage,
      description: mileageData?.description || '',
      dateTimeInserted: mileageData?.dateTimeInserted || new Date().toISOString(),
      propertyId: parsedPropertyId,
      date: mileageData?.date || new Date().toISOString().split('T')[0]
    };

    const headers = {
      Accept: '*/*',
      'Content-Type': 'application/json'
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.post(`${import.meta.env.VITE_API_URL_BASE}/api/mileage`, payload, {
      headers
    });
    return response.data;
  } catch (error) {
    console.error("Error adding mileage:", error);
    throw error;
  }
};

export const getMileage = async ({ token, propertyId }) => {
  try {
    const parsedPropertyId = parseInt(propertyId, 10);
    if (Number.isNaN(parsedPropertyId) || parsedPropertyId <= 0) {
      throw new Error('Invalid propertyId for mileage request');
    }

    const headers = {
      Accept: '*/*'
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get(`${import.meta.env.VITE_API_URL_BASE}/api/getMileage/${parsedPropertyId}`, {
      headers
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
    const url = `${import.meta.env.VITE_API_URL_BASE}/api/createReservation`;
    const response = await axios.post(url, reservationData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating reservation:", {
      url: `${import.meta.env.VITE_API_URL_BASE}/api/createReservation`,
      code: error?.code,
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data
    });
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

export const createEvent = async ({token, eventData}) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL_BASE}/api/createNewEvent`, eventData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const updateEvent = async ({token, eventData}) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL_BASE}/api/UpdateEvent`, eventData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async ({token, eventId}) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL_BASE}/api/deleteEvent/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting event:", error);
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
    console.log('deleteInvoice function received invoiceId:', invoiceId, 'Type:', typeof invoiceId);
    const url = `${import.meta.env.VITE_API_URL_BASE}/api/DeleteInvoiceByInvoiceId?invoiceId=${invoiceId}`;
    console.log('Full URL:', url);
    const response = await axios.delete(url, {
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

export const deleteMileage = async ({ token, mileageId }) => {
  try {
    const parsedMileageId = parseInt(mileageId, 10);
    if (Number.isNaN(parsedMileageId) || parsedMileageId <= 0) {
      throw new Error('Invalid mileageId for delete request');
    }

    const headers = {
      Accept: '*/*'
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.delete(`${import.meta.env.VITE_API_URL_BASE}/api/deleteMileage/${parsedMileageId}`, {
      headers
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting mileage:', error);
    throw error;
  }
};

export const getReservationByReference = async (bookingReference) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL_BASE}/api/getAllReservationsByReference`, {
      params: {
        confirmationNumber: bookingReference
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reservation:", error);
    throw error;
  }
};

// Review API Calls
export const getReviewsByPropertyId = async ({ token, propertyId }) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL_BASE}/api/getReviewsByPropertyId/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const getReviewById = async ({ token, reviewId }) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL_BASE}/api/getReviewById`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        reviewId: reviewId
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching review:", error);
    throw error;
  }
};

export const createReview = async ({ token, reviewData }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL_BASE}/api/createReview`, reviewData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const updateReview = async ({ token, reviewData }) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL_BASE}/api/updateReview`, reviewData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const deleteReview = async ({ token, reviewId, id }) => {
  try {
    const resolvedReviewId = reviewId ?? id;
    const response = await axios.delete(`${import.meta.env.VITE_API_URL_BASE}/api/deleteReview/${resolvedReviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};