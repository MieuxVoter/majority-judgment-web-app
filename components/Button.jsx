import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Row, Col, Button} from "reactstrap";

const ButtonWithIcon = ({icon, children, position, ...props}) => {
  if (icon && position === 'left') {
    return <Button {...props}>
      <Row className='gx-2 align-items-end'>
        <Col className='col-auto'>
          <FontAwesomeIcon icon={icon} />
        </Col>
        <Col className='col-auto'>
          {children}
        </Col>
      </Row>
    </Button>
  }
  else if (icon && position === 'right') {
    return <Button {...props}>
      <Row className='gx-2 align-items-end'>
        <Col className='col-auto'>
          {children}
        </Col>
        <Col className='col-auto'>
          <FontAwesomeIcon icon={icon} />
        </Col>
      </Row>
    </Button>
  }

  else {
    return (<Button {...props}>{children}</Button>)
  }
}

ButtonWithIcon.defaultProps = {
  position: 'left'
}
export default ButtonWithIcon
