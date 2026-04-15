import axios from 'axios';

// Đổi port theo đúng backend của bạn
const baseURL = process.env.VUE_APP_API_URL || 'http://localhost:5000/api/helpdesk/';

const handleError = fn => (...params) =>
  fn(...params).catch(error => {
    console.error(error);
  });

export const api = {
  getTicket: handleError(async id => {
    const res = await axios.get(baseURL + id);
    return res.data; // return object response from server { success: true, data: ... }
  }),
  getTickets: handleError(async () => {
    const res = await axios.get(baseURL);
    return res.data;
  }),
  deleteTicket: handleError(async id => {
    const res = await axios.delete(baseURL + id);
    return res.data;
  }),
  createTicket: handleError(async payload => {
    const res = await axios.post(baseURL, payload);
    return res.data;
  }),
  updateTicket: handleError(async payload => {
    const res = await axios.put(baseURL + payload._id, payload);
    return res.data;
  })
};
