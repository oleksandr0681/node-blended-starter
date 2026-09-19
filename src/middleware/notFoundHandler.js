export default function notFoundHandler(request, response) {
  response.status(404).json({ message: 'Route not found.' });
}
