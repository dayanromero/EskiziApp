import request from 'src/utils/fetchEskizi';

/**
 * Fetch place data
 * @returns {*}
 */

export const getPlaces = (query, options = {}) =>
  request.get('/eskizi/places/all', options);

/**
 * rate place
 * @param data
 * @returns {*}
 */
export const ratePlace = (id, rate) =>
  request.post(`/eskizi/places/updated/postId/${id}/ratingScore/${rate}`, {});
