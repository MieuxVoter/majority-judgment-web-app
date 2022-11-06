/* eslint react/prop-types: 0 */
import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClone,
  faVoteYea,
  faExclamationTriangle,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import ClipboardJS from 'clipboard';
const CopyField = (props) => {
  const ref = React.createRef();
  const handleClickOnField = (event) => {
    event.target.focus();
    event.target.select();
  };
  const { t, value, iconCopy, text } = props;

  if (typeof window !== 'undefined') {
    new ClipboardJS('.btn');
  }

  return (
    <div className="input-group my-4 ">
      <input
        type="text"
        style={{ display: 'none' }}
        className="form-control"
        // ref={ref}
        value={value}
        readOnly
        onClick={handleClickOnField}
      />

      <div className="input-group-append copy">
        {/* <Button
          href={value}
          target="_blank"
          rel="noreferrer"
          className="btn btn-success"
          type="button"
        >
          <FontAwesomeIcon icon={iconOpen}  />
          {t("Go")}
        </Button> */}

        <Button
          data-clipboard-text={value}
          id="tooltip"
          target="_blank"
          rel="noreferrer"
          className="btn btn-copy"
          type="button"
        >
          {text}
          <FontAwesomeIcon icon={iconCopy} />
        </Button>
      </div>
      <UncontrolledTooltip placement="top" target="tooltip" trigger="click">
        Lien copié
      </UncontrolledTooltip>
    </div>
  );
};

CopyField.defaultProps = {
  iconCopy: faClone,
  iconOpen: faExternalLinkAlt,
};

export default CopyField;
