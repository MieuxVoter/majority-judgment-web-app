const VerticalGripDots = ({fill = "black", opacity = 0.25}) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="12" r="2" fill={fill} fill-opacity={opacity} />
    <circle cx="8" cy="22" r="2" fill={fill} fill-opacity={opacity} />
    <circle cx="8" cy="2" r="2" fill={fill} fill-opacity={opacity} />
    <circle cx="16" cy="12" r="2" fill={fill} fill-opacity={opacity} />
    <circle cx="16" cy="22" r="2" fill={fill} fill-opacity={opacity} />
    <circle cx="16" cy="2" r="2" fill={fill} fill-opacity={opacity} />
  </svg>
);

export default VerticalGripDots;
