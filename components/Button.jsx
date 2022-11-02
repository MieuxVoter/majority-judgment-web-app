import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Row, Col, Button} from "reactstrap";

const ButtonWithIcon = ({icon, children, ...props}) => {
  if (icon) {
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

  else {
    return (<Button {...props}>{children}</Button>)
  }
}

export default ButtonWithIcon
