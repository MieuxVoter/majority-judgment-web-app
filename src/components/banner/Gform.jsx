/* eslint react/prop-types: 0 */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";

const Gform = props => {
  return (
    <a
      className={props.className}
      href={process.env.REACT_APP_FEEDBACK_FORM}
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={faGoogleDrive} className="mr-2" />
      Votre avis nous intéresse !
    </a>
  );
};

export default Gform;
