import { formatDistance, parse } from 'date-fns';
import { postLinkEvent as apiPostLinkEvent } from './api';

export function pluralize(noun, count) {
  return count === 1 ? noun : `${noun}s`;
}

export function currencyFilter(value) {
  if (typeof value !== 'number') {
    return '-';
  }

  const isNegative = value < 0;
  const displayValue = value < 0 ? -value : value;
  return `${isNegative ? '-' : ''}$${displayValue
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1,')}`;
}

const months = [
  null,
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function formatDate(timestamp) {
  if (timestamp) {
    const [y, m, d] = timestamp.slice(0, 10).split('-');
    return `${months[+m]} ${d}, ${y}`;
  }

  return '';
}

export function diffBetweenCurrentTime(timestamp) {
  return formatDistance(new Date(), parse(timestamp), {
    addSuffix: true,
    includeSeconds: true,
  }).replace(/^(about|less than)\s/i, '');
}

export const logEvent = (eventName, metadata, error) => {
  console.log(`Link Event: ${eventName}`, metadata, error);
};

export const logSuccess = async (
  { institution, accounts, link_session_id },
  userId
) => {
  logEvent('onSuccess', {
    institution,
    accounts,
    link_session_id,
  });
  await apiPostLinkEvent({
    userId,
    link_session_id,
    type: 'success',
  });
};

export const logExit = async (
  error,
  { institution, status, link_session_id, request_id },
  userId
) => {
  logEvent(
    'onExit',
    {
      institution,
      status,
      link_session_id,
      request_id,
    },
    error
  );

  const eventError = error || {};
  await apiPostLinkEvent({
    userId,
    link_session_id,
    request_id,
    type: 'exit',
    ...eventError,
    status,
  });
};
