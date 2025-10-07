import type { Meta, StoryObj } from "@storybook/react";
import SvgCanvas from "./svgCanvas";

type Args = {
  dotCount: number;
  radius: number;
  dotColor: string;
  showGrid: boolean;
  showAxes: boolean;
};

const meta: Meta<typeof SvgCanvas> = {
  title: "App/SvgCanvas",
  component: SvgCanvas,
  argTypes: {
    dotCount: { control: { type: "range", min: 3, max: 60, step: 1 } },
    radius: { control: { type: "range", min: 20, max: 400, step: 10 } },
    dotColor: { control: "color" },
    showGrid: { control: "boolean" },
    showAxes: { control: "boolean" },
  },
  args: {
    dotCount: 16,
    radius: 150,
    dotColor: "#ef4444",
    showGrid: true,
    showAxes: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function Grid({ size = 2000, step = 100 }: { size?: number; step?: number }) {
  const lines: JSX.Element[] = [];
  for (let x = -size; x <= size; x += step) {
    lines.push(
      <line key={`v-${x}`} x1={x} y1={-size} x2={x} y2={size} stroke="#e5e7eb" strokeWidth={1} />,
    );
  }
  for (let y = -size; y <= size; y += step) {
    lines.push(
      <line key={`h-${y}`} x1={-size} y1={y} x2={size} y2={y} stroke="#e5e7eb" strokeWidth={1} />,
    );
  }
  return <g>{lines}</g>;
}

function Axes({ size = 2000 }: { size?: number }) {
  return (
    <g>
      <line x1={-size} y1={0} x2={size} y2={0} stroke="#94a3b8" strokeWidth={2} />
      <line x1={0} y1={-size} x2={0} y2={size} stroke="#94a3b8" strokeWidth={2} />
    </g>
  );
}

export const Playground: Story = {
  render: (args: Args) => {
    const dots = Array.from({ length: args.dotCount }).map((_, i) => {
      const t = (i / args.dotCount) * Math.PI * 2;
      const cx = Math.cos(t) * args.radius;
      const cy = Math.sin(t) * args.radius;
      return <circle key={i} cx={cx} cy={cy} r={10} fill={args.dotColor} />;
    });

    return (
      <div
        style={{ height: "60vh", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}
      >
        <style>
          {`
          /* Make the inner SVG fill its container */
          div[data-testid='svg-canvas-wrapper'] svg[aria-label='SVG Canvas'] { width: 100%; height: 100%; display: block; }
        `}
        </style>
        <div
          data-testid="svg-canvas-wrapper"
          style={{ width: "100%", height: "100%", background: "#fafafa" }}
        >
          <SvgCanvas>
            {args.showGrid && <Grid />}
            {args.showAxes && <Axes />}
            <circle cx={0} cy={0} r={18} fill="#0ea5e9" />
            {dots}
          </SvgCanvas>
        </div>
      </div>
    );
  },
};

export const RandomNodes: Story = {
  args: { dotCount: 24, radius: 200, dotColor: "#22c55e", showGrid: false, showAxes: true },
  render: (args: Args) => {
    const rand = (seed: number) => {
      let t = seed;
      return () => (t = (t * 1664525 + 1013904223) % 4294967296) / 4294967296;
    };
    const r = rand(42);
    const nodes = Array.from({ length: args.dotCount }).map((_, i) => {
      const cx = (r() - 0.5) * args.radius * 3;
      const cy = (r() - 0.5) * args.radius * 3;
      const rr = 6 + r() * 10;
      return <circle key={i} cx={cx} cy={cy} r={rr} fill={args.dotColor} fillOpacity={0.85} />;
    });

    return (
      <div
        style={{ height: "50vh", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}
      >
        <style>
          {`div[data-testid='svg-canvas-wrapper'] svg[aria-label='SVG Canvas'] { width: 100%; height: 100%; display: block; }`}
        </style>
        <div
          data-testid="svg-canvas-wrapper"
          style={{ width: "100%", height: "100%", background: "#ffffff" }}
        >
          <SvgCanvas>
            {args.showAxes && <Axes />}
            {nodes}
          </SvgCanvas>
        </div>
      </div>
    );
  },
};
