/* eslint react/prop-types: 0 */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';

const Twitter = (props) => {
  const handleClick = () => {
    const url =
      'https://twitter.com/intent/tweet?text=' +
      props.title +
      '&t=' +
      props.url;
    window.open(
      url,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=500,width=700'
    );
  };
  return <img src="/twitter.svg" onClick={handleClick} role="button" />;
};

export default Twitter;

//i
