import app from './app';

const PORT = parseInt(process.env.PORT || '12202');
console.log(`🚀 Server running on port ${PORT}`);
export default {
  port: PORT,
  fetch: app.fetch
};