import {
  Row,
  Col,
  Label,
  Input,
  InputGroup,
  Button,
  Modal,
  ModalBody,
  Form
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "next-i18next";
import Image from 'next/image';
import {useElection, useElectionDispatch} from './ElectionContext';
import defaultAvatar from '../../public/default-avatar.svg'


const CandidateModal = ({isOpen, position, toggle}) => {

  const {t} = useTranslation();

  const election = useElection();
  const dispatch = useElectionDispatch();
  const candidate = election.candidates[position];
  const image = candidate && candidate.image ? candidate.image : defaultAvatar;

  const addCandidate = () => {
    dispatch({'type': 'candidate-push', 'value': "default"})
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      keyboard={true}
    >
      <div className="modal-header p-4">
        <h4 className="modal-title">
          {t('admin.add-candidate')}
        </h4>
        <button type="button" onClick={toggle} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <ModalBody className='p-4'>
        <p>{t('admin.add-candidate-desc')}
        </p>
        <Col>
          <InputGroup>
            <Form className='container container-fluid'>
              <Row className='gx-4 mb-3'>
                <Col className='col-auto'>
                  <Image src={image} height={120} width={120} alt={t('admin.photo')} />
                </Col>
                <Col className='col-auto'>
                  <Label className='fw-bold'>{t('admin.photo')} <span className='text-muted'> ({t('admin.optional')})</span></Label>
                  <p>{t('admin.photo-type')} jpg, png, pdf</p>
                  <div>
                    <input type="file" name="image-upload" id="image-upload" />
                    <label className="inputfile" htmlfor="image-upload">{t('admin.photo-import')}</label>
                  </div>

                </Col>
              </Row>
              <div className='mb-3'>
                <Label className='fw-bold'>{t('common.name')} </Label>
                <Input
                  type="text"
                  placeholder={t("admin.candidate-name-placeholder")}
                  tabIndex={position + 1}
                  maxLength="250"
                  autoFocus
                  required
                />
              </div>
              <div className=''>
                <Label className='fw-bold'>{t('common.description')} <span className='text-muted'> ({t('admin.optional')})</span></Label>
                <Input
                  type="text"
                  defaultValue={candidate.description}
                  placeholder={t("admin.candidate-desc-placeholder")}
                  maxLength="250"
                />
              </div>
              <Row className='mt-5 mb-3'>
                <Col className='col-auto me-auto'>
                  <Button onClick={toggle} color='dark' outline={true}>
                    <Row className='gx-2 align-items-end'>
                      <Col>
                        <FontAwesomeIcon icon={faArrowLeft} />
                      </Col>
                      <Col>
                        {t('common.cancel')}
                      </Col>
                    </Row>
                  </Button>
                </Col>
                <Col className='col-auto '>
                  <Button outline={true} color="primary" onClick={addCandidate}>
                    <Row className='gx-2 align-items-end'>
                      <Col>
                        <FontAwesomeIcon icon={faPlus} />
                      </Col>
                      <Col>
                        <span>{t('common.save')}</span>
                      </Col>
                    </Row>
                  </Button>
                </Col>

              </Row>
            </Form>
          </InputGroup>
        </Col>
      </ModalBody >
    </Modal >);

}
export default CandidateModal;
