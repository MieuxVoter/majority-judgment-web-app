import React, { useContext } from "react";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCommentAlt} from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../../AppContext"


const Gform = (props) => {
  const context = useContext(AppContext);
  console.log(context);

  return (
    <a
      className={props.className}
      href={context.feedbackForm}
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={faCommentAlt} className="mr-2" />
      Votre avis nous intéresse !
    </a>
  );
}

Gform.propTypes = {
  className: PropTypes.string,
};

export default Gform;
