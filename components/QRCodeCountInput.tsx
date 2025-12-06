import { Col, Row } from "reactstrap";

const QRCodeCountInput = ({onEdit, value}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        onEdit(value || 0)
      }

    return <Row className="list_input gx-2 p-1  my-3 align-items-center">
        <Col>
        <input
            type="number"
            className="border-0 w-100"
            onChange={handleChange}
            value={value || 0}
            min="0"
        />
        </Col>
    </Row>
}

export default QRCodeCountInput;