const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Función para mezclar cartas
const mezclarCartas = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Obtener cartas del juego
app.get('/api/cartas', (req, res) => {
  try {
    const cartasData = JSON.parse(fs.readFileSync(path.join(__dirname, 'cartas.json'), 'utf8'));
    const iconos = cartasData.iconos;
    
    // Duplicar y mezclar
    const cartasDuplicadas = [...iconos, ...iconos];
    const cartasMezcladas = mezclarCartas(cartasDuplicadas);
    
    // Formatear cartas
    const cartas = cartasMezcladas.map((valor, index) => ({
      id: index,
      valor,
      volteada: false,
      encontrada: false
    }));

    res.json({ cartas, totalParejas: iconos.length });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cartas' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});