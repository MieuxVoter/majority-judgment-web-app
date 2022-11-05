import {useTranslation} from "next-i18next";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Row, Col} from "reactstrap"
import {useState} from "react";
import Button from "@components/Button"


const InputField = ({value, onDelete}) => {
  return <Button
    icon={faXmark}
    className='bg-light text-primary border-0'
    outline={true}
    style={{boxShadow: "unset"}}
  >
    {value}
  </Button >
}


const ListInput = ({onEdit, inputs, validator}) => {

  const [state, setState] = useState("");

  const {t} = useTranslation();

  const handleDelete = (position: number) => {
    onEdit({...inputs}.splice(position))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (validator(state)) {
        setState("");
        onEdit([...inputs, state])
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(e.target.value);
  }

  return <Row className='gx-2 p-1 shadow list-input align-items-center'>
    {inputs.map((item, i) =>
      <Col className='col-auto'>
        <InputField
          key={i}
          value={item}
          onDelete={() => handleDelete(i)}
        />
      </Col>
    )
    }
    <Col className='col-auto'>
      <input
        type='text'
        className='border-0 w-100'
        placeholder={t('admin.private-placeholder')}
        onKeyPress={handleKeyDown}
        onChange={handleChange}
        value={state}
      />
    </Col>
  </Row>
}

export default ListInput;
