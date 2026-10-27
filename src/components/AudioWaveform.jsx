import React, { useEffect, useRef } from 'react';

/**
 * High-performance 60fps HTML5 Canvas audio waveform visualizer.
 * Employs stable animation refs to eliminate React re-render churn.
 */
export function AudioWaveform({ audioLevel = 0.2, isListening = false }) {
  const canvasRef = useRef(null);
  const audioLevelRef = useRef(audioLevel);

  // Keep latest audio level in ref without re-triggering the rendering effect
  useEffect(() => {
    audioLevelRef.current = audioLevel;
  }, [audioLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const numBars = 32;
    const barWidth = 4;
    const barGap = 4;
    let phase = 0;

    // Smoothed bar heights array for fluid animation
    const barHeights = new Array(numBars).fill(6);

    const render = () => {
      phase += 0.07;
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      const currentAmp = audioLevelRef.current || 0.15;
      const totalWidth = numBars * barWidth + (numBars - 1) * barGap;
      const startX = (width - totalWidth) / 2;

      // Draw subtle ambient glow behind the bars
      const glowGradient = ctx.createRadialGradient(
        width / 2, centerY, 10,
        width / 2, centerY, 80
      );
      glowGradient.addColorStop(0, 'rgba(16, 163, 127, 0.25)');
      glowGradient.addColorStop(1, 'rgba(16, 163, 127, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(width / 2, centerY, 80, 0, Math.PI * 2);
      ctx.fill();

      // Render each frequency bar
      for (let i = 0; i < numBars; i++) {
        const x = startX + i * (barWidth + barGap);
        const norm = i / numBars; // 0 to 1
        const bellCurve = Math.sin(norm * Math.PI); // Peak in center

        // Harmonic modulation
        const wave1 = Math.sin(norm * 4 + phase);
        const wave2 = Math.cos(norm * 6 - phase * 0.8);
        const targetHeight = Math.max(
          6,
          (bellCurve * 0.75 + Math.abs(wave1 * wave2) * 0.25) * (currentAmp * height * 0.9)
        );

        // Smooth interpolation
        barHeights[i] += (targetHeight - barHeights[i]) * 0.25;
        const dynamicH = barHeights[i];
        const y = centerY - dynamicH / 2;

        // Gradient: Emerald into bright cyan-green
        const barGradient = ctx.createLinearGradient(0, y, 0, y + dynamicH);
        barGradient.addColorStop(0, '#10a37f');
        barGradient.addColorStop(0.5, '#34d399');
        barGradient.addColorStop(1, '#059669');

        ctx.fillStyle = barGradient;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, dynamicH, 2);
        } else {
          ctx.rect(x, y, barWidth, dynamicH);
        }
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, []); // Run animation loop once on mount

  return (
    <div className="waveform-canvas-container" aria-label="Audio Visualizer">
      <canvas
        ref={canvasRef}
        width={300}
        height={100}
        style={{ display: 'block' }}
      />
    </div>
  );
}
