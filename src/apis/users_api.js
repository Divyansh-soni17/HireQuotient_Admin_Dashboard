import axios from "axios";

const baseUrl = "https://hirequotient-backend.onrender.com/";

export const addUser = async (name, email, role) => {
  const config = { headers: { "Content-Type": "application/json" } };
  const { data } = await axios.post(
    baseUrl + "users/addUser",
    { name, email, role },
    config
  );
  return data;
};

export const updateUser = async (id, name, role) => {
  const config = { headers: { "Content-Type": "application/json" } };
  const { data } = await axios.put(
    baseUrl + `users/updateUser/${id}`,
    { name, role },
    config
  );
  return data;
};
export const deleteUser = async (id) => {
  const { data } = await axios.delete(baseUrl + `users/deleteUser/${id}`);
  return data;
};
export const getAllUsers = async () => {
  const { data } = await axios.get(baseUrl + `users/getUsers`);
  return data;
};
