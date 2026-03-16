export function isNetworkError(error: Error): boolean {
  return (
    error.message.includes('net::ERR_FAILED') ||
    error.message.includes('net::ERR_CONNECTION') ||
    error.message.includes('NetworkError') ||
    error.message.includes('Timeout')
  );
}
