import { useState, useEffect, MouseEvent, ChangeEvent } from 'react';
import { Col, Label, Input, Modal, ModalBody, Form } from 'reactstrap';
import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'next-i18next';
import { ElectionTypes, useElection } from '@services/ElectionContext';
import Button from '@components/Button';

const GradeModal = ({ isOpen, toggle, value }) => {
  const { t } = useTranslation();

  const [election, dispatch] = useElection();
  const grade = election.grades.filter((g) => g.value === value)[0];

  const [name, setName] = useState<string>(grade.name);

  useEffect(() => {
    setName(grade.name);
  }, [grade]);

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch({
      type: ElectionTypes.GRADE_SET,
      position: election.grades.map((g) => g.value).indexOf(value),
      field: 'name',
      value: name,
    });
    toggle();
  };

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

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
          <Form className="container container-fluid">
            <div className="mb-3">
              <Label className="fw-bold">{t('common.name')} </Label>
              <Input
                type="text"
                placeholder={t('admin.grade-name-placeholder')}
                value={name}
                onChange={handleName}
                autoFocus
                required
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
