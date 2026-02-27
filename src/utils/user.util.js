const BASE_URL = import.meta.env.VITE_API_URL;
const USERS_BASE = `${BASE_URL}/api/`;

const getToken = () =>
  JSON.parse(localStorage.getItem("user"))?.data?.token;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
});

/* GET USERS */
export const getUsers = async () => {
  const res = await fetch(`${USERS_BASE}users`, {
    headers: getHeaders()
  });
  return await res.json();
};

/* CREATE USER */
export const createUser = async (payload) => {
  const res = await fetch(`${USERS_BASE}auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  console.log('API response status:', res);
  if (!res.ok) throw await res.json();
  return await res.json();
};

/* DISABLE USER */
export const disableUser = async (id) => {
  const payload = { is_active: false };
  const res = await fetch(`${USERS_BASE}users/delete/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  return await res.json();
};

/* UPDATE USER */
export const updateUser = async (id, payload) => {
  const res = await fetch(`${USERS_BASE}/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  return await res.json();
};
