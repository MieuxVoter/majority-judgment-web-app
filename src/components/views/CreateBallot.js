import React, {Component} from "react";
import { Container, Row, Col, Input  } from 'reactstrap';


class CreateBallot extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render(){
        const params = new URLSearchParams(this.props.location.search);


        return(
            <Container>
                <Row>
                    <Col ><h3>Formulaire :</h3></Col>
                </Row>
                <Row className="mt-2">
                    <Col xs="12" >
                        <Input placeholder="Saisissez ici la question de votre vote" name="title" autoFocus defaultValue={params.get("title")?params.get("title"):""} />
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default CreateBallot;
