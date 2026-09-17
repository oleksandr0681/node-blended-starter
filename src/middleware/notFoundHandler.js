export default function notFoundHandler(request, response) {
  response.status(404).json({ messate: 'Route not found.' });
}
