import * as React from "react";
import type { SVGProps } from "react";
const SvgPlanetaryNebula = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <ellipse
      cx={16.668}
      cy={-2.13}
      fill="none"
      stroke="#fff"
      strokeDasharray="0.94859296, 1.89718591"
      strokeDashoffset={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={0.949}
      rx={6.534}
      ry={7.116}
      transform="matrix(.59515 .80362 -.8636 .50417 0 0)"
    />
    <ellipse
      cx={-0.615}
      cy={16.974}
      fill="none"
      stroke="#fff"
      strokeDasharray="0.97995792, 1.95991586"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={0.98}
      rx={10.377}
      ry={7.911}
      transform="scale(1.03396 .96485)rotate(-45)"
    />
    <circle cx={11.754} cy={12.133} r={1.192} fill="#fff" />
  </svg>
);
export default SvgPlanetaryNebula;
