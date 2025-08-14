
# Autopartes UI (Vite + React + Tailwind)

UI idéntica a la de la dulcería pero adaptada a **Almacén de Autopartes**.

## Scripts
- `npm i`
- `npm run dev`
- `npm run build`
- `npm run start` (usa `vite preview` en el puerto `$PORT` para Railway)

## Variables de entorno
Copia `.env.example` a `.env` y ajusta:
- `VITE_API_URL` → URL de tu backend FastAPI (Railway).

## Deploy en Railway
Crea un servicio **Web** (Node) y define:
- Start command: `npm run start`
- Variables: `VITE_API_URL`

## GitHub Actions
El workflow `deploy-ui.yml` usa Railway CLI y despliega al servicio `autopartes-ui`.
