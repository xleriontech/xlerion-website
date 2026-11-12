import { Navigate } from 'react-router-dom';

/**
 * Rutas publicas de las tarjetas digitales.
 *
 * En produccion el .htaccess sirve /mike y /juliette directamente como
 * documento principal (para que la PWA sea instalable y el service worker
 * las controle). Ese es el camino preferido.
 *
 * Esta ruta es la red de seguridad: si el .htaccess del hosting todavia no
 * tiene las reglas de reescritura, en lugar de mostrar la pagina 404 de la
 * SPA se redirige a la tarjeta estatica (que siempre es la fuente de verdad).
 *
 * Tarjeta -> URL publica
 *   Miguel   -> /mike
 *   Juliette -> /juliette
 */
const CARDS = {
  mike: '/cards/tarjeta-miguel.html',
  juliette: '/cards/tarjeta-juliette.html',
};

export default function DigitalCardRedirect({ founder }) {
  const target = CARDS[founder];
  if (!target) return <Navigate to="/cards/" replace />;
  return <Navigate to={target} replace />;
}
