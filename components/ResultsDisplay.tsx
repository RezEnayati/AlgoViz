'use client';

import React from 'react';
import { GraphNode, AlgorithmStep } from '@/types/graph';

interface ResultsDisplayProps {
  nodes: GraphNode[];
  finalStep: AlgorithmStep | null;
  sourceNode: string | null;
  isComplete: boolean;
}

export default function ResultsDisplay({
  nodes,
  finalStep,
  sourceNode,
  isComplete,
}: ResultsDisplayProps) {
  if (!isComplete || !finalStep || !sourceNode) {
    return (
      <div className="h-full bg-slate-900 rounded-lg p-4">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Results</h3>
        <p className="text-sm text-slate-500">
          Run the algorithm to completion to see results.
        </p>
      </div>
    );
  }

  const sourceLabel = nodes.find((n) => n.id === sourceNode)?.data.label || sourceNode;

  // Build results from final step
  const results = nodes.map((node) => {
    const distance = finalStep.distances.get(node.id);

    // Reconstruct path using predecessors
    const path: string[] = [];
    let current: string | null | undefined = node.id;
    while (current) {
      path.unshift(current);
      current = finalStep.predecessors.get(current);
    }

    const pathLabels = path.map(
      (id) => nodes.find((n) => n.id === id)?.data.label || id
    );

    return {
      node: node.data.label,
      distance: distance === Infinity ? '∞' : distance,
      path: pathLabels.join(' → '),
      isReachable: distance !== Infinity,
    };
  });

  return (
    <div className="h-full bg-slate-900 rounded-lg p-4 overflow-auto">
      <h3 className="text-sm font-medium text-slate-300 mb-3">
        Results from: {sourceLabel}
      </h3>
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2 text-xs font-medium text-slate-500 border-b border-slate-700 pb-2">
          <span>Node</span>
          <span>Distance</span>
          <span>Path</span>
        </div>
        {results.map((result) => (
          <div
            key={result.node}
            className={`grid grid-cols-3 gap-2 text-sm py-1 ${
              result.isReachable ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            <span className="font-medium">{result.node}</span>
            <span className={result.isReachable ? 'text-green-400' : ''}>{result.distance}</span>
            <span className="text-xs truncate text-slate-400" title={result.path}>
              {result.isReachable ? result.path : 'Unreachable'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
