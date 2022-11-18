/**
 * Contain a button with a content that can be copied
 */
import {faCopy} from '@fortawesome/free-solid-svg-icons';
import Button from '@components/Button';

interface ButtonCopyInterface {
  text: string;
  content: any;
}

const ButtonCopy = ({text, content}: ButtonCopyInterface) => {
  return (<Button
    className="bg-white shadow-lg border-black border-3"
    position="right"
    icon={faCopy}
    onClick={() => navigator.clipboard.writeText(content)}
  >
    {text}

  </Button >)

}

export default ButtonCopy;
