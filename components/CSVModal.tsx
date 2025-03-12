import { useTranslation } from 'next-i18next';
import { Table } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Button from '@components/Button';
import { Row } from 'reactstrap';

type ModalProps = {
    show: boolean;
    onClose: () => void;
  };

const CSVModal = ({show, onClose}:ModalProps) => {
    const { t } = useTranslation();
    
  return (
    <>
      <Modal show={show} onHide={onClose} animation={false}  size='lg' centered={true}>
        <Modal.Header closeButton>
          <Modal.Title>{t("home.uploadCSV.modal.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>{t("home.uploadCSV.modal.description")}</p>
            <p>{t("home.uploadCSV.modal.modelToFollow")}</p>
            <Table striped bordered hover width={"100%"} className='text-center'>
                <thead>
                    <tr>
                        <th></th>
                        <th>{t("grades.excellent")}</th>
                        <th>{t("grades.very-good")}</th>
                        <th>{t("grades.good")}</th>
                        <th>{t("grades.passable")}</th>
                        <th>{t("grades.inadequate")}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Candidat 1</td>
                        <td>5</td>
                        <td>3</td>
                        <td>8</td>
                        <td>2</td>
                        <td>2</td>
                    </tr>
                    <tr>
                        <td>Candidat 2</td>
                        <td>7</td>
                        <td>3</td>
                        <td>2</td>
                        <td>3</td>
                        <td>5</td>
                    </tr>
                    <tr>
                        <td>Candidat 3</td>
                        <td>2</td>
                        <td>7</td>
                        <td>5</td>
                        <td>3</td>
                        <td>3</td>
                    </tr>
                </tbody>
            </Table>
            <br />
            <p>{t("home.uploadCSV.modal.warnAboutMentionOrder")}</p>
            { /* <Row>
                <Button
                            color="secondary"
                            outline={true}
                            type="submit"
                            icon={faArrowRight}
                            position="right"
                            onClick={() => {
                            }}
                        >
                            fdssdf
                            </Button>
                            </Row>
            */}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CSVModal;