/* eslint react/prop-types: 0 */
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";

class Gform extends Component {
  render () {
    return (
      <a
        className={this.props.className}
        href={this.context.feedbackForm}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faGoogleDrive} className="mr-2" />
        Votre avis nous intéresse !
      </a>
    );
  }
};

export default Gform;
