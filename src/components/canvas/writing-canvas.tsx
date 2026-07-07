"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Eraser, Hand, Highlighter, Maximize2, Minus, Pencil, PenLine, Plus, Redo2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WritingTool } from "@/types/life";

type WritingCanvasProps = {
  value?: string;
  onChange: (dataUrl: string) => void;
  fullscreen?: boolean;
  onToggleFullscreen: () => void;
};

const toolIcons: Record<WritingTool, React.ComponentType<{ className?: string }>> = {
  pen: PenLine,
  pencil: Pencil,
  marker: Highlighter,
  eraser: Eraser
};

export function WritingCanvas({ value, onChange, fullscreen, onToggleFullscreen }: WritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const historyRef = useRef<string[]>([]);
  const redoRef = useRef<string[]>([]);
  const [tool, setTool] = useState<WritingTool>("pen");
  const [color, setColor] = useState("#1f2937");
  const [thickness, setThickness] = useState(4);
  const [zoom, setZoom] = useState(1);
  const [palmGuard, setPalmGuard] = useState(true);

  const exportCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return "";
    return canvas.toDataURL("image/png");
  }, []);

  const drawImage = useCallback((dataUrl?: string) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(255,250,238,0.01)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    if (!dataUrl) return;
    const image = new Image();
    image.onload = () => context.drawImage(image, 0, 0, canvas.width, canvas.height);
    image.src = dataUrl;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const previous = exportCanvas();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      drawImage(previous || value);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [drawImage, exportCanvas, value]);

  useEffect(() => {
    drawImage(value);
    historyRef.current = value ? [value] : [];
    redoRef.current = [];
  }, [drawImage, value]);

  const pushHistory = useCallback(() => {
    const snapshot = exportCanvas();
    if (snapshot) historyRef.current = [...historyRef.current.slice(-18), snapshot];
    redoRef.current = [];
  }, [exportCanvas]);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const applyStrokeStyle = (context: CanvasRenderingContext2D) => {
    context.lineCap = "round";
    context.lineJoin = "round";
    context.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    context.strokeStyle = color;
    context.globalAlpha = tool === "pencil" ? 0.48 : tool === "marker" ? 0.28 : 1;
    context.lineWidth = (tool === "marker" ? thickness * 2.4 : thickness) * (window.devicePixelRatio || 1);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (palmGuard && event.pointerType === "touch" && event.width > 40) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    pushHistory();
    canvas.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    lastPointRef.current = pointFromEvent(event);
    applyStrokeStyle(context);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const lastPoint = lastPointRef.current;
    if (!canvas || !context || !lastPoint) return;
    const nextPoint = pointFromEvent(event);
    applyStrokeStyle(context);
    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(nextPoint.x, nextPoint.y);
    context.stroke();
    context.globalAlpha = 1;
    lastPointRef.current = nextPoint;
  };

  const endStroke = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPointRef.current = null;
    onChange(exportCanvas());
  };

  const restore = (dataUrl?: string) => {
    drawImage(dataUrl);
    onChange(dataUrl ?? "");
  };

  const undo = () => {
    const current = exportCanvas();
    const previous = historyRef.current.pop();
    if (!previous) return;
    redoRef.current.push(current);
    restore(previous);
  };

  const redo = () => {
    const current = exportCanvas();
    const next = redoRef.current.pop();
    if (!next) return;
    historyRef.current.push(current);
    restore(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-[1.4rem] border bg-white/50 p-2 shadow-inner dark:bg-white/6">
        {(Object.keys(toolIcons) as WritingTool[]).map((item) => {
          const Icon = toolIcons[item];
          return (
            <Button
              key={item}
              type="button"
              size="iconSm"
              variant={tool === item ? "default" : "ghost"}
              title={item}
              aria-label={item}
              onClick={() => setTool(item)}
            >
              <Icon className="size-4" aria-hidden />
            </Button>
          );
        })}
        <input
          aria-label="Ink color"
          title="Ink color"
          type="color"
          value={color}
          onChange={(event) => setColor(event.target.value)}
          className="size-9 cursor-pointer rounded-full border bg-transparent p-1"
        />
        <input
          aria-label="Pen thickness"
          title="Pen thickness"
          type="range"
          min={1}
          max={18}
          value={thickness}
          onChange={(event) => setThickness(Number(event.target.value))}
          className="h-9 w-28 accent-blue-600"
        />
        <Button type="button" size="iconSm" variant="ghost" onClick={() => setZoom((value) => Math.max(0.75, value - 0.1))} aria-label="Zoom out">
          <Minus className="size-4" aria-hidden />
        </Button>
        <Button type="button" size="iconSm" variant="ghost" onClick={() => setZoom((value) => Math.min(1.75, value + 0.1))} aria-label="Zoom in">
          <Plus className="size-4" aria-hidden />
        </Button>
        <Button type="button" size="iconSm" variant="ghost" onClick={undo} aria-label="Undo">
          <Undo2 className="size-4" aria-hidden />
        </Button>
        <Button type="button" size="iconSm" variant="ghost" onClick={redo} aria-label="Redo">
          <Redo2 className="size-4" aria-hidden />
        </Button>
        <Button
          type="button"
          size="iconSm"
          variant={palmGuard ? "secondary" : "ghost"}
          onClick={() => setPalmGuard((value) => !value)}
          aria-label="Palm guard"
          title="Palm guard"
        >
          <Hand className="size-4" aria-hidden />
        </Button>
        <Button type="button" size="iconSm" variant="ghost" onClick={onToggleFullscreen} aria-label="Fullscreen">
          <Maximize2 className="size-4" aria-hidden />
        </Button>
      </div>
      <div className="overflow-auto rounded-paper border bg-white/35 p-3 shadow-paper dark:bg-white/5">
        <canvas
          ref={canvasRef}
          className={cn(
            "block h-[520px] w-full touch-none rounded-[1rem] paper-texture shadow-inner transition-transform",
            fullscreen && "h-[calc(100vh-13rem)]"
          )}
          style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
          aria-label="Handwriting canvas"
        />
      </div>
    </div>
  );
}
