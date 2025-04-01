import * as React from "react";
import type { SVGProps } from "react";
const SvgSun = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={24}
    height={24}
    {...props}
  >
    <circle cx={12} cy={12} r={6} fill="#fff" />
    <path
      id="sun_svg__a"
      fill="none"
      stroke="#fff"
      strokeWidth={2}
      d="M12 1v3"
    />
    <use
      xlinkHref="#sun_svg__a"
      id="sun_svg__b"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#sun_svg__b"
      id="sun_svg__c"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#sun_svg__c"
      id="sun_svg__d"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#sun_svg__d"
      id="sun_svg__e"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#sun_svg__e"
      id="sun_svg__f"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#sun_svg__f"
      id="sun_svg__g"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#sun_svg__g"
      width="100%"
      height="100%"
      transform="rotate(45 12 12)"
    />
  </svg>
);
export default SvgSun;
