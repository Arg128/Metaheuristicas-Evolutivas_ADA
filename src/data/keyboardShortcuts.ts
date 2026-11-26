export interface SlideShortcutItem {
  keys: string;
  label: string;
}

export const SLIDE_SHORTCUTS: Record<number, SlideShortcutItem[]> = {
  2: [{ keys: '↑ ↓ / 1–3', label: 'Exacto · Heurística · Metaheurística' }],
  3: [
    { keys: '↑ ↓ / 1–3', label: 'Cambiar rama' },
    { keys: 'V', label: 'Diagrama NEOS' },
    { keys: 'Z', label: 'Zoom CE' },
  ],
  4: [{ keys: '↑ ↓ / 1–3', label: 'Binaria · Real · Árbol' }],
  5: [{ keys: '↑ ↓ / 1–3', label: 'Explotación · Equilibrio · Exploración' }],
  6: [{ keys: '↑ ↓ / 1–5', label: 'AG · EE · PE · PG · DE' }],
  7: [
    { keys: '↑ ↓ / 1–4', label: 'Equivalencia' },
    { keys: 'Enter', label: 'Metáfora ↔ Rigor' },
    { keys: 'V', label: 'Bestiary' },
  ],
  8: [
    { keys: '↑ ↓ / 1–2', label: 'Ruleta · Torneo' },
    { keys: 'Enter', label: 'Muestrear Padre' },
  ],
  9: [
    { keys: '↑ ↓ / 1–3', label: '1P · 2P · Uniforme' },
    { keys: 'Enter', label: 'Recombinar' },
    { keys: 'V', label: 'Def. 15 Paper' },
  ],
  10: [
    { keys: '↑ ↓ / V', label: 'Modo AGA ON/OFF' },
    { keys: 'Enter', label: 'Ejecutar Mutación' },
  ],
  11: [
    { keys: '↑ ↓ / V', label: 'Elitismo ON/OFF' },
    { keys: 'Enter', label: 'Nueva Simulación' },
  ],
  12: [{ keys: '↑ ↓', label: 'Recorrer líneas 01–12' }],
  13: [
    { keys: 'Enter', label: 'Play / Pausa' },
    { keys: '↓ / ↑', label: 'Paso / +1 Gen' },
    { keys: 'R', label: 'Reiniciar' },
  ],
  14: [
    { keys: '1–3 / ↑ ↓', label: 'Grilla 40·80·160' },
    { keys: 'Enter', label: 'Iniciar / Pausa' },
    { keys: 'R', label: 'Reiniciar' },
  ],
  15: [{ keys: '↑ ↓ / 1–3', label: 'Analítica · FEA · CFD' }],
  16: [{ keys: '↑ ↓ / 1–2', label: 'Paisaje Plano · Con Gradiente' }],
  17: [
    { keys: '↑ ↓', label: 'Cambiar entero B' },
    { keys: 'Enter', label: 'Salto crítico 7→8' },
  ],
  18: [{ keys: '↑ ↓ / 1–4', label: 'NASA · Auto · Bio · Eléctricos' }],
  20: [{ keys: '↑ ↓ / 1–5', label: 'Filtrar bloque de referencias' }],
};

export const GLOBAL_SHORTCUTS: SlideShortcutItem[] = [
  { keys: '← → / Espacio', label: 'Diapositiva anterior / siguiente' },
  { keys: '↑ ↓ / 1–5', label: 'Cambiar estado o tarjeta activa dentro de la diapositiva' },
  { keys: 'Enter', label: 'Ejecutar acción principal (muestrear, cruzar, mutar, play/pausa)' },
  { keys: 'V', label: 'Alternar vista de literatura o modo (NEOS, Bestiary, Def. 15, AGA, Elitismo)' },
  { keys: 'H', label: 'Ocultar / mostrar barra superior y leyenda de atajos (icono ojo)' },
  { keys: 'I · N · F · K', label: 'Índice · Notas privadas · Pantalla completa · Esta leyenda de atajos' },
];
