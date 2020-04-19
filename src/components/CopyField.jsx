import React, {Component} from 'react';
import {Button} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';


const CopyField = props => {
  const ref = React.createRef();
  const handleClickOnField = event => {
    event.target.focus();
    event.target.select();
  };
  const handleClickOnButton = event => {
    const input = ref.current;
    input.focus();
    input.select();
    document.execCommand('copy');
  };

  const {t, value, icon} = props;

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
          className="btn btn-outline-light"
          onClick={handleClickOnButton}
          type="button">
          <FontAwesomeIcon icon={icon} className="mr-2" />
          {t('Copy')}
        </Button>
      </div>
    </div>
  );
};

export default CopyField;
