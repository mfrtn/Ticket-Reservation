interface ErrorI extends Error {
  code?: number;
  statusCode?: number;
}

export default ErrorI;
