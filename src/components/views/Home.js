import React, {Component} from "react";
import { Container, Row, Col,Button, Input  } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRocket } from '@fortawesome/free-solid-svg-icons'

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render(){
        return(
            <Container>
                <Row>
                    <Col className="text-center"><h3>Simple, gratuit : organisez un vote à l'aide du Jugement Majoritaire.</h3></Col>
                </Row>
                <Row className="mt-2">
                    <Col xs="12" md="9" xl="6" className="offset-xl-2">
                            <Input placeholder="Saisissez ici la question de votre vote" className="mt-2" />
                    </Col>
                    <Col xs="12" md="3" xl="2">
                        <Button className="btn btn-block btn-secondary mt-2"><FontAwesomeIcon icon={faRocket} className="mr-2"/>Lancer</Button>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col className="text-center"><p>Pas de publicité et pas de cookie publicitaire.</p></Col>
                </Row>
            </Container>
        )
    }
}
export default Home;
