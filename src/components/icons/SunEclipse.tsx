import * as React from "react";
import type { SVGProps } from "react";
const SvgSunEclipse = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={24}
    height={24}
    {...props}
  >
    <circle
      cx={12}
      cy={12}
      r={5}
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="bevel"
      strokeWidth={2}
    />
    <path
      id="sun_eclipse_svg__a"
      fill="none"
      stroke="#fff"
      strokeWidth={2}
      d="M12 1v3"
    />
    <use
      xlinkHref="#sun_eclipse_svg__a"
      id="sun_eclipse_svg__b"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#sun_eclipse_svg__b"
      id="sun_eclipse_svg__c"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#sun_eclipse_svg__c"
      id="sun_eclipse_svg__d"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#sun_eclipse_svg__d"
      id="sun_eclipse_svg__e"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#sun_eclipse_svg__e"
      id="sun_eclipse_svg__f"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#sun_eclipse_svg__f"
      id="sun_eclipse_svg__g"
      width="100%"
      height="100%"
      x={0}
      y={0}
      transform="rotate(45 12 12)"
    />
    <use
      xlinkHref="#sun_eclipse_svg__g"
      width="100%"
      height="100%"
      transform="rotate(45 12 12)"
    />
    <circle cx={15.75} cy={12} r={6} fill="#fff" />
  </svg>
);
export default SvgSunEclipse;
