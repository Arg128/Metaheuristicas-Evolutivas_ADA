import { useState } from 'react';
import { Code2, Cpu, Play } from 'lucide-react';
import { MathFormula } from '../components/ui/MathFormula';
import { SlideLayout } from '../components/ui/SlideLayout';
import { useSlideKeyboard } from '../hooks/useSlideKeyboard';
import type { SlideMeta } from '../types/presentation';

export interface SlideProps {
  meta: SlideMeta;
  totalSlides: number;
}

interface LineSpec {
  line: number;
  code: string;
  phase: string;
  operator: string;
  complexity: string;
  simulatorEffect: string;
}

const PSEUDOCODE_LINES: LineSpec[] = [
  {
    line: 1,
    code: 'P ← InicializarPoblacion(N)',
    phase: 'Inicio',
    operator: 'Muestreo uniforme en [-5.12, 5.12]² vía Mulberry32.',
    complexity: 'O(N · L)',
    simulatorEffect: 'Dispersa los N puntos iniciales sobre Rastrigin 2D.',
  },
  {
    line: 2,
    code: 'EvaluarAptitud(P)',
    phase: 'Evaluar',
    operator: 'Cómputo escalar f(x, y) para los N individuos.',
    complexity: 'O(N · C_fit)',
    simulatorEffect: 'Asigna escala térmica de color e identifica el primer líder.',
  },
  {
    line: 3,
    code: 'g ← 0',
    phase: 'Control',
    operator: 'Reinicio del contador generacional.',
    complexity: 'O(1)',
    simulatorEffect: 'Reinicia el reloj y el gráfico de convergencia.',
  },
  {
    line: 4,
    code: 'mientras NoCriterioParada(P, g) hacer',
    phase: 'Bucle',
    operator: 'Verifica g < g_max y ausencia de estancamiento.',
    complexity: 'O(1) / iter',
    simulatorEffect: 'Controla el ciclo continuo o paso a paso en Slide 13.',
  },
  {
    line: 5,
    code: '  Padres ← SeleccionarTorneo(P, k)',
    phase: 'Selección',
    operator: 'Muestreo de k candidatos al azar y elección del mínimo.',
    complexity: 'O(N · k)',
    simulatorEffect: 'Traza destellos ámbar hacia los padres ganadores.',
  },
  {
    line: 6,
    code: '  Hijos ← CruceAritmetico(Padres, p_c)',
    phase: 'Cruce',
    operator: 'Interpolación α·p₁ + (1−α)·p₂ con probabilidad p_c.',
    complexity: 'O(N · L)',
    simulatorEffect: 'Dibuja trayectorias cian entre progenitores e hijos.',
  },
  {
    line: 7,
    code: '  Hijos ← MutacionGaussiana(Hijos, p_m, σ)',
    phase: 'Mutación',
    operator: 'Perturbación N(0, σ²I) acotada al dominio con tasa p_m.',
    complexity: 'O(N · L)',
    simulatorEffect: 'Dibuja saltos violetas que evitan mínimos locales.',
  },
  {
    line: 8,
    code: '  EvaluarAptitud(Hijos)',
    phase: 'Evaluar',
    operator: 'Cálculo de f(x, y) sobre la nueva descendencia.',
    complexity: 'O(N · C_fit)',
    simulatorEffect: 'Actualiza el contador de evaluaciones y colores térmicos.',
  },
  {
    line: 9,
    code: '  Elite ← ConservarMejores(P, E)',
    phase: 'Elitismo',
    operator: 'Extrae los E individuos con menor energía f(x, y).',
    complexity: 'O(N log N)',
    simulatorEffect: 'Marca con halo dorado al mejor individuo preservado.',
  },
  {
    line: 10,
    code: '  P ← ReemplazoElitista(Elite, Hijos)',
    phase: 'Reemplazo',
    operator: 'Fusión de la élite E con los mejores N − E hijos.',
    complexity: 'O(N)',
    simulatorEffect: 'Promueve P^(g+1) garantizando monotonicidad.',
  },
  {
    line: 11,
    code: '  g ← g + 1',
    phase: 'Avance',
    operator: 'Incremento del índice generacional.',
    complexity: 'O(1)',
    simulatorEffect: 'Agrega un punto nuevo a la curva de convergencia.',
  },
  {
    line: 12,
    code: 'retornar MejorIndividuo(P)',
    phase: 'Salida',
    operator: 'Devuelve x* = argmin_{x ∈ P} f(x).',
    complexity: 'O(N)',
    simulatorEffect: 'Aísla la solución cuasi-óptima hallada cerca de (0, 0).',
  },
];

export function Slide12Pseudocode({ meta, totalSlides }: SlideProps) {
  const [selectedLine, setSelectedLine] = useState<number>(5);
  const active = PSEUDOCODE_LINES[selectedLine - 1] ?? PSEUDOCODE_LINES[0];

  useSlideKeyboard({
    onNextState: () => setSelectedLine((prev) => (prev >= PSEUDOCODE_LINES.length ? 1 : prev + 1)),
    onPrevState: () => setSelectedLine((prev) => (prev <= 1 ? PSEUDOCODE_LINES.length : prev - 1)),
    onSelectNumber: (idx) => {
      if (idx < PSEUDOCODE_LINES.length) setSelectedLine(idx + 1);
    },
  });

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="El ciclo evolutivo completo se resume en 12 líneas trazables: inicialización, selección-cruce-mutación, evaluación y elitismo."
    >
      {/* Left 7 Cols: 12-Line Numbered Canonical Pseudocode */}
      <div className="col-span-7 flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/5 backdrop-blur-md">
        <div className="mb-2 flex shrink-0 items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-violet-700" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-violet-800">
              Algoritmo Evolutivo Canónico (12 Líneas)
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Clic o cursor para inspeccionar
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-between py-0.5 font-mono text-[15.5px]">
          {PSEUDOCODE_LINES.map((item) => {
            const isSelected = item.line === selectedLine;
            return (
              <button
                key={item.line}
                type="button"
                onClick={() => setSelectedLine(item.line)}
                onMouseEnter={() => setSelectedLine(item.line)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'border border-violet-400 bg-violet-50 text-black shadow-xs'
                    : 'border border-transparent text-slate-800 hover:bg-slate-100/80'
                }`}
              >
                <span
                  className={`w-6 shrink-0 text-right text-xs font-bold ${
                    isSelected ? 'text-violet-700' : 'text-slate-400'
                  }`}
                >
                  {String(item.line).padStart(2, '0')}
                </span>
                <span className="flex-1 whitespace-pre font-semibold">{item.code}</span>
                <span
                  className={`rounded px-2 py-0.5 font-sans text-xs font-bold ${
                    isSelected
                      ? 'bg-violet-100 text-violet-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.phase}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right 5 Cols: Interactive Line Inspector Card */}
      <div className="col-span-5 flex min-h-0 flex-col gap-3">
        <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-violet-200 bg-white/95 p-5 shadow-sm shadow-slate-900/5 backdrop-blur-md">
          <div className="flex shrink-0 items-center justify-between">
            <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 font-mono text-xs font-bold text-violet-800">
              Línea {String(active.line).padStart(2, '0')} · {active.phase}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-sm font-bold text-emerald-700">
              <Cpu className="h-4 w-4" />
              {active.complexity}
            </span>
          </div>

          <pre className="mt-3 shrink-0 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-base font-bold text-cyan-900">
            {active.code}
          </pre>

          <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3">
            <div className="flex flex-1 flex-col justify-center rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-violet-700">
                Operador Matemático
              </span>
              <p className="mt-1.5 text-[16px] font-medium text-[#1B365D] leading-snug">
                {active.operator}
              </p>
            </div>

            <div className="flex flex-1 flex-col justify-center rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <Play className="h-3.5 w-3.5" />
                Efecto Visual en Simulador (Slide 13)
              </span>
              <p className="mt-1.5 text-[16px] font-medium text-emerald-950 leading-snug">
                {active.simulatorEffect}
              </p>
            </div>
          </div>

          <div className="mt-3 flex shrink-0 items-center justify-between border-t border-slate-200/80 pt-2.5 text-sm text-slate-700">
            <span>Costo por generación:</span>
            <span className="font-mono font-bold text-black">{active.complexity}</span>
          </div>
        </div>

        {meta.keyFormula ? (
          <MathFormula
            tex={meta.keyFormula.tex}
            label={meta.keyFormula.label}
            block
            highlight
            accent="violet"
          />
        ) : null}
      </div>
    </SlideLayout>
  );
}
