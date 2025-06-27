import { createServer } from 'vite';
import { createServer as createHttpServer } from 'http';

export async function startViteServer() {
  const vite = await createServer({
    server: {
      middlewareMode: true,
      hmr: { server: createHttpServer() },
      allowedHosts: true
    }
  });

  return vite.middlewares;
}
