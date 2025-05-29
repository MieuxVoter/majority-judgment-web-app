import {useTranslation} from 'next-i18next';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Row, Col} from 'reactstrap';
import {useState} from 'react';
import Button from '@components/Button';

const InputField = ({value, onDelete}) => {
  return (
    <Button
      customIcon={<FontAwesomeIcon icon={faXmark} onClick={onDelete} />}
      className="bg-light text-primary border-0"
      outline={true}
      style={{boxShadow: 'unset'}}
    >
      {value}
    </Button>
  );
};

const ListInput = ({onEdit, inputs, validator}) => {
  const [state, setState] = useState('');

  const {t} = useTranslation();

  const handleDelete = (position: number) => {
    const inputCopy = [...inputs];
    inputCopy.splice(position, 1);
    onEdit(inputCopy);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // if we press delete, we remove the last input
    if (e.key === "Backspace") {
      e.preventDefault();
      
      if (state === "") {
        onEdit([...inputs.slice(0, -1)]);
        return
      }
      else {
        setState(state.slice(0, -1));
      }
    }

    if (['Enter', 'Tab', ';', ' ', ','].includes(e.key) && validator(state.trim())) {
      onEdit([...inputs, state]);
      setState('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const splittingCharacters = ['Enter', 'Tab', ';', ' ', ',']

    const lastCharacter = e.target.value[e.target.value.length - 1]
    if (!splittingCharacters.includes(lastCharacter)) {
      setState(e.target.value);
    };

    // Check if we have a splitting character on the target value
    // This happens for example when we copy paste a list of emails
    if (splittingCharacters.some(character => e.target.value.includes(character))) {
      const splits = e.target.value.split(/[,;\t\n ]/)
      const validEmails = []
      const invalidEmails = []

      splits.forEach((email) => {
        if (email == '')
          return
        if (validator(email)) {
          validEmails.push(email)
        }
        else {
          invalidEmails.push(email)
        }
      });

      onEdit([...inputs, ...validEmails])
      setState(invalidEmails.join(', '))
    };

  }

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
          value={state}
        />
      </Col>
    </Row>
  );
};

export default ListInput;
