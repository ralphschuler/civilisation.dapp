import { useId, useMemo, type PropsWithChildren, type SVGProps } from 'react';

type SvgCanvasProps = PropsWithChildren<SVGProps<SVGSVGElement>>;

const DEFAULT_VIEWBOX = '-400 -300 800 600';

const SvgCanvas = (props: SvgCanvasProps) => {
  const { children, viewBox: viewBoxProp, preserveAspectRatio = 'xMidYMid meet', role = 'img', 'aria-label': ariaLabelProp, ...rest } = props;
  const id = useId();

  const computedViewBox = useMemo(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_VIEWBOX;
    }

    const { innerHeight, innerWidth } = window;
    return `${innerWidth / -2} ${100 - innerHeight} ${innerWidth} ${innerHeight}`;
  }, []);

  const ariaLabel = ariaLabelProp ?? 'SVG Canvas';
  const viewBox = viewBoxProp ?? computedViewBox;

  return (
    <svg
      {...rest}
      id={id}
      role={role}
      aria-label={ariaLabel}
      preserveAspectRatio={preserveAspectRatio}
      viewBox={viewBox}
    >
      <title>SVG Canvas</title>
      {children}
    </svg>
  );
};

export default SvgCanvas;
