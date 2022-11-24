/**
 * Contain a button with a content that can be copied
 */
import {faCopy} from '@fortawesome/free-solid-svg-icons';
import {Button} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

interface ButtonCopyInterface {
  text: string;
  content: any;
}

const ButtonCopy = ({text, content}: ButtonCopyInterface) => {
  return (<Button
    className="bg-white text-black my-2 shadow-lg border-dark border py-3 px-4 border-3 justify-content-between gx-2 align-items-end"
    onClick={() => navigator.clipboard.writeText(content)}>

    <div>{text}</div>
    <div>
      <FontAwesomeIcon icon={faCopy} />
    </div>

  </Button >)

}

export default ButtonCopy;
