/* eslint react/prop-types: 0 */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';

const Facebook = (props) => {
  const handleClick = () => {
    const url =
      'https://www.facebook.com/sharer/sharer.php?u=' +
      props.url +
      '&t=' +
      props.title;
    window.open(
      url,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=500,width=700'
    );
  };
  return (
    <img
      src="/facebook.svg"
      onClick={handleClick}
      className="cursorPointer mr-2"
    />
  );
};

export default Facebook;

//i
