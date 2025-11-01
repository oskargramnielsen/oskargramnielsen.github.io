'use client';

import { useEffect, useRef } from 'react';

interface TechFieldProps {
  skills: string[];
}

interface Node {
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function TechField({ skills }: TechFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const nodes: Node[] = skills.map((label, index) => ({
      label,
      radius: 12 + Math.random() * 18,
      x: 80 + Math.random() * (canvas.width - 160),
      y: 80 + Math.random() * (canvas.height - 160),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    let animationFrame: number;
    let lastTimestamp = 0;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const ratio = window.devicePixelRatio || 1;
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.scale(ratio, ratio);
    };

    resizeCanvas();

    const observer = new ResizeObserver(() => {
      context.resetTransform();
      resizeCanvas();
    });
    observer.observe(canvas.parentElement ?? canvas);

    const step = (timestamp: number) => {
      animationFrame = requestAnimationFrame(step);
      const delta = Math.min((timestamp - lastTimestamp) / 16.67, 2.5);
      lastTimestamp = timestamp;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();

      context.fillStyle = 'rgba(15, 23, 42, 0.06)';
      if (document.documentElement.classList.contains('dark')) {
        context.fillStyle = 'rgba(148, 163, 184, 0.08)';
      }

      nodes.forEach((node, nodeIndex) => {
        node.x += node.vx * delta * 1.2;
        node.y += node.vy * delta * 1.2;

        if (node.x < node.radius || node.x > canvas.clientWidth - node.radius) {
          node.vx *= -1;
        }
        if (node.y < node.radius || node.y > canvas.clientHeight - node.radius) {
          node.vy *= -1;
        }

        if (pointerRef.current) {
          const dx = pointerRef.current.x - node.x;
          const dy = pointerRef.current.y - node.y;
          const distSq = dx * dx + dy * dy;
          const threshold = 220 * 220;
          if (distSq < threshold && distSq > 6) {
            const force = (1 - distSq / threshold) * 0.35;
            node.vx -= (dx / Math.sqrt(distSq)) * force * 0.015;
            node.vy -= (dy / Math.sqrt(distSq)) * force * 0.015;
          }
        }

        for (let i = nodeIndex + 1; i < nodes.length; i++) {
          const target = nodes[i];
          const dx = target.x - node.x;
          const dy = target.y - node.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 180) {
            const alpha = 1 - distance / 180;
            context.strokeStyle = `rgba(94, 234, 212, ${0.25 * alpha})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(node.x, node.y);
            context.lineTo(target.x, target.y);
            context.stroke();
          }
        }

        const gradient = context.createRadialGradient(node.x, node.y, node.radius * 0.2, node.x, node.y, node.radius);
        gradient.addColorStop(0, 'rgba(94, 234, 212, 0.65)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.15)');
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context.fill();

        context.font = '500 12px var(--font-sans, "Inter")';
        context.fillStyle = 'rgba(15, 23, 42, 0.88)';
        if (document.documentElement.classList.contains('dark')) {
          context.fillStyle = 'rgba(226, 232, 240, 0.92)';
        }
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(node.label, node.x, node.y);
      });

      context.restore();
    };

    animationFrame = requestAnimationFrame(step);

    const handlePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const clearPointer = () => {
      pointerRef.current = null;
    };

    canvas.addEventListener('pointermove', handlePointer);
    canvas.addEventListener('pointerleave', clearPointer);
    canvas.addEventListener('pointerdown', handlePointer);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      canvas.removeEventListener('pointermove', handlePointer);
      canvas.removeEventListener('pointerleave', clearPointer);
      canvas.removeEventListener('pointerdown', handlePointer);
    };
  }, [skills]);

  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-[1.75rem] border border-border/40 bg-card/60">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="backdrop-grid" />
    </div>
  );
}
