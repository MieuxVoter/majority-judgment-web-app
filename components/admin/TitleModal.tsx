import {useState, useEffect} from 'react';
import {Label, Input, Modal, ModalBody, Form} from 'reactstrap';
import {faPlus, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from 'next-i18next';
import {ElectionTypes, useElection} from '@services/ElectionContext';
import Button from '@components/Button';
import {checkName} from '@services/ElectionContext';
import {AppTypes, useAppContext} from '@services/context';
import {useRouter} from 'next/router';


const TitleModal = ({isOpen, toggle}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const [election, dispatch] = useElection();
  const [_, dispatchApp] = useAppContext();
  const [name, setName] = useState(election.name);
  const disabled = name === "";

  useEffect(() => {
    setName(election.name);
  }, [election.name])

  const save = (e) => {
    e.preventDefault()

    if (name === "") {
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: "error",
        message: t("error.empty-name")
      })
      return
    }

    dispatch({
      type: ElectionTypes.SET,
      field: 'name',
      value: name,
    });

    toggle();
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      keyboard={true}
      className="modal_candidate"
    >
      <div className="modal-header p-4">
        <h4 className="modal-title">{t('admin.set-title')}</h4>
        <button
          type="button"
          onClick={toggle}
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>

      <ModalBody className="p-4">
        <Form className="container container-fluid">
          <div className="mb-3">
            <Label className="fw-bold">{t('common.name')} </Label>
            <Input
              type="text"
              placeholder={t('home.writeQuestion')}
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
            <div onClick={save}>
              <Button
                color={disabled ? "light" : "primary"}
                disabled={disabled}
                icon={faPlus}
              >
                {t('common.save')}
              </Button>
            </div>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};
export default TitleModal;
