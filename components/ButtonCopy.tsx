/**
 * Contain a button with a content that can be copied
 */
import React, { useState } from 'react';
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ButtonCopyInterface {
  text: string;
  content: any;
}

const ButtonCopy = ({ text, content }: ButtonCopyInterface) => {
  const [check, setCheck] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCheck(true);

    setTimeout(() => {
      setCheck(false);
    }, 3000);
  };

  const icon = check ? faCheck : faCopy;

  return (
    <Button
      className="bg-white text-black my-2 shadow-lg border-dark border py-3 px-4 border-3 justify-content-between gx-2 align-items-end"
      onClick={handleCopy}
    >
      <div>{text}</div>
      <div>
        <FontAwesomeIcon icon={icon} />
      </div>
    </Button>
  );
};

export default ButtonCopy;
