import axios from 'axios';

const API_BASE = '/api';

export async function fetchLeads(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.state) params.append('state', filters.state);
  if (filters.minScore) params.append('minScore', filters.minScore);

  const response = await axios.get(`${API_BASE}/leads?${params}`);
  return response.data;
}

export async function fetchLead(id) {
  const response = await axios.get(`${API_BASE}/leads/${id}`);
  return response.data;
}

export async function importLeads({ state, maxResults }) {
  const response = await axios.post(`${API_BASE}/leads/import`, {
    state,
    maxResults
  });
  return response.data;
}

export async function enrichLead(id) {
  const response = await axios.post(`${API_BASE}/leads/${id}/enrich`);
  return response.data;
}

export async function enrichAllLeads() {
  const response = await axios.post(`${API_BASE}/leads/enrich-all`);
  return response.data;
}

export async function updateLeadStatus(id, status) {
  const response = await axios.patch(`${API_BASE}/leads/${id}/status`, { status });
  return response.data;
}

export async function updateLeadNotes(id, notes) {
  const response = await axios.patch(`${API_BASE}/leads/${id}/notes`, { notes });
  return response.data;
}
