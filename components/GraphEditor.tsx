'use client';

import React, { useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { GraphNode, GraphEdge, AlgorithmStep } from '@/types/graph';

interface GraphEditorProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  sourceNode: string | null;
  currentStep: AlgorithmStep | null;
  onNodesChange: (nodes: GraphNode[]) => void;
}

export default function GraphEditor({
  nodes,
  edges,
  sourceNode,
  currentStep,
  onNodesChange,
}: GraphEditorProps) {
  const isDragging = useRef(false);

  // Convert nodes to React Flow format
  const convertedNodes: Node[] = React.useMemo(() => {
    return nodes.map((node) => {
      const isVisited = currentStep?.visited.has(node.id) || false;
      const isCurrent = currentStep?.currentNode === node.id;
      const isSource = node.id === sourceNode;
      const distance = currentStep?.distances.get(node.id);

      let background = '#ffffff';
      if (isCurrent) background = '#fbbf24';
      else if (isVisited) background = '#4ade80';
      else if (isSource) background = '#60a5fa';

      let label = node.data.label;
      if (distance !== undefined && distance !== Infinity) {
        label = `${node.data.label} (${distance})`;
      }

      return {
        id: node.id,
        position: node.position,
        data: { label },
        style: {
          background,
          border: '2px solid #666',
          borderRadius: '50%',
          width: 50,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
        },
      };
    });
  }, [nodes, sourceNode, currentStep]);

  // Convert edges to React Flow format
  const convertedEdges: Edge[] = React.useMemo(() => {
    return edges.map((edge) => {
      const isRelaxed = currentStep?.relaxedEdges.some(
        (re) =>
          (re.from === edge.source && re.to === edge.target) ||
          (re.from === edge.target && re.to === edge.source)
      );

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: String(edge.weight),
        animated: isRelaxed,
        style: { stroke: isRelaxed ? '#f59e0b' : '#888', strokeWidth: 2 },
        labelStyle: { fontWeight: 700, fontSize: 14 },
        labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
      };
    });
  }, [edges, currentStep]);

  const [rfNodes, setRfNodes, onRfNodesChange] = useNodesState(convertedNodes);
  const [rfEdges, setRfEdges] = useEdgesState(convertedEdges);

  // Sync nodes from parent only when not dragging
  React.useEffect(() => {
    if (!isDragging.current) {
      setRfNodes(convertedNodes);
    }
  }, [convertedNodes, setRfNodes]);

  // Sync edges from parent
  React.useEffect(() => {
    setRfEdges(convertedEdges);
  }, [convertedEdges, setRfEdges]);

  const handleNodesChangeInternal = React.useCallback(
    (changes: NodeChange[]) => {
      onRfNodesChange(changes);

      // Check if we're starting or ending a drag
      for (const change of changes) {
        if (change.type === 'position') {
          if (change.dragging === true) {
            isDragging.current = true;
          } else if (change.dragging === false) {
            isDragging.current = false;

            // Update parent state only when drag ends
            setRfNodes((currentNodes) => {
              const updatedNodes = nodes.map((node) => {
                const rfNode = currentNodes.find((n) => n.id === node.id);
                if (rfNode) {
                  return { ...node, position: rfNode.position };
                }
                return node;
              });
              onNodesChange(updatedNodes);
              return currentNodes;
            });
          }
        }
      }
    },
    [nodes, onNodesChange, onRfNodesChange, setRfNodes]
  );

  return (
    <div style={{ width: '100%', height: '100%' }} className="bg-slate-900">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={handleNodesChangeInternal}
        fitView
      >
        <Controls
          position="top-right"
          className="!bg-slate-800 !border-slate-700 !shadow-lg"
        />
        <Background color="#334155" gap={20} />
      </ReactFlow>
    </div>
  );
}
