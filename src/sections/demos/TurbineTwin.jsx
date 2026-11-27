import React from 'react';
import DigitalTwinViewer3D from '../../components/DigitalTwinViewer3D';

/**
 * TurbineTwin — gemelo digital 3D de la turbina (visor WebGL existente),
 * expuesto con la prop `active` para pausar su renderizado cuando el tab
 * correspondiente no está visible.
 */
export default function TurbineTwin({ active }) {
  return <DigitalTwinViewer3D active={active} />;
}
