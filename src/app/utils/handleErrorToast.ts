import toast from "react-hot-toast";

function parseValidationErrors(errors: any[]): string {
  return errors
    .map((err) => {
      if (err.constraints) {
        return Object.values(err.constraints).join(', ');
      }
      if (err.children && err.children.length > 0) {
        return parseValidationErrors(err.children);
      }
      return '';
    })
    .join(', ');
}

export function handleErrorToast(error: any): void {
  const rawErrors = error?.response?.data?.message;

  let errorMessage = 'Error desconocido';

  if (Array.isArray(rawErrors)) {
    errorMessage = parseValidationErrors(rawErrors);
  } else if (typeof rawErrors === 'string') {
    errorMessage = rawErrors;
  } else if (error?.message) {
    errorMessage = error.message;
  }

  toast.error(errorMessage);
}