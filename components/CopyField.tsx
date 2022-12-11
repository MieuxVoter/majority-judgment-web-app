/* eslint react/prop-types: 0 */
import React, { useState } from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClone,
  faExternalLinkAlt,
  faCheck,
  faCopy,
} from '@fortawesome/free-solid-svg-icons';
import ClipboardJS from 'clipboard';

const CopyField = ({ value, iconCopy = null, text }) => {
  const [check, setCheck] = useState(false);

  const handleClickOnField = (event) => {
    event.target.focus();
    event.target.select();
    setCheck(true);

    setTimeout(() => {
      setCheck(false);
    }, 3000);
  };

  if (typeof window !== 'undefined') {
    new ClipboardJS('.btn');
  }

  let icon = null;
  if (check) {
    icon = faCheck;
  } else if (iconCopy) {
    icon = iconCopy;
  } else {
    icon = faCopy;
  }

  return (
    <div className="input-group my-4 ">
      <input
        type="text"
        style={{ display: 'none' }}
        className="form-control"
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
          target="_blank"
          rel="noreferrer"
          className="btn btn-copy"
          type="button"
        >
          {text}
          <FontAwesomeIcon icon={icon} />
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
