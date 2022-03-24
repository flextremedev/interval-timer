import { animated, easings, useSpring } from '@react-spring/web';
import * as React from 'react';

type ArcProps = React.SVGProps<SVGSVGElement> & {
  progress: number;
  progressPerSecond: number;
};

const strokeLength = 877;

export function Arc({ progress, progressPerSecond, ...restProps }: ArcProps) {
  const { strokeDashoffset } = useSpring({
    from: { strokeDashoffset: (progress / 100) * strokeLength },
    strokeDashoffset: (progress / 100 + progressPerSecond / 100) * strokeLength,
    config: { duration: 1000, easing: easings.linear },
  });

  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 282 282"
      {...restProps}
    >
      <circle
        cx={141}
        cy={141}
        r={139}
        fill="#FBFCFE"
        stroke="#CDD9EE"
        strokeWidth={4}
      />
      <animated.circle
        cx={141}
        cy={141}
        r={139}
        stroke="#0057FF"
        strokeWidth={4}
        style={{
          transform: 'rotateZ(-90deg)',
          transformOrigin: '50% 50%',
          strokeDasharray: strokeLength,
          strokeDashoffset,
        }}
      />
    </svg>
  );
}
