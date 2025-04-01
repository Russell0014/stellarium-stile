import * as React from "react";
import type { SVGProps } from "react";
const SvgDoubleStar = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <path
      fill="#fff"
      d="M9.02 3.441a4.27 4.27 0 0 0-4.27 4.27 4.27 4.27 0 0 0 4.27 4.268 4 4 0 0 0 .21-.006 5.78 5.78 0 0 1 3.877-3.038 4.3 4.3 0 0 0 .18-1.224A4.27 4.27 0 0 0 9.02 3.44"
    />
    <circle cx={14.374} cy={14.444} r={5.381} fill="#fff" />
  </svg>
);
export default SvgDoubleStar;
