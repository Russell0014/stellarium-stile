import * as React from "react";
import type { SVGProps } from "react";
const SvgGlobularStarCluster = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <circle
      cx={12}
      cy={12}
      r={9}
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
    <path fill="none" stroke="#fff" strokeWidth={2} d="M12 3v18M21 12H3" />
  </svg>
);
export default SvgGlobularStarCluster;
