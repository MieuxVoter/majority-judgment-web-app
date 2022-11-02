/**
 * This component displays a bar releaving the current step
 */
import {useTranslation} from "next-i18next";
import {faArrowLeft, faCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const {Row, Col, Container} = require("reactstrap")


const Step = ({name, position, active, check}) => {
  const {t} = useTranslation();
  const disabled = !active && !check
  return <Col
    className="col-auto">
    <Row className={`align-items-center creation-step ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}>
      <Col className='col-auto badge align-items-center justify-content-center d-flex'>
        <div>{check ? <FontAwesomeIcon icon={faCheck} /> : position}</div>
      </Col>
      <Col className='col-auto name'>
        {t(`admin.step-${name}`)}
      </Col>
    </Row >
  </Col >
}

export const creationSteps = ['candidate', 'params', 'confirm'];

export const ProgressSteps = ({step, className, ...props}) => {
  const {t} = useTranslation();

  if (!creationSteps.includes(step)) {
    throw Error(`Unknown step {step}`);
  }
  const stepId = creationSteps.indexOf(step);

  return <Row className={`w-100 m-5 d-flex ${className}`} {...props}>
    <Col className='col-3'>
      {step === 'candidate' ? null : (
        <Row className='gx-2 align-items-end'>
          <Col className='col-auto'>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Col>
          <Col className='col-auto'>
            {t('admin.candidates-back-step')}
          </Col>
        </Row>
      )
      }
    </Col>
    <Col className='col-6'>
      <Row className='w-100 gx-5 justify-content-center'>
        {creationSteps.map((name, i) => <Step name={name} active={step === name} check={i < stepId} key={i} position={i + 1} />
        )}
      </Row >
    </Col>
    <Col className='col-3'>
    </Col>
  </Row >
}

