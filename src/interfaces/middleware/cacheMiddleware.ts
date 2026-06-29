import { Request, Response, NextFunction } from 'express';
import { RedisCacheService } from '../../infrastructure/cache/RedisCacheService';

/** Cachea respuestas GET en Redis.
 *  Key = `refugios:{req.originalUrl}`.
 *  Si hay cache hit → responde desde Redis sin ejecutar el handler.
 *  Si miss → ejecuta el handler, intercepta res.json, guarda en Redis.
 *  Agrega header X-Cache: HIT | MISS para debugging.
 */
export function cache(ttl: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const cacheService = RedisCacheService.getInstance();

    if (!cacheService.isConnected) {
      next();
      return;
    }

    const key = `refugios:${req.originalUrl}`;

    cacheService
      .get(key)
      .then((cached) => {
        if (cached) {
          res.set('X-Cache', 'HIT');
          res.json(JSON.parse(cached));
          return;
        }

        // Cache miss: interceptamos res.json para capturar la respuesta
        const originalJson = res.json.bind(res);
        res.json = function (body: Record<string, unknown>) {
          res.set('X-Cache', 'MISS');
          cacheService.set(key, JSON.stringify(body), ttl).catch(() => {});
          return originalJson(body);
        };

        next();
      })
      .catch(() => {
        next();
      });
  };
}

/** Invalida patrones de cache después de una escritura exitosa (2xx).
 *  Ej: invalidateCache('refugios:*') borra todas las claves que empiecen con 'refugios:'.
 */
export function invalidateCache(...patterns: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const cacheService = RedisCacheService.getInstance();

    if (!cacheService.isConnected) {
      next();
      return;
    }

    const originalJson = res.json.bind(res);
    res.json = function (body: Record<string, unknown>) {
      // Solo invalidamos si la operación fue exitosa
      if (res.statusCode >= 200 && res.statusCode < 300) {
        for (const pattern of patterns) {
          cacheService.delByPattern(pattern).catch(() => {});
        }
      }
      return originalJson(body);
    };

    next();
  };
}
