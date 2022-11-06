/**
 * This component displays a bar releaving the current step
 */
import { useTranslation } from 'next-i18next';
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const { Row, Col, Container } = require('reactstrap');

const Step = ({ name, position, active, check, onClick }) => {
  const { t } = useTranslation();
  const disabled = !active && !check;
  return (
    <Col className="col-auto" role={onClick ? 'button' : ''} onClick={onClick}>
      <Row
        className={`align-items-center creation-step ${
          active ? 'active' : ''
        } ${disabled ? 'disabled' : ''}`}
      >
        <Col className="col-auto badge align-items-center justify-content-center d-flex">
          <div>{check ? <FontAwesomeIcon icon={faCheck} /> : position}</div>
        </Col>
        <Col className="col-auto name">{t(`admin.step-${name}`)}</Col>
      </Row>
    </Col>
  );
};

export const creationSteps = ['candidate', 'params', 'confirm'];

interface GoToStep {
  (): void;
}

interface ProgressStepsProps {
  step: string;
  goToParams: GoToStep;
  goToCandidates: GoToStep;
  className?: string;
  [props: string]: any;
}

export const ProgressSteps = ({
  step,
  goToParams,
  goToCandidates,
  className = '',
  ...props
}: ProgressStepsProps) => {
  const { t } = useTranslation();

  if (!creationSteps.includes(step)) {
    throw Error(`Unknown step {step}`);
  }
  const stepId = creationSteps.indexOf(step);

  const gotosteps = [goToCandidates, goToParams];

  return (
    <Row className={`w-100 m-5 d-flex ${className}`} {...props}>
      <Col className="col-lg-3 col-6 mb-3">
        {step === 'candidate' ? null : (
          <Row className="gx-2 align-items-end">
            <Col className="col-auto">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Col>
            <Col role="button" onClick={goToCandidates} className="col-auto">
              {t('admin.candidates-back-step')}
            </Col>
          </Row>
        )}
      </Col>
      <Col className="col-lg-6 col-12">
        <Row className="w-100 gx-5 justify-content-center">
          {creationSteps.map((name, i) => (
            <Step
              name={name}
              active={step === name}
              check={i < stepId}
              key={i}
              position={i + 1}
              onClick={gotosteps[i]}
            />
          ))}
        </Row>
      </Col>
      <Col className="col-3"></Col>
    </Row>
  );
};
