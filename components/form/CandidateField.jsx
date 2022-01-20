import {useState} from 'react'
import ButtonWithConfirm from "./ButtonWithConfirm";
import {
  Row,
  Col,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import {useTranslation} from "react-i18next";
import {
  sortableHandle
} from "react-sortable-hoc";
import HelpButton from "@components/form/HelpButton";

const DragHandle = sortableHandle(({children}) => (
  <span className="input-group-text indexNumber">{children}</span>
));
const CandidateField = ({label, description, candIndex, onDelete, ...inputProps}) => {
  const {t} = useTranslation();

  return (
    <Row>
      <Col className="addCandidateCard">
        <InputGroup className="addCandidateForm">
          <InputGroupAddon addonType="prepend"  className="addCandidateHeader">
            <DragHandle>
              <h6>Ajouter un participant</h6>
              <p>Ajoutez une photo, le nom et une description au candidat.</p>
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
          <Label className="addCandidateText">Description (Facultatif)</Label>
          <Input
            type="text"
            value={description}
            {...inputProps}
            placeholder={t("resource.candidatePlaceholder")}
            tabIndex={candIndex + 1}
            maxLength="250"
            autoFocus
            className="addCandidateText"
          />
          <ButtonWithConfirm className="" label={label} onDelete={onDelete}>
            
          </ButtonWithConfirm>
        </InputGroup>
      </Col>
      <Col xs="auto" className="align-self-center pl-0">
        <HelpButton>
          {t(
            "Enter the name of your candidate or proposal here (250 characters max.)"
          )}
        </HelpButton>
      </Col>
    </Row>
  );
}

export default CandidateField
