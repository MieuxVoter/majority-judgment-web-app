import { useState } from 'react'
import ButtonWithConfirm from "./ButtonWithConfirm";
import {
  Row,
  Col,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  Button, Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";
import { useTranslation } from "react-i18next";
import {
  sortableHandle
} from "react-sortable-hoc";
import HelpButton from "@components/form/HelpButton";
import AddPicture from "@components/form/AddPicture";
import {
  faPlus, faCogs, faCheck
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const DragHandle = sortableHandle(({ children }) => (
  <span className="input-group-text indexNumber">{children}</span>
));

const CandidateField = ({ label, description, candIndex, onDelete, onAdd, ...inputProps }) => {
  const { t } = useTranslation();
  const [visibled, setVisibility] = useState(false);
  const toggle = () => setVisibility(!visibled)
  const test = () => {
    toggle();
    onAdd();
  }
  const [image, setImage] = useState(null);
    const [createObjectURL, setCreateObjectURL] = useState(null);

    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];

            setImage(i);
            setCreateObjectURL(URL.createObjectURL(i));
        }
    };
  return (
    <Row className="rowNoMargin">
      <div className="candidateButton">
        <div className="avatarThumb">
          <img src={createObjectURL} alt="" />
          <span className="ml-2">Ajouter un candidat</span>
          
        </div>       
        <FontAwesomeIcon  onClick={toggle} icon={faPlus} className="mr-2 cursorPointer" />
      </div>

      <Modal
        isOpen={visibled}
        toggle={toggle}
        className="modal-dialog-centered"
      >

        <ModalHeader className='closeModalAddCandidate' toggle={toggle}>

        </ModalHeader>
        <ModalBody>









          <Col className="addCandidateCard">
            <InputGroup className="addCandidateForm">
              <InputGroupAddon addonType="prepend" className="addCandidateHeader">
                <DragHandle>
                  <h6>Ajouter un participant</h6>
                  <p>Ajoutez une photo, le nom et une description au candidat.</p>
                  <div className="ajout-avatar">
            <div>
                <div className="avatar-placeholer">
                    <img src={createObjectURL} />
                </div>
            </div>
            <div className="avatar-text">
                <h4>Photo <span> (facultatif)</span></h4>

                <p>Importer une photo.<br />format : jpg, png, pdf</p>
                <div className="btn-ajout-avatar">
                    <input type="file" name="myImage" id="myImage" onChange={uploadToClient} />
                    <label className="inputfile" for="myImage">Importer une photo</label>
                </div>
            </div>
        </div>
                  <img src="/avatar.svg" />
                </DragHandle>
              </InputGroupAddon>
              <Label className="addCandidateText">Nom et prenom</Label>
              <Input
                type="text"
                value={label}
                {...inputProps}
                placeholder={t("resource.candidatePlaceholder")}
                tabIndex={candIndex + 1}
                maxLength="250"
                autoFocus
                className="addCandidateText"
              />
              <Label className="sss">Description (Facultatif)</Label>
              <Input
                type="text"
                value={description}
                {...inputProps}
                placeholder="Texte"
                tabIndex={candIndex + 1}
                maxLength="250"
                autoFocus
                className="sss"
              />
              <Row className="removeAddButtons">
                <ButtonWithConfirm className="removeButton" label={label} onDelete={onDelete, toggle}></ButtonWithConfirm>
                <Button className="addButton" label={label} onClick={test}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Ajouter</span>
                </Button>
              </Row>
            </InputGroup>
          </Col>
        </ModalBody></Modal>
      {/* <Col xs="auto" className="align-self-center pl-0">
        <HelpButton>
          {t(
            "Enter the name of your candidate or proposal here (250 characters max.)"
          )}
        </HelpButton>
      </Col> */}
    </Row>
  );
}

export default CandidateField
