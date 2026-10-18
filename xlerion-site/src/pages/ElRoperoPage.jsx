import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAnalytics } from '../hooks/useAnalytics';

export default function ElRoperoPage() {
    const { t } = useLanguage();
    useAnalytics('El Ropero Mag&co', 'project');

    useEffect(() => {
        // Update page metadata
        const updateOrCreateMeta = (name, content, isProperty = false) => {
            let elem = document.querySelector(
                isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
            );
            if (!elem) {
                elem = document.createElement('meta');
                if (isProperty) {
                    elem.setAttribute('property', name);
                } else {
                    elem.setAttribute('name', name);
                }
                document.head.appendChild(elem);
            }
            elem.setAttribute('content', content);
        };

        updateOrCreateMeta('description', t('projects_el_ropero_desc'));
        updateOrCreateMeta('og:title', t('projects_el_ropero_title'), true);
        updateOrCreateMeta('og:description', t('projects_el_ropero_desc'), true);
        document.title = t('projects_el_ropero_title');
    }, [t]);

    // Serve static Ropero from public folder
    const roperoUrl = '/el-ropero/index.html';

    return (
        <div className="min-h-screen bg-black">
            <iframe
                src={roperoUrl}
                title="El Ropero Mag&co"
                className="w-full h-screen border-none"
                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; magnetometer; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-presentation"
            />
        </div>
    );
}
