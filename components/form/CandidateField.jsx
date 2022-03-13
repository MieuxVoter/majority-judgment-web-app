import { useState, useEffect } from 'react'
import ButtonWithConfirm from "./ButtonWithConfirm";
import TrashButton from "./TrashButton";
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
  faPlus, faCogs, faCheck, faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const DragHandle = sortableHandle(({ children }) => (
  <span className="input-group-text indexNumber">{children}</span>
));

const CandidateField = ({ avatar, label, description, candIndex, onDelete, onAdd, ...inputProps }) => {
  const { t } = useTranslation();
  const [visibled, setVisibility] = useState(false);
  const toggle = () => setVisibility(!visibled)



  const [selected, setSelectedState] = useState(false);
  const [className , setClassName] = useState("none");
  const [trashIcon , setTrashIcon] = useState("none");
  const [plusIcon , setPlusIcon] = useState("none");
  
  const addCandidate = () => {
    toggle();
    onAdd();  
  }
  useEffect(() => {
    setClassName("candidateButton " + (selected ? "candidateAdded" : ""))
}, [selected] );
useEffect(() => {
  setPlusIcon("mr-2 cursorPointer " + (selected ? "trashIcon" : ""))
}, [selected] );
useEffect(() => {
  setTrashIcon("trashIcon " + (selected ? "displayTrash" : ""))
}, [selected] );

const addFunction = () => {
  addCandidate();
  setSelectedState(!selected); 
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
      <div className={className}>
        <div className="avatarThumb">
          <img src={createObjectURL} alt="" />
          <input placeholder="Ajouter un candidat" className="candidate-placeholder ml-2" value={label}/>         
        </div>       
       
        <FontAwesomeIcon  onClick={toggle} icon={faPlus} className={plusIcon} />
        <div className={trashIcon}><TrashButton  label={label} onDelete={onDelete}/></div>
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
                    <input type="file" name="myImage" id="myImage" value={avatar} onChange={uploadToClient} />
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
                required
              />
              <Label>Description (Facultatif)</Label>
              <Input
                type="text"
                value={description}
                placeholder="Texte"
                tabIndex={candIndex + 1}
                maxLength="250"
                autoFocus
              />
              <Row className="removeAddButtons">
                
                <ButtonWithConfirm className="removeButton" label={label} onDelete={onDelete, toggle}/>
                <Button className="addButton" label={label} onClick={addFunction}>
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
