/* eslint react/prop-types: 0 */
import React from "react";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClone,
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
    <div className="input-group my-4 ">
      <input
        type="text"
        style={{display:"none"}}
        className="form-control"
        ref={ref}
        value={value}
        readOnly
        onClick={handleClickOnField}
      />

      <div className="input-group-append copy">
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
          className="btn btn-copy"
          onClick={handleClickOnButton}
          type="button"
        >
          {t("Copy")}
          <FontAwesomeIcon icon={iconCopy} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

CopyField.defaultProps = {
  iconCopy: faClone,
  iconOpen: faExternalLinkAlt,
};

export default CopyField;
