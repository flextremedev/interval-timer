import * as React from 'react';

export function Arc(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 282 282"
      {...props}
    >
      <circle
        cx={141}
        cy={141}
        r={139}
        fill="#FBFCFE"
        stroke="#CDD9EE"
        strokeWidth={4}
      />
      <path
        d="M280 141a138.998 138.998 0 01-237.288 98.288A139.01 139.01 0 012 141 138.997 138.997 0 01141 2a138.997 138.997 0 01139 139h0z"
        stroke="#0057FF"
        strokeWidth={4}
      />
    </svg>
  );
}
