/**
 * This component displays a bar releaving the current step
 */
import { useTranslation } from 'next-i18next';
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const { Row, Col, Container } = require('reactstrap');

const DesktopStep = ({ name, position, active, checked, onClick }) => {
  const { t } = useTranslation();
  const disabled = !active && !checked ? ' disabled' : '';
  const activeClass = active ? 'bg-white text-primary' : 'bg-secondary';
  return (
    <Col className="col-auto" role={onClick ? 'button' : ''} onClick={onClick}>
      <Row className={`align-items-center creation-step ${disabled} `}>
        <Col
          className={`${activeClass} creation-step-icon desktop_step col-auto align-items-center justify-content-center d-flex`}
        >
          {checked ? <FontAwesomeIcon icon={faCheck} /> : position}
        </Col>
        <Col className="col-auto name">{t(`admin.step-${name}`)}</Col>
      </Row>
    </Col>
  );
};

const MobileStep = ({ position, active, checked, onClick }) => {
  const disabled = !active && !checked ? ' bg-secondary disabled' : '';
  const activeClass = active ? 'bg-white text-primary' : 'bg-secondary';
  return (
    <div
      className={`${disabled} ${activeClass} mobile_step align-items-center justify-content-center d-flex me-2 fw-bold`}
      role={onClick ? 'button' : ''}
      onClick={onClick}
    >
      {checked ? <FontAwesomeIcon icon={faCheck} /> : position}
    </div>
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
    <Row className={`w-100 ms-2 mt-4 m-md-5 d-flex ${className}`} {...props}>
      <Col className="col-lg-3 col-8 mb-3 d-none d-md-block">
        {step === 'candidate' ? null : (
          <Row
            role="button"
            onClick={goToCandidates}
            className="gx-2 align-items-end"
          >
            <Col className="col-auto">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Col>
            <Col className="col-auto">{t('admin.candidates-back-step')}</Col>
          </Row>
        )}
      </Col>
      <Col className="d-none d-md-block col-lg-6 col-12">
        <Row className="w-100 gx-4 gx-md-5 justify-content-center">
          {creationSteps.map((name, i) => (
            <DesktopStep
              name={name}
              active={step === name}
              checked={i < stepId}
              key={i}
              position={i + 1}
              onClick={gotosteps[i]}
            />
          ))}
        </Row>
      </Col>
      <Col className="d-block d-md-none col-lg-6 col-12 d-flex">
        {creationSteps.map((name, i) => (
          <MobileStep
            active={step === name}
            checked={i < stepId}
            key={i}
            position={i + 1}
            onClick={gotosteps[i]}
          />
        ))}
      </Col>
      <Col className="col-3"></Col>
    </Row>
  );
};
