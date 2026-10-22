const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || 'Something went wrong');
  return result;
}

export const getEvents = () => request('/events');
export const getEvent = (id) => request(`/events/${id}`);
export const createEvent = (data) => request('/events', { method: 'POST', body: JSON.stringify(data) });
export const updateEvent = (id, data) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteEvent = (id) => request(`/events/${id}`, { method: 'DELETE' });
export const getDashboard = () => request('/events/dashboard');
export const registerForEvent = (data) => request('/registrations', { method: 'POST', body: JSON.stringify(data) });
export const getRegistrations = () => request('/registrations');
