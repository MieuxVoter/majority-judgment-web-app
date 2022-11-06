import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Col, Button } from 'reactstrap';

interface ButtonProps {
  children?: React.ReactNode;
  icon?: IconProp;
  position?: 'left' | 'right';
  [props: string]: any;
}
const ButtonWithIcon = ({
  icon,
  children,
  position = 'left',
  ...props
}: ButtonProps) => {
  if (icon && position === 'left') {
    return (
      <Button {...props}>
        <Row className="gx-2 align-items-end">
          <Col className="col-auto">
            <FontAwesomeIcon icon={icon} />
          </Col>
          <Col className="col-auto">{children}</Col>
        </Row>
      </Button>
    );
  } else if (icon && position === 'right') {
    return (
      <Button {...props}>
        <Row className="gx-2 align-items-end">
          <Col className="col-auto">{children}</Col>
          <Col className="col-auto">
            <FontAwesomeIcon icon={icon} />
          </Col>
        </Row>
      </Button>
    );
  } else {
    return <Button {...props}>{children}</Button>;
  }
};

export default ButtonWithIcon;
