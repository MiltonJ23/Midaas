/**
 * Wraps API calls with standardized error handling
 * @param apiFn The API function to execute
 * @param defaultErrorMessage Fallback error message
 * @param defaultSuccessMessage Fallback success message
 */
export async function withErrorHandling<T>(
  apiFn: () => Promise<any>,
  defaultErrorMessage: string,
  defaultSuccessMessage?: string,
): Promise<{ data?: T; error?: string }> {
  try {
    const response = await apiFn();

    // Handle successful response
    if (response.status >= 200 && response.status < 300) {
      console.log("API Success:", response);
      // Add message to the response data if it doesn't exist
      if (response.data && !response.data.message && defaultSuccessMessage) {
        response.data.message = defaultSuccessMessage;
      }

      return { data: response.data };
    }

    // Handle 402 as data (use actual response data)
    if (response.status === 402) {
      return { data: response.data as T };
    }

    // Handle error responses with status codes
    const errorMessage =
      response.data?.message ||
      response.data?.Message ||
      response.data?.Message?.property_id[0] ||
      response.data?.detail ||
      defaultErrorMessage;

    return { error: errorMessage };
  } catch (error: any) {
    // Handle 402 specifically for "no active plan" (treat as data to prevent crashes)
    if (error.response?.status === 402) {
      return {
        data: error.response.data as T,
      };
    }

    console.error(`API Error:`, error);

    // Handle field validation errors (400 status with field-specific errors)
    if (error.response?.status === 400 && error.response?.data) {
      const errorData = error.response.data;

      // Handle field validation errors inside Message object
      if (
        typeof errorData === "object" &&
        errorData.Message &&
        typeof errorData.Message === "object"
      ) {
        const fieldErrors: string[] = [];
        Object.keys(errorData.Message).forEach((field) => {
          const fieldError = errorData.Message[field];
          if (Array.isArray(fieldError)) {
            fieldErrors.push(...fieldError.map((err) => `${field}: ${err}`));
          } else if (typeof fieldError === "string") {
            fieldErrors.push(`${field}: ${fieldError}`);
          }
        });

        if (fieldErrors.length > 0) {
          return { error: fieldErrors.join("\n") };
        }
      }

      // Check if it's a field validation error object
      if (
        typeof errorData === "object" &&
        !errorData.Message &&
        !errorData.detail
      ) {
        const fieldErrors: string[] = [];

        // Extract field-specific errors
        Object.keys(errorData).forEach((field) => {
          const fieldError = errorData[field];
          if (Array.isArray(fieldError)) {
            fieldErrors.push(...fieldError.map((err) => `${field}: ${err}`));
          } else if (typeof fieldError === "string") {
            fieldErrors.push(`${field}: ${fieldError}`);
          }
        });

        console.log("");

        if (fieldErrors.length > 0) {
          return { error: fieldErrors.join("\n") };
        }
      }
    }

    // Extract error message from axios error response
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.Message ||
      error.response?.data?.detail ||
      error.message ||
      defaultErrorMessage;

    // Special handling for 404 errors if needed
    if (error.response?.status === 404) {
      // You can customize the 404 error message here
      const notFoundMessage = errorMessage || "Resource not found";

      // Option 1: Return as error (recommended for most cases)
      return { error: notFoundMessage };

      // Option 2: Return as data with not found flag (uncomment if needed)
      // return {
      //   data: {
      //     message: notFoundMessage,
      //     notFound: true,
      //     status: 404
      //   } as unknown as T
      // };
    }

    return { error: errorMessage };
  }
}
