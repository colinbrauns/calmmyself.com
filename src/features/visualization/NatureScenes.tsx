"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import ShapeBreather from "@/components/ShapeBreather";
import {
  Mountain,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  Sparkles,
  Sun,
  Trees,
  Volume2,
  VolumeX,
  Waves,
  MicOff,
} from "lucide-react";

interface ScenePalette {
  badgeBg: string;
  badgeText: string;
  accent: string;
  text: string;
  gradientFrom: string;
  gradientTo: string;
  surface: string;
  glowFrom: string;
  glowTo: string;
}

interface SceneBackgroundConfig {
  gradient: string;
  overlay: string;
  particle: string;
}

interface NatureScene {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
  visualization: string[];
  sounds: string[];
  sensations: string[];
  palette: ScenePalette;
  background: SceneBackgroundConfig;
  ambient: {
    url: string;
    credit: string;
  };
  breathing: {
    durationMs: number;
  };
}

const NATURE_SCENES: NatureScene[] = [
  {
    id: "forest",
    name: "Peaceful Forest",
    icon: Trees,
    color: "calm",
    description: "A quiet woodland path dappled with sunlight",
    visualization: [
      "You're walking on a soft forest path covered with fallen leaves.",
      "Tall trees stretch up around you, their branches forming a natural canopy.",
      "Gentle rays of sunlight filter through the leaves, creating dancing patterns of light and shadow.",
      "The air is fresh and clean, filled with the scent of earth and growing things.",
      "You can hear birds singing softly in the distance and leaves rustling in a gentle breeze.",
    ],
    sounds: [
      "Gentle rustling of leaves",
      "Distant bird songs",
      "Your footsteps on the soft earth",
      "A gentle breeze through the trees",
      "Perhaps the distant sound of a stream",
    ],
    sensations: [
      "Cool, fresh air filling your lungs",
      "Soft earth beneath your feet",
      "Dappled sunlight warming your skin",
      "A gentle breeze on your face",
      "The peaceful feeling of being embraced by nature",
    ],
    palette: {
      badgeBg: "bg-emerald-100/80",
      badgeText: "",
      accent: "bg-emerald-500",
      text: "",
      gradientFrom: "from-emerald-300/70",
      gradientTo: "to-emerald-600/80",
      surface: "bg-white/65",
      glowFrom: "from-emerald-300",
      glowTo: "to-emerald-600",
    },
    background: {
      gradient:
        "radial-gradient(at 20% 20%, rgba(74,222,128,0.45) 0%, transparent 55%), radial-gradient(at 80% 15%, rgba(34,197,94,0.4) 0%, transparent 45%), radial-gradient(at 30% 80%, rgba(6,95,70,0.55) 0%, transparent 52%)",
      overlay: "bg-emerald-950/45",
      particle: "rgba(52,211,153,0.28)",
    },
    ambient: {
      url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_1a1b0ada55.mp3?filename=forest-birdsong-ambient-110624.mp3",
      credit: "Forest birdsong by Pixabay (CC0)",
    },
    breathing: {
      durationMs: 7000,
    },
  },
  {
    id: "ocean",
    name: "Ocean Shore",
    icon: Waves,
    color: "calm",
    description: "A serene beach with gentle waves and warm sand",
    visualization: [
      "You're sitting on warm, soft sand at the edge of a beautiful ocean.",
      "The water is a stunning blue-green color, clear and inviting.",
      "Gentle waves roll in rhythmically, creating white foam as they meet the shore.",
      "The horizon stretches endlessly where the ocean meets the sky.",
      "Seagulls glide gracefully overhead against a backdrop of puffy white clouds.",
    ],
    sounds: [
      "Rhythmic sound of waves washing ashore",
      "Gentle hiss as water retreats over sand",
      "Seagulls calling in the distance",
      "Gentle breeze rustling through beach grass",
      "The vast, peaceful sound of the ocean",
    ],
    sensations: [
      "Warm sand beneath you",
      "Gentle ocean breeze on your skin",
      "Warm sun on your face",
      "Salt air filling your lungs",
      "Cool water touching your feet",
    ],
    palette: {
      badgeBg: "bg-sky-100/75",
      badgeText: "",
      accent: "bg-sky-500",
      text: "",
      gradientFrom: "from-sky-300/70",
      gradientTo: "to-cyan-500/80",
      surface: "bg-white/60",
      glowFrom: "from-sky-300",
      glowTo: "to-cyan-500",
    },
    background: {
      gradient:
        "radial-gradient(at 15% 25%, rgba(125,211,252,0.45) 0%, transparent 55%), radial-gradient(at 80% 30%, rgba(56,189,248,0.45) 0%, transparent 45%), radial-gradient(at 35% 85%, rgba(14,165,233,0.4) 0%, transparent 52%)",
      overlay: "bg-cyan-950/35",
      particle: "rgba(56,189,248,0.35)",
    },
    ambient: {
      url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_586d05f7f0.mp3?filename=waves-ambient-5746.mp3",
      credit: "Ocean waves by Pixabay (CC0)",
    },
    breathing: {
      durationMs: 8000,
    },
  },
  {
    id: "mountain",
    name: "Mountain Peak",
    icon: Mountain,
    color: "calm",
    description: "A peaceful mountain summit with vast views",
    visualization: [
      "You're sitting on a comfortable rocky outcrop at the top of a beautiful mountain.",
      "Rolling hills and valleys stretch out below you in all directions.",
      "The air is crisp and clear, with unlimited visibility.",
      "Other mountain peaks rise in the distance, creating layers of blue and purple silhouettes.",
      "Above you, the sky is a brilliant blue with white clouds drifting slowly by.",
    ],
    sounds: [
      "Gentle wind through the mountain air",
      "Distant echo from the valleys below",
      "Perhaps the call of a hawk circling overhead",
      "Your own peaceful breathing",
      "The profound silence of high places",
    ],
    sensations: [
      "Cool, crisp mountain air",
      "Warm sun on your back",
      "Solid rock supporting you",
      "Gentle breeze in your hair",
      "A sense of elevation and expansiveness",
    ],
    palette: {
      badgeBg: "bg-indigo-100/75",
      badgeText: "",
      accent: "bg-indigo-500",
      text: "",
      gradientFrom: "from-indigo-300/70",
      gradientTo: "to-purple-500/75",
      surface: "bg-white/58",
      glowFrom: "from-indigo-300",
      glowTo: "to-purple-500",
    },
    background: {
      gradient:
        "radial-gradient(at 20% 20%, rgba(129,140,248,0.4) 0%, transparent 55%), radial-gradient(at 80% 15%, rgba(99,102,241,0.45) 0%, transparent 45%), radial-gradient(at 30% 80%, rgba(168,85,247,0.4) 0%, transparent 52%)",
      overlay: "bg-indigo-950/35",
      particle: "rgba(129,140,248,0.3)",
    },
    ambient: {
      url: "https://cdn.pixabay.com/download/audio/2021/09/29/audio_52a6f2f2d3.mp3?filename=wind-ambience-5980.mp3",
      credit: "Mountain wind by Pixabay (CC0)",
    },
    breathing: {
      durationMs: 9000,
    },
  },
  {
    id: "meadow",
    name: "Sunny Meadow",
    icon: Sun,
    color: "calm",
    description: "A flower-filled meadow on a perfect day",
    visualization: [
      "You're lying in a beautiful meadow filled with wildflowers.",
      "Colorful blooms surround you - yellows, purples, whites, and pinks.",
      "The grass is soft and green, swaying gently in a warm breeze.",
      "Above you, the sky is a perfect blue with fluffy white clouds.",
      "Butterflies dance from flower to flower, and bees hum contentedly nearby.",
    ],
    sounds: [
      "Gentle buzzing of bees among flowers",
      "Grass and flowers swaying in the breeze",
      "Birds singing happily nearby",
      "The whisper of wind through the meadow",
      "Your own peaceful breathing",
    ],
    sensations: [
      "Soft grass beneath you",
      "Warm sunshine on your skin",
      "Gentle breeze carrying flower scents",
      "The tickle of grass around you",
      "Complete relaxation and peace",
    ],
    palette: {
      badgeBg: "bg-amber-100/80",
      badgeText: "",
      accent: "bg-amber-500",
      text: "",
      gradientFrom: "from-amber-200/75",
      gradientTo: "to-orange-400/80",
      surface: "bg-white/62",
      glowFrom: "from-amber-200",
      glowTo: "to-orange-400",
    },
    background: {
      gradient:
        "radial-gradient(at 18% 22%, rgba(251,191,36,0.4) 0%, transparent 55%), radial-gradient(at 78% 18%, rgba(249,115,22,0.35) 0%, transparent 45%), radial-gradient(at 25% 82%, rgba(250,204,21,0.45) 0%, transparent 52%)",
      overlay: "bg-amber-950/30",
      particle: "rgba(250,204,21,0.32)",
    },
    ambient: {
      url: "https://cdn.pixabay.com/download/audio/2022/07/23/audio_5a6ad4fbb0.mp3?filename=summer-meadow-115353.mp3",
      credit: "Summer meadow by Pixabay (CC0)",
    },
    breathing: {
      durationMs: 7500,
    },
  },
];

const DEFAULT_BACKGROUND =
  "radial-gradient(at 18% 22%, rgba(14,165,233,0.2) 0%, transparent 55%), radial-gradient(at 70% 18%, rgba(59,130,246,0.15) 0%, transparent 50%)";

const STEP_LABELS = ["Visualize", "Listen", "Feel"];

const SCENE_SHAPES: Record<
  NatureScene["id"],
  "flower" | "circle" | "triangle" | "square"
> = {
  forest: "flower",
  ocean: "circle",
  mountain: "triangle",
  meadow: "flower",
};

/* ────────────────────────────────────────────
   Canvas Drawing Functions
   ──────────────────────────────────────────── */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  speed: number;
  color?: string;
  life?: number;
}

function seededParticles(
  count: number,
  w: number,
  h: number,
  opts?: { colors?: string[] },
): Particle[] {
  const arr: Particle[] = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.3,
      size: 2 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.7,
      color: opts?.colors
        ? opts.colors[Math.floor(Math.random() * opts.colors.length)]
        : undefined,
    });
  }
  return arr;
}

function drawForest(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  bs: number,
  particles: React.MutableRefObject<Particle[] | null>,
) {
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
  sky.addColorStop(0, "#87CEEB");
  sky.addColorStop(0.7, "#c8e6c9");
  sky.addColorStop(1, "#e8f5e9");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Light rays
  ctx.save();
  ctx.globalAlpha = 0.06 + 0.02 * Math.sin(t * 0.3);
  for (let i = 0; i < 5; i++) {
    const rx = w * 0.15 + i * w * 0.18;
    ctx.fillStyle = "rgba(255,255,200,0.5)";
    ctx.beginPath();
    ctx.moveTo(rx, 0);
    ctx.lineTo(rx - 30 + Math.sin(t * 0.2 + i) * 10, h * 0.7);
    ctx.lineTo(rx + 50 + Math.sin(t * 0.2 + i) * 10, h * 0.7);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Mountain/hill layers
  const hillColors = ["#1b5e20", "#2e7d32", "#388e3c", "#4caf50"];
  for (let layer = 0; layer < 4; layer++) {
    const ly = h * (0.35 + layer * 0.1);
    const amp = 30 + layer * 15;
    ctx.fillStyle = hillColors[layer];
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 4) {
      const yy =
        ly +
        Math.sin(x * 0.005 + layer * 2 + t * 0.05 * (0.5 - layer * 0.1)) * amp +
        Math.sin(x * 0.012 + layer) * amp * 0.4;
      ctx.lineTo(x, yy);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  }

  // Trees
  const treePositions = [0.08, 0.18, 0.3, 0.42, 0.55, 0.65, 0.78, 0.9];
  for (const tx of treePositions) {
    const bx = tx * w;
    const by = h * 0.62 + Math.sin(tx * 10) * 20;
    const sway = Math.sin(t * 0.5 + tx * 5) * 3;
    // Trunk
    ctx.fillStyle = "#5D4037";
    ctx.fillRect(bx - 4, by - 60, 8, 70);
    // Canopy layers
    const greens = ["#2e7d32", "#388e3c", "#43a047", "#66bb6a"];
    for (let c = 0; c < 3; c++) {
      ctx.fillStyle = greens[c];
      ctx.beginPath();
      ctx.arc(
        bx + sway * (1 + c * 0.3),
        by - 60 - c * 18,
        22 - c * 3,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }

  // Ground
  const ground = ctx.createLinearGradient(0, h * 0.75, 0, h);
  ground.addColorStop(0, "#33691e");
  ground.addColorStop(1, "#1b5e20");
  ctx.fillStyle = ground;
  ctx.fillRect(0, h * 0.75, w, h * 0.25);

  // Grass tufts
  ctx.strokeStyle = "#4caf50";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 60; i++) {
    const gx = (i / 60) * w + Math.sin(i * 3) * 10;
    const gy = h * 0.75 + Math.random() * h * 0.2;
    const sway = Math.sin(t * 1.2 + i * 0.5) * 4;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.quadraticCurveTo(gx + sway, gy - 12, gx + sway * 1.5, gy - 18);
    ctx.stroke();
  }

  // Fog
  ctx.save();
  const fogAlpha = 0.08 + 0.04 * Math.sin(t * 0.2) * bs;
  ctx.globalAlpha = fogAlpha;
  const fog = ctx.createLinearGradient(0, h * 0.65, 0, h * 0.85);
  fog.addColorStop(0, "transparent");
  fog.addColorStop(0.5, "rgba(255,255,255,0.6)");
  fog.addColorStop(1, "transparent");
  ctx.fillStyle = fog;
  ctx.fillRect(0, h * 0.65, w, h * 0.2);
  ctx.restore();

  // Fireflies
  if (!particles.current) particles.current = seededParticles(35, w, h * 0.7);
  const ff = particles.current;
  for (const p of ff) {
    p.x += Math.sin(t * p.speed + p.phase) * 0.4;
    p.y += Math.cos(t * p.speed * 0.7 + p.phase) * 0.3;
    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h * 0.7;
    if (p.y > h * 0.7) p.y = 0;
    const glow = 0.3 + 0.7 * Math.abs(Math.sin(t * 1.5 + p.phase));
    ctx.save();
    ctx.globalAlpha = glow * 0.8;
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(200,255,100,0.9)";
    ctx.fillStyle = "rgba(200,255,100,0.9)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Floating leaves
  ctx.save();
  for (let i = 0; i < 8; i++) {
    const lx = ((t * 15 + i * 130) % (w + 40)) - 20;
    const ly = h * 0.2 + Math.sin(t * 0.8 + i * 2) * 40 + i * 30;
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = i % 2 === 0 ? "#8bc34a" : "#ff8f00";
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(Math.sin(t + i) * 0.5);
    ctx.beginPath();
    ctx.ellipse(0, 0, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawOcean(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  bs: number,
  particles: React.MutableRefObject<Particle[] | null>,
) {
  // Sky gradient - sunset feel
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.5);
  sky.addColorStop(0, "#4a90d9");
  sky.addColorStop(0.5, "#87CEEB");
  sky.addColorStop(0.8, "#ffd4a2");
  sky.addColorStop(1, "#ff9a56");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.5);

  // Clouds
  ctx.save();
  ctx.globalAlpha = 0.4;
  for (let i = 0; i < 5; i++) {
    const cx = ((t * 5 + i * 200) % (w + 200)) - 100;
    const cy = 40 + i * 30;
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, 60 + i * 10, 18 + i * 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 40, cy - 5, 40, 14, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Sun
  const sunX = w * 0.7;
  const sunY = h * 0.38;
  ctx.save();
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 80);
  sunGlow.addColorStop(0, "rgba(255,200,50,0.9)");
  sunGlow.addColorStop(0.3, "rgba(255,180,50,0.4)");
  sunGlow.addColorStop(1, "transparent");
  ctx.fillStyle = sunGlow;
  ctx.fillRect(sunX - 80, sunY - 80, 160, 160);
  ctx.fillStyle = "#ffe082";
  ctx.shadowBlur = 30;
  ctx.shadowColor = "rgba(255,200,50,0.8)";
  ctx.beginPath();
  ctx.arc(sunX, sunY, 22 + Math.sin(t * 0.5) * 2 * bs, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Water
  const waterTop = h * 0.48;
  const waterGrad = ctx.createLinearGradient(0, waterTop, 0, h);
  waterGrad.addColorStop(0, "#4db6e0");
  waterGrad.addColorStop(0.3, "#2196F3");
  waterGrad.addColorStop(0.7, "#1565C0");
  waterGrad.addColorStop(1, "#0d47a1");
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, waterTop, w, h - waterTop);

  // Wave lines
  ctx.save();
  for (let wl = 0; wl < 15; wl++) {
    const wy = waterTop + 10 + wl * ((h - waterTop) / 15);
    ctx.strokeStyle = `rgba(255,255,255,${0.12 - wl * 0.006})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 3) {
      const yy =
        wy + Math.sin(x * 0.02 + t * (1.2 - wl * 0.05) + wl) * (4 + wl * 0.5);
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  ctx.restore();

  // Sun reflection on water
  ctx.save();
  ctx.globalAlpha = 0.15 + 0.05 * Math.sin(t * 0.8);
  for (let r = 0; r < 12; r++) {
    const rx = sunX + Math.sin(t * 0.5 + r * 0.8) * 8;
    const ry = waterTop + 5 + r * 15;
    const rw = 3 + Math.sin(t * 1.5 + r) * 2;
    ctx.fillStyle = "rgba(255,220,100,0.5)";
    ctx.fillRect(rx - rw, ry, rw * 2, 6);
  }
  ctx.restore();

  // Shore / foam
  ctx.save();
  const shoreY = h * 0.82;
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "#e0d8b0";
  ctx.fillRect(0, shoreY, w, h - shoreY);
  // Foam line
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 3) {
    const fy = shoreY + Math.sin(x * 0.03 + t * 1.5) * 5;
    if (x === 0) ctx.moveTo(x, fy);
    else ctx.lineTo(x, fy);
  }
  ctx.stroke();
  ctx.restore();

  // Foam particles
  if (!particles.current) particles.current = seededParticles(25, w, 30);
  for (const p of particles.current) {
    p.x += Math.sin(t * 0.5 + p.phase) * 0.3;
    const py = shoreY - 5 + (p.y % 30) + Math.sin(t + p.phase) * 3;
    ctx.save();
    ctx.globalAlpha = 0.4 + 0.3 * Math.sin(t + p.phase);
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(p.x % w, py, p.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Sailboat
  const boatX = ((t * 8) % (w + 100)) - 50;
  const boatY = h * 0.52 + Math.sin(t * 0.8) * 3;
  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = "#37474f";
  // Hull
  ctx.beginPath();
  ctx.moveTo(boatX - 12, boatY);
  ctx.lineTo(boatX + 12, boatY);
  ctx.lineTo(boatX + 8, boatY + 6);
  ctx.lineTo(boatX - 8, boatY + 6);
  ctx.closePath();
  ctx.fill();
  // Sail
  ctx.beginPath();
  ctx.moveTo(boatX, boatY);
  ctx.lineTo(boatX, boatY - 18);
  ctx.lineTo(boatX + 10, boatY - 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Seagulls
  ctx.save();
  ctx.strokeStyle = "#37474f";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 4; i++) {
    const gx = ((t * 20 + i * 180) % (w + 100)) - 50;
    const gy = 60 + i * 25 + Math.sin(t * 1.2 + i * 3) * 8;
    const wingAmp = Math.sin(t * 3 + i * 2) * 4;
    ctx.beginPath();
    ctx.moveTo(gx - 8, gy + wingAmp);
    ctx.quadraticCurveTo(gx - 3, gy - 3, gx, gy);
    ctx.quadraticCurveTo(gx + 3, gy - 3, gx + 8, gy + wingAmp);
    ctx.stroke();
  }
  ctx.restore();
}

function drawMountain(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  bs: number,
  particles: React.MutableRefObject<Particle[] | null>,
) {
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
  sky.addColorStop(0, "#1a237e");
  sky.addColorStop(0.4, "#3949ab");
  sky.addColorStop(0.8, "#7986cb");
  sky.addColorStop(1, "#c5cae9");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Sun rays from behind peaks
  ctx.save();
  const sunCx = w * 0.45;
  const sunCy = h * 0.35;
  ctx.globalAlpha = 0.08 + 0.03 * Math.sin(t * 0.4) * bs;
  for (let r = 0; r < 8; r++) {
    const angle = (r / 8) * Math.PI * 2 + t * 0.05;
    ctx.fillStyle = "rgba(255,235,180,0.4)";
    ctx.beginPath();
    ctx.moveTo(sunCx, sunCy);
    ctx.lineTo(sunCx + Math.cos(angle) * 300, sunCy + Math.sin(angle) * 300);
    ctx.lineTo(
      sunCx + Math.cos(angle + 0.15) * 300,
      sunCy + Math.sin(angle + 0.15) * 300,
    );
    ctx.closePath();
    ctx.fill();
  }
  // Sun glow
  const sg = ctx.createRadialGradient(sunCx, sunCy, 5, sunCx, sunCy, 60);
  sg.addColorStop(0, "rgba(255,235,180,0.6)");
  sg.addColorStop(1, "transparent");
  ctx.fillStyle = sg;
  ctx.globalAlpha = 0.5;
  ctx.fillRect(sunCx - 60, sunCy - 60, 120, 120);
  ctx.restore();

  // Wispy clouds
  ctx.save();
  ctx.globalAlpha = 0.2;
  for (let i = 0; i < 4; i++) {
    const cx = ((t * 4 + i * 250) % (w + 200)) - 100;
    const cy = 50 + i * 35;
    ctx.fillStyle = "rgba(200,210,240,0.5)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, 70, 12, 0.1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Mountain layers (5 layers, back to front)
  const mtColors = ["#283593", "#3949ab", "#5c6bc0", "#7986cb", "#9fa8da"];
  const mtSnow = [false, false, false, true, true];
  for (let layer = 0; layer < 5; layer++) {
    const baseY = h * (0.3 + layer * 0.1);
    ctx.fillStyle = mtColors[layer];
    ctx.beginPath();
    ctx.moveTo(0, h);
    const peaks: { x: number; y: number }[] = [];
    for (let x = 0; x <= w; x += 2) {
      const yy =
        baseY +
        Math.sin(x * 0.008 + layer * 1.5) * (50 - layer * 5) +
        Math.sin(x * 0.02 + layer * 3) * (25 - layer * 3) +
        Math.sin(x * 0.003 + t * 0.02 * (0.3 - layer * 0.05)) * 15;
      peaks.push({ x, y: yy });
      ctx.lineTo(x, yy);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Snow caps on nearer peaks
    if (mtSnow[layer]) {
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      // Find local minima (peaks)
      for (let i = 10; i < peaks.length - 10; i += 20) {
        let isMin = true;
        for (let j = -5; j <= 5; j++) {
          if (peaks[i + j] && peaks[i + j].y < peaks[i].y - 2) {
            isMin = false;
            break;
          }
        }
        if (isMin && peaks[i].y < baseY) {
          ctx.beginPath();
          ctx.moveTo(peaks[i].x - 12, peaks[i].y + 8);
          ctx.lineTo(peaks[i].x, peaks[i].y - 2);
          ctx.lineTo(peaks[i].x + 12, peaks[i].y + 8);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.restore();
    }
  }

  // Ground
  ctx.fillStyle = "#4a5568";
  ctx.fillRect(0, h * 0.82, w, h * 0.18);

  // Eagles
  ctx.save();
  ctx.fillStyle = "#1a1a2e";
  for (let i = 0; i < 3; i++) {
    const angle = t * 0.15 + i * 2.1;
    const ex = w * 0.4 + Math.cos(angle) * (80 + i * 40);
    const ey = h * 0.2 + Math.sin(angle) * (30 + i * 15) + i * 20;
    const wingUp = Math.sin(t * 2 + i * 3) * 3;
    ctx.beginPath();
    ctx.moveTo(ex - 10, ey + wingUp);
    ctx.quadraticCurveTo(ex - 4, ey - 4, ex, ey);
    ctx.quadraticCurveTo(ex + 4, ey - 4, ex + 10, ey + wingUp);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1a1a2e";
    ctx.stroke();
  }
  ctx.restore();

  // Wind streaks
  if (!particles.current) particles.current = seededParticles(20, w, h * 0.5);
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = "rgba(200,210,240,0.5)";
  ctx.lineWidth = 1;
  for (const p of particles.current) {
    p.x += 1.5 * p.speed;
    if (p.x > w + 20) {
      p.x = -20;
      p.y = Math.random() * h * 0.5;
    }
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + 20 + p.speed * 10, p.y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawMeadow(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  bs: number,
  particles: React.MutableRefObject<Particle[] | null>,
) {
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55);
  sky.addColorStop(0, "#64b5f6");
  sky.addColorStop(1, "#bbdefb");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Sun with glow
  const sunX = w * 0.8;
  const sunY = h * 0.15;
  ctx.save();
  ctx.shadowBlur = 40;
  ctx.shadowColor = "rgba(255,200,50,0.6)";
  const sunG = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 60);
  sunG.addColorStop(0, "rgba(255,235,59,1)");
  sunG.addColorStop(0.4, "rgba(255,235,59,0.3)");
  sunG.addColorStop(1, "transparent");
  ctx.fillStyle = sunG;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff9c4";
  ctx.beginPath();
  ctx.arc(sunX, sunY, 18 + Math.sin(t * 0.4) * 1.5 * bs, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Lens flare
  ctx.save();
  ctx.globalAlpha = 0.06 + 0.02 * Math.sin(t * 0.3);
  const flare = ctx.createRadialGradient(
    sunX - 100,
    sunY + 80,
    0,
    sunX - 100,
    sunY + 80,
    40,
  );
  flare.addColorStop(0, "rgba(255,200,50,0.4)");
  flare.addColorStop(1, "transparent");
  ctx.fillStyle = flare;
  ctx.fillRect(sunX - 140, sunY + 40, 80, 80);
  ctx.restore();

  // Fluffy clouds
  ctx.save();
  ctx.globalAlpha = 0.7;
  for (let i = 0; i < 4; i++) {
    const cx = ((t * 6 + i * 220) % (w + 250)) - 120;
    const cy = 50 + i * 28 + Math.sin(t * 0.3 + i) * 5;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(cx, cy, 25, 0, Math.PI * 2);
    ctx.arc(cx + 25, cy - 8, 20, 0, Math.PI * 2);
    ctx.arc(cx + 50, cy, 22, 0, Math.PI * 2);
    ctx.arc(cx + 20, cy + 5, 18, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Rolling hills
  const hillGreens = ["#66bb6a", "#81c784", "#a5d6a7"];
  for (let hl = 0; hl < 3; hl++) {
    ctx.fillStyle = hillGreens[hl];
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 3) {
      const yy =
        h * (0.45 + hl * 0.08) +
        Math.sin(x * 0.006 + hl * 2) * 25 +
        Math.sin(x * 0.015 + hl) * 12;
      ctx.lineTo(x, yy);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  }

  // Main ground
  const gnd = ctx.createLinearGradient(0, h * 0.6, 0, h);
  gnd.addColorStop(0, "#4caf50");
  gnd.addColorStop(1, "#388e3c");
  ctx.fillStyle = gnd;
  ctx.fillRect(0, h * 0.6, w, h * 0.4);

  // Grass blades
  ctx.save();
  for (let i = 0; i < 100; i++) {
    const gx = (i / 100) * w + Math.sin(i * 7) * 8;
    const gy = h * 0.62 + (i % 30) * (h * 0.012);
    const sway = Math.sin(t * 1.5 + i * 0.4) * 5;
    const bladeH = 14 + Math.sin(i * 2.3) * 6;
    ctx.strokeStyle = i % 3 === 0 ? "#43a047" : "#66bb6a";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.quadraticCurveTo(
      gx + sway,
      gy - bladeH * 0.6,
      gx + sway * 1.3,
      gy - bladeH,
    );
    ctx.stroke();
  }
  ctx.restore();

  // Wildflowers
  const flowerColors = ["#ffeb3b", "#ce93d8", "#f48fb1", "#ffffff", "#ff8a65"];
  for (let i = 0; i < 40; i++) {
    const fx = (i * 37 + Math.sin(i * 5) * 20) % w;
    const fy = h * 0.64 + (i % 20) * (h * 0.015) + Math.sin(i * 3) * 5;
    const sway = Math.sin(t * 1.2 + i * 0.6) * 2;
    ctx.fillStyle = flowerColors[i % flowerColors.length];
    ctx.beginPath();
    ctx.arc(fx + sway, fy, 2.5 + Math.sin(i) * 1, 0, Math.PI * 2);
    ctx.fill();
    // Stem
    ctx.strokeStyle = "#388e3c";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(fx, fy + 2);
    ctx.lineTo(fx, fy + 10);
    ctx.stroke();
  }

  // Butterflies
  if (!particles.current) {
    particles.current = seededParticles(8, w, h * 0.5, {
      colors: ["#e91e63", "#ff9800", "#9c27b0", "#2196f3", "#ffeb3b"],
    });
  }
  ctx.save();
  for (const p of particles.current) {
    p.x += Math.sin(t * p.speed + p.phase) * 1.2;
    p.y += Math.cos(t * p.speed * 0.8 + p.phase) * 0.8;
    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < h * 0.3) p.y = h * 0.6;
    if (p.y > h * 0.7) p.y = h * 0.3;
    const wingAngle = Math.sin(t * 6 + p.phase) * 0.4;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.fillStyle = p.color || "#e91e63";
    ctx.globalAlpha = 0.7;
    // Left wing
    ctx.beginPath();
    ctx.ellipse(-3, 0, 4, 2.5, -wingAngle, 0, Math.PI * 2);
    ctx.fill();
    // Right wing
    ctx.beginPath();
    ctx.ellipse(3, 0, 4, 2.5, wingAngle, 0, Math.PI * 2);
    ctx.fill();
    // Body
    ctx.fillStyle = "#333";
    ctx.globalAlpha = 0.8;
    ctx.fillRect(-0.5, -3, 1, 6);
    ctx.restore();
  }
  ctx.restore();

  // Bees
  ctx.save();
  for (let i = 0; i < 5; i++) {
    const bx = (w * 0.2 + i * w * 0.15 + Math.sin(t * 2 + i * 4) * 25) % w;
    const by = h * 0.58 + Math.sin(t * 3 + i * 2) * 15 + i * 8;
    ctx.fillStyle = "#fdd835";
    ctx.beginPath();
    ctx.ellipse(bx, by, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#333";
    ctx.fillRect(bx - 1, by - 2, 2, 1);
    ctx.fillRect(bx - 1, by, 2, 1);
  }
  ctx.restore();

  // Dandelion seeds
  ctx.save();
  ctx.globalAlpha = 0.4;
  for (let i = 0; i < 6; i++) {
    const dx = ((t * 10 + i * 170) % (w + 100)) - 50;
    const dy = h * 0.3 + Math.sin(t * 0.4 + i * 3) * 30 + i * 15;
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 0.5;
    // Seed body
    ctx.beginPath();
    ctx.moveTo(dx, dy);
    ctx.lineTo(dx, dy + 4);
    ctx.stroke();
    // Fluff
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for (let f = 0; f < 5; f++) {
      const fa = (f / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(dx, dy);
      ctx.lineTo(dx + Math.cos(fa) * 4, dy + Math.sin(fa) * 4);
      ctx.stroke();
    }
  }
  ctx.restore();
}

/* ────────────────────────────────────────────
   SceneCanvas Component
   ──────────────────────────────────────────── */

function SceneCanvas({
  sceneId,
  breathingScale,
}: {
  sceneId: string;
  breathingScale: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[] | null>(null);
  const breathRef = useRef(breathingScale);

  useEffect(() => {
    breathRef.current = breathingScale;
  }, [breathingScale]);

  useEffect(() => {
    particlesRef.current = null;
  }, [sceneId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cw = 0;
    let ch = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      cw = canvas.offsetWidth;
      ch = canvas.offsetHeight;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let animationId: number;
    let time = 0;

    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, cw, ch);

      const bs = breathRef.current;
      if (sceneId === "forest") drawForest(ctx, cw, ch, time, bs, particlesRef);
      else if (sceneId === "ocean")
        drawOcean(ctx, cw, ch, time, bs, particlesRef);
      else if (sceneId === "mountain")
        drawMountain(ctx, cw, ch, time, bs, particlesRef);
      else if (sceneId === "meadow")
        drawMeadow(ctx, cw, ch, time, bs, particlesRef);

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [sceneId]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full rounded-3xl"
      style={{ zIndex: 0 }}
    />
  );
}

/* ────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────── */

export default function NatureScenes() {
  const [selectedScene, setSelectedScene] = useState<NatureScene | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [breathPhase, setBreathPhase] = useState<"expand" | "release">(
    "expand",
  );
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [volume, setVolume] = useState(0.55);
  const [autoJourney, setAutoJourney] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const journeyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const currentContent = useMemo(() => {
    if (!selectedScene) return [];
    if (currentStep === 0) return selectedScene.visualization;
    if (currentStep === 1) return selectedScene.sounds;
    return selectedScene.sensations;
  }, [selectedScene, currentStep]);

  const totalLines = selectedScene
    ? selectedScene.visualization.length +
      selectedScene.sounds.length +
      selectedScene.sensations.length
    : 0;

  const currentLineNumber = useMemo(() => {
    if (!selectedScene) return 0;
    const priorVisualization =
      currentStep >= 1 ? selectedScene.visualization.length : 0;
    const priorSounds = currentStep >= 2 ? selectedScene.sounds.length : 0;
    return priorVisualization + priorSounds + currentLineIndex + 1;
  }, [currentLineIndex, currentStep, selectedScene]);

  const isComplete =
    !!selectedScene &&
    currentStep === 2 &&
    currentLineIndex === selectedScene.sensations.length - 1;

  useEffect(() => {
    if (!selectedScene) {
      setBreathPhase("expand");
      return;
    }
    setBreathPhase("expand");
    const interval = setInterval(
      () =>
        setBreathPhase((phase) => (phase === "expand" ? "release" : "expand")),
      selectedScene.breathing.durationMs,
    );
    return () => clearInterval(interval);
  }, [selectedScene]);

  const breathingScale = breathPhase === "expand" ? 1.12 : 0.92;

  useEffect(() => {
    if (!selectedScene) {
      audioRef.current?.pause();
      audioRef.current = null;
      setIsAudioEnabled(false);
      return;
    }
    const audio = new Audio(selectedScene.ambient.url);
    audio.loop = true;
    audioRef.current = audio;
    return () => {
      audio.pause();
    };
  }, [selectedScene]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isAudioEnabled) {
      audio.volume = volume;
      audio.play().catch(() => {
        setIsAudioEnabled(false);
      });
    } else {
      audio.pause();
    }
  }, [isAudioEnabled, volume]);

  const handleAdvance = useCallback(() => {
    if (!selectedScene) return;
    if (currentLineIndex < currentContent.length - 1) {
      setCurrentLineIndex((index) => index + 1);
    } else if (currentStep < 2) {
      setCurrentStep((step) => step + 1);
      setCurrentLineIndex(0);
    }
  }, [currentContent.length, currentLineIndex, currentStep, selectedScene]);

  useEffect(() => {
    return () => {
      if (journeyTimerRef.current) {
        clearTimeout(journeyTimerRef.current);
      }
      if (speechSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechSupported]);

  useEffect(() => {
    if (!selectedScene || !autoJourney) {
      if (journeyTimerRef.current) {
        clearTimeout(journeyTimerRef.current);
        journeyTimerRef.current = null;
      }
      if (speechSupported) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (isComplete) {
      setAutoJourney(false);
      return;
    }

    const activeLine = currentContent[currentLineIndex];
    if (!activeLine) return;

    if (speechSupported) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeLine);
      utterance.rate = 0.92;
      utterance.pitch = 1;
      utterance.volume = 0.95;
      window.speechSynthesis.speak(utterance);
    }

    const words = activeLine.split(/\s+/).length;
    const estimatedDuration = Math.max(words * 600, 5200);

    journeyTimerRef.current = setTimeout(() => {
      handleAdvance();
    }, estimatedDuration);

    return () => {
      if (journeyTimerRef.current) {
        clearTimeout(journeyTimerRef.current);
        journeyTimerRef.current = null;
      }
    };
  }, [
    autoJourney,
    currentContent,
    currentLineIndex,
    handleAdvance,
    isComplete,
    selectedScene,
    speechSupported,
  ]);

  const resetScene = useCallback(() => {
    setSelectedScene(null);
    setCurrentStep(0);
    setCurrentLineIndex(0);
    setAutoJourney(false);
    setIsAudioEnabled(false);
    if (speechSupported) {
      window.speechSynthesis.cancel();
    }
  }, [speechSupported]);

  const handlePrev = useCallback(() => {
    if (currentLineIndex > 0) {
      setCurrentLineIndex((index) => index - 1);
      return;
    }
    if (currentStep > 0 && selectedScene) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      const prevContent =
        prevStep === 1
          ? selectedScene.sounds
          : prevStep === 0
            ? selectedScene.visualization
            : selectedScene.sensations;
      setCurrentLineIndex(prevContent.length - 1);
    }
  }, [currentLineIndex, currentStep, selectedScene]);

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled((enabled) => !enabled);
  }, []);

  const toggleAutoJourney = useCallback(() => {
    setAutoJourney((enabled) => !enabled);
  }, []);

  if (!selectedScene) {
    return (
      <div className="relative mx-auto max-w-4xl">
        <div
          className="absolute inset-0 -z-10 rounded-3xl opacity-80 blur-3xl"
          style={{ backgroundImage: DEFAULT_BACKGROUND }}
        />
        <Card className="mx-auto max-w-xl bg-white/80 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle>Calming Nature Scenes</CardTitle>
            <CardDescription>
              Choose a natural setting for guided visualization
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {NATURE_SCENES.map((scene) => {
              const Icon = scene.icon;
              return (
                <Card
                  key={scene.id}
                  className="cursor-pointer border-2 border-white/60 bg-white/70 transition duration-200 hover:-translate-y-1 hover:border-white hover:shadow-lg"
                  onClick={() => setSelectedScene(scene)}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <motion.div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/70 shadow-inner`}
                      animate={{ y: [0, -3, 0] }}
                      transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Icon size={26} />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold">{scene.name}</h3>
                      <p className="text-sm">{scene.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  const palette = selectedScene.palette;
  const Icon = selectedScene.icon;

  return (
    <div className="relative mx-auto max-w-3xl">
      {/* Animated Canvas Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        <SceneCanvas
          sceneId={selectedScene.id}
          breathingScale={breathingScale}
        />
      </div>

      <div className="relative z-10 overflow-hidden rounded-3xl border border-white/25 bg-white/40 p-6 shadow-2xl backdrop-blur-md sm:p-8">
        <header className="text-center">
          <div className="relative mx-auto mb-6 flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44">
            <ShapeBreather
              shape={SCENE_SHAPES[selectedScene.id] ?? "circle"}
              phase={breathPhase === "expand" ? "inhale" : "exhale"}
              durationMs={selectedScene.breathing.durationMs}
              isActive
              size={140}
              colors={{
                from: selectedScene.palette.glowFrom,
                to: selectedScene.palette.glowTo,
              }}
              scaleMin={0.85}
              scaleMax={1.2}
              styleMode="fill"
            />
          </div>
          <div
            className={`mx-auto mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm ${palette.badgeBg} ${palette.badgeText}`}
          >
            <Icon size={20} />
            {selectedScene.name}
          </div>
          <h2
            className={`text-2xl font-semibold tracking-tight ${palette.text}`}
          >
            {STEP_LABELS[currentStep]} • {currentLineNumber} of {totalLines}
          </h2>
          <p className="mt-2 text-sm">{selectedScene.description}</p>
        </header>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-3 rounded-full bg-white/60 px-4 py-2 text-sm shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleAudio}
              aria-label="Toggle ambient audio"
            >
              {isAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </Button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="w-24 accent-calm-500"
              aria-label="Ambient volume"
            />
            <span className="text-xs uppercase tracking-wide">Ambient</span>
          </div>

          <Button
            variant={autoJourney ? "calm" : "outline"}
            size="sm"
            onClick={toggleAutoJourney}
            className="flex items-center gap-2"
          >
            {autoJourney ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
            Auto Journey
            {speechSupported ? <Sparkles size={16} /> : <MicOff size={16} />}
          </Button>
        </div>

        <div className="mt-8 space-y-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/70">
            <motion.div
              className={`${palette.accent} h-full origin-left rounded-full`}
              animate={{ width: `${(currentLineNumber / totalLines) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          <div className="flex justify-center gap-4 text-sm font-semibold">
            {STEP_LABELS.map((step, idx) => (
              <div key={step} className="text-center">
                <div
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border text-xs ${
                    idx === currentStep
                      ? `${palette.accent} text-white border-transparent`
                      : idx < currentStep
                        ? "border-emerald-200 bg-emerald-500 text-white"
                        : "border-white/60 bg-white/50"
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="mt-2 block text-xs uppercase tracking-wide">
                  {step}
                </span>
              </div>
            ))}
          </div>

          <div
            className={`relative overflow-hidden rounded-2xl border border-white/40 p-6 text-center shadow-inner ${palette.surface}`}
          >
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br opacity-40`}
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: breathPhase === "expand" ? 0.55 : 0.3,
              }}
              transition={{
                duration: selectedScene.breathing.durationMs / 1000,
              }}
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.05))`,
              }}
            />
            <AnimatePresence mode="wait">
              <motion.p
                key={`${currentStep}-${currentLineIndex}`}
                className={`relative z-10 text-lg leading-relaxed ${palette.text}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {currentContent[currentLineIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="rounded-xl bg-white/60 p-4 text-center text-sm shadow-sm">
            {currentStep === 0 &&
              "Close your eyes and picture this scene in detail."}
            {currentStep === 1 &&
              "Tune into the soundscape. What layers of sound can you pick out?"}
            {currentStep === 2 &&
              "Notice how your body responds. Let the sensations invite calm."}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handlePrev}
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={currentStep === 0 && currentLineIndex === 0}
          >
            Previous
          </Button>

          <Button
            onClick={() => {
              if (isComplete) {
                resetScene();
              } else {
                handleAdvance();
              }
            }}
            variant="calm"
            size="lg"
            className="flex-1"
          >
            {isComplete ? "Complete" : "Next"}
          </Button>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 text-center text-xs sm:flex-row sm:justify-between">
          <button
            onClick={resetScene}
            className="inline-flex items-center gap-2 text-sm transition"
          >
            <RefreshCw size={16} />
            Choose a different scene
          </button>
          <p>Ambient: {selectedScene.ambient.credit}</p>
        </div>
      </div>
    </div>
  );
}
