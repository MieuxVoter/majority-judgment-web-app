import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'reactstrap';

interface ButtonProps {
  children?: React.ReactNode;
  icon?: IconProp;
  customIcon?: JSX.Element;
  position?: 'left' | 'right';
  [props: string]: any;
}
const ButtonWithIcon = ({
  icon,
  customIcon,
  children,
  position = 'left',
  ...props
}: ButtonProps) => {
  if ((icon || customIcon) && position === 'left') {
    return (
      <Button {...props}>
        <div className="w-100 d-flex gap-3 justify-content-between align-items-center">
          {customIcon ? customIcon : <FontAwesomeIcon icon={icon} />}
          <div>{children}</div>
        </div>
      </Button>
    );
  } else if ((icon || customIcon) && position === 'right') {
    return (
      <Button {...props}>
        <div className="w-100 gap-3 d-flex align-items-center justify-content-between">
          <div>{children}</div>
          {customIcon ? customIcon : <FontAwesomeIcon icon={icon} />}
        </div>
      </Button>
    );
  } else {
    return <Button {...props}>{children}</Button>;
  }
};

export default ButtonWithIcon;
