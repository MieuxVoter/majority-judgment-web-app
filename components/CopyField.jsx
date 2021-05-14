/* eslint react/prop-types: 0 */
import React from "react";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faVoteYea,
  faExclamationTriangle,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";

const CopyField = (props) => {
  const ref = React.createRef();
  const handleClickOnField = (event) => {
    event.target.focus();
    event.target.select();
  };
  const handleClickOnButton = () => {
    const input = ref.current;
    input.focus();
    input.select();
    document.execCommand("copy");
  };

  const { t, value, iconCopy, iconOpen } = props;

  return (
    <div className="input-group  ">
      <input
        type="text"
        className="form-control"
        ref={ref}
        value={value}
        readOnly
        onClick={handleClickOnField}
      />

      <div className="input-group-append">
        {/*
        <Button
          href={value}
          target="_blank"
          rel="noreferrer"
          className="btn btn-success"
          type="button"
        >
          <FontAwesomeIcon icon={iconOpen} className="mr-2" />
          {t("Go")}
        </Button>
        */}
        <Button
          className="btn btn-secondary"
          onClick={handleClickOnButton}
          type="button"
        >
          <FontAwesomeIcon icon={iconCopy} className="mr-2" />
          {t("Copy")}
        </Button>
      </div>
    </div>
  );
};

CopyField.defaultProps = {
  iconCopy: faCopy,
  iconOpen: faExternalLinkAlt,
};

export default CopyField;
