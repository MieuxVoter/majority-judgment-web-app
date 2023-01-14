import ButtonWithConfirm from "./ButtonWithConfirm";
import {Row, Col, Input, InputGroup, InputGroupAddon} from "reactstrap";
import {useTranslation} from "react-i18next";
import HelpButton from "@components/form/HelpButton";

const CandidateField = ({label, candIndex, onDelete, ...inputProps}) => {
  const {t} = useTranslation();

  return (
    <Row>
      <Col>
        <InputGroup>
          <Input
            type="text"
            value={label}
            {...inputProps}
            placeholder={t("resource.candidatePlaceholder")}
            tabIndex={candIndex + 1}
            maxLength="250"
            autoFocus
          />
          <ButtonWithConfirm
            className="btn btn-primary  border-light"
            label={label}
            onDelete={onDelete}
          ></ButtonWithConfirm>
        </InputGroup>
      </Col>
      <Col xs="auto" className="align-self-center ps-0">
        <HelpButton>
          {t(
            "Enter the name of your candidate or proposal here (250 characters max.)"
          )}
        </HelpButton>
      </Col>
    </Row>
  );
};

export default CandidateField;
