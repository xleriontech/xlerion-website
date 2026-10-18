import XlerionGreenWave from '../components/XlerionGreenWave';
import { useAnalytics } from '../hooks/useAnalytics';

export default function XlerionGreenWavePage() {
    useAnalytics('Xlerion GreenWave', 'project');
    return (
        <div className="w-full">
            <XlerionGreenWave />
        </div>
    );
}
