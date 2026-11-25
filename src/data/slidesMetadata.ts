import type { SlideMeta } from '../types/presentation';

export const SLIDES_METADATA: SlideMeta[] = [
  {
    id: 1,
    slug: 'caratula',
    block: 'Fundamentos y Taxonomía',
    title: 'Metaheurísticas Evolutivas',
    subtitle:
      'Análisis y Diseño de Algoritmos · Universidad Nacional de San Agustín (UNSA) · Grupo 7',
    pedagogicalGoal:
      'Presentar formalmente el tema de exposición, el equipo expositor y el hilo conductor desde los fundamentos estocásticos hasta las aplicaciones en ingeniería.',
    speakerScript:
      'Buenos días con todos. Somos el Grupo 7 del curso de Análisis y Diseño de Algoritmos de la UNSA. Hoy exploraremos las Metaheurísticas Evolutivas: cómo transformar principios poblacionales en algoritmos rigurosos de optimización estocástica capaces de resolver problemas complejos de ingeniería y optimización continua o combinatoria donde los métodos clásicos colapsan.',
    interactionHint:
      'Usa las flechas ← → o Barra Espaciadora para avanzar, I para abrir el índice temático, N para mostrar estas notas con cronómetro y F para pantalla completa.',
    plannedVisualSummary:
      'Portada de alto impacto con título, metadatos del curso (ADA - UNSA), espacio reservado para integrantes del Grupo 7, mapa visual de los 5 bloques temáticos y partículas evolutivas SVG en órbita.',
    keyFormula: {
      label: 'Optimización Estocástica Poblacional',
      tex: 'P^{(g+1)} = \\mathcal{T}\\!\\left(P^{(g)}\\right), \\quad f: \\mathcal{G} \\rightarrow \\mathbb{R}',
    },
  },
  {
    id: 2,
    slug: 'contexto-paradigmas',
    block: 'Fundamentos y Taxonomía',
    title: 'Algoritmo Exacto vs. Heurística vs. Metaheurística',
    subtitle:
      'Por qué la explosión exponencial y los paisajes no derivables exigen búsqueda estocástica poblacional.',
    pedagogicalGoal:
      'Contrastar las garantías, velocidad y escalabilidad de los algoritmos exactos, las heurísticas específicas y las metaheurísticas evolutivas.',
    speakerScript:
      'En problemas complejos de ingeniería y optimización continua o combinatoria, los algoritmos exactos garantizan el óptimo global, pero su costo O(2^n) en instancias NP-duros o su dependencia de gradientes los vuelve inviables. Las heurísticas son veloces, pero específicas de un dominio y sin garantías. Las metaheurísticas evolutivas ofrecen un marco genérico, sin gradiente y poblacional para hallar soluciones cuasi-óptimas en presupuestos computacionales acotados.',
    interactionHint:
      'Selector interactivo entre los tres paradigmas para comparar complejidad, necesidad de gradiente y escalabilidad sobre un espacio multimodal.',
    plannedVisualSummary:
      'Tabla comparativa interactiva de 3 columnas (Algoritmo Exacto, Heurística, Metaheurística Evolutiva) acoplada a un gráfico comparativo de crecimiento de tiempo de ejecución frente al tamaño del problema.',
    keyFormula: {
      label: 'Barrera Combinatoria en Problemas NP-Duros',
      tex: 'T_{\\text{exacto}}(n) \\in \\mathcal{O}(2^n) \\quad \\text{vs.} \\quad T_{\\text{evolutivo}}(n, g_{\\max}) \\in \\mathcal{O}(g_{\\max} \\cdot N \\cdot C_{\\text{fit}})',
    },
  },
  {
    id: 3,
    slug: 'taxonomia-metaheuristicas',
    block: 'Fundamentos y Taxonomía',
    title: 'Taxonomía de las Metaheurísticas',
    subtitle:
      'De los métodos de trayectoria única a los algoritmos poblacionales de enjambre y computación evolutiva.',
    pedagogicalGoal:
      'Ubicar formalmente a las cinco ramas de la computación evolutiva (AG, EE, PE, PG y DE) dentro del espectro global de las metaheurísticas.',
    speakerScript:
      'No todas las búsquedas heurísticas son iguales. Mientras los métodos de trayectoria única como Simulated Annealing o Tabu Search exploran una única solución punto a punto a lo largo de una vecindad, las metaheurísticas poblacionales mantienen un colectivo de soluciones candidatas. Dentro de ellas distinguimos la Inteligencia de Enjambre (ACO, PSO) y la Computación Evolutiva, conformada por Algoritmos Genéticos (AG), Estrategias Evolutivas (EE), Programación Evolutiva (PE), Programación Genética (PG) y Evolución Diferencial (DE).',
    interactionHint:
      'Árbol taxonómico interactivo: haz clic en "Poblacionales" y "Computación Evolutiva" para desplegar AG, EE, PE, PG y DE, o alterna entre vista general y zoom evolutivo.',
    plannedVisualSummary:
      'Árbol taxonómico SVG desplegable: Metaheurísticas -> Trayectoria (SA, Tabu) vs. Poblacionales -> Enjambre (ACO, PSO) vs. Computación Evolutiva (AG, EE, PE, PG, DE).',
  },
  {
    id: 4,
    slug: 'genotipo-fenotipo-aptitud',
    block: 'Fundamentos y Taxonomía',
    title: 'Dualidad Genotipo vs. Fenotipo y Función de Aptitud',
    subtitle:
      'El desacoplamiento entre la codificación matemática manipulable y la solución real evaluada.',
    pedagogicalGoal:
      'Comprender el mapeo entre el espacio genotípico y el espacio fenotípico, así como el rol de la función escalar de aptitud.',
    speakerScript:
      'El corazón de un algoritmo evolutivo reside en el desacoplamiento entre genotipo y fenotipo. El algoritmo no manipula directamente el ala aerodinámica ni el circuito físico; manipula su abstracción matemática —cadenas binarias, vectores reales o árboles sintácticos— y luego decodifica cada individuo para medir su calidad mediante la función de aptitud f: G -> R.',
    interactionHint:
      'Edita bits del genotipo o cambia el tipo de codificación (Binaria, Vector Real, Árbol Sintáctico) para observar la actualización instantánea del fenotipo.',
    plannedVisualSummary:
      'Pantalla dividida: panel izquierdo con cromosoma manipulable (bits / vector real / árbol) y panel derecho con decodificación visual en tiempo real y medidor de aptitud f(x).',
    keyFormula: {
      label: 'Mapeo Genotipo-Fenotipo y Evaluación',
      tex: '\\phi: \\mathcal{G} \\rightarrow \\mathcal{F}, \\qquad f: \\mathcal{G} \\rightarrow \\mathbb{R}',
    },
  },
  {
    id: 5,
    slug: 'exploracion-vs-explotacion',
    block: 'Fundamentos y Taxonomía',
    title: 'El Dilema: Exploración vs. Explotación',
    subtitle:
      'Equilibrio estocástico entre diversificación espacial e intensificación sobre óptimos prometedores.',
    pedagogicalGoal:
      'Evaluar cómo la presión de selección y la tasa de mutación gobiernan la convergencia prematura frente a la deriva aleatoria.',
    speakerScript:
      'Todo algoritmo evolutivo camina sobre una cuerda floja. Si explotamos demasiado rápido mediante una presión de selección excesiva, la diversidad genética colapsa y la población queda atrapada en el primer óptimo local. Si exploramos en exceso con mutaciones descontroladas, la búsqueda degenera en un paseo aleatorio sin convergencia.',
    interactionHint:
      'Desliza el control "Presión de Selección vs. Mutación" para observar en tiempo real cómo las partículas colapsan en un óptimo local o se dispersan sin rumbo.',
    plannedVisualSummary:
      'Mapa de contorno 2D multimodal interactivo con población de partículas animada y slider continuo que regula el balance exploración/explotación.',
    keyFormula: {
      label: 'Balance de Diversidad Poblacional',
      tex: '\\text{Var}\\!\\left(f(P^{(g)})\\right) = \\frac{1}{N}\\sum_{i=1}^{N} \\left(f_i - \\bar{f}\\right)^2',
    },
  },
  {
    id: 6,
    slug: 'cinco-familias-evolutivas',
    block: 'Operadores Evolutivos',
    title: 'Panorama de las 5 Familias Evolutivas',
    subtitle:
      'Comparación estructural de AG, EE, PE, PG y Evolución Diferencial (DE).',
    pedagogicalGoal:
      'Diferenciar la representación, el operador dominante y el dominio de aplicación de las cinco ramas canónicas de la computación evolutiva.',
    speakerScript:
      'Aunque comparten la misma raíz conceptual, las cinco familias evolutivas divergen en su arquitectura interna. Los Algoritmos Genéticos (AG) operan con cadenas binarias y cruce; las Estrategias Evolutivas (EE) optimizan vectores reales con mutación gaussiana auto-adaptativa; la Programación Evolutiva (PE) evoluciona máquinas de estados mediante mutación fenotípica; la Programación Genética (PG) recombina árboles sintácticos ejecutables; y la Evolución Diferencial (DE) perturba vectores reales usando diferencias vectoriales entre individuos de la población.',
    interactionHint:
      'Filtra por dominio (Discreto, Continuo, Síntesis) y selecciona cada una de las 5 tarjetas (AG, EE, PE, PG, DE) para inspeccionar su estructura animada.',
    plannedVisualSummary:
      'Matriz interactiva de 5 tarjetas (AG, EE, PE, PG, DE) con filtros por dominio y micro-diagramas SVG animados de cadenas binarias, elipsoides gaussianos, autómatas, árboles y vectores diferencia.',
    keyFormula: {
      label: 'Mutación Vectorial en Evolución Diferencial (DE/rand/1)',
      tex: '\\mathbf{v}_i = \\mathbf{x}_{r_1} + F \\cdot \\left(\\mathbf{x}_{r_2} - \\mathbf{x}_{r_3}\\right), \\quad F \\in (0, 2]',
    },
  },
  {
    id: 7,
    slug: 'metafora-vs-matematica',
    block: 'Operadores Evolutivos',
    title: 'Crítica Constructiva: Metáfora Biológica vs. Operador Matemático',
    subtitle:
      'Desmitificación formal: distribuciones de probabilidad, operadores vectoriales y Cadenas de Markov.',
    pedagogicalGoal:
      'Traducir la terminología bio-inspirada a su equivalente riguroso en análisis estocástico y optimización matemática.',
    speakerScript:
      'Debemos desmitificar la disciplina. Más allá de la narrativa biológica, un algoritmo evolutivo no hace magia darwiniana: es un método iterativo de optimización estocástica. La "selección natural" es muestreo probabilístico ponderado; la "mutación y el cruce" son operadores estocásticos de perturbación y mezcla; y la "evolución poblacional" es formalmente una Cadena de Markov no estacionaria sobre distribuciones de probabilidad.',
    interactionHint:
      'Activa el conmutador "Traductor Matemático" para transformar cada término biológico en su definición formal y teorema equivalente.',
    plannedVisualSummary:
      'Interfaz "Traductor Matemático" con deslizador continuo que transforma tarjetas de jerga biológica ("Supervivencia del más apto", "Mutación", "Población") en ecuaciones estocásticas y Cadenas de Markov.',
    keyFormula: {
      label: 'Transición Markoviana de Poblaciones',
      tex: '\\mathbb{P}\\!\\left(P^{(g+1)} \\mid P^{(g)}, \\dots, P^{(0)}\\right) = \\mathbb{P}\\!\\left(P^{(g+1)} \\mid P^{(g)}\\right)',
    },
  },
  {
    id: 8,
    slug: 'operador-seleccion',
    block: 'Operadores Evolutivos',
    title: 'Operador de Selección: Ruleta vs. Torneo',
    subtitle:
      'Muestreo proporcional a la aptitud frente a competición estocástica con presión modulable.',
    pedagogicalGoal:
      'Explicar el fundamento probabilístico de la selección por ruleta y cómo el tamaño de torneo k regula la presión selectiva.',
    speakerScript:
      'El operador de selección concentra el presupuesto computacional en las regiones más prometedoras. En la selección por ruleta, cada individuo i tiene una probabilidad proporcional a su aptitud relativa P(i) = f_i / sum(f_j), lo cual puede sufrir cuando hay súper-individuos. En cambio, la selección por torneo enfrenta a k candidatos aleatorios y elige al mejor: incrementando k modulamos directamente la presión selectiva sin depender de escalas absolutas.',
    interactionHint:
      'Ajusta el tamaño de torneo k y lanza simulaciones de muestreo para comparar ruleta proporcional y torneo.',
    plannedVisualSummary:
      'Panel dual interactivo: ruleta circular proporcional animada frente a llaves de torneo estocástico de tamaño k configurable.',
    keyFormula: {
      label: 'Probabilidad de Selección Proporcional (Ruleta)',
      tex: 'P(i) = \\frac{f_i}{\\sum_{j=1}^{N} f_j}',
    },
  },
  {
    id: 9,
    slug: 'operador-recombinacion',
    block: 'Operadores Evolutivos',
    title: 'Operador de Recombinación (Cruce) y Teorema del Esquema',
    subtitle:
      'Cruce en 1 punto, 2 puntos y uniforme como motor de ensamblaje de bloques de construcción.',
    pedagogicalGoal:
      'Mostrar cómo el cruce recombina esquemas cortos de bajo orden y explicar la Hipótesis del Bloque de Construcción de Holland y Goldberg.',
    speakerScript:
      'La recombinación es el motor de ensamblaje de los Algoritmos Genéticos. Su objetivo es tomar "bloques de construcción" —esquemas cortos, de bajo orden y aptitud superior a la media— presentes en dos padres distintos y combinarlos en descendientes potencialmente superiores, tal como formaliza el Teorema del Esquema de Holland.',
    interactionHint:
      'Alterna entre cruce de 1 punto, 2 puntos y uniforme y pulsa "Ejecutar Recombinación" para visualizar la herencia cromosómica.',
    plannedVisualSummary:
      'Simulación cromosómica paso a paso con dos progenitores en colores contrastantes, puntos de corte dinámicos y resaltado de bloques de construcción preservados.',
    keyFormula: {
      label: 'Cota Inferior del Teorema del Esquema de Holland',
      tex: '\\mathbb{E}[m(H, g+1)] \\ge m(H, g)\\frac{\\bar{f}(H)}{\\bar{f}}\\left[1 - p_c\\frac{\\delta(H)}{L-1} - o(H)p_m\\right]',
    },
  },
  {
    id: 10,
    slug: 'operador-mutacion-agas',
    block: 'Operadores Evolutivos',
    title: 'Mutación, Ergodicidad y Algoritmos Adaptativos (AGAs)',
    subtitle:
      'Perturbación binaria o gaussiana para garantizar accesibilidad global y ajuste dinámico de parámetros.',
    pedagogicalGoal:
      'Demostrar por qué la mutación garantiza la ergodicidad de la cadena de Markov evolutiva y cómo los AGAs adaptan p_c y p_m.',
    speakerScript:
      'La mutación aplica perturbaciones estocásticas: inversión bit a bit con probabilidad p_m en representaciones discretas, o ruido Gaussiano N(0, sigma^2) en espacios reales. Matemáticamente, asegura la ergodicidad del algoritmo al evitar que la probabilidad de transición entre dos estados sea cero. Además, los Algoritmos Genéticos Adaptativos (AGAs) ajustan p_c y p_m en tiempo real según la dispersión de la aptitud.',
    interactionHint:
      'Modifica p_m o sigma y activa el modo adaptativo (AGA) para ver cómo reacciona la varianza de la población.',
    plannedVisualSummary:
      'Comparador visual de mutación bit-flip y distribución Gaussiana N(0, sigma^2) con indicador de ergodicidad y curva adaptativa de p_m.',
    keyFormula: {
      label: 'Perturbación Gaussiana en Espacios Continuos',
      tex: "\\mathbf{x}' = \\mathbf{x} + \\boldsymbol{\\varepsilon}, \\qquad \\boldsymbol{\\varepsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\sigma^2 \\mathbf{I})",
    },
  },
  {
    id: 11,
    slug: 'elitismo-y-parada',
    block: 'Operadores Evolutivos',
    title: 'Elitismo y Criterios de Parada',
    subtitle:
      'Conservación monótona de la mejor aptitud frente a la pérdida estocástica y condiciones de término.',
    pedagogicalGoal:
      'Ilustrar el rol del elitismo como trinquete de seguridad y sistematizar los criterios de detención del ciclo evolutivo.',
    speakerScript:
      'Sin elitismo, el azar del cruce y la mutación puede destruir la mejor solución hallada hasta el momento. Al preservar intactos los E mejores individuos hacia la siguiente generación, garantizamos una trayectoria monótona no decreciente de la mejor aptitud. Finalmente, el algoritmo se detiene al alcanzar un límite generacional g_max, detectar una meseta de convergencia o agotar el presupuesto temporal.',
    interactionHint:
      'Alterna el conmutador Elitismo ON/OFF para observar en la curva de aptitud cómo la ausencia de elitismo degrada temporalmente al mejor individuo.',
    plannedVisualSummary:
      'Gráfico SVG temporal (Aptitud Máxima vs. Aptitud Promedio) con toggle Elitismo ON/OFF mostrando caídas en la curva sin elitismo vs. escalera monótona con elitismo.',
    keyFormula: {
      label: 'Propiedad Monótona bajo Elitismo (Minimización)',
      tex: 'f\\!\\left(x_{\\text{best}}^{(g+1)}\\right) \\le f\\!\\left(x_{\\text{best}}^{(g)}\\right) \\quad \\forall\\, g \\ge 0',
    },
  },
  {
    id: 12,
    slug: 'pseudocodigo-estandarizado',
    block: 'Operadores Evolutivos',
    title: 'Pseudocódigo Base Estandarizado',
    subtitle:
      'Estructura canónica en 12 líneas que integra inicialización, operadores estocásticos y reemplazo elitista.',
    pedagogicalGoal:
      'Consolidar el flujo completo de una metaheurística evolutiva en un pseudocódigo limpio y trazable paso a paso.',
    speakerScript:
      'Aquí consolidamos todos los operadores vistos en un pseudocódigo estándar de 12 líneas. Partimos de una población inicial aleatoria, la evaluamos e inicializamos el contador generacional g <- 0. Dentro del bucle principal encadenamos selección por torneo, cruce, mutación, evaluación de descendientes y reemplazo elitista hasta satisfacer el criterio de parada. Este mismo código será el depurador vivo en el simulador de la siguiente diapositiva.',
    interactionHint:
      'Pasa el cursor o selecciona cualquiera de las 12 líneas para inspeccionar su rol algorítmico y su complejidad por iteración.',
    plannedVisualSummary:
      'Bloque de pseudocódigo numerado de 12 líneas con resaltado sintáctico por fase (Inicialización, Selección, Cruce, Mutación, Evaluación, Elitismo) y diagramas de flujo laterales.',
    keyFormula: {
      label: 'Inicialización de Contador Generacional',
      tex: 'g \\leftarrow 0, \\quad \\text{mientras } g < g_{\\max} \\text{ hacer } g \\leftarrow g + 1',
    },
  },
  {
    id: 13,
    slug: 'simulador-rastrigin-2d',
    block: 'Simulación y Comparativa',
    title: 'Simulador Interactivo Rastrigin 2D + Pseudocódigo',
    subtitle:
      'Depuración visual línea por línea sobre un paisaje multimodal en [-5.12, 5.12]^2.',
    pedagogicalGoal:
      'Observar en tiempo real cómo cada línea del pseudocódigo transforma la distribución espacial de la población sobre Rastrigin 2D.',
    speakerScript:
      'Pasemos de la teoría a la dinámica viva. A la izquierda tenemos las 12 líneas del pseudocódigo y a la derecha el plano cartesiano [-5.12, 5.12]^2 de la función multimodal de Rastrigin 2D, cuyo óptimo global está en (0,0) rodeado de decenas de trampas locales. Observen cómo el torneo, la interpolación del cruce, los saltos violetas de mutación y el halo dorado del elitismo guían la convergencia usando PRNG determinista Mulberry32.',
    interactionHint:
      'Usa Play/Pausa o Paso a Paso, cambia N, p_m, p_c, Elitismo y Velocidad en tiempo real, y observa el resaltado sincronizado de línea.',
    plannedVisualSummary:
      'Módulo estelar dividido: pseudocódigo interactivo de 12 líneas sincronizado con lienzo cartesiano SVG/Canvas Rastrigin 2D, gráfica de convergencia y sliders en vivo.',
    keyFormula: {
      label: 'Función Multimodal de Rastrigin 2D',
      tex: 'f(x, y) = 20 + x^2 + y^2 - 10\\left(\\cos(2\\pi x) + \\cos(2\\pi y)\\right)',
    },
  },
  {
    id: 14,
    slug: 'carrera-ag-vs-exacto',
    block: 'Simulación y Comparativa',
    title: 'Carrera en Vivo: Algoritmo Genético vs. Búsqueda Exacta',
    subtitle:
      'Comparativa empírica de evaluaciones y convergencia sobre el mismo espacio continuo Rastrigin 2D.',
    pedagogicalGoal:
      'Demostrar cuantitativamente la ventaja en costo de evaluaciones de una búsqueda evolutiva guiada frente a una grilla exhaustiva.',
    speakerScript:
      'Para cuantificar el ahorro computacional, enfrentamos en vivo a nuestro Algoritmo Genético contra una búsqueda exacta por grilla exhaustiva en el mismo espacio [-5.12, 5.12]^2. Mientras la grilla debe barrer sistemáticamente miles de celdas sin memoria de calidad previa, el algoritmo evolutivo concentra rápidamente sus evaluaciones alrededor de las cuencas de menor energía.',
    interactionHint:
      'Inicia la carrera simultánea y compara el contador de evaluaciones de aptitud y el mejor f(x,y) encontrado por ambos métodos.',
    plannedVisualSummary:
      'Doble lienzo sincronizado lado a lado: barrido sistemático de grilla exhaustiva vs. enjambre poblacional evolutivo, con marcadores de evaluaciones y mejor aptitud en vivo.',
    keyFormula: {
      label: 'Costo de Grilla Exhaustiva en D Dimensiones',
      tex: 'N_{\\text{eval, grilla}} = \\left(\\frac{b - a}{\\Delta}\\right)^D',
    },
  },
  {
    id: 15,
    slug: 'analisis-complejidad',
    block: 'Análisis y Límites',
    title: 'Análisis de Complejidad Computacional',
    subtitle:
      'Complejidad espacial O(N·L), temporal por generación y el cuello de botella dominante C_fit.',
    pedagogicalGoal:
      'Desglosar formalmente el costo algorítmico por generación e identificar que la evaluación de aptitud domina el tiempo real.',
    speakerScript:
      'Desde el punto de vista algorítmico, almacenar una población de N individuos de longitud L cuesta O(N·L) en memoria, y los operadores genéticos por generación toman apenas tiempo lineal O(N·L). El verdadero cuello de botella computacional es C_fit: cuando evaluar un candidato implica ejecutar simulaciones de dinámica de fluidos (CFD) o elementos finitos (FEA), la evaluación supera el 90% del tiempo total.',
    interactionHint:
      'Cambia el perfil de costo de C_fit (analítica simple vs. FEA vs. CFD) para observar cómo cambia la proporción del gráfico de dona y el tiempo proyectado.',
    plannedVisualSummary:
      'Gráfico circular tipo dona SVG desglosando Inicialización, Selección, Cruce, Mutación y Evaluación C_fit, junto a selector de complejidad de simulación.',
    keyFormula: {
      label: 'Complejidad Temporal por Generación',
      tex: 'T_{\\text{gen}} \\in \\mathcal{O}\\!\\left(N \\cdot C_{\\text{fit}} + N \\cdot L\\right)',
    },
  },
  {
    id: 16,
    slug: 'limites-paisaje-plano',
    block: 'Análisis y Límites',
    title: 'Límites Operativos: Paisaje Plano ("Aguja en un Pajar")',
    subtitle:
      'Por qué en funciones de decisión binaria limpia sin gradiente implícito la evolución colapsa.',
    pedagogicalGoal:
      'Evidenciar que los algoritmos evolutivos requieren correlación espacial de aptitud y fallan sobre mesetas completamente planas.',
    speakerScript:
      'Los algoritmos evolutivos no son mágicos. Si el paisaje de aptitud no ofrece ningún gradiente implícito de mejora —como un problema de decisión binaria limpia Correcto/Incorrecto o una aguja en un pajar—, todas las soluciones fuera del punto objetivo tienen exactamente la misma aptitud. Sin señal diferencial, la selección no puede guiar a la población y el algoritmo colapsa en una búsqueda aleatoria ciega.',
    interactionHint:
      'Alterna entre "Superficie Escalable" y "Paisaje Plano Sin Gradiente" para observar cómo la población pasa de converger a vagar erráticamente.',
    plannedVisualSummary:
      'Visualizador comparativo 2D de isolíneas y perfil transversal: paisaje con gradiente guía vs. meseta plana con una única aguja estrecha.',
    keyFormula: {
      label: 'Colapso por Ausencia de Señal Diferencial',
      tex: 'f(\\mathbf{x}) = c \\;\\forall\\, \\mathbf{x} \\neq \\mathbf{x}^* \\implies P(i) = \\frac{1}{N} \\;\\text{(muestreo uniforme)}',
    },
  },
  {
    id: 17,
    slug: 'paredes-hamming-codigo-gray',
    block: 'Análisis y Límites',
    title: 'Paredes de Hamming y Solución con Código Gray',
    subtitle:
      'Cómo evitar barreras de mutación destructivas entre enteros adyacentes en codificación binaria.',
    pedagogicalGoal:
      'Explicar el fenómeno de las paredes de Hamming en binario estándar (7 -> 8) y demostrar cómo el Código Gray garantiza adyacencia de 1 bit.',
    speakerScript:
      'Un problema clásico en representaciones binarias enteras son las paredes de Hamming. Pasar de 7 (0111) a 8 (1000) exige invertir los 4 bits simultáneamente: una distancia de Hamming de 4 que bloquea mutaciones simples. La codificación Gray resuelve esta barrera garantizando que dos enteros consecutivos difieran exactamente en un único bit, restaurando la continuidad del vecindario genotípico.',
    interactionHint:
      'Recorre el selector entero de 0 a 15 para comparar las transiciones de bits y la distancia de Hamming entre Binario Estándar y Código Gray.',
    plannedVisualSummary:
      'Comparador interactivo bit a bit entre Binario Natural y Código Gray con resaltado de bits que cambian en la transición 7 (0111) -> 8 (1000) vs. (0100) -> (1100).',
    keyFormula: {
      label: 'Conversión Binario a Código Gray y Transición Crítica',
      tex: 'G = B \\oplus (B \\gg 1), \\qquad d_H(0111_2,\\, 1000_2) = 4 \\;\\text{vs.}\\; d_H^{\\text{Gray}}(7, 8) = 1',
    },
  },
  {
    id: 18,
    slug: 'casos-reales-ingenieria',
    block: 'Aplicaciones y Cierre',
    title: 'Casos Reales en Ingeniería y Ciencia',
    subtitle:
      'Aeroespacial (NASA ST5), Automotriz (Frente de Pareto), Bioinformática y Sistemas Eléctricos.',
    pedagogicalGoal:
      'Conectar la maquinaria teórica con cuatro aplicaciones industriales reales en espacios no derivables, combinatorios y multiobjetivo.',
    speakerScript:
      'En el mundo real, estas técnicas resuelven problemas inabordables para el cálculo clásico. En la misión ST5 de la NASA, la computación evolutiva diseñó antenas con geometrías asimétricas que superaron a los diseños humanos. En ingeniería automotriz, optimiza el compromiso choque-peso mediante Frentes de Pareto. En bioinformática explora conformaciones de plegamiento proteico, y en sistemas eléctricos co-optimiza controladores continuos y reglas discretas en un mismo cromosoma.',
    interactionHint:
      'Selecciona cada caso industrial (Aeroespacial, Automotriz, Bioinformática, Redes Eléctricas) para inspeccionar su representación genotípica y beneficio clave.',
    plannedVisualSummary:
      'Matriz interactiva de 4 casos de estudio con íconos vectoriales, detalle de genotipo utilizado, gráfico de Frente de Pareto para el caso automotriz y métricas de impacto.',
  },
  {
    id: 19,
    slug: 'cierre-hiperheuristicas',
    block: 'Aplicaciones y Cierre',
    title: 'Conclusiones y Puente hacia Hiperheurísticas',
    subtitle:
      'Sensibilidad a hiperparámetros y la transición hacia el Diseño Automático de Algoritmos.',
    pedagogicalGoal:
      'Sintetizar los aprendizajes clave del módulo y abrir el puente temático hacia la siguiente exposición sobre hiperheurísticas.',
    speakerScript:
      'Para concluir, hemos visto que las metaheurísticas evolutivas destacan en problemas complejos de ingeniería y optimización continua o combinatoria gracias al desacople genotipo-fenotipo, el equilibrio exploración-explotación y su rigor estocástico. Sin embargo, su rendimiento depende fuertemente de calibrar manualmente N, p_c, p_m y los operadores. Precisamente esta sensibilidad abre la puerta al siguiente paradigma: las Hiperheurísticas y el Diseño Automático de Algoritmos, donde dejamos que los algoritmos diseñen algoritmos.',
    interactionHint:
      'Resumen interactivo de los 4 pilares y vista previa de la arquitectura de alto nivel de una Hiperheurística sobre metaheurísticas.',
    plannedVisualSummary:
      'Síntesis visual de los 4 pilares fundamentales conectada mediante diagrama SVG ascendente hacia la capa de Hiperheurísticas y Diseño Automático de Algoritmos.',
    keyFormula: {
      label: 'Meta-Nivel de Hiperheurísticas',
      tex: '\\max_{h \\in \\mathcal{H}} \\; \\mathbb{E}\\!\\left[\\text{Rendimiento}(h(\\mathcal{P}))\\right]',
    },
  },
];
