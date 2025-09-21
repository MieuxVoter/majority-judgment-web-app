import React from 'react';
import { Container } from 'reactstrap';
import PatternedBackground from '@components/PatternedBackground';
import Button from '@components/Button';

interface ErrorDisplayProps {
  title: string;
  message: string;
  buttonText: string;
  onButtonClick: () => void;
}

const ErrorDisplay = ({ title, message, buttonText, onButtonClick }: ErrorDisplayProps) => {
  return (
    <PatternedBackground>
      <Container
        className="d-flex flex-column justify-content-center align-items-center text-center text-white"
        style={{ minHeight: '100vh' }}
      >
        <h4 className="mb-4">{title}</h4>
        <p className="mb-4">{message}</p>
        <Button color="secondary" className="bg-blue" onClick={onButtonClick}>
          {buttonText}
        </Button>
      </Container>
    </PatternedBackground>
  );
};

export default ErrorDisplay;
