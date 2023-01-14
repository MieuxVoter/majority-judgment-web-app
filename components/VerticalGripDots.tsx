import Image from 'next/image';
import verticalGripDots from '../public/vertical-grip-dots.svg';

const VerticalGripDots = (props) => (
  <Image src={verticalGripDots} alt="vertical grip dots" {...props} />
);

export default VerticalGripDots;
