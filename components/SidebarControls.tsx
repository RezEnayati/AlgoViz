'use client';

import React from 'react';
import { EditorMode } from '@/types/graph';

interface SidebarControlsProps {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  onRunDijkstra: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  canStepForward: boolean;
  canStepBack: boolean;
  isRunning: boolean;
  currentStepIndex: number;
  totalSteps: number;
  sourceNode: string | null;
}

export default function SidebarControls({
  mode,
  onModeChange,
  onRunDijkstra,
  onStepForward,
  onStepBack,
  onReset,
  canStepForward,
  canStepBack,
  isRunning,
  currentStepIndex,
  totalSteps,
  sourceNode,
}: SidebarControlsProps) {
  const buttonBaseClass =
    'w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm';
  const activeClass = 'bg-blue-600 text-white shadow-md';
  const inactiveClass = 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  const disabledClass = 'bg-gray-100 text-gray-400 cursor-not-allowed';

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col gap-4">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Graph Editor</h2>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onModeChange('addNode')}
            className={`${buttonBaseClass} ${mode === 'addNode' ? activeClass : inactiveClass}`}
          >
            Add Node
          </button>
          <button
            onClick={() => onModeChange('addEdge')}
            className={`${buttonBaseClass} ${mode === 'addEdge' ? activeClass : inactiveClass}`}
          >
            Add Edge
          </button>
          <button
            onClick={() => onModeChange('selectSource')}
            className={`${buttonBaseClass} ${mode === 'selectSource' ? activeClass : inactiveClass}`}
          >
            Select Source
          </button>
          <button
            onClick={() => onModeChange('select')}
            className={`${buttonBaseClass} ${mode === 'select' ? activeClass : inactiveClass}`}
          >
            Select Mode
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Algorithm</h2>
        <div className="flex flex-col gap-2">
          <button
            onClick={onRunDijkstra}
            disabled={!sourceNode || isRunning}
            className={`${buttonBaseClass} ${
              !sourceNode || isRunning
                ? disabledClass
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            Run Dijkstra
          </button>
          {!sourceNode && (
            <p className="text-xs text-gray-500 italic">Select a source node first</p>
          )}
        </div>
      </div>

      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Playback</h2>
        {isRunning && (
          <div className="mb-3 text-sm text-gray-600">
            Step {currentStepIndex + 1} of {totalSteps}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <button
            onClick={onStepBack}
            disabled={!canStepBack}
            className={`${buttonBaseClass} ${canStepBack ? inactiveClass : disabledClass}`}
          >
            Step Back
          </button>
          <button
            onClick={onStepForward}
            disabled={!canStepForward}
            className={`${buttonBaseClass} ${canStepForward ? inactiveClass : disabledClass}`}
          >
            Step Forward
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Reset</h2>
        <button
          onClick={onReset}
          className={`${buttonBaseClass} bg-red-100 text-red-700 hover:bg-red-200`}
        >
          Reset Graph
        </button>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Legend</h3>
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-400 border-2 border-blue-600"></div>
            <span className="text-gray-600">Source Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-yellow-600"></div>
            <span className="text-gray-600">Current Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-green-600"></div>
            <span className="text-gray-600">Visited Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-yellow-500 rounded"></div>
            <span className="text-gray-600">Relaxed Edge</span>
          </div>
        </div>
      </div>
    </div>
  );
}
