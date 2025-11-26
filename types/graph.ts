// Graph Types for Algorithm Visualizer

export interface GraphNode {
  id: string;
  position: { x: number; y: number };
  data: { label: string };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  label?: string;
}

export interface DistanceUpdate {
  node: string;
  newDistance: number;
}

export interface RelaxedEdge {
  from: string;
  to: string;
  weight: number;
}

export interface AlgorithmStep {
  currentNode: string;
  visited: Set<string>;
  distanceUpdates: DistanceUpdate[];
  relaxedEdges: RelaxedEdge[];
  distances: Map<string, number>;
  predecessors: Map<string, string | null>;
}

export interface DijkstraResult {
  distances: Map<string, number>;
  predecessors: Map<string, string | null>;
  steps: AlgorithmStep[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type EditorMode = 'select' | 'addNode' | 'addEdge' | 'selectSource';
