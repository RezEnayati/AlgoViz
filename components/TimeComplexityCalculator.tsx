'use client';

import React from 'react';

interface TimeComplexityCalculatorProps {
  nodeCount: number;
  edgeCount: number;
  currentStepIndex: number;
  totalSteps: number;
  isRunning: boolean;
}

export default function TimeComplexityCalculator({
  nodeCount,
  edgeCount,
  currentStepIndex,
  totalSteps,
  isRunning,
}: TimeComplexityCalculatorProps) {
  const V = nodeCount;
  const E = edgeCount;

  // Calculate time complexity: O((V + E) log V)
  const heapComplexity = V > 0 ? (V + E) * Math.log2(V) : 0;

  // Progress percentage
  const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  return (
    <div className="h-full bg-slate-900 rounded-lg p-4 overflow-auto">
      <h3 className="text-sm font-medium text-slate-300 mb-3">
        Complexity Analysis
      </h3>

      {/* Graph Stats */}
      <div className="mb-4 p-3 bg-slate-800 rounded-lg">
        <h4 className="text-xs font-medium text-slate-500 mb-2">Current Graph</h4>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-slate-500">V:</span>{' '}
            <span className="font-medium text-blue-400">{V}</span>
          </div>
          <div>
            <span className="text-slate-500">E:</span>{' '}
            <span className="font-medium text-green-400">{E}</span>
          </div>
        </div>
      </div>

      {/* Time Complexity */}
      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-4">
        <h4 className="text-xs font-medium text-blue-400 mb-2">Time Complexity</h4>
        <div className="text-lg text-blue-300 font-mono">
          O((V + E) log V)
        </div>
        <div className="text-xs text-blue-400/70 mt-2">
          ≈ {heapComplexity.toFixed(0)} operations
        </div>
      </div>

      {/* Live Progress */}
      {isRunning && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-slate-500 mb-2">
            Progress
          </h4>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Step {currentStepIndex + 1}</span>
            <span>{totalSteps} total</span>
          </div>
        </div>
      )}

      {/* Space Complexity */}
      <div className="p-3 bg-slate-800 rounded-lg">
        <h4 className="text-xs font-medium text-slate-500 mb-2">
          Space Complexity
        </h4>
        <div className="text-lg text-slate-300 font-mono">
          O(V)
        </div>
        <div className="text-xs text-slate-500 mt-2">
          Stores distances and predecessors
        </div>
      </div>
    </div>
  );
}
