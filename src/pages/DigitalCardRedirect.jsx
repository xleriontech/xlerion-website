import HardRedirect from '../components/HardRedirect';

/**
 * Rutas publicas de las tarjetas digitales.
 *
 * En produccion el .htaccess sirve /mike y /juliette directamente como
 * documento principal (para que la PWA sea instalable, el service worker
 * las controle y el inicio_url sea limpio). Ese es el camino preferido.
 *
 * Esta ruta es la red de seguridad: si el .htaccess del hosting todavia no
 * tiene las reglas de reescritura, en lugar de mostrar la pagina 404 de la
 * SPA se redirige a la tarjeta estatica (que siempre es la fuente de verdad).
 *
 * IMPORTANTE: la redireccion es DURA (window.location.replace). Con
 * <Navigate> el router haria una navegacion client-side, el servidor no
 * recibiria la peticion y la SPA caeria en su ruta 404.
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
  return <HardRedirect to={target || '/cards/'} />;
}
