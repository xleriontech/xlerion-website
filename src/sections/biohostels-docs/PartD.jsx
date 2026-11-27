import React from 'react';
import { BIO, Bar, Bullets, Card, Chip, DataTable, DocSection, Field, Kpi, Note, Step, Sub } from './ui';
import { XIBadge } from './icons';

export function BioCoin() {
  const dist = [
    ['Respaldo Inmobiliario', 40, BIO.green],
    ['Comunidad & Airdrops', 20, BIO.teal],
    ['Ecosistema El Flecho', 15, BIO.accent],
    ['Equipo & Desarrollo', 15, '#8a9a90'],
    ['Reserva de Estabilidad', 10, BIO.info],
  ];
  const casos = [
    { icon: 'building', t: 'Biohostels', c: BIO.teal, items: ['• Compra de fracciones con 5% descuento', '• Pago obligatorio de administración', '• Recepción de dividendos en BIO', '• Venta de participación solo en BIO'] },
    { icon: 'home', t: 'Microhostales', c: BIO.accent, items: ['• Pago de reservas en BIO o USD (1:1)', '• Pago de servicios (luz, agua, internet)', '• +10 BIO por reseña 5★', '• 1 BIO por cada $10 USD gastado'] },
    { icon: 'box', t: 'El Flecho', c: BIO.info, items: ['• 3% cashback en BIO en restaurantes', '• 0% comisión vs 15% de tarjetas', '• Pago instantáneo sin intermediarios', '• Trueque BIO ↔ productos locales'] },
  ];
  const kpis = [['Holders de BioCoin', '5.000', '50.000'], ['Transacciones/mes', '10.000', '500.000'], ['BioCoin quemados', '240.000', '10.000.000'], ['Biohostels con BioCoin', '4', '32'], ['Proveedores El Flecho', '100', '3.200'], ['Precio BioCoin (USD)', '$0.05', '$0.50+']];
  const contract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract BioCoin is ERC20, ERC20Burnable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
    uint256 public burnRate = 2; // 2% por transacción
    address public treasury;
    address public daoGovernance;

    constructor() ERC20("BioCoin", "BIO") {
        treasury = msg.sender;
        _mint(treasury, MAX_SUPPLY);
    }

    function _transfer(address from, address to, uint256 amount)
        internal override
    {
        uint256 burnAmount = (amount * burnRate) / 100;
        uint256 transferAmount = amount - burnAmount;
        super._transfer(from, address(0), burnAmount);
        super._transfer(from, to, transferAmount);
    }
}`;
  return (
    <DocSection id="biocoin" cap="Capítulo 12" title="BioCoin (BIO)" lead="Criptomoneda ecosistémica respaldada por activos reales. Token ERC-20 en Polygon con mecanismo deflacionario y utilidad dentro de Biohostels, Microhostales y El Flecho.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"><Field label="Blockchain" value="Polygon (Layer 2)" color={BIO.teal} /><Field label="Estándar" value="ERC-20" /><Field label="Supply Total" value="100.000.000 BIO" /><Field label="Supply Circulante" value="10.000.000 BIO (10%)" /><Field label="Mecanismo" value="Deflacionario" color={BIO.accent} /><Field label="Quema por transacción" value="2%" color={BIO.warning} /></div>
      <Sub iconName="coin" title="Distribución del Supply"><Card><div className="space-y-4">{dist.map(([l, pct, c]) => <Bar key={l} label={l} pct={pct} color={c} />)}</div></Card></Sub>
      <Sub iconName="star" title="Casos de Uso dentro del Ecosistema">
        <div className="grid md:grid-cols-3 gap-4">{casos.map((c) => (<Card key={c.t}><div className="flex items-center gap-2"><XIBadge name={c.icon} size={16} box={30} color={c.c} /><h4 className="font-semibold" style={{ color: c.c }}>{c.t}</h4></div><div className="mt-3"><Bullets items={c.items} /></div></Card>))}</div>
      </Sub>
      <Sub iconName="doc" title="Smart Contract Base (Solidity · Polygon)">
        <div className="rounded-xl border border-white/[0.08] bg-[#050d0a] overflow-hidden"><div className="px-4 py-2 border-b border-white/[0.08] text-[11px] font-mono text-gray-500">BioCoin.sol · ERC-20 · Burnable · 2% burn por transferencia</div><pre className="p-4 text-xs leading-relaxed overflow-x-auto text-gray-300 font-mono"><code>{contract}</code></pre></div>
        <div className="mt-3"><Note>Contrato base de referencia del documento maestro. Antes de despliegue: auditoría de seguridad (CertiK o Hacken) y revisión legal.</Note></div>
      </Sub>
      <Sub iconName="chart" title="Métricas de Éxito (KPIs)"><DataTable head={['Indicador', 'Meta Año 1', 'Meta Año 3']} rows={kpis} /></Sub>
    </DocSection>
  );
}

export function MarcoLegal() {
  const inmobiliario = [['Ley 160 de 1994 (UAF)', 'Unidad Agrícola Familiar: no se puede subdividir si los lotes resultantes son inferiores a la UAF del municipio (mínimo 4.4 hectáreas en zonas rurales).'], ['Decreto 19/2012 y 1469/2010', 'Licencias de subdivisión, urbanización y construcción. Requiere planos topográficos y estudios técnicos.'], ['Decreto 3600 de 2007', 'Suelo rural: máximo 30% de ocupación, prohibición de cercas sólidas, cesión de áreas para equipamientos.'], ['Ley 675 de 2001', 'Propiedad Horizontal: estructura legal para Biohostels como fracciones privativas y áreas comunes.']];
  const financiero = [['Ley 2118 de 2021', 'Marco de activos virtuales: BioCoin se clasifica como "activo virtual", no como moneda de curso legal.'], ['Circular Externa 007 de 2014 (SFC)', 'Prohíbe a entidades financieras operar con cripto, pero no a particulares.'], ['Resolución 055 de 2022 (DIAN)', 'Ganancias en criptoactivos pagan impuesto de renta (10-39%).'], ['Decreto 1357 de 2018', 'Crowdfunding inmobiliario: plataformas deben estar autorizadas y supervisadas por la SFC.'], ['Ley 1581 de 2012', 'Protección de datos personales: consentimiento explícito para cruce de información con APIs externas.']];
  const estructura = [['shield', 'Biohostels S.A.S.', 'Sociedad por Acciones Simplificada en Colombia. Opera la plataforma y los Biohostels.', BIO.teal], ['globe', 'BioCoin Foundation', 'Fundación en Panamá o Suiza para emisión de tokens. Jurisdicción crypto-friendly.', BIO.info], ['building', 'Fiducia Biohostels', 'Fiduciaria colombiana que respalda cada BioCoin con activos reales (lotes + Microhostales).', BIO.accent]];
  return (
    <DocSection id="legal" cap="Capítulo 13" title="Marco Legal Colombiano" lead="Regulación inmobiliaria, financiera y de criptoactivos aplicable al ecosistema Biohostels en Colombia.">
      <div className="grid md:grid-cols-2 gap-4">
        <Sub iconName="building" title="Regulación Inmobiliaria"><div className="space-y-3">{inmobiliario.map(([t, d]) => (<Card key={t}><h4 className="text-sm font-semibold text-white">{t}</h4><p className="mt-1 text-sm text-gray-400 leading-relaxed">{d}</p></Card>))}</div></Sub>
        <Sub iconName="money" title="Regulación Financiera y Crypto"><div className="space-y-3">{financiero.map(([t, d]) => (<Card key={t}><h4 className="text-sm font-semibold text-white">{t}</h4><p className="mt-1 text-sm text-gray-400 leading-relaxed">{d}</p></Card>))}</div></Sub>
      </div>
      <Sub iconName="shield" title="Estructura Legal Recomendada">
        <div className="grid md:grid-cols-3 gap-3">{estructura.map(([icon, t, d, c]) => (<Card key={t}><XIBadge name={icon} color={c} /><h4 className="mt-3 font-semibold" style={{ color: c }}>{t}</h4><p className="mt-2 text-sm text-gray-400 leading-relaxed">{d}</p></Card>))}</div>
        <div className="mt-3"><Note title="Nota:">Este resumen es informativo y no constituye asesoría legal. Antes de ejecutar, validar con abogado especializado en cripto/inmobiliario en Colombia.</Note></div>
      </Sub>
    </DocSection>
  );
}

export function Roadmap() {
  const fases = [
    { n: '01', t: 'Fase Fundación', m: 'Mes 1-3', c: BIO.teal, items: ['✓ Constituir BioCoin Foundation (jurisdicción crypto-friendly)', '✓ Desarrollar Smart Contract en Polygon', '✓ Auditoría de seguridad (CertiK o Hacken)', '✓ Crear wallet oficial BioCoin (app móvil)', '✓ Validación legal de subdivisión en 800 m² (UAF municipal)'] },
    { n: '02', t: 'Fase Integración Interna', m: 'Mes 4-6', c: BIO.info, items: ['✓ Primer Biohostel piloto acepta BioCoin', '✓ 20 proveedores de El Flecho integran pagos', '✓ Sistema de staking activo (5-15% anual)', '✓ Airdrop a primeros 1.000 inversionistas', '✓ Construcción de 4 Biohostels piloto'] },
    { n: '03', t: 'Fase Expansión', m: 'Mes 7-12', c: BIO.accent, items: ['✓ Listado en exchange descentralizado (Uniswap/QuickSwap)', '✓ 10 Biohostels operando con BioCoin', '✓ 200 proveedores en El Flecho', '✓ Lanzamiento BioQuest en pilotos (misiones, BioDex, recompensas BIO)', '✓ Registro SIC de marca "Biohostels"'] },
    { n: '04', t: 'Fase Madurez', m: 'Año 2', c: BIO.green, items: ['✓ Listado en exchange centralizado (Binance/KuCoin)', '✓ 32 Biohostels (1 por departamento)', '✓ BioQuest con IA, IoT biodiversidad y NFTs de especies legendarias', '✓ Integración con Lightning Network (Bitcoin) para micropagos', '✓ Certificación ISO 14001 (gestión ambiental)'] },
  ];
  const kpis = [['Holders de BioCoin', '5.000', '50.000'], ['Transacciones/mes', '10.000', '500.000'], ['BioCoin quemados', '240.000', '10.000.000'], ['Biohostels con BioCoin', '4', '32'], ['Proveedores El Flecho', '100', '3.200'], ['Precio BioCoin (USD)', '$0.05', '$0.50+']];
  const pasos = ['Agendar reunión de presentación (30 min)', 'Recibir documento legal completo y estructura fiduciaria', 'Visitar Biohostel piloto en Guatapé, Salento o Tayrona', 'Definir tipo de inversión (fraccionada o fideicomiso)', 'Firmar contrato y recibir wallet BioCoin con airdrop inicial'];
  const inmediatos = ['Validar estructura legal con abogado especializado en cripto en Colombia', 'Seleccionar blockchain (recomendado: Polygon por costos y velocidad)', 'Contratar desarrollador Solidity para smart contract', 'Diseñar wallet BioCoin (app móvil con UX simple)', 'Piloto con 1 Biohostel en zona turística (Guatapé, Salento o Tayrona)', 'Implementar BioQuest piloto: catálogo de especies, app móvil, recompensas BIO e IoT biodiversidad'];
  return (
    <DocSection id="roadmap" cap="Capítulo 15" title="Roadmap y Próximos Pasos" lead="Fases de implementación, métricas de éxito y pasos inmediatos para inversionistas y equipo fundador, actualizado con BioQuest y la gamificación ecológica.">
      <div className="grid md:grid-cols-2 gap-4">{fases.map((f) => <Step key={f.n} n={f.n} title={f.t} meta={f.m} color={f.c} items={f.items} />)}</div>
      <Sub iconName="chart" title="Métricas de Éxito (KPIs)"><DataTable head={['Indicador', 'Meta Año 1', 'Meta Año 3']} rows={kpis} /></Sub>
      <div className="grid md:grid-cols-2 gap-4">
        <Sub iconName="rocket" title="Próximos Pasos Inmediatos">
          <Card><ol className="list-none p-0 m-0 space-y-2">{inmediatos.map((p, i) => (<li key={p} className="flex gap-3 text-sm text-gray-300"><span className="shrink-0 w-6 h-6 rounded-full grid place-items-center text-[11px] font-mono font-bold" style={{ background: BIO.teal + '22', color: BIO.teal }}>{i + 1}</span><span>{p}</span></li>))}</ol></Card>
        </Sub>
        <Sub iconName="users" title="Próximos Pasos para Inversionistas">
          <Card tone="teal"><ol className="list-none p-0 m-0 space-y-2">{pasos.map((p, i) => (<li key={p} className="flex gap-3 text-sm text-gray-300"><span className="shrink-0 w-6 h-6 rounded-full grid place-items-center text-[11px] font-mono font-bold" style={{ background: BIO.accent + '22', color: BIO.accent }}>{i + 1}</span><span>{p}</span></li>))}</ol></Card>
        </Sub>
      </div>
      <Sub iconName="send" title="Contacto">
        <div className="grid sm:grid-cols-3 gap-3"><Card><div className="text-[10px] font-mono text-gray-500">CONTACTO DIRECTO</div><div className="mt-2 text-sm text-white">+57 313 226 3265</div><div className="text-sm text-gray-400">miguelxlerion@gmail.com</div></Card><Card><div className="text-[10px] font-mono text-gray-500">PLATAFORMA</div><div className="mt-2 text-sm text-white break-all">biohostel-com.xleriondev.workers.dev</div><div className="text-sm text-gray-400">Xlerion.com.co</div></Card><Card><div className="text-[10px] font-mono text-gray-500">UBICACIÓN</div><div className="mt-2 text-sm text-white">Bogotá, Colombia</div><div className="text-sm text-gray-400">Disponible remoto</div></Card></div>
      </Sub>
    </DocSection>
  );
}
