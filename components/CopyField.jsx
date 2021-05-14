/* eslint react/prop-types: 0 */
import React from "react";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CopyField = props => {
  const ref = React.createRef();
  const handleClickOnField = event => {
    event.target.focus();
    event.target.select();
  };
  const handleClickOnButton = () => {
    const input = ref.current;
    input.focus();
    input.select();
    document.execCommand("copy");
  };

  const { t, value, iconCopy } = props;

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
        <Button
          className="btn btn-secondary"
          onClick={handleClickOnButton}
          type="button"
        >
          <FontAwesomeIcon icon={iconCopy} className="mr-2" />
          {t("Copy")}
        </Button>
      </div>
        {/*<div className="input-group-append">
        <a
          className="btn btn-secondary"
          href={value}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={iconOpen} className="mr-2" />
          {t("Open")}
        </a>
      </div>*/}
    </div>
  );
};

export default CopyField;
