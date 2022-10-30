/**
 * This component displays a bar releaving the current step
 */
import {useTranslation} from "next-i18next";
const {Row, Col} = require("reactstrap")


const Step = ({name, position, active}) => {
  const {t} = useTranslation();
  return <Col
    className="col-auto">
    <Row className={`align-items-center creation-step ${active ? 'active' : ''}`}>
      <Col className='col-auto badge align-items-center justify-content-center d-flex'>
        <div>{position}</div>
      </Col>
      <Col className='col-auto name'>
        {t(`admin.step-${name}`)}
      </Col>
    </Row>
  </Col >
}

const CreationSteps = ({step, ...props}) => {
  const steps = ['candidate', 'params', 'confirm'];

  if (!steps.includes(step)) {
    throw Error(`Unknown step {step}`);
  }

  return <div {...props}>
    <Row className='justify-content-between creation-steps'>
      {steps.map((name, i) => <Step name={name} active={step === name} key={i} position={i + 1} />
      )}
    </Row >
  </div >

}

export default CreationSteps;
