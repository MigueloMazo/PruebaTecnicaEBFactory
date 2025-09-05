import React, { useState, useEffect, useCallback } from "react";
import './App.css';

export default function App() {
  // Estados del juego
  const [cartas, setCartas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [bloqueado, setBloqueado] = useState(false);
  const [movimientos, setMovimientos] = useState(0);
  const [parejasEncontradas, setParejasEncontradas] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const [totalParejas, setTotalParejas] = useState(8);
  const [gameCompleto, setGameCompleto] = useState(false);

  // Cargar cartas del backend
  const cargarJuego = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/cartas');
      if (!response.ok) {
        throw new Error('Error al obtener cartas del servidor');
      }
      const data = await response.json();
      setCartas(data.cartas);
      setTotalParejas(data.totalParejas);
      reiniciarEstados();
    } catch (error) {
      console.error('Error conectando con el backend:', error);
      alert('No se pudo conectar con el servidor. Asegúrate de que esté ejecutándose.');
    }
  }, []);

  // Al montar: cargar cartas del backend
  useEffect(() => {
    cargarJuego();
  }, [cargarJuego]);

  // Tiempo
  useEffect(() => {
    let timer;
    if (corriendo) {
      timer = setInterval(() => setTiempo(t => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [corriendo]);

  // Verificar victoria
  useEffect(() => {
    if (parejasEncontradas === totalParejas && parejasEncontradas > 0) {
      setCorriendo(false);
      setGameCompleto(true);
    }
  }, [parejasEncontradas, totalParejas]);

  const reiniciarEstados = () => {
    setSeleccionadas([]);
    setBloqueado(false);
    setMovimientos(0);
    setParejasEncontradas(0);
    setTiempo(0);
    setCorriendo(true);
    setGameCompleto(false);
  };

  const manejarClickCarta = (index) => {
    if (bloqueado) return;
    const carta = cartas[index];
    if (!carta || carta.volteada || carta.encontrada) return;

    if (seleccionadas.length === 0) {
      setCartas(prev => prev.map((c, i) => i === index ? { ...c, volteada: true } : c));
      setSeleccionadas([index]);
      return;
    }

    if (seleccionadas.length === 1) {
      const primeroIdx = seleccionadas[0];
      if (primeroIdx === index) return;

      setCartas(prev => prev.map((c, i) => i === index ? { ...c, volteada: true } : c));
      setBloqueado(true);
      setMovimientos(m => m + 1);

      const valorPrimero = cartas[primeroIdx].valor;
      const valorSegundo = cartas[index].valor;

      if (valorPrimero === valorSegundo) {
        setTimeout(() => {
          setCartas(prev => prev.map((c, i) => (i === primeroIdx || i === index) ? { ...c, encontrada: true } : c));
          setSeleccionadas([]);
          setParejasEncontradas(p => p + 1);
          setBloqueado(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCartas(prev => prev.map((c, i) => (i === primeroIdx || i === index) ? { ...c, volteada: false } : c));
          setSeleccionadas([]);
          setBloqueado(false);
        }, 1000);
      }
    }
  };

  const formatoTiempo = (segundos) => {
    const m = Math.floor(segundos / 60).toString().padStart(2, '0');
    const s = (segundos % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="titulo">
            Juego de Memoria
          </h1>
          
          <div className="estadisticas">
            <div className="stat">
              <span className="stat-icon">⏱️</span>
              <span className="stat-value">{formatoTiempo(tiempo)}</span>
            </div>
            <div className="stat">
              <span className="stat-icon">🎯</span>
              <span className="stat-value">{movimientos}</span>
            </div>
            <div className="stat">
              <span className="stat-icon">💫</span>
              <span className="stat-value">{parejasEncontradas}/{totalParejas}</span>
            </div>
          </div>
        </header>

        <main className="game-area">
          <div className="tablero">
            {cartas.map((carta, i) => (
              <button
                key={carta.id}
                onClick={() => manejarClickCarta(i)}
                className={`carta ${carta.volteada || carta.encontrada ? 'volteada' : ''} ${carta.encontrada ? 'encontrada' : ''}`}
                disabled={carta.encontrada}
              >
                <div className="carta-inner">
                  <div className="carta-frente">
                    {carta.volteada || carta.encontrada ? (
                      <img 
                        src={carta.valor} 
                        alt="Carta" 
                        className="carta-imagen"
                      />
                    ) : ''}
                  </div>
                  <div className="carta-dorso">
                    <div className="pattern"></div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="controles">
            <button onClick={cargarJuego} className="btn-reiniciar">
              🔄 Nuevo Juego
            </button>
            
            {gameCompleto && (
              <div className="victoria">
                🎉 ¡Ganaste! Tiempo: {formatoTiempo(tiempo)} - Movimientos: {movimientos}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}