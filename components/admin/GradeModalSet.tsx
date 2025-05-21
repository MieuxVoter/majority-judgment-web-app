import {useState, useEffect, MouseEvent, ChangeEvent} from 'react';
import {Col, Label, Input, Modal, ModalBody, Form} from 'reactstrap';
import {faPlus, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from 'next-i18next';
import {ElectionTypes, useElection} from '@services/ElectionContext';
import Button from '@components/Button';

const GradeModal = ({isOpen, toggle, value}) => {
  const {t} = useTranslation();

  const [election, dispatch] = useElection();
  const grade = election.grades.find((g) => g.value === value);

  const [name, setName] = useState<string>(grade.name);

  const names = election.grades.map((g) => g.name);
  const disabled = name != grade.name && (name === '' || names.includes(name));

  const handleSubmit = (e: {preventDefault:()=>void}) => {
    e.preventDefault();
    if (disabled) return;

    dispatch({
      type: ElectionTypes.GRADE_SET,
      position: value,
      field: 'name',
      value: name,
    });
    toggle();
  };

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  useEffect(() => {
    setName(grade.name);
  }, [grade]);


  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      keyboard={true}
      className="modal_grade"
    >
      <div className="modal-header p-4">
        <h4 className="modal-title">{t('admin.edit-grade')}</h4>
        <button
          type="button"
          onClick={toggle}
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>

      <ModalBody className="p-4">
        <p>{t('admin.add-grade-desc')}</p>
        <Col>
          <Form className="container container-fluid" onSubmit={handleSubmit}>
            <div className="mb-3">
              <Label className="fw-bold">{t('common.name')} </Label>
              <Input
                type="text"
                placeholder={t('admin.grade-name-placeholder')}
                value={name}
                onChange={handleName}
                autoFocus
                required
                onSubmit={handleSubmit}
              />
            </div>
            <div className="mt-5 gap-2 d-grid mb-3 d-md-flex">
              <Button
                onClick={toggle}
                color="dark"
                className="me-md-auto"
                outline={true}
                icon={faArrowLeft}
              >
                {t('common.cancel')}
              </Button>
              <Button
                color="primary"
                disabled={disabled}
                onClick={handleSubmit}
                icon={faPlus}
                role="submit"
              >
                {t('common.save')}
              </Button>
            </div>
          </Form>
        </Col>
      </ModalBody>
    </Modal>
  );
};
export default GradeModal;
