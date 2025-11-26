// Dijkstra's Algorithm Implementation with Min-Heap Priority Queue

import {
  GraphNode,
  GraphEdge,
  AlgorithmStep,
  DijkstraResult,
  DistanceUpdate,
  RelaxedEdge,
} from '@/types/graph';

// Min-Heap Priority Queue Implementation
class MinHeap {
  private heap: { node: string; distance: number }[] = [];

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  private swap(index1: number, index2: number): void {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }

  private heapifyUp(index: number): void {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.heap[parentIndex].distance > this.heap[index].distance) {
        this.swap(parentIndex, index);
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  private heapifyDown(index: number): void {
    while (true) {
      const leftIndex = this.getLeftChildIndex(index);
      const rightIndex = this.getRightChildIndex(index);
      let smallest = index;

      if (
        leftIndex < this.heap.length &&
        this.heap[leftIndex].distance < this.heap[smallest].distance
      ) {
        smallest = leftIndex;
      }

      if (
        rightIndex < this.heap.length &&
        this.heap[rightIndex].distance < this.heap[smallest].distance
      ) {
        smallest = rightIndex;
      }

      if (smallest !== index) {
        this.swap(index, smallest);
        index = smallest;
      } else {
        break;
      }
    }
  }

  insert(node: string, distance: number): void {
    this.heap.push({ node, distance });
    this.heapifyUp(this.heap.length - 1);
  }

  extractMin(): { node: string; distance: number } | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!;

    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown(0);
    return min;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  decreaseKey(node: string, newDistance: number): void {
    const index = this.heap.findIndex((item) => item.node === node);
    if (index !== -1 && newDistance < this.heap[index].distance) {
      this.heap[index].distance = newDistance;
      this.heapifyUp(index);
    }
  }
}

// Build adjacency list from edges
function buildAdjacencyList(
  nodes: GraphNode[],
  edges: GraphEdge[]
): Map<string, { neighbor: string; weight: number }[]> {
  const adjacencyList = new Map<string, { neighbor: string; weight: number }[]>();

  // Initialize adjacency list for all nodes
  nodes.forEach((node) => {
    adjacencyList.set(node.id, []);
  });

  // Add edges (undirected graph - add both directions)
  edges.forEach((edge) => {
    const sourceList = adjacencyList.get(edge.source);
    const targetList = adjacencyList.get(edge.target);

    if (sourceList) {
      sourceList.push({ neighbor: edge.target, weight: edge.weight });
    }
    if (targetList) {
      targetList.push({ neighbor: edge.source, weight: edge.weight });
    }
  });

  return adjacencyList;
}

// Validate edges for negative weights
function validateEdges(edges: GraphEdge[]): void {
  for (const edge of edges) {
    if (edge.weight < 0) {
      throw new Error(
        `Negative weight detected on edge ${edge.source} -> ${edge.target}. Dijkstra's algorithm does not support negative weights.`
      );
    }
  }
}

// Main Dijkstra's Algorithm
export function dijkstra(
  nodes: GraphNode[],
  edges: GraphEdge[],
  sourceId: string
): DijkstraResult {
  // Validate no negative weights
  validateEdges(edges);

  // Validate source node exists
  const sourceExists = nodes.some((node) => node.id === sourceId);
  if (!sourceExists) {
    throw new Error(`Source node ${sourceId} does not exist in the graph.`);
  }

  const adjacencyList = buildAdjacencyList(nodes, edges);
  const distances = new Map<string, number>();
  const predecessors = new Map<string, string | null>();
  const visited = new Set<string>();
  const steps: AlgorithmStep[] = [];
  const priorityQueue = new MinHeap();

  // Initialize distances to infinity and predecessors to null
  nodes.forEach((node) => {
    distances.set(node.id, node.id === sourceId ? 0 : Infinity);
    predecessors.set(node.id, null);
  });

  // Insert source into priority queue
  priorityQueue.insert(sourceId, 0);

  while (!priorityQueue.isEmpty()) {
    const current = priorityQueue.extractMin();
    if (!current) break;

    const { node: currentNode, distance: currentDistance } = current;

    // Skip if already visited
    if (visited.has(currentNode)) continue;

    // Mark as visited
    visited.add(currentNode);

    const distanceUpdates: DistanceUpdate[] = [];
    const relaxedEdges: RelaxedEdge[] = [];

    // Get neighbors
    const neighbors = adjacencyList.get(currentNode) || [];

    for (const { neighbor, weight } of neighbors) {
      if (visited.has(neighbor)) continue;

      const newDistance = currentDistance + weight;
      const currentNeighborDistance = distances.get(neighbor) || Infinity;

      if (newDistance < currentNeighborDistance) {
        // Update distance
        distances.set(neighbor, newDistance);
        predecessors.set(neighbor, currentNode);
        priorityQueue.insert(neighbor, newDistance);

        distanceUpdates.push({ node: neighbor, newDistance });
        relaxedEdges.push({ from: currentNode, to: neighbor, weight });
      }
    }

    // Record this step
    steps.push({
      currentNode,
      visited: new Set(visited),
      distanceUpdates: [...distanceUpdates],
      relaxedEdges: [...relaxedEdges],
      distances: new Map(distances),
      predecessors: new Map(predecessors),
    });
  }

  return {
    distances,
    predecessors,
    steps,
  };
}

// Helper to get shortest path from source to target
export function getShortestPath(
  predecessors: Map<string, string | null>,
  targetId: string
): string[] {
  const path: string[] = [];
  let current: string | null = targetId;

  while (current !== null) {
    path.unshift(current);
    current = predecessors.get(current) || null;
  }

  return path;
}
