import {isImmutable} from 'immutable';
import configApi from '../config/api';

/**
 * Get method
 * @param url
 * @returns {Promise<R>}
 */
const get = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    let baseURL = configApi.API_ESKIZI + '/wp-json' + url;
    fetch(baseURL, {
      ...options,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: undefined,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code !== 200) {
          reject(new Error(data.message));
        } else {
          resolve(data.data);
        }
      })
      .catch((error) => {
        return error;
      });
  });
};

/**
 * Post method
 * @param url
 * @param data
 * @param method
 * @returns {Promise<R>}
 */
const post = (url, data, method = 'POST') => {
  return new Promise((resolve, reject) => {
    // To JS Object
    if (isImmutable(data)) {
      data = data.toJS();
    }

    let baseURL = configApi.API_ESKIZI + '/wp-json' + url;

    fetch(baseURL, {
      method: method,
      headers: {
        Accept: 'application/json',
        Authorization: null,
        'Content-Type': 'application/json',
      },
      body: typeof data === 'object' ? JSON.stringify(data) : null,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code !== 200) {
          reject(new Error(result.message));
        } else {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default {
  get,
  post,
  put: (url, data) => post(url, data, 'PUT'),
};
