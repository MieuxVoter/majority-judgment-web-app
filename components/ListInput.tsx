import { useTranslation } from 'next-i18next';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Col } from 'reactstrap';
import { useState } from 'react';
import Button from '@components/Button';

const InputField = ({ value, onDelete }) => {
  return (
    <Button
      customIcon={<FontAwesomeIcon icon={faXmark} onClick={onDelete} />}
      className="bg-light text-primary border-0"
      outline={true}
      style={{ boxShadow: 'unset' }}
    >
      {value}
    </Button>
  );
};

const ListInput = ({ onEdit, inputs, validator }) => {
  const [state, setState] = useState('');

  const { t } = useTranslation();

  const handleDelete = (position: number) => {
    const inputCopy = [...inputs];
    inputCopy.splice(position, 1);
    onEdit(inputCopy);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === ';') {
      if (validator(state)) {
        onEdit([...inputs, state]);
        setState('');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(e.target.value);
  };

  return (
    <Row className="list_input gx-2 p-1  my-3 align-items-center">
      {inputs.map((item, i) => (
        <Col className="col-auto">
          <InputField key={i} value={item} onDelete={() => handleDelete(i)} />
        </Col>
      ))}
      <Col>
        <input
          type="text"
          className="border-0 w-100"
          placeholder={t('admin.private-placeholder')}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          value={state.replace(';', '')}
        />
      </Col>
    </Row>
  );
};

export default ListInput;
