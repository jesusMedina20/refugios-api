import Redis from 'ioredis';

export class RedisCacheService {
  private static instance: RedisCacheService | null = null;
  private client: Redis | null = null;
  private enabled = false;

  private constructor() {
    const url = process.env.REDIS_URL;

    if (!url) {
      console.warn('[CACHE] REDIS_URL no definida — cache desactivado');
      return;
    }

    this.client = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times: number) {
        if (times > 3) return null; // se rinde después de 3 intentos
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    this.client.on('connect', () => {
      console.log('[CACHE] Conectando a Redis…');
    });

    this.client.on('ready', () => {
      this.enabled = true;
      console.log('[CACHE] Redis conectado y listo');
    });

    this.client.on('error', (err) => {
      this.enabled = false;
      console.error('[CACHE] Error de Redis:', err.message);
    });

    this.client.on('close', () => {
      this.enabled = false;
      console.warn('[CACHE] Conexión Redis cerrada');
    });

    this.client.connect().catch((err: Error) => {
      this.enabled = false;
      console.warn('[CACHE] No se pudo conectar a Redis:', err.message);
    });
  }

  /** Obtiene la instancia singleton */
  static getInstance(): RedisCacheService {
    if (!RedisCacheService.instance) {
      RedisCacheService.instance = new RedisCacheService();
    }
    return RedisCacheService.instance;
  }

  get isConnected(): boolean {
    return this.enabled;
  }

  /** Obtiene un valor del cache. Retorna null si no existe o si Redis no está disponible. */
  async get(key: string): Promise<string | null> {
    if (!this.enabled || !this.client) return null;

    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }

  /** Guarda un valor en cache con TTL en segundos. */
  async set(key: string, value: string, ttl: number): Promise<void> {
    if (!this.enabled || !this.client) return;

    try {
      await this.client.setex(key, ttl, value);
    } catch {
      // silencioso — el cache es optional
    }
  }

  /** Elimina todas las claves que matcheen un patrón (ej: 'refugios:*') */
  async delByPattern(pattern: string): Promise<void> {
    if (!this.enabled || !this.client) return;

    try {
      let cursor = '0';
      do {
        const [nextCursor, keys] = await this.client.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          100
        );
        cursor = nextCursor;

        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } while (cursor !== '0');
    } catch {
      // silencioso
    }
  }

  /** Cierra la conexión Redis (para graceful shutdown) */
  async quit(): Promise<void> {
    if (this.client) {
      this.enabled = false;
      await this.client.quit();
      console.log('[CACHE] Conexión Redis cerrada');
    }
  }
}
