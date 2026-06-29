# Refugios API

API REST pública con información de refugios y alojamientos para damnificados por los **terremotos del 24 de junio de 2026 en Venezuela** (magnitudes 7,2 y 7,5).

Los datos provienen de fuentes oficiales y la sociedad civil organizada, recolectados durante la emergencia en los estados La Guaira, Miranda, Aragua y el Distrito Capital.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js 20+ |
| Lenguaje | TypeScript (strict) |
| Framework | Express |
| Base de datos | MongoDB con Mongoose |
| Validación | Zod |
| Arquitectura | Repository Pattern |

---

## Setup local

```bash
# Requisitos: Node.js 20+ y MongoDB (local, Docker o Atlas)

git clone https://github.com/jesusMedina20/refugios-api
cd refugios-api
npm install
cp .env.example .env
```

Editar `.env` con la URI de MongoDB:

``
```

```bash
# Sembrar la base de datos con los 15 refugios reales
npm run seed

# Iniciar en modo desarrollo (hot-reload)
npm run dev

# Build + producción
npm run build
npm start
```

---

## Deploy

La API está desplegada en **Render** con base de datos en **MongoDB Atlas**:

```
https://refugios-api.onrender.com
```

> ⚠️ El plan gratis de Render duerme el servicio tras 15 minutos de inactividad. La primera solicitud después de ese período puede demorar entre 30 y 50 segundos (cold start).

---

## Endpoints

### `GET /health`

Health check del servicio.

```json
{
  "status": "ok",
  "timestamp": "2026-06-29T17:29:56.636Z"
}
```

---

### `GET /refugios`

Lista todos los refugios. Soporta filtros opcionales por query params.

| Parámetro | Tipo | Ejemplo |
|-----------|------|---------|
| `estado` | string | `La Guaira` |
| `tipo` | string | `refugio`, `punto_resguardo`, `centro_acopio` |
| `activo` | boolean | `true`, `false` |

```
GET /refugios
GET /refugios?estado=La+Guaira
GET /refugios?tipo=refugio
GET /refugios?estado=Miranda&tipo=punto_resguardo
```

```json
{
  "success": true,
  "data": [
    {
      "id": "665a1b2c3d4e5f6a7b8c9d0e",
      "nombre": "Polideportivo José María Vargas",
      "ubicacion": {
        "estado": "La Guaira",
        "municipio": "Vargas",
        "parroquia": "La Guaira",
        "direccion": "Centro de La Guaira"
      },
      "tipo": "centro_acopio",
      "capacidad": null,
      "ocupacion_actual": null,
      "servicios": null,
      "coordinador": null,
      "contacto": null,
      "activo": true,
      "fuente": "oficial",
      "created_at": "2026-06-29T17:00:00.000Z",
      "updated_at": "2026-06-29T17:00:00.000Z"
    }
  ],
  "count": 15
}
```

---

### `GET /refugios/:id`

Obtiene un refugio por su ID de MongoDB.

```
GET /refugios/665a1b2c3d4e5f6a7b8c9d0e
```

```json
{
  "success": true,
  "data": {
    "id": "665a1b2c3d4e5f6a7b8c9d0e",
    "nombre": "Complejo Cultural y Deportivo Guayana Esequiba",
    "ubicacion": {
      "estado": "Distrito Capital",
      "municipio": "Libertador",
      "parroquia": "San Bernardino",
      "direccion": "Parroquia San Bernardino, Caracas"
    },
    "tipo": "refugio",
    "activo": true,
    "fuente": "oficial"
  }
}
```

---

### `POST /refugios`

Crea un nuevo refugio. Solo `nombre` y `ubicacion` son obligatorios; el resto puede completarse después vía PATCH.

```
POST /refugios
Content-Type: application/json
```

```json
{
  "nombre": "Nuevo Refugio",
  "ubicacion": {
    "estado": "Miranda",
    "municipio": "Sucre",
    "parroquia": "Petare",
    "direccion": "Av. Principal, Edificio donado"
  },
  "tipo": "refugio",
  "fuente": "sociedad_civil"
}
```

```json
{
  "success": true,
  "data": {
    "id": "665a1b2c3d4e5f6a7b8c9d0f",
    "nombre": "Nuevo Refugio",
    "ubicacion": {
      "estado": "Miranda",
      "municipio": "Sucre",
      "parroquia": "Petare",
      "direccion": "Av. Principal, Edificio donado"
    },
    "tipo": "refugio",
    "capacidad": null,
    "ocupacion_actual": null,
    "servicios": null,
    "coordinador": null,
    "contacto": null,
    "activo": true,
    "fuente": "sociedad_civil",
    "created_at": "2026-06-29T18:00:00.000Z",
    "updated_at": "2026-06-29T18:00:00.000Z"
  }
}
```

---

### `PATCH /refugios/:id`

Actualización parcial de un refugio. Solo se envían los campos a modificar.

```
PATCH /refugios/665a1b2c3d4e5f6a7b8c9d0f
Content-Type: application/json
```

```json
{
  "capacidad": 300,
  "ocupacion_actual": 150,
  "servicios": ["alimentacion", "agua_potable", "atencion_medica"],
  "coordinador": "Protección Civil",
  "contacto": "+582123456789"
}
```

---

## Schema

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `nombre` | `string` | ✅ | Nombre del refugio (3–200 caracteres) |
| `ubicacion.estado` | `string` | ✅ | Estado del país |
| `ubicacion.municipio` | `string` | ✅ | Municipio |
| `ubicacion.parroquia` | `string` | ✅ | Parroquia |
| `ubicacion.direccion` | `string` | ✅ | Dirección de referencia |
| `tipo` | `enum` | ❌ | `refugio`, `punto_resguardo` o `centro_acopio` |
| `capacidad` | `number` | ❌ | Capacidad máxima de personas |
| `ocupacion_actual` | `number` | ❌ | Personas alojadas actualmente |
| `servicios` | `string[]` | ❌ | Lista de servicios disponibles |
| `coordinador` | `string` | ❌ | Persona o entidad responsable |
| `contacto` | `string` | ❌ | Teléfono de contacto |
| `activo` | `boolean` | ❌ | Si está operativo (default `true`) |
| `fuente` | `enum` | ❌ | `oficial` o `sociedad_civil` |

> Los campos marcados como ❌ se almacenan como `null` hasta que se completen con la información real.

---

## Formato de errores

Todas las respuestas de error tienen una estructura consistente:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Refugio con id 'abc123' no encontrado",
    "details": ["campo: mensaje de validación"]
  }
}
```

| Código | Significado | Status HTTP |
|--------|-------------|-------------|
| `NOT_FOUND` | El recurso no existe | 404 |
| `VALIDATION_ERROR` | Datos de entrada inválidos | 400 |
| `INTERNAL_ERROR` | Error interno del servidor | 500 |

---

## Datos iniciales (seed)

El seed incluye **15 refugios reales** activos durante la emergencia:

- **Caracas** (9): Guayana Esequiba, Estadio Chato Candela, IND, Ipostel, Liceo Andrés Bello, Parque Alí Primera, Parque Francisco de Miranda, Plaza Altamira, Plaza Bolívar de Chacao
- **La Guaira** (3): Polideportivo José María Vargas, Estadio García Carneiro, Cancha de Paz de Playa Grande
- **Maracay** (1): Estadio José Pérez Colmenares
- **Otros** (1): Sede de la Federación Venezolana de Fútbol (FVF)

Fuentes: prensa oficial, ONG Cecodap, reportes de El Diario, El Impulso, Infobae.

---

## Licencia

MIT — uso libre para fines humanitarios y de información pública.
