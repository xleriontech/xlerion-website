import { useAnalytics } from '../hooks/useAnalytics';

export default function TestRadio() {
    useAnalytics('Test Radio', 'test');
    return (
        <div className="p-8 text-white bg-black min-h-screen">
            <h1 className="text-4xl font-bold mb-4">Radio Nocaima Test</h1>
            <p className="text-lg">Si ves esto, la ruta funciona.</p>
        </div>
    );
}
