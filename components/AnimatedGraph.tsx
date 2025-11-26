'use client';

import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
}

interface Edge {
  from: number;
  to: number;
  progress: number;
  active: boolean;
}

export default function AnimatedGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize nodes
    const nodeCount = 12;
    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 6 + Math.random() * 4,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    nodesRef.current = nodes;

    // Initialize edges (connect nearby nodes)
    const edges: Edge[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() < 0.3) {
          edges.push({
            from: i,
            to: j,
            progress: 0,
            active: false,
          });
        }
      }
    }
    edgesRef.current = edges;

    let time = 0;
    let activeEdgeIndex = 0;

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 50 || node.x > canvas.offsetWidth - 50) node.vx *= -1;
        if (node.y < 50 || node.y > canvas.offsetHeight - 50) node.vy *= -1;

        // Keep in bounds
        node.x = Math.max(50, Math.min(canvas.offsetWidth - 50, node.x));
        node.y = Math.max(50, Math.min(canvas.offsetHeight - 50, node.y));
      });

      // Activate edges periodically (Dijkstra-like animation)
      if (Math.floor(time * 2) % 2 === 0 && edges.length > 0) {
        const edgeToActivate = Math.floor(time * 0.5) % edges.length;
        edges.forEach((edge, i) => {
          if (i === edgeToActivate) {
            edge.active = true;
            edge.progress = Math.min(1, edge.progress + 0.05);
          } else {
            edge.progress = Math.max(0, edge.progress - 0.02);
            if (edge.progress === 0) edge.active = false;
          }
        });
      }

      // Draw edges
      edges.forEach((edge) => {
        const fromNode = nodes[edge.from];
        const toNode = nodes[edge.to];
        const dist = Math.hypot(toNode.x - fromNode.x, toNode.y - fromNode.y);

        if (dist < 300) {
          const alpha = (1 - dist / 300) * 0.3;

          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);

          if (edge.active && edge.progress > 0) {
            // Animated active edge
            const gradient = ctx.createLinearGradient(
              fromNode.x, fromNode.y, toNode.x, toNode.y
            );
            gradient.addColorStop(0, `rgba(59, 130, 246, ${0.8 * edge.progress})`);
            gradient.addColorStop(edge.progress, `rgba(147, 51, 234, ${0.8 * edge.progress})`);
            gradient.addColorStop(1, `rgba(147, 51, 234, 0)`);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
          } else {
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
            ctx.lineWidth = 1;
          }
          ctx.stroke();

          // Draw weight label on some edges
          if (dist < 200 && edge.from < 5) {
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            ctx.font = '10px system-ui';
            ctx.fillStyle = `rgba(100, 116, 139, ${alpha * 2})`;
            ctx.fillText(String(Math.floor(dist / 20)), midX, midY);
          }
        }
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.2 + 1;
        const radius = node.radius * pulse;

        // Glow effect
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, radius * 3
        );
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        const nodeGradient = ctx.createRadialGradient(
          node.x - radius * 0.3, node.y - radius * 0.3, 0,
          node.x, node.y, radius
        );
        nodeGradient.addColorStop(0, '#60a5fa');
        nodeGradient.addColorStop(1, '#3b82f6');
        ctx.fillStyle = nodeGradient;
        ctx.fill();

        // Node border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}
