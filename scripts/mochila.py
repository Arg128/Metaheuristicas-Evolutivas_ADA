"""Compara un algoritmo genético binario con el muestreo uniforme y el óptimo exacto."""

import argparse
import csv
import itertools
import random
import statistics
import time
from dataclasses import asdict, dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
POPULATION = 20
GENERATIONS = 40
TOURNAMENT = 3
CROSSOVER = 0.85
SEEDS = range(42, 72)
BUDGET = POPULATION + (POPULATION - 1) * GENERATIONS


@dataclass(frozen=True)
class Instance:
    name: str
    capacity: int
    weights: tuple[int, ...]
    values: tuple[int, ...]


@dataclass(frozen=True)
class Candidate:
    bits: tuple[int, ...]
    weight: int
    value: int


@dataclass(frozen=True)
class Result:
    instancia: str
    metodo: str
    semilla: int
    evaluaciones: int
    cromosoma: str
    peso: int
    valor: int
    optimo: int
    alcanza_optimo: int
    tiempo_ms: float


KIT = Instance("kit", 10, (6, 3, 4, 2, 1), (9, 6, 7, 3, 2))


def synthetic(n, seed):
    rng = random.Random(seed)
    weights = tuple(rng.randint(1, 25) for _ in range(n))
    values = tuple(rng.randint(1, 40) for _ in range(n))
    return Instance(f"sintetica_{n}", sum(weights) * 2 // 5, weights, values)


def evaluate(instance, bits):
    weight = sum(w for w, bit in zip(instance.weights, bits) if bit)
    value = sum(v for v, bit in zip(instance.values, bits) if bit)
    return Candidate(bits, weight, value)


def uniform_bits(n, rng):
    return tuple(rng.getrandbits(1) for _ in range(n))


def initial_population(instance, rng):
    n = len(instance.weights)
    population = [evaluate(instance, (0,) * n)]
    population.extend(evaluate(instance, uniform_bits(n, rng)) for _ in range(POPULATION - 1))
    return population


def rank(candidate, capacity):
    if candidate.weight <= capacity:
        return (1, candidate.value, -candidate.weight)
    return (0, capacity - candidate.weight, candidate.value)


def genetic(instance, seed):
    rng = random.Random(seed)
    population = initial_population(instance, rng)
    n = len(instance.weights)
    mutation = 1 / n

    def key(candidate):
        return rank(candidate, instance.capacity)

    def parent():
        return max((rng.choice(population) for _ in range(TOURNAMENT)), key=key).bits

    for _ in range(GENERATIONS):
        next_population = [max(population, key=key)]
        while len(next_population) < POPULATION:
            a = parent()
            b = parent()
            if rng.random() < CROSSOVER:
                point = rng.randrange(1, n)
                child = a[:point] + b[point:]
            else:
                child = a
            child = tuple(1 - bit if rng.random() < mutation else bit for bit in child)
            next_population.append(evaluate(instance, child))
        population = next_population
    return max(population, key=key)


def sampling(instance, seed):
    rng = random.Random(seed)
    n = len(instance.weights)
    candidates = initial_population(instance, rng)
    candidates.extend(evaluate(instance, uniform_bits(n, rng)) for _ in range(BUDGET - POPULATION))
    return max(candidates, key=lambda c: rank(c, instance.capacity))


def exhaustive(instance):
    candidates = (evaluate(instance, bits) for bits in itertools.product((0, 1), repeat=len(instance.weights)))
    return max(candidates, key=lambda c: rank(c, instance.capacity))


def exact_value(instance):
    values = [0] * (instance.capacity + 1)
    for weight, value in zip(instance.weights, instance.values):
        for capacity in range(instance.capacity, weight - 1, -1):
            values[capacity] = max(values[capacity], values[capacity - weight] + value)
    return values[instance.capacity]


def run(instances):
    results = []
    for instance in instances:
        optimum = exact_value(instance)
        for seed in SEEDS:
            for name, method in (("genetico", genetic), ("aleatorio", sampling)):
                start = time.perf_counter_ns()
                best = method(instance, seed)
                elapsed_ms = (time.perf_counter_ns() - start) / 1_000_000
                if best.weight > instance.capacity or best.value > optimum:
                    raise RuntimeError(f"Resultado inválido en {instance.name} ({name}, {seed})")
                results.append(Result(
                    instance.name, name, seed, BUDGET, "".join(map(str, best.bits)),
                    best.weight, best.value, optimum, int(best.value == optimum),
                    round(elapsed_ms, 4),
                ))
    return results


def write_results(output, results):
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=Result.__dataclass_fields__)
        writer.writeheader()
        writer.writerows(asdict(result) for result in results)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--salida", type=Path, default=ROOT / "data" / "resultados.csv")
    args = parser.parse_args()

    best = exhaustive(KIT)
    if (best.bits, best.weight, best.value) != ((0, 1, 1, 1, 1), 10, 18) or exact_value(KIT) != 18:
        raise RuntimeError("El caso base no coincide con la enumeración y la programación dinámica.")
    instances = (KIT, synthetic(20, 2026), synthetic(40, 2027))
    results = run(instances)
    write_results(args.salida, results)

    print(f"Kit óptimo: {''.join(map(str, best.bits))}, {best.weight} kg, {best.value} puntos.")
    for instance in instances:
        for name in ("genetico", "aleatorio"):
            subset = [r for r in results if r.instancia == instance.name and r.metodo == name]
            values = [r.valor for r in subset]
            print(
                f"{instance.name} (n={len(instance.weights)}, W={instance.capacity}) {name}: "
                f"óptimo={subset[0].optimo}, éxitos={sum(r.alcanza_optimo for r in subset)}/{len(subset)}, "
                f"mediana={statistics.median(values):g}, rango={min(values)}–{max(values)}, "
                f"tiempo mediano={statistics.median(r.tiempo_ms for r in subset):.4f} ms"
            )
    print(f"{len(results)} corridas exportadas. Presupuesto por corrida: {BUDGET}.")


if __name__ == "__main__":
    main()
