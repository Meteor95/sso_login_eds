import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { checkDatabase } from './middleware/checkDatabase';

const app = new Hono();
app.use(checkDatabase);
app.use(
    '*',
    cors({
      origin: 'http://localhost:12201',
      credentials: true,
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    })
  );

app.get('/', (c) => {
    return c.html('🚀Server REST API sudah berjalan.🚀<br>Hallo semua, ngapain kamu disini. Disini tidak ada apa apa!')
})
export default app;