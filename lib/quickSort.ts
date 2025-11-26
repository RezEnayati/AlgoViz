export interface QuickSortStep {
  array: number[];
  low: number;
  high: number;
  pivotIndex: number;
  comparing: number[];
  swapping: number[];
  sorted: number[];
  description: string;
}

export interface QuickSortResult {
  steps: QuickSortStep[];
  sortedArray: number[];
}

export function quickSort(inputArray: number[]): QuickSortResult {
  const steps: QuickSortStep[] = [];
  const array = [...inputArray];
  const sorted: Set<number> = new Set();

  function addStep(
    low: number,
    high: number,
    pivotIndex: number,
    comparing: number[],
    swapping: number[],
    description: string
  ) {
    steps.push({
      array: [...array],
      low,
      high,
      pivotIndex,
      comparing: [...comparing],
      swapping: [...swapping],
      sorted: Array.from(sorted),
      description,
    });
  }

  function partition(low: number, high: number): number {
    const pivot = array[high];
    addStep(low, high, high, [], [], `Partitioning [${low}-${high}], pivot = ${pivot}`);

    let i = low - 1;

    for (let j = low; j < high; j++) {
      addStep(low, high, high, [j, high], [], `Comparing ${array[j]} with pivot ${pivot}`);

      if (array[j] <= pivot) {
        i++;
        if (i !== j) {
          addStep(low, high, high, [], [i, j], `${array[j]} <= ${pivot}, swapping ${array[i]} and ${array[j]}`);
          [array[i], array[j]] = [array[j], array[i]];
        } else {
          addStep(low, high, high, [], [], `${array[j]} <= ${pivot}, no swap needed`);
        }
      } else {
        addStep(low, high, high, [], [], `${array[j]} > ${pivot}, no action`);
      }
    }

    const pivotFinalPos = i + 1;
    if (pivotFinalPos !== high) {
      addStep(low, high, high, [], [pivotFinalPos, high], `Placing pivot ${pivot} at position ${pivotFinalPos}`);
      [array[pivotFinalPos], array[high]] = [array[high], array[pivotFinalPos]];
    }

    sorted.add(pivotFinalPos);
    addStep(low, high, pivotFinalPos, [], [], `Pivot ${pivot} is now in its final sorted position`);

    return pivotFinalPos;
  }

  function quickSortRecursive(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortRecursive(low, pi - 1);
      quickSortRecursive(pi + 1, high);
    } else if (low === high) {
      sorted.add(low);
      addStep(low, high, low, [], [], `Single element ${array[low]} is sorted`);
    }
  }

  if (array.length > 0) {
    addStep(0, array.length - 1, -1, [], [], `Starting QuickSort on array of ${array.length} elements`);
    quickSortRecursive(0, array.length - 1);

    // Mark all as sorted
    for (let i = 0; i < array.length; i++) {
      sorted.add(i);
    }
    addStep(0, array.length - 1, -1, [], [], `Array is now fully sorted`);
  }

  return {
    steps,
    sortedArray: array,
  };
}

// Generate a random array
export function generateRandomArray(size: number, max: number = 50): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 1);
}
