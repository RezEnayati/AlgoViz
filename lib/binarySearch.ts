export interface BinarySearchStep {
  left: number;
  right: number;
  mid: number;
  comparison: 'equal' | 'less' | 'greater';
  found: boolean;
  description: string;
}

export interface BinarySearchResult {
  steps: BinarySearchStep[];
  foundIndex: number;
  found: boolean;
}

export function binarySearch(
  array: number[],
  target: number
): BinarySearchResult {
  const steps: BinarySearchStep[] = [];
  let left = 0;
  let right = array.length - 1;
  let foundIndex = -1;
  let found = false;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midValue = array[mid];

    let comparison: 'equal' | 'less' | 'greater';
    let description: string;

    if (midValue === target) {
      comparison = 'equal';
      description = `Found ${target} at index ${mid}`;
      found = true;
      foundIndex = mid;

      steps.push({
        left,
        right,
        mid,
        comparison,
        found: true,
        description,
      });

      break;
    } else if (midValue < target) {
      comparison = 'less';
      description = `${midValue} < ${target}, search right half`;

      steps.push({
        left,
        right,
        mid,
        comparison,
        found: false,
        description,
      });

      left = mid + 1;
    } else {
      comparison = 'greater';
      description = `${midValue} > ${target}, search left half`;

      steps.push({
        left,
        right,
        mid,
        comparison,
        found: false,
        description,
      });

      right = mid - 1;
    }
  }

  // If not found, add a final step
  if (!found && steps.length > 0) {
    const lastStep = steps[steps.length - 1];
    steps.push({
      ...lastStep,
      description: `${target} not found in array`,
      found: false,
    });
  }

  return {
    steps,
    foundIndex,
    found,
  };
}

// Generate a sorted array of random numbers
export function generateSortedArray(size: number, max: number = 100): number[] {
  const set = new Set<number>();
  while (set.size < size) {
    set.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(set).sort((a, b) => a - b);
}
