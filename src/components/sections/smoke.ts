/**
 * Blue, slightly magical smoke for the hero notes. Runs on time, not scroll,
 * so it keeps drifting while the visitor pauses. Positions are relative to the
 * hero stage; the canvas covers the whole viewport so nothing gets cut off.
 */

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Part = {
  glint: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  s: number;
  grow: number;
  rot: number;
  vr: number;
  age: number;
  life: number;
  a: number;
  tex: number;
  ph: number;
};

const hash = (x: number, y: number, s: number) => {
  const v = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453;
  return v - Math.floor(v);
};
const vnoise = (x: number, y: number, s: number) => {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  return lerp(lerp(hash(xi, yi, s), hash(xi + 1, yi, s), u), lerp(hash(xi, yi + 1, s), hash(xi + 1, yi + 1, s), u), v);
};
const fbm = (x: number, y: number, s: number) => {
  let a = 0, amp = 0.5, f = 1;
  for (let o = 0; o < 5; o++) {
    a += amp * vnoise(x * f, y * f, s + o);
    f *= 2.03;
    amp *= 0.5;
  }
  return a;
};

// A soft, torn puff of smoke: a round body eaten into wisps by noise, faded to nothing well before the square edge.
function puff([r, g, b]: number[], seed: number, S = 160) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const c = cv.getContext('2d')!, img = c.createImageData(S, S);
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const dx = (x - S / 2) / (S / 2), dy = (y - S / 2) / (S / 2);
      const n = fbm(x / 30, y / 30, seed), n2 = fbm(x / 14 + 9, y / 14, seed + 3);
      const d = Math.hypot(dx, dy) * (0.6 + 0.8 * n2);
      const edge = clamp(Math.min(x, S - 1 - x, y, S - 1 - y) / (S * 0.16));
      const a = Math.pow(clamp(1 - d), 1.6) * Math.pow(clamp((n - 0.36 + 0.3 * clamp(1 - d)) * 2.4), 1.15) * edge;
      const k = (y * S + x) * 4;
      img.data[k] = r;
      img.data[k + 1] = g;
      img.data[k + 2] = b;
      img.data[k + 3] = a * 255;
    }
  c.putImageData(img, 0, 0);
  return cv;
}

// A tiny sparkle: white core, blue halo.
function sparkle(S = 32) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const c = cv.getContext('2d')!, g = c.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.18, 'rgba(200,210,255,0.95)');
  g.addColorStop(0.45, 'rgba(70,95,255,0.35)');
  g.addColorStop(1, 'rgba(31,59,255,0)');
  c.fillStyle = g;
  c.fillRect(0, 0, S, S);
  return cv;
}

// A divergence-free swirl field (the curl of a moving stream function), so the smoke curls in strands instead of jittering.
function field(x: number, y: number, t: number): [number, number] {
  const a = 0.011, c = 0.014, a2 = 0.024, c2 = 0.019;
  const s1 = Math.sin(a * x + 0.35 * t), k1 = Math.cos(a * x + 0.35 * t);
  const s2 = Math.sin(c * y - 0.5 * t), k2 = Math.cos(c * y - 0.5 * t);
  const g = Math.cos(a2 * x - c2 * y + 0.8 * t);
  const dx = k1 * k2 + 0.6 * g;
  const dy = -(c / a) * s1 * s2 - 0.6 * (c2 / a2) * g;
  return [dy, -dx];
}

export class Smoke {
  private parts: Part[] = [];
  private fresh: HTMLCanvasElement[] = [];
  private aged: HTMLCanvasElement[] = [];
  private glint: HTMLCanvasElement | null = null;
  private t = 0;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private dpr: number,
    private cap: number,
  ) {}

  /** Builds the textures. Slow-ish (~50 ms), so call it once the page has settled. */
  prepare() {
    if (this.glint) return;
    // A mix of deep blue and soft periwinkle puffs.
    this.fresh = [[38, 66, 240], [56, 88, 236], [44, 74, 220]].map((c, i) => puff(c, i * 13 + 1));
    this.aged = [[132, 152, 238], [160, 176, 246], [118, 140, 228]].map((c, i) => puff(c, i * 17 + 5));
    this.glint = sparkle();
  }

  get alive() {
    return this.parts.length > 0;
  }

  /** Smoke rising off a note: x, y is its top left corner, w its size. */
  emit(x: number, y: number, w: number, count: number) {
    this.prepare();
    for (let k = 0; k < count && this.parts.length < this.cap; k++) {
      const glint = Math.random() < 0.07;
      // Denser towards the middle of the note, so the cloud starts round rather than square.
      const px = x + w * (0.5 + (Math.random() + Math.random() - 1) * 0.6), py = y + w * (0.5 + (Math.random() + Math.random() - 1) * 0.6);
      this.parts.push({
        glint,
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 22,
        vy: -(26 + Math.random() * 34) - (glint ? 20 : 0),
        s: glint ? 4 + Math.random() * 6 : w * (0.1 + Math.random() * 0.14),
        grow: glint ? 0 : w * (0.45 + Math.random() * 0.55),
        rot: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.5,
        age: 0,
        life: glint ? 1.2 + Math.random() * 1.4 : 2.8 + Math.random() * 2,
        a: glint ? 1 : 0.16 + Math.random() * 0.14,
        // 0-2 are the deep blue puffs, 3-5 the pale ones.
        tex: (Math.random() * 6) | 0,
        ph: Math.random() * 6.28,
      });
    }
  }

  /** Advances by dt seconds and draws. ox, oy is where the stage sits in the viewport. */
  step(dt: number, ox: number, oy: number) {
    const { ctx, dpr } = this;
    this.t += dt;
    for (let k = this.parts.length - 1; k >= 0; k--) {
      const p = this.parts[k];
      p.age += dt;
      if (p.age >= p.life) {
        this.parts.splice(k, 1);
        continue;
      }
      // Warm smoke rises in a plume, then slows down and the swirl takes over.
      p.vy = p.vy * (1 - 0.35 * dt) - (p.glint ? 14 : 6) * dt;
      p.vx *= 1 - 0.5 * dt;
      const [fx, fy] = field(p.x, p.y, this.t);
      const swirl = (p.glint ? 46 : 34) * Math.min(1, p.age / 1.1);
      p.x += (p.vx + fx * swirl) * dt;
      p.y += (p.vy + fy * swirl) * dt;
      p.rot += p.vr * dt;

      const u = p.age / p.life;
      const sy = p.y + oy;
      // Only fades right at the top edge of the screen, so it never looks cut off.
      const life = Math.min(1, u / 0.05) * Math.pow(1 - u, 1.4) * clamp((sy + 10) / 70);
      if (life <= 0) continue;
      ctx.save();
      ctx.translate((p.x + ox) * dpr, sy * dpr);
      if (p.glint && this.glint) {
        ctx.globalAlpha = life * (0.45 + 0.55 * Math.sin(p.age * 13 + p.ph) ** 2);
        const s = p.s * dpr * (0.8 + 0.4 * Math.sin(p.age * 9 + p.ph));
        ctx.drawImage(this.glint, -s / 2, -s / 2, s, s);
      } else {
        // Very faint layers only add rounding noise (rings and banding), so they are skipped.
        const a = p.a * life;
        if (a > 0.012) {
          const s = (p.s + p.grow * Math.sqrt(u)) * dpr;
          ctx.rotate(p.rot);
          ctx.globalAlpha = a;
          ctx.drawImage((p.tex < 3 ? this.fresh : this.aged)[p.tex % 3], -s / 2, -s / 2, s, s);
        }
      }
      ctx.restore();
    }
  }
}
