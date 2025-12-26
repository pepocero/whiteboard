# Variables de Entorno para Vercel - Self-Hosted

**Dominio:** `whiteboard.carlinitools.com`

## Configuración Mínima (Solo Funcionalidad Básica)

Para una versión básica que funcione sin servicios externos:

```
VITE_APP_DISABLE_SENTRY=true
VITE_APP_ENABLE_TRACKING=false
```

**Nota:** Con esta configuración mínima, tendrás:
- ✅ Dibujo básico y guardado local
- ✅ Exportar/importar archivos
- ❌ Compartir enlaces (necesita backend)
- ❌ Colaboración en tiempo real (necesita WebSocket)
- ❌ Almacenamiento de imágenes en enlaces compartidos (necesita Firebase)
- ❌ Funciones de IA (necesita AI backend)

---

## Configuración Completa (Con Todos los Servicios)

### 1. URLs de Tu Dominio (Opcional - Solo si tienes servicios Plus)
```
VITE_APP_PLUS_APP=https://whiteboard.carlinitools.com
VITE_APP_PLUS_LP=https://whiteboard.carlinitools.com
```

**O deshabilitar completamente:**
```
VITE_APP_PLUS_APP=
VITE_APP_PLUS_LP=
```

### 2. Backend para Compartir Enlaces (Opcional)

Si quieres que los usuarios puedan compartir enlaces a sus dibujos, necesitas un backend propio:

```
VITE_APP_BACKEND_V2_GET_URL=https://api.carlinitools.com/v2
VITE_APP_BACKEND_V2_POST_URL=https://api.carlinitools.com/v2
```

**Nota:** Si no configuras esto, la función "Share Link" no funcionará.

### 3. Firebase para Almacenamiento de Archivos (Opcional)

Si quieres que las imágenes en los enlaces compartidos se guarden en la nube:

```
VITE_APP_FIREBASE_CONFIG={"apiKey":"tu-api-key","authDomain":"tu-proyecto.firebaseapp.com","projectId":"tu-proyecto","storageBucket":"tu-proyecto.appspot.com","messagingSenderId":"123456789","appId":"1:123456789:web:abcdef"}
```

**Cómo obtenerlo:**
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Ve a Project Settings → General
4. En "Your apps", crea una Web app si no tienes una
5. Copia la configuración y conviértela a JSON string

**Nota:** Si no configuras Firebase, las imágenes en enlaces compartidos no se guardarán.

### 4. WebSocket Server para Colaboración (Opcional)

Si quieres colaboración en tiempo real:

```
VITE_APP_WS_SERVER_URL=https://ws.carlinitools.com
```

**Nota:** Necesitas un servidor WebSocket compatible con Socket.IO. Si no lo configuras, la colaboración no funcionará.

### 5. AI Backend (Opcional)

Si quieres funciones de IA:

```
VITE_APP_AI_BACKEND=https://ai.carlinitools.com
```

**Nota:** Si no configuras esto, las funciones de IA no estarán disponibles.

### 6. Export Public Key (Opcional - Solo si usas Plus)
```
VITE_APP_PLUS_EXPORT_PUBLIC_KEY=tu_clave_publica
```

### 7. Portal URL (Opcional - Solo para workflow específico)
```
VITE_APP_PORTAL_URL=https://portal.carlinitools.com
```

---

## Variables de Configuración del Sistema

### Deshabilitar Sentry (Recomendado para self-hosted)
```
VITE_APP_DISABLE_SENTRY=true
```

### Habilitar Tracking (Opcional)
```
VITE_APP_ENABLE_TRACKING=false
```

### Variables de Desarrollo (No necesarias en producción)
```
VITE_APP_PORT=3000
VITE_APP_DEV_DISABLE_LIVE_RELOAD=false
VITE_APP_COLLAPSE_OVERLAY=false
VITE_APP_ENABLE_ESLINT=false
VITE_APP_ENABLE_PWA=false
```

---

## Variables Automáticas de Vercel

Estas variables son proporcionadas automáticamente por Vercel:

```
VERCEL_GIT_COMMIT_SHA  # Se usa para VITE_APP_GIT_SHA en el build
```

---

## Configuración Recomendada para Self-Hosted

### Opción 1: Mínima (Solo dibujo local)
```
VITE_APP_DISABLE_SENTRY=true
VITE_APP_ENABLE_TRACKING=false
```

### Opción 2: Con Compartir Enlaces (Necesitas backend propio)
```
VITE_APP_DISABLE_SENTRY=true
VITE_APP_ENABLE_TRACKING=false
VITE_APP_BACKEND_V2_GET_URL=https://api.carlinitools.com/v2
VITE_APP_BACKEND_V2_POST_URL=https://api.carlinitools.com/v2
VITE_APP_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}
```

### Opción 3: Completa (Con todos los servicios)
```
VITE_APP_DISABLE_SENTRY=true
VITE_APP_ENABLE_TRACKING=false
VITE_APP_BACKEND_V2_GET_URL=https://api.carlinitools.com/v2
VITE_APP_BACKEND_V2_POST_URL=https://api.carlinitools.com/v2
VITE_APP_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}
VITE_APP_WS_SERVER_URL=https://ws.carlinitools.com
VITE_APP_AI_BACKEND=https://ai.carlinitools.com
```

---

## Cómo Configurarlas en Vercel

1. Ve a tu proyecto en Vercel
2. Ve a **Settings** → **Environment Variables**
3. Agrega cada variable con su valor correspondiente
4. Selecciona los **Environments** donde aplicará (Production, Preview, Development)
5. Guarda los cambios

### Importante:

- **Las variables que empiezan con `VITE_` son expuestas al cliente (frontend)** - No pongas secretos aquí
- **`VITE_APP_FIREBASE_CONFIG`** debe ser un JSON válido como string (sin saltos de línea)
- **Si no configuras un servicio**, esa funcionalidad simplemente no estará disponible (la app seguirá funcionando)
- **Para producción**, configura al menos `VITE_APP_DISABLE_SENTRY=true` para evitar errores de Sentry

---

## Notas sobre Servicios Propios

Si quieres implementar tus propios servicios:

1. **Backend V2**: Necesitas un servidor que acepte POST para guardar escenas y GET para recuperarlas
2. **WebSocket Server**: Necesitas un servidor Socket.IO para colaboración en tiempo real
3. **Firebase**: Puedes usar Firebase de Google o implementar tu propio almacenamiento
4. **AI Backend**: Necesitas un servidor que procese las solicitudes de IA

Si no implementas estos servicios, la aplicación funcionará perfectamente para uso individual y local.

