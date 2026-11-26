import { useState } from 'react';
import { Code2, Cpu, Play } from 'lucide-react';
import { MathFormula } from '../components/ui/MathFormula';
import { SlideLayout } from '../components/ui/SlideLayout';
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
    phase: 'Inicialización',
    operator: 'Muestreo uniforme en [-5.12, 5.12]^2 vía Mulberry32',
    complexity: 'O(N · L)',
    simulatorEffect: 'Dispersa los N puntos iniciales sobre toda la superficie de Rastrigin.',
  },
  {
    line: 2,
    code: 'EvaluarAptitud(P)',
    phase: 'Evaluación Inicial',
    operator: 'Cómputo escalar f(x, y) para los N individuos',
    complexity: 'O(N · C_fit)',
    simulatorEffect: 'Asigna color/tamaño según energía f(x,y) e identifica el primer líder.',
  },
  {
    line: 3,
    code: 'g ← 0',
    phase: 'Control',
    operator: 'Inicialización de contador generacional',
    complexity: 'O(1)',
    simulatorEffect: 'Reinicia el reloj generacional y el historial de convergencia.',
  },
  {
    line: 4,
    code: 'mientras NoCriterioParada(P, g) hacer',
    phase: 'Bucle Principal',
    operator: 'Verifica g < g_max y ausencia de estancamiento',
    complexity: 'O(1) por iteración',
    simulatorEffect: 'Controla el ciclo continuo o paso a paso del simulador en Slide 13.',
  },
  {
    line: 5,
    code: '  Padres ← SeleccionarPorTorneo(P, k)',
    phase: 'Selección',
    operator: 'Muestreo estocástico de k candidatos y elección del mínimo',
    complexity: 'O(N · k)',
    simulatorEffect: 'Resalta en cian a los padres ganadores que formarán la siguiente generación.',
  },
  {
    line: 6,
    code: '  Hijos ← CruceAritmetico(Padres, p_c)',
    phase: 'Recombinación',
    operator: 'Combinación convexa α·p₁ + (1−α)·p₂ con probabilidad p_c',
    complexity: 'O(N · L)',
    simulatorEffect: 'Dibuja segmentos de interpolación entre parejas de padres hacia sus hijos.',
  },
  {
    line: 7,
    code: '  Hijos ← MutacionGaussiana(Hijos, p_m, σ)',
    phase: 'Mutación',
    operator: 'Perturbación N(0, σ²I) acotada al dominio con tasa p_m',
    complexity: 'O(N · L)',
    simulatorEffect: 'Traza vectores de salto violetas que evitan el atrapamiento local.',
  },
  {
    line: 8,
    code: '  EvaluarAptitud(Hijos)',
    phase: 'Evaluación',
    operator: 'Cálculo de f(x, y) sobre la descendencia generada',
    complexity: 'O(N · C_fit)',
    simulatorEffect: 'Actualiza la curva de convergencia y el contador total de evaluaciones.',
  },
  {
    line: 9,
    code: '  Elite ← ConservarMejores(P, E)',
    phase: 'Elitismo',
    operator: 'Extracción de los E individuos con menor f(x,y)',
    complexity: 'O(N log N) o O(N·E)',
    simulatorEffect: 'Envuelve en un halo dorado al mejor individuo preservado intacto.',
  },
  {
    line: 10,
    code: '  P ← ReemplazoElitista(Elite, Hijos)',
    phase: 'Reemplazo',
    operator: 'Fusión de la élite E con los mejores N − E hijos',
    complexity: 'O(N)',
    simulatorEffect: 'Promueve la nueva población P^(g+1) garantizando monotonicidad.',
  },
  {
    line: 11,
    code: '  g ← g + 1',
    phase: 'Avance',
    operator: 'Incremento del índice generacional',
    complexity: 'O(1)',
    simulatorEffect: 'Avanza el punto temporal en el gráfico de fitness mínimo/promedio.',
  },
  {
    line: 12,
    code: 'retornar MejorIndividuo(P)',
    phase: 'Salida',
    operator: 'Devolución de x* = argmin_{x ∈ P} f(x)',
    complexity: 'O(N)',
    simulatorEffect: 'Destaca la solución cuasi-óptima final hallada cerca de (0, 0).',
  },
];

export function Slide12Pseudocode({ meta, totalSlides }: SlideProps) {
  const [selectedLine, setSelectedLine] = useState<number>(5);
  const active = PSEUDOCODE_LINES[selectedLine - 1] ?? PSEUDOCODE_LINES[0];

  return (
    <SlideLayout
      meta={meta}
      totalSlides={totalSlides}
      variant="split"
      keyTakeaway="El flujo completo de una metaheurística evolutiva se sintetiza en 12 líneas trazables: inicialización, bucle de selección-cruce-mutación, evaluación y reemplazo elitista."
    >
      {/* Left 7 Cols: 12-Line Numbered Canonical Pseudocode */}
      <div className="col-span-7 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-900/5 backdrop-blur-md">
        <div className="mb-2 flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-violet-700" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-violet-800">
              Algoritmo Evolutivo Canónico (12 Líneas)
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Haz clic o pasa el cursor sobre una línea
          </span>
        </div>

        <div className="space-y-1 font-mono text-[13px]">
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
                    ? 'border border-violet-400 bg-violet-50 text-slate-900 shadow-xs'
                    : 'border border-transparent text-slate-700 hover:bg-slate-100/80'
                }`}
              >
                <span
                  className={`w-6 shrink-0 text-right text-xs font-bold ${
                    isSelected ? 'text-violet-700' : 'text-slate-400'
                  }`}
                >
                  {String(item.line).padStart(2, '0')}
                </span>
                <span className="flex-1 whitespace-pre font-medium">{item.code}</span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-sans font-semibold ${
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
      <div className="col-span-5 flex flex-col justify-between gap-3">
        <div className="flex flex-1 flex-col justify-between rounded-2xl border border-violet-200 bg-white/95 p-5 shadow-sm shadow-slate-900/5 backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 font-mono text-xs font-bold text-violet-800">
                Línea {String(active.line).padStart(2, '0')} · {active.phase}
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-emerald-700">
                <Cpu className="h-3.5 w-3.5" />
                {active.complexity}
              </span>
            </div>

            <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm font-semibold text-cyan-800">
              {active.code}
            </pre>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-violet-700">
                  Operador Matemático
                </span>
                <p className="mt-1 text-sm text-slate-800 leading-relaxed">
                  {active.operator}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                  <Play className="h-3.5 w-3.5" />
                  Efecto Visual en Simulador (Slide 13)
                </span>
                <p className="mt-1 text-sm text-emerald-950 leading-relaxed">
                  {active.simulatorEffect}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
            <span>Contribución por generación:</span>
            <span className="font-mono font-semibold text-slate-900">{active.complexity}</span>
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
