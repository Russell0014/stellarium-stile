import * as React from "react";
import type { SVGProps } from "react";
const SvgArtificialSatellite = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={24}
    height={24}
    {...props}
  >
    <path
      fill="#fff"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.83 15.223 8.777 12.17l3.393-3.393 3.053 3.053z"
    />
    <rect
      id="artificial_satellite_svg__a"
      width={6.187}
      height={2.652}
      x={-28.284}
      y={-1.414}
      fill="#fff"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      ry={0}
      transform="rotate(225)"
    />
    <path
      fill="none"
      stroke="#fff"
      strokeWidth={1.5}
      d="M10.182 17.354c-2.03-.52-3.094-1.779-3.536-3.536M9.475 19.475c-2.104-.202-4.675-2.806-4.95-4.95"
    />
    <use
      xlinkHref="#artificial_satellite_svg__a"
      width="100%"
      height="100%"
      transform="rotate(180 12 12)"
    />
  </svg>
);
export default SvgArtificialSatellite;
