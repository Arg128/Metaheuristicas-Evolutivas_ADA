import type { SlideMeta } from '../types/presentation';

export const SLIDES_METADATA: SlideMeta[] = [
  {
    id: 1,
    slug: 'caratula',
    block: 'Fundamentos y Taxonomía',
    speaker: 'Maritza',
    speakerRange: '01–05',
    title: 'Metaheurísticas Evolutivas',
    subtitle: 'Análisis y Diseño de Algoritmos · UNSA · Grupo 7',
    pedagogicalGoal:
      'Presentar formalmente el tema, el equipo expositor por bloques y el hilo conductor desde fundamentos hasta aplicaciones.',
    speakerScript:
      'Buenos días con todos. Somos el Grupo 7 de Análisis y Diseño de Algoritmos (UNSA). Hoy presentaremos las Metaheurísticas Evolutivas en 4 bloques: Maritza cubrirá fundamentos y representación (1–5); Fredy, las familias evolutivas y operadores (6–10); Jhoans, ejecución y simulador Rastrigin 2D (11–14); y Ángel, complejidad, límites, aplicaciones y referencias (15–20).',
    interactionHint:
      'Usa ← → o Espacio para avanzar, I para el índice por expositor, N para notas y cronómetro, y F para pantalla completa.',
    plannedVisualSummary:
      'Portada académica clara con título de alto impacto, integrantes del Grupo 7 con sus rangos de diapositivas y partículas orbitales SVG.',
    citationIds: ['R2'],
    keyFormula: {
      label: 'Optimización Estocástica Poblacional',
      tex: 'P^{(g+1)} = \\mathcal{T}\\!\\left(P^{(g)}\\right), \\quad f: \\mathcal{G} \\rightarrow \\mathbb{R}',
    },
  },
  {
    id: 2,
    slug: 'contexto-paradigmas',
    block: 'Fundamentos y Taxonomía',
    speaker: 'Maritza',
    speakerRange: '01–05',
    title: 'Exacto vs. Heurística vs. Metaheurística',
    subtitle: 'Por qué la explosión O(2ⁿ) y paisajes no derivables exigen búsqueda poblacional.',
    pedagogicalGoal:
      'Contrastar garantías, necesidad de gradiente y escalabilidad de métodos exactos, heurísticas ad-hoc y metaheurísticas evolutivas.',
    speakerScript:
      'En problemas NP-duros o no derivables, los métodos exactos garantizan el óptimo global pero explotan en O(2^n). Las heurísticas son veloces pero específicas de un dominio y sin garantías. Las metaheurísticas evolutivas ofrecen un marco generalista de caja negra con presupuesto acotado O(g_max · N · C_fit).',
    interactionHint:
      'Haz clic en las 3 tarjetas superiores y desliza n para comparar el crecimiento exponencial O(2^n) frente al presupuesto evolutivo.',
    plannedVisualSummary:
      'Tabla comparativa concisa de 3 paradigmas acoplada a gráfico SVG de crecimiento asintótico.',
    citationIds: ['R1'],
    keyFormula: {
      label: 'Barrera Combinatoria en NP-Duros',
      tex: 'T_{\\text{exacto}}(n) \\in \\mathcal{O}(2^n) \\;\\text{vs.}\\; T_{\\text{AE}}(n, g_{\\max}) \\in \\mathcal{O}(g_{\\max} \\cdot N \\cdot C_{\\text{fit}})',
    },
  },
  {
    id: 3,
    slug: 'taxonomia-metaheuristicas',
    block: 'Fundamentos y Taxonomía',
    speaker: 'Maritza',
    speakerRange: '01–05',
    title: 'Taxonomía de las Metaheurísticas',
    subtitle: 'Trayectoria única frente a enjambre y las cinco ramas de Computación Evolutiva.',
    pedagogicalGoal:
      'Ubicar formalmente AG, EE, PE, PG y DE dentro de las metaheurísticas poblacionales frente a trayectoria única.',
    speakerScript:
      'Las búsquedas de trayectoria (Simulated Annealing, Tabu Search) mueven una sola solución por vecindad. Las poblacionales mantienen un colectivo: Inteligencia de Enjambre (ACO, PSO) y Computación Evolutiva (AG, EE, PE, PG y Evolución Diferencial DE). Además podemos conmutar al diagrama clásico de la taxonomía NEOS.',
    interactionHint:
      'Alterna entre el árbol SVG interactivo (con zoom en Computación Evolutiva) y la figura clásica de la taxonomía NEOS.',
    plannedVisualSummary:
      'Árbol SVG desplegable con zoom animado y pestaña a la taxonomía clásica NEOS Guide.',
    citationIds: ['R1', 'R2', 'R3', 'R7'],
  },
  {
    id: 4,
    slug: 'genotipo-fenotipo-aptitud',
    block: 'Fundamentos y Taxonomía',
    speaker: 'Maritza',
    speakerRange: '01–05',
    title: 'Genotipo vs. Fenotipo y Aptitud',
    subtitle: 'Desacople entre codificación manipulable (G) y solución real evaluada (F).',
    pedagogicalGoal:
      'Explicar el mapeo φ: G → F y el rol de la función escalar de aptitud f: G → ℝ.',
    speakerScript:
      'El algoritmo evolutivo no modifica directamente un ala aerodinámica o circuito (fenotipo F); manipula su abstracción matemática (genotipo G: bits, reales o árboles). Luego φ decodifica cada genotipo en fenotipo y f asigna su aptitud escalar.',
    interactionHint:
      'Cambia entre codificación Binaria, Vector Real o Árbol Sintáctico y modifica genes para ver cambiar el perfil alar y la aptitud.',
    plannedVisualSummary:
      'Definiciones formales a la izquierda y laboratorio interactivo genotipo-fenotipo a la derecha.',
    citationIds: ['R2', 'R5'],
    keyFormula: {
      label: 'Mapeo Genotipo–Fenotipo y Aptitud',
      tex: '\\phi: \\mathcal{G} \\rightarrow \\mathcal{F}, \\qquad f: \\mathcal{G} \\rightarrow \\mathbb{R}',
    },
  },
  {
    id: 5,
    slug: 'exploracion-vs-explotacion',
    block: 'Fundamentos y Taxonomía',
    speaker: 'Maritza',
    speakerRange: '01–05',
    title: 'Dilema: Exploración vs. Explotación',
    subtitle: 'Equilibrio entre diversificación global e intensificación sobre óptimos prometedores.',
    pedagogicalGoal:
      'Mostrar cómo los extremos de selección y mutación provocan convergencia prematura o deriva aleatoria.',
    speakerScript:
      'Como formalizan Črepinšek, Liu y Mernik (2013), todo algoritmo evolutivo equilibra dos fuerzas opuestas: exploración (diversidad vía mutación) y explotación (intensificación vía selección). Exceso de explotación produce convergencia prematura en trampas locales; exceso de exploración degenera en paseo aleatorio.',
    interactionHint:
      'Desliza el control para observar la población colapsar en trampas locales, divergir o converger al óptimo global x*.',
    plannedVisualSummary:
      'Extracto científico ACM CSUR (2013) + mapa multimodal 2D en vivo con 24 partículas.',
    citationIds: ['R4'],
    keyFormula: {
      label: 'Varianza de Aptitud Poblacional',
      tex: '\\text{Var}\\!\\left(f(P^{(g)})\\right) = \\frac{1}{N}\\sum_{i=1}^{N} \\left(f_i - \\bar{f}\\right)^2',
    },
  },
  {
    id: 6,
    slug: 'cinco-familias-evolutivas',
    block: 'Operadores Evolutivos',
    speaker: 'Fredy',
    speakerRange: '06–10',
    title: 'Panorama de las 5 Familias Evolutivas',
    subtitle: 'Representación y operador dominante en AG, EE, PE, PG y Evolución Diferencial.',
    pedagogicalGoal:
      'Diferenciar la representación, operador principal y dominio de aplicación de las cinco ramas evolutivas.',
    speakerScript:
      'Las cinco familias comparten el ciclo selectivo pero divergen en estructura: AG usa cadenas binarias y cruce; EE vectores reales y mutación gaussiana; PE autómatas y mutación fenotípica; PG árboles sintácticos ejecutables; y Evolución Diferencial (DE) combina vectores mediante diferencias poblacionales v_i = x_r1 + F(x_r2 − x_r3).',
    interactionHint:
      'Filtra por dominio (Discreto, Continuo, Síntesis) y haz clic en cada familia para inspeccionar su micro-diagrama.',
    plannedVisualSummary:
      'Matriz interactiva de 5 tarjetas con filtros de dominio y micro-SVG animados.',
    citationIds: ['R5', 'R7'],
    keyFormula: {
      label: 'Mutación Diferencial (DE/rand/1)',
      tex: '\\mathbf{v}_i = \\mathbf{x}_{r_1} + F \\cdot \\left(\\mathbf{x}_{r_2} - \\mathbf{x}_{r_3}\\right), \\quad F \\in (0, 2]',
    },
  },
  {
    id: 7,
    slug: 'metafora-vs-matematica',
    block: 'Operadores Evolutivos',
    speaker: 'Fredy',
    speakerRange: '06–10',
    title: 'Metáfora Biológica vs. Operador Matemático',
    subtitle: 'Desmitificación formal: de la retórica bio-inspirada a Cadenas de Markov.',
    pedagogicalGoal:
      'Criticar la proliferación de metáforas ("EC-Bestiary") y traducir los términos biológicos a operadores estocásticos.',
    speakerScript:
      'Sörensen (2015) y el EC-Bestiary de Campelo alertan contra inventar algoritmos basados solo en metáforas animales. Como formaliza Cruz-Duarte et al. (2021), una metaheurística es una tupla modular de operadores estocásticos: la selección es muestreo ponderado, la variación es perturbación vectorial y la evolución es una Cadena de Markov.',
    interactionHint:
      'Usa el Traductor Matemático o cambia a la pestaña "Evidencia en Literatura" para ver EC-Bestiary y el esquema modular.',
    plannedVisualSummary:
      'Extracto Sörensen/Cruz-Duarte + traductor interactivo + figuras reales de EC-Bestiary y pipeline sin metáforas.',
    citationIds: ['R8', 'R9', 'R10'],
    keyFormula: {
      label: 'Propiedad Markoviana Poblacional',
      tex: '\\mathbb{P}\\!\\left(P^{(g+1)} \\mid P^{(g)}, \\dots, P^{(0)}\\right) = \\mathbb{P}\\!\\left(P^{(g+1)} \\mid P^{(g)}\\right)',
    },
  },
  {
    id: 8,
    slug: 'operador-seleccion',
    block: 'Operadores Evolutivos',
    speaker: 'Fredy',
    speakerRange: '06–10',
    title: 'Operador de Selección: Ruleta vs. Torneo',
    subtitle: 'Muestreo proporcional a la aptitud frente a competición estocástica modulable.',
    pedagogicalGoal:
      'Comparar la sensibilidad a escala de la ruleta frente al torneo de tamaño k.',
    speakerScript:
      'La ruleta proporcional asigna P(i) = f_i / Σf_j, lo que falla si un súper-individuo domina la suma. El torneo toma k candidatos al azar y elige al mejor: como muestran Blickle y Thiele (1996), aumentar k incrementa directamente la presión selectiva y es invariante a desplazamientos o escalados de f.',
    interactionHint:
      'Pulsa "Muestrear Padre" y ajusta el tamaño k del torneo para comparar frecuencias empíricas entre Ruleta y Torneo.',
    plannedVisualSummary:
      'Extracto Blickle & Thiele (1996) + simulador dual ruleta SVG vs. llaves de torneo k.',
    citationIds: ['R6', 'R10', 'R11'],
    keyFormula: {
      label: 'Selección Proporcional (Ruleta)',
      tex: 'P(i) = \\frac{f_i}{\\sum_{j=1}^{N} f_j}',
    },
  },
  {
    id: 9,
    slug: 'operador-recombinacion',
    block: 'Operadores Evolutivos',
    speaker: 'Fredy',
    speakerRange: '06–10',
    title: 'Recombinación (Cruce) y Teorema del Esquema',
    subtitle: 'Cruce en 1 punto, 2 puntos y uniforme para ensamblar bloques de construcción.',
    pedagogicalGoal:
      'Explicar el cruce cromosómico y la cota inferior del Teorema del Esquema de Holland.',
    speakerScript:
      'El cruce combina segmentos de dos progenitores para ensamblar bloques de construcción cortos y de alta aptitud (Goldberg, 1989). El Teorema del Esquema de Holland acota el crecimiento esperado de un esquema H en función de su longitud definitoria δ(H) y orden o(H). Además puedes abrir la Definición 15 literal del paper de Cruz-Duarte et al. (2021).',
    interactionHint:
      'Alterna entre 1 Punto, 2 Puntos y Uniforme, ejecuta recombinación, o pulsa "Ver Def. 15 (Paper SWEVO)".',
    plannedVisualSummary:
      'Extracto del Teorema del Esquema + simulador cromosómico interactivo + recorte literal SWEVO Def. 15.',
    citationIds: ['R5', 'R6', 'R10'],
    keyFormula: {
      label: 'Teorema del Esquema (Holland)',
      tex: '\\mathbb{E}[m(H, g+1)] \\ge m(H, g)\\frac{\\bar{f}(H)}{\\bar{f}}\\left[1 - p_c\\frac{\\delta(H)}{L-1} - o(H)p_m\\right]',
    },
  },
  {
    id: 10,
    slug: 'operador-mutacion-agas',
    block: 'Operadores Evolutivos',
    speaker: 'Fredy',
    speakerRange: '06–10',
    title: 'Mutación, Ergodicidad y AGAs',
    subtitle: 'Perturbación discreta o gaussiana y control adaptativo de p_c y p_m.',
    pedagogicalGoal:
      'Demostrar que la mutación garantiza ergodicidad y explicar el ajuste adaptativo de Srinivas y Patnaik.',
    speakerScript:
      'La mutación aplica bit-flip con tasa p_m o ruido gaussiano N(0, σ²I). Garantiza ergodicidad: cualquier estado es alcanzable con probabilidad positiva. Además, en los AGAs de Srinivas y Patnaik (1994), cuando cae la varianza de aptitud, el algoritmo eleva p_m y reduce p_c automáticamente para evitar estancarse.',
    interactionHint:
      'Activa/desactiva Modo AGA y mueve la varianza poblacional o σ para ver el reajuste automático de p_c y p_m.',
    plannedVisualSummary:
      'Extracto Rudolph/Srinivas & Patnaik + simulador bit-flip, campana gaussiana y control AGA.',
    citationIds: ['R10', 'R12', 'R13'],
    keyFormula: {
      label: 'Perturbación Gaussiana Continua',
      tex: "\\mathbf{x}' = \\mathbf{x} + \\boldsymbol{\\varepsilon}, \\qquad \\boldsymbol{\\varepsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\sigma^2 \\mathbf{I})",
    },
  },
  {
    id: 11,
    slug: 'elitismo-y-parada',
    block: 'Operadores Evolutivos',
    speaker: 'Jhoans',
    speakerRange: '11–14',
    title: 'Elitismo y Criterios de Parada',
    subtitle: 'Convergencia monótona de la mejor solución y límites del ciclo evolutivo.',
    pedagogicalGoal:
      'Explicar el teorema de Rudolph sobre elitismo y los tres criterios canónicos de parada.',
    speakerScript:
      'Rudolph (1994) demostró mediante Cadenas de Markov que un AG canónico sin elitismo no converge al óptimo global porque el cruce y la mutación pueden destruir al mejor individuo. Preservar los E mejores garantiza monotonicidad. El ciclo termina por límite generacional g_max, meseta Δf < ε o presupuesto temporal t_max.',
    interactionHint:
      'Conmuta Elitismo ON/OFF y genera nuevas semillas para comparar la escalera monótona frente a las caídas estocásticas.',
    plannedVisualSummary:
      'Teorema de Rudolph (1994) + tres criterios de parada + curva animada Elitismo ON/OFF.',
    citationIds: ['R13'],
    keyFormula: {
      label: 'Monotonicidad Elitista (Minimización)',
      tex: 'f\\!\\left(x_{\\text{best}}^{(g+1)}\\right) \\le f\\!\\left(x_{\\text{best}}^{(g)}\\right) \\quad \\forall\\, g \\ge 0',
    },
  },
  {
    id: 12,
    slug: 'pseudocodigo-estandarizado',
    block: 'Operadores Evolutivos',
    speaker: 'Jhoans',
    speakerRange: '11–14',
    title: 'Pseudocódigo Base Estandarizado',
    subtitle: 'Estructura trazable en 12 líneas lista para depuración visual en Rastrigin 2D.',
    pedagogicalGoal:
      'Consolidar inicialización, selección, cruce, mutación, evaluación y reemplazo elitista en 12 líneas.',
    speakerScript:
      'Todo algoritmo evolutivo estándar se resume en estas 12 líneas: inicializamos N individuos, evaluamos su aptitud y entramos al bucle hasta el criterio de parada ejecutando torneo, cruce, mutación, evaluación y reemplazo elitista. Este mismo flujo será el depurador en vivo en la siguiente diapositiva.',
    interactionHint:
      'Haz clic o pasa el cursor sobre cualquiera de las 12 líneas para inspeccionar su operador, complejidad y efecto visual.',
    plannedVisualSummary:
      'Bloque interactivo de 12 líneas con inspector matemático y efecto mapeado al simulador.',
    citationIds: ['R2', 'R10'],
    keyFormula: {
      label: 'Bucle Generacional Acotado',
      tex: 'g \\leftarrow 0, \\quad \\text{mientras } g < g_{\\max} \\text{ hacer } g \\leftarrow g + 1',
    },
  },
  {
    id: 13,
    slug: 'simulador-rastrigin-2d',
    block: 'Simulación y Comparativa',
    speaker: 'Jhoans',
    speakerRange: '11–14',
    title: 'Simulador Rastrigin 2D + Pseudocódigo',
    subtitle: 'Depuración línea por línea sobre paisaje multimodal [-5.12, 5.12]² con Mulberry32.',
    pedagogicalGoal:
      'Visualizar en tiempo real cómo cada operador mueve la población hacia el óptimo global (0,0).',
    speakerScript:
      'Aquí vemos las 12 líneas ejecutándose en vivo sobre Rastrigin 2D, cuyo óptimo global está en (0,0) rodeado de decenas de mínimos locales. Observen los destellos del torneo en línea 5, la interpolación del cruce en línea 6, los saltos gaussianos violetas en línea 7 y el halo dorado elitista en línea 9 usando semilla determinista Mulberry32.',
    interactionHint:
      'Usa Play, Paso o +1 Gen y ajusta N, p_m, p_c, Elitismo y Velocidad en tiempo real.',
    plannedVisualSummary:
      'Depurador sincronizado de 12 líneas a la izquierda y mapa topográfico 2D + curva de convergencia a la derecha.',
    citationIds: ['R13'],
    keyFormula: {
      label: 'Rastrigin 2D',
      tex: 'f(x, y) = 20 + x^2 + y^2 - 10\\left(\\cos(2\\pi x) + \\cos(2\\pi y)\\right)',
    },
  },
  {
    id: 14,
    slug: 'carrera-ag-vs-exacto',
    block: 'Simulación y Comparativa',
    speaker: 'Jhoans',
    speakerRange: '11–14',
    title: 'Carrera en Vivo: Genético vs. Grilla Exacta',
    subtitle: 'Ahorro empírico de evaluaciones frente al barrido exhaustivo en Rastrigin 2D.',
    pedagogicalGoal:
      'Demostrar cuantitativamente la reducción de evaluaciones del AG frente a una cuadrícula exhaustiva.',
    speakerScript:
      'Enfrentamos al Algoritmo Genético contra una búsqueda exacta por cuadrícula sobre el mismo dominio. Mientras la malla debe visitar miles de celdas sin memoria previa —creciendo como ((b−a)/Δ)^D en D dimensiones—, el AG concentra evaluaciones en las mejores cuencas y encuentra soluciones de alta calidad en una fracción mínima de evaluaciones.',
    interactionHint:
      'Cambia la resolución de malla (40×40, 80×80, 160×160) y pulsa Iniciar para observar el factor de ahorro en vivo.',
    plannedVisualSummary:
      'Arena dual sincronizada: barrido exhaustivo de grilla vs. población evolutiva convergente.',
    citationIds: ['R1'],
    keyFormula: {
      label: 'Evaluaciones en Grilla D-Dim',
      tex: 'N_{\\text{grilla}} = \\left(\\frac{b - a}{\\Delta}\\right)^D',
    },
  },
  {
    id: 15,
    slug: 'analisis-complejidad',
    block: 'Análisis y Límites',
    speaker: 'Ángel',
    speakerRange: '15–20',
    title: 'Análisis de Complejidad Computacional',
    subtitle: 'Memoria O(N·L), tiempo O(N·C_fit + N·L) y el cuello de botella C_fit.',
    pedagogicalGoal:
      'Desglosar el costo espacial/temporal y mostrar por qué C_fit domina el cómputo en ingeniería.',
    speakerScript:
      'En memoria solo almacenamos N individuos de longitud L: O(N·L). Los operadores genéticos por generación también son lineales O(N·L). El cuello de botella real es el costo de evaluar la aptitud C_fit: cuando cada individuo requiere una simulación de elementos finitos (FEA) o dinámica de fluidos (CFD), C_fit supera el 90% del tiempo total.',
    interactionHint:
      'Cambia entre Analítica O(1), FEA Media y CFD Intensiva para ver cómo C_fit domina el gráfico de dona.',
    plannedVisualSummary:
      'Tarjetas de complejidad + gráfico de dona interactivo con perfiles analítico, FEA y CFD.',
    citationIds: ['R1', 'R2'],
    keyFormula: {
      label: 'Tiempo por Generación',
      tex: 'T_{\\text{gen}} \\in \\mathcal{O}\\!\\left(N \\cdot C_{\\text{fit}} + N \\cdot L\\right)',
    },
  },
  {
    id: 16,
    slug: 'limites-paisaje-plano',
    block: 'Análisis y Límites',
    speaker: 'Ángel',
    speakerRange: '15–20',
    title: 'Límites: Paisaje Plano y No Free Lunch',
    subtitle: 'Sin correlación aptitud–distancia ni señal diferencial, la evolución colapsa.',
    pedagogicalGoal:
      'Evidenciar el límite teórico (Teorema NFL y paisajes planos tipo "Aguja en un Pajar").',
    speakerScript:
      'Ninguna metaheurística es universal. Por el Teorema No Free Lunch de Wolpert y Macready (1997), promediando sobre todas las funciones posibles todos los algoritmos rinden igual. En un paisaje plano ("aguja en un pajar", como descifrar una clave exacta), todo fallo tiene la misma aptitud f(x)=c y la selección se reduce a búsqueda aleatoria ciega.',
    interactionHint:
      'Alterna entre "Con Gradiente" y "Paisaje Plano" para observar cómo las partículas pasan de converger a vagar sin rumbo.',
    plannedVisualSummary:
      'Extracto formal No Free Lunch (1997) + simulador 2D de paisaje escalable vs. meseta plana.',
    citationIds: ['R14'],
    keyFormula: {
      label: 'Colapso en Meseta Plana',
      tex: 'f(\\mathbf{x}) = c \\;\\forall\\, \\mathbf{x} \\neq \\mathbf{x}^* \\implies P(i) = \\frac{1}{N}',
    },
  },
  {
    id: 17,
    slug: 'paredes-hamming-codigo-gray',
    block: 'Análisis y Límites',
    speaker: 'Ángel',
    speakerRange: '15–20',
    title: 'Paredes de Hamming y Código Gray',
    subtitle: 'Cómo evitar barreras de mutación entre enteros contiguos en binario.',
    pedagogicalGoal:
      'Demostrar la transición crítica 7→8 (4 bits) en binario frente a d_H = 1 en Código Gray.',
    speakerScript:
      'En binario natural, pasar de 7 (0111) a 8 (1000) exige mutar los 4 bits a la vez (probabilidad p_m^4): una pared de Hamming. Como analizó Whitley (1999), el Código Gray G = B ⊕ (B >> 1) garantiza que cualquier par de enteros adyacentes difiera en exactamente 1 bit (d_H = 1), eliminando estas barreras locales.',
    interactionHint:
      'Pulsa "Ver Salto Crítico 7 → 8" o recorre B de 0 a 14 para comparar bits modificados entre Binario y Gray.',
    plannedVisualSummary:
      'Extracto Whitley (1999) + comparador interactivo bit a bit y grafo de vecindad 0..15.',
    citationIds: ['R15'],
    keyFormula: {
      label: 'Transformación Binario → Gray',
      tex: 'G = B \\oplus (B \\gg 1), \\qquad d_H(0111_2, 1000_2) = 4 \\;\\text{vs.}\\; d_H^{\\text{Gray}}(7, 8) = 1',
    },
  },
  {
    id: 18,
    slug: 'casos-reales-ingenieria',
    block: 'Aplicaciones y Cierre',
    speaker: 'Ángel',
    speakerRange: '15–20',
    title: 'Casos Reales en Ingeniería y Ciencia',
    subtitle: 'Aeroespacial (NASA ST5), Automotriz (NSGA-II), Bioinformática y Control Eléctrico.',
    pedagogicalGoal:
      'Conectar representaciones genotípicas y frentes de Pareto con aplicaciones industriales documentadas.',
    speakerScript:
      'En aplicaciones reales sin derivadas: Hornby et al. (2006) evolucionaron antenas para la misión NASA ST5 superando diseños humanos; Deb et al. (2002) popularizaron NSGA-II para frentes de Pareto choque-peso en automoción; en bioinformática se optimiza plegamiento proteico y en redes eléctricas se co-evolucionan ganancias PID continuas con reglas difusas discretas.',
    interactionHint:
      'Selecciona cada caso industrial arriba para inspeccionar su genotipo, referencia y esquema SVG.',
    plannedVisualSummary:
      'Selector de 4 casos documentados con diagrama SVG dinámico por dominio y cita directa.',
    citationIds: ['R1', 'R2', 'R16', 'R17'],
  },
  {
    id: 19,
    slug: 'cierre-hiperheuristicas',
    block: 'Aplicaciones y Cierre',
    speaker: 'Ángel',
    speakerRange: '15–20',
    title: 'Conclusiones y Puente a Hiperheurísticas',
    subtitle: 'La sensibilidad paramétrica motiva el Diseño Automático de Algoritmos.',
    pedagogicalGoal:
      'Sintetizar los 4 pilares aprendidos y abrir paso al paradigma de Hiperheurísticas.',
    speakerScript:
      'En síntesis: las metaheurísticas evolutivas resuelven problemas no derivables gracias al desacople genotipo-fenotipo y el balance exploración-explotación, aunque están acotadas por C_fit y paisajes planos. Su mayor reto es ajustar manualmente N, p_c y p_m; por ello el paso natural son las Hiperheurísticas (Burke et al., 2013; Cruz-Duarte et al., 2021): algoritmos que diseñan algoritmos.',
    interactionHint:
      'Revisa los 4 pilares y el diagrama ascendente hacia la capa de Hiperheurísticas; siguiente lámina muestra la bibliografía.',
    plannedVisualSummary:
      '4 pilares sintéticos + puente SVG hacia Hiperheurísticas + extracto formal Burke / Cruz-Duarte.',
    citationIds: ['R10', 'R18'],
    keyFormula: {
      label: 'Meta-Nivel de Hiperheurísticas',
      tex: '\\max_{h \\in \\mathcal{H}} \\; \\mathbb{E}\\!\\left[\\text{Rendimiento}(h(\\mathcal{P}))\\right]',
    },
  },
  {
    id: 20,
    slug: 'referencias-bibliograficas',
    block: 'Aplicaciones y Cierre',
    speaker: 'Ángel',
    speakerRange: '15–20',
    title: 'Referencias Bibliográficas',
    subtitle: 'Literatura fundamental, teoremas de convergencia y aplicaciones documentadas.',
    pedagogicalGoal:
      'Respaldar cada bloque de la exposición con fuentes académicas verificadas y DOIs navegables.',
    speakerScript:
      'Presentamos las 18 referencias científicas verificadas que respaldan nuestra exposición, organizadas por expositor y bloque temático. Pueden filtrar por integrante si algún docente desea profundizar en un teorema o aplicación puntual. Muchas gracias por su atención.',
    interactionHint:
      'Filtra por expositor (Maritza, Fredy, Jhoans, Ángel) para ampliar la tipografía y abrir los DOIs directos.',
    plannedVisualSummary:
      'Índice bibliográfico interactivo filtrable por bloque/expositor con etiquetas de diapositiva y enlaces DOI.',
    citationIds: [],
  },
];
