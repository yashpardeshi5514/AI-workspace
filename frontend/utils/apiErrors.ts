// API error handling utilities
export class APIError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: any): APIError => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 401) {
      return new APIError(401, 'UNAUTHORIZED', 'Session expired. Please log in again.');
    }

    if (status === 403) {
      return new APIError(403, 'FORBIDDEN', 'You do not have permission to access this resource.');
    }

    if (status === 404) {
      return new APIError(404, 'NOT_FOUND', 'The requested resource was not found.');
    }

    if (status === 409) {
      return new APIError(409, 'CONFLICT', data.message || 'This resource already exists.');
    }

    if (status === 422) {
      return new APIError(
        422,
        'VALIDATION_ERROR',
        'Please check your input and try again.',
        data.details
      );
    }

    if (status === 429) {
      return new APIError(429, 'RATE_LIMITED', 'Too many requests. Please try again later.');
    }

    if (status >= 500) {
      return new APIError(
        status,
        'SERVER_ERROR',
        'Server error. Please try again later.'
      );
    }

    return new APIError(
      status,
      data.code || 'ERROR',
      data.message || 'An error occurred'
    );
  }

  if (error.request) {
    return new APIError(
      0,
      'NETWORK_ERROR',
      'Network error. Please check your connection.'
    );
  }

  return new APIError(0, 'UNKNOWN_ERROR', error.message || 'An unknown error occurred');
};

export const getUserFriendlyError = (error: APIError): string => {
  const messages: Record<string, string> = {
    UNAUTHORIZED: 'Your session has expired. Please log in again.',
    FORBIDDEN: 'You do not have permission for this action.',
    NOT_FOUND: 'Resource not found.',
    CONFLICT: 'This item already exists.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    RATE_LIMITED: 'Too many requests. Please wait a moment before trying again.',
    SERVER_ERROR: 'Server error. Our team has been notified.',
    NETWORK_ERROR: 'Connection problem. Please check your internet.',
  };

  return messages[error.code] || error.message;
};
