import React, {Component} from "react";
import { Container, Row, Col, Input, Label  } from 'reactstrap';
import HelpButton from "../form/HelpButton";



class CreateBallot extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
        this.focusInput= React.createRef();
    }

    render(){
        const params = new URLSearchParams(this.props.location.search);


        return(
            <Container>
                <form onSubmit={this.handleSubmit} autoComplete="off">
                    <Row>
                        <Col ><h3>Démarrer un vote</h3></Col>
                    </Row>
                    <Row>
                        <hr />
                    </Row>
                    <Row className="mt-2">
                        <Col xs="12" >
                            <Label for="title">Question du vote :</Label>
                        </Col>
                        <Col   >
                            <Input placeholder="Saisissez ici la question de votre vote" name="title" id="title" innerRef={this.focusInput} autoFocus defaultValue={params.get("title")?params.get("title"):""} maxlength="250" />
                        </Col>
                        <Col xs="auto" className="align-self-center pl-0">
                            <HelpButton id="helpTitle">
                                Posez ici votre question ou introduisez simplement votre vote.
                                <br /><u>Par exemple :</u> <em>Pour être mon représentant, je juge ce candidat ...</em>
                            </HelpButton>
                        </Col>
                    </Row>
                </form>
            </Container>
        )
    }
}
export default CreateBallot;
