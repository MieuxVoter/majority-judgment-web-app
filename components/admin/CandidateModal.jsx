import {
  Row,
  Col,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  Button, Modal, ModalHeader, ModalBody, Form
} from "reactstrap";
import {useTranslation} from "react-i18next";
import Image from 'next/image';
import {
  faPlus, faCogs, faCheck, faTrash
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useElection, useElectionDispatch} from './ElectionContext';
import ButtonWithConfirm from "./ButtonWithConfirm";
import defaultAvatar from '../../public/avatar.svg'
import HelpButton from "@components/admin/HelpButton";
import AddPicture from "@components/admin/AddPicture";
import addIcon from '../../public/add.svg'
import leftArrowIcon from '../../public/arrow-left.svg'

const CandidateModal = ({isOpen, position, toggle}) => {

  const {t} = useTranslation();

  const election = useElection();
  const dispatch = useElectionDispatch();
  const candidate = election.candidates[position];
  const image = candidate && candidate.image ? candidate.image : defaultAvatar;

  const removeCandidate = () => {
    dispatch({'type': 'candidate-rm', 'value': position})
  }

  const addCandidate = () => {
    dispatch({'type': 'candidate-push', 'value': "default"})
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      keyboard={true}
    >
      <div className="modal-header">
        <h4 className="modal-title">
          {t('admin.add-candidate')}
        </h4>
        <button type="button" onClick={toggle} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <ModalBody>
        <p>{t('admin.add-candidate-desc')}
        </p>
        <Col className="addCandidateCard">
          <InputGroup className="addCandidateForm">
            <Form>
              <div className="input-group-prepend">
                <div className="ajout-avatar">
                  <div>
                    <div className="avatar-placeholer">
                    </div>
                  </div>
                  <div className="avatar-text">
                    <h4>{t('admin.photo')} <span> ({t('admin.optional')})</span></h4>

                    <p>{t('admin.photo-type')} jpg, png, pdf</p>
                    <div className="btn-ajout-avatar">
                      <input type="file" name="myImage" id="myImage" />
                      <label className="inputfile" htmlFor="myImage">{t('admin.photo-import')}</label>
                    </div>
                  </div>
                </div>
                <img src="/avatar.svg" />
              </div>
              <Label className="addCandidateText">{t('common.name')}</Label>
              <Input
                type="text"
                placeholder={t("admin.candidate-name-placeholder")}
                tabIndex={position + 1}
                maxLength="250"
                autoFocus
                className="addCandidateText"
                required
              />
              <Label>{t('common.description')} <span> ({t('admin.optional')})</span></Label>
              <Input
                type="text"
                defaultValue={candidate.description}
                placeholder={t("admin.candidate-desc-placeholder")}
                maxLength="250"
              />
              <Row>
                <Col col='col-auto me-auto'>
                  <Button onClick={toggle} color='dark' outline={true}>
                    <Image src={leftArrowIcon} alt={t('common.cancel')} />
                    {t('common.cancel')}
                  </Button>
                </Col>
                <Col col='col-auto '>
                  <Button outline={true} color="primary" onClick={addCandidate} className="p-3">
                    <Image src={addIcon} alt={t('common.save')} />
                    <span>{t('common.save')}</span>
                  </Button>
                </Col>

              </Row>
            </Form>
          </InputGroup>
        </Col>
      </ModalBody>
    </Modal >);

}
export default CandidateModal;
