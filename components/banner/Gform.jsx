import PropTypes from 'prop-types';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCommentAlt} from "@fortawesome/free-solid-svg-icons";
import {api} from "@services/api"


const Gform = (props) => {
  return (
    <a
      className={props.className}
      href={api.feedbackForm}
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
