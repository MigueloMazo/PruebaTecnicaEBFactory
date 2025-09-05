Juego de Memoria con parejas de cartas

Un juego de memoria hecho con React (frontend) y Node.js + Express (backend).
El jugador debe encontrar todas las parejas de cartas en el menor tiempo y movimientos posibles.

Instalación y ejecución

1. Clonar el repositorio
   git clone https://github.com/MigueloMazo/PruebaTecnicaEBFactory.git
   cd juego-parejas

2. Backend (Node + Express)
   El backend entrega las cartas mezcladas.
   Entrar a la carpeta del backend:

- cd backend
  Instalar dependencias:
- npm install
  Iniciar el servidor:
- node server.js
  El backend quedará corriendo en http://localhost:3001

3. Frontend (React + Vite)
   Abrir otra terminal y entrar al frontend:

- cd frontend
  Instalar dependencias:
- npm install
  Iniciar la app:
- npm run dev
  El frontend quedará en http://localhost:5173

Importante: asegúrate de que el backend esté corriendo primero.

Cómo jugar:
Abre http://localhost:5173
Haz clic en las cartas para voltearlas.
Encuentra las parejas iguales.
Ganas cuando encuentras todas las parejas.
Usa el botón 🔄 Nuevo Juego para reiniciar.
