import { useEffect } from 'react';

/**
 * Redireccion DURA (recarga de pagina) hacia una ruta estatica.
 *
 * Necesario para las tarjetas digitales: /cards/... son documentos estaticos
 * servidos por el servidor, NO rutas del router de React.
 *
 * Con <Navigate> el router hace una navegacion client-side: el servidor
 * nunca recibe la peticion, la SPA busca una ruta que no existe y cae en
 * la pagina 404 (pantalla en blanco o "no encontrado").
 *
 * Con window.location.replace el navegador pide el documento al servidor:
 * - /mike y /juliette los reescribe el .htaccess a la tarjeta;
 * - /cards/ lo sirve el indice estatico public/cards/index.html.
 */
export default function HardRedirect({ to }) {
    useEffect(() => {
        window.location.replace(to);
    }, [to]);

    return null;
}
