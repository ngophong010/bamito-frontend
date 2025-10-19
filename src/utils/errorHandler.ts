/**
 * Handles API errors and provides consistent error messages
 * @param error The error object from the API call
 * @param defaultMessage Default message to show if error is not handled
 */
export const handleApiError = (error: any, defaultMessage: string = 'An error occurred'): Error => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const message = error.response.data?.message || defaultMessage;
        return new Error(message);
    } else if (error.request) {
        // The request was made but no response was received
        return new Error('No response from server. Please check your connection.');
    } else {
        // Something happened in setting up the request that triggered an Error
        return new Error(error.message || defaultMessage);
    }
};