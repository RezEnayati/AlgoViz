'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { binarySearch, generateSortedArray, BinarySearchStep } from '@/lib/binarySearch';

export default function BinarySearchVisualizerPage() {
  const [array, setArray] = useState<number[]>(() => generateSortedArray(15));
  const [target, setTarget] = useState<string>('');
  const [steps, setSteps] = useState<BinarySearchStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);
  const [found, setFound] = useState<boolean | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = currentStepIndex >= 0 && currentStepIndex < steps.length
    ? steps[currentStepIndex]
    : null;

  // Auto-play effect
  useEffect(() => {
    if (isPlaying && isRunning) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isRunning, speed, steps.length]);

  const handleGenerateArray = useCallback(() => {
    setArray(generateSortedArray(15));
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsRunning(false);
    setIsPlaying(false);
    setFound(null);
    setTarget('');
  }, []);

  const handleRunSearch = useCallback(() => {
    const targetNum = parseInt(target);
    if (isNaN(targetNum)) return;

    const result = binarySearch(array, targetNum);
    setSteps(result.steps);
    setCurrentStepIndex(0);
    setIsRunning(true);
    setIsPlaying(false);
    setFound(result.found);
  }, [array, target]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleStepForward = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }, [currentStepIndex, steps.length]);

  const handleStepBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }, [currentStepIndex]);

  const handleReset = useCallback(() => {
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsRunning(false);
    setIsPlaying(false);
    setFound(null);
  }, []);

  const getElementStyle = (index: number) => {
    if (!currentStep) return 'bg-slate-700 border-slate-600';

    if (currentStep.found && index === currentStep.mid) {
      return 'bg-green-500 border-green-400 text-white';
    }
    if (index === currentStep.mid) {
      return 'bg-yellow-500 border-yellow-400 text-slate-900';
    }
    if (index >= currentStep.left && index <= currentStep.right) {
      return 'bg-blue-500/20 border-blue-500';
    }
    return 'bg-slate-800 border-slate-700 opacity-40';
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-900 flex">
      {/* Sidebar */}
      <div className="w-72 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Target Input */}
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Target Value</h3>
          <div className="flex gap-2">
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Enter number"
              className="flex-1 px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Controls</h3>
          <div className="space-y-2">
            <button
              onClick={handleRunSearch}
              disabled={!target || isRunning}
              className="w-full px-3 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              Run Search
            </button>
            <button
              onClick={handleGenerateArray}
              className="w-full px-3 py-2 text-sm font-medium rounded-lg bg-slate-600 text-white hover:bg-slate-500 transition-colors"
            >
              New Array
            </button>
          </div>
        </div>

        {/* Playback */}
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Playback</h3>
          {isRunning && (
            <p className="text-sm text-slate-400 mb-3">
              Step {currentStepIndex + 1} of {steps.length}
            </p>
          )}

          {/* Auto-play button */}
          {isRunning && (
            <button
              onClick={handlePlayPause}
              disabled={currentStepIndex >= steps.length - 1}
              className={`w-full mb-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isPlaying
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed`}
            >
              {isPlaying ? 'Pause' : 'Auto Play'}
            </button>
          )}

          {/* Speed control */}
          {isRunning && (
            <div className="mb-3">
              <label className="block text-xs text-slate-500 mb-1">
                Speed: {speed}ms
              </label>
              <input
                type="range"
                min="100"
                max="1000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Fast</span>
                <span>Slow</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleStepBack}
              disabled={!isRunning || currentStepIndex <= 0 || isPlaying}
              className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-slate-700 text-white hover:bg-slate-600 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleStepForward}
              disabled={!isRunning || currentStepIndex >= steps.length - 1 || isPlaying}
              className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-slate-700 text-white hover:bg-slate-600 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
          {isRunning && (
            <button
              onClick={handleReset}
              className="w-full mt-2 px-3 py-2 text-sm font-medium rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="p-4 mt-auto">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Legend</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500"></div>
              <span className="text-slate-400">Current Mid</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500/40 border border-blue-500"></div>
              <span className="text-slate-400">Search Range</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-slate-400">Found</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-800 opacity-40"></div>
              <span className="text-slate-400">Eliminated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Step Description */}
        {currentStep && (
          <div className="p-4 bg-slate-800 border-b border-slate-700">
            <p className="text-sm text-slate-300">
              <span className="text-slate-500">Step {currentStepIndex + 1}:</span>{' '}
              {currentStep.description}
            </p>
          </div>
        )}

        {/* Array Visualization */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex gap-2 flex-wrap justify-center">
            {array.map((value, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-mono text-sm font-medium transition-all duration-300 ${getElementStyle(index)}`}
                >
                  {value}
                </div>
                <span className="text-xs text-slate-500">{index}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Panel - Complexity Info */}
        <div className="h-48 p-4 bg-slate-800 border-t border-slate-700">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Complexity */}
            <div className="bg-slate-900 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Complexity</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Time</span>
                  <span className="text-blue-400 font-mono">O(log n)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Space</span>
                  <span className="text-slate-400 font-mono">O(1)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Array Size</span>
                  <span className="text-slate-400">{array.length} elements</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Max Steps</span>
                  <span className="text-slate-400">{Math.ceil(Math.log2(array.length))}</span>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="bg-slate-900 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Result</h3>
              {found === null ? (
                <p className="text-sm text-slate-500">Run the search to see results.</p>
              ) : found ? (
                <div className="space-y-2">
                  <p className="text-sm text-green-400">Target found</p>
                  <p className="text-sm text-slate-400">
                    Index: <span className="text-white font-mono">{steps[steps.length - 1]?.mid}</span>
                  </p>
                  <p className="text-sm text-slate-400">
                    Steps taken: <span className="text-white">{steps.length}</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-red-400">Target not found</p>
                  <p className="text-sm text-slate-400">
                    Steps taken: <span className="text-white">{steps.length}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
