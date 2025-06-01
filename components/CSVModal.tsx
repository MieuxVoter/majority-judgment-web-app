import { useTranslation } from 'next-i18next';
import { Table } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Button from '@components/Button';
import { Container, Row } from 'reactstrap';
import Papa from 'papaparse';

type ModalProps = {
    show: boolean;
    onClose: () => void;
  };

const CSVModal = ({show, onClose}:ModalProps) => {
  const { t } = useTranslation();
  const candidate = t("home.uploadCSV.modal.candidate");

  const csv = [
      ["", t("grades.excellent"), t("grades.very-good"), t("grades.good"), t("grades.passable"), t("grades.inadequate")],
      [`${candidate} 1`, 5, 3, 0, 4, 8],
      [`${candidate} 2`, 7, 4, 2, 2, 5],
      [`${candidate} 3`, 2, 7, 5, 3, 3],
  ]

  return (
    <>
      <Modal show={show} onHide={onClose} animation={false}  size='lg' centered={true}>
        <Modal.Header closeButton>
          <Modal.Title>{t("home.uploadCSV.modal.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <p>{t("home.uploadCSV.modal.description")}</p>
            <p>{t("home.uploadCSV.modal.modelToFollow")}</p>
            <Table striped bordered hover width={"100%"} className='text-center'>
              <thead>
                <tr>
                  {csv[0].map((t, index) => <th key={`header-${index}`}>{t}</th>)}
                </tr>
              </thead>
              <tbody>
                {csv.slice(1).map((row, rowIndex)=>{
                  return (
                    <tr key={`row-${rowIndex}`}>
                      {row.map((t, columnIndex) => <td key={`cell-${rowIndex}-${columnIndex}`}>{t}</td>)}
                    </tr>
                  )
                })}
              </tbody>
            </Table>
            <br />
            <p>{t("home.uploadCSV.modal.warnAboutMentionOrder")}</p>
            <Row>
              <Button
                color="primary"
                outline={true}
                type="submit"
                icon={faArrowRight}
                position="right"
                onClick={() => {
                  const csvContent = Papa.unparse(csv);
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const link = document.createElement('a');
                  const url = URL.createObjectURL(blob);
                  link.setAttribute('href', url);
                  link.setAttribute('download', 'election-model.csv');
                  link.style.visibility = 'hidden';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}>
                {t("home.uploadCSV.modal.downloadCSVModel")}
              </Button>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CSVModal;