/* eslint react/prop-types: 0 */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";

const Gform = props => {
  return (
    <a
      className={props.className}
      href="https://docs.google.com/forms/d/1Y5ocQscSkHFZdniR7Lvc9mbkJYe9ZIC4w0tOvC4rDZo/viewform?edit_requested=true"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={faGoogleDrive} className="mr-2" />
      Votre avis nous intéresse !
    </a>
  );
};

export default Gform;

//https://docs.google.com/forms/d/1Y5ocQscSkHFZdniR7Lvc9mbkJYe9ZIC4w0tOvC4rDZo/viewform?edit_requested=true
