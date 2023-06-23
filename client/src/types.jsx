// reserved for types

export const RouteInfo = {
  userId: '',
};

export const ItemType = {
  id: 0,
  plaid_item_id: '',
  user_id: 0,
  plaid_access_token: '',
  plaid_institution_id: '',
  status: '',
  created_at: '',
  updated_at: '',
};

export const AccountType = {
  id: 0,
  item_id: 0,
  user_id: 0,
  plaid_account_id: '',
  name: '',
  mask: '',
  official_name: '',
  current_balance: 0,
  available_balance: 0,
  iso_currency_code: '',
  unofficial_currency_code: '',
  type: '',
  subtype: '',
  created_at: '',
  updated_at: '',
};

export const TransactionType = {
  id: 0,
  account_id: 0,
  item_id: 0,
  user_id: 0,
  plaid_transaction_id: '',
  plaid_category_id: '',
  category: '',
  subcategory: '',
  type: '',
  name: '',
  amount: 0,
  iso_currency_code: '',
  unofficial_currency_code: '',
  date: '',
  pending: false,
  account_owner: '',
  created_at: '',
  updated_at: '',
};

export const AssetType = {
  id: 0,
  user_id: 0,
  value: 0,
  description: '',
  created_at: '',
  updated_at: '',
};

export const UserType = {
  id: 0,
  username: null,
  created_at: '',
  updated_at: '',
};
