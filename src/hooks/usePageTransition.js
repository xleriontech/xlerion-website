import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoader } from '../context/LoaderContext';

export function usePageTransition() {
    const location = useLocation();
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        // Mostrar loader al cambiar de página
        showLoader();

        // Ocultar después de un breve delay (simula carga)
        const timer = setTimeout(() => {
            hideLoader();
        }, 500);

        return () => clearTimeout(timer);
    }, [location.pathname]);
}
