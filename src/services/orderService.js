import axios from './httpRequester';

const path = '/order';

export const addOrder = args => {
  return axios.post(path, args).catch(e => e.response);
};

export const getOrders = () => {
  return axios.get(path).catch(e => e.response);
};

export const getOrder = orderId => {
  return axios.get(`${path}/${orderId}`).catch(e => e.response);
}