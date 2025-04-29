import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { checkDatabase } from '@middlewares/checkDatabase';
import { authRoutes } from '@routes/auth/auth-routes';
const app = new Hono();
app.use(checkDatabase);
app.use(
    '*',
    cors({
      origin: 'http://localhost:12202',
      credentials: true,
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    })
  );
const apiPrefix = process.env.BASE_URL_API || 'api/v1';
app.route(`${apiPrefix}auth`, authRoutes);
app.get('/', (c) => {
    return c.html('🚀Server REST API sudah berjalan.🚀<br>Hallo semua, ngapain kamu disini. Disini tidak ada apa apa!')
})
export default app;