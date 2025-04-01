import * as React from "react";
import type { SVGProps } from "react";
const SvgDeepSky = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={24}
    height={24}
    viewBox="0 0 22.5 22.5"
    {...props}
  >
    <g transform="translate(0 -105.5)">
      <path
        id="deep_sky_svg__a"
        fill="#fff"
        fillRule="evenodd"
        stroke="#fff"
        strokeWidth={0.938}
        d="M7.5 108.31c7.5 4.688.938 7.5.938 7.5l5.624 5.625s7.5-13.125-6.562-13.125z"
      />
      <use
        xlinkHref="#deep_sky_svg__a"
        id="deep_sky_svg__b"
        width="100%"
        height="100%"
        x={0}
        y={0}
        transform="rotate(60 11.25 116.75)"
      />
      <use
        xlinkHref="#deep_sky_svg__b"
        id="deep_sky_svg__c"
        width="100%"
        height="100%"
        x={0}
        y={0}
        transform="rotate(60 11.25 116.75)"
      />
      <use
        xlinkHref="#deep_sky_svg__c"
        id="deep_sky_svg__d"
        width="100%"
        height="100%"
        x={0}
        y={0}
        transform="rotate(60 11.25 116.75)"
      />
      <use
        xlinkHref="#deep_sky_svg__d"
        id="deep_sky_svg__e"
        width="100%"
        height="100%"
        x={0}
        y={0}
        transform="rotate(60 11.25 116.75)"
      />
      <use
        xlinkHref="#deep_sky_svg__e"
        width="100%"
        height="100%"
        transform="rotate(60 11.25 116.75)"
      />
    </g>
  </svg>
);
export default SvgDeepSky;
