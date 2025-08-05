import axios from './httpRequester';

const path = '/cart';

export const addItem = itemId => {
  return axios.post(path, { itemId }).catch(e => e.response);
}

export const getItems = () => {
  return axios.get(path).catch(e => e.response);
}

export const removeItem = cartId => {
  return axios.delete(`${path}/${cartId}`).catch(e => e.response);
}

export const removeCart = () => {
  return axios.delete(path).catch(e => e.response);
}