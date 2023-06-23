import axios from 'axios';
import React from 'react';
import { toast } from 'react-toastify';
import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';

import { DuplicateItemToastMessage } from '../components';

const baseURL = '/';

const api = axios.create({
  baseURL,
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: 0,
  },
});

export default api;

export const getLoginUser = (username) =>
  api.post('/sessions', { username });

export const addAsset = (userId, description, value) =>
  api.post('/assets', { userId, description, value });

export const getAssetsByUser = (userId) => api.get(`/assets/${userId}`);

export const deleteAssetByAssetId = (assetId) =>
  api.delete(`/assets/${assetId}`);

export const getUsers = () => api.get('/users');

export const getUserById = (userId) => api.get(`/users/${userId}`);

export const addNewUser = (username) =>
  api.post('/users', { username });

export const deleteUserById = (userId) =>
  api.delete(`/users/${userId}`);

export const getItemById = (id) => api.get(`/items/${id}`);

export const getItemsByUser = (userId) =>
  api.get(`/users/${userId}/items`);

export const deleteItemById = (id) => api.delete(`/items/${id}`);

export const setItemState = (itemId, status) =>
  api.put(`items/${itemId}`, { status });

export const setItemToBadState = (itemId) =>
  api.post('/items/sandbox/item/reset_login', { itemId });

export const getLinkToken = (userId, itemId) =>
  api.post(`/link-token`, {
    userId,
    itemId,
  });

export const getAccountsByItem = (itemId) =>
  api.get(`/items/${itemId}/accounts`);

export const getAccountsByUser = (userId) =>
  api.get(`/users/${userId}/accounts`);

export const getTransactionsByAccount = (accountId) =>
  api.get(`/accounts/${accountId}/transactions`);

export const getTransactionsByItem = (itemId) =>
  api.get(`/items/${itemId}/transactions`);

export const getTransactionsByUser = (userId) =>
  api.get(`/users/${userId}/transactions`);

export const getInstitutionById = (instId) =>
  api.get(`/institutions/${instId}`);

export const postLinkEvent = (event) => api.post(`/link-event`, event);

export const exchangeToken = async (
  publicToken,
  institution,
  accounts,
  userId
) => {
  try {
    const { data } = await api.post('/items', {
      publicToken,
      institutionId: institution.institution_id,
      userId,
      accounts,
    });
    return data;
  } catch (err) {
    const { response } = err;
    if (response && response.status === 409) {
      toast.error(
        <DuplicateItemToastMessage institutionName={institution.name} />
      );
    } else {
      toast.error(`Error linking ${institution.name}`);
    }
  }
};
