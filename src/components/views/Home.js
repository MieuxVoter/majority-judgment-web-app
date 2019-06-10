import React, {Component} from "react";
import { Container, Row, Col,Button, Input  } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import { Redirect } from 'react-router-dom';
import logoLine from "../../logos/logo-line-white.svg";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title:null,
            redirect:false,
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({redirect: true});
    };

    handleChangeTitle= (event) => {
            this.setState({title: event.target.value});
    };

    render(){
        const redirect = this.state.redirect;

        if (redirect) {
            return <Redirect to={ '/create-ballot/?title='+encodeURIComponent(this.state.title)} />;
        }
        return(
            <Container>
                <form ref="form" onSubmit={this.handleSubmit}>
                    <Row>
                        <img src={logoLine} alt="logo" height="128" className="d-block ml-auto mr-auto mb-4"/>
                    </Row>
                <Row>
                    <Col className="text-center"><h3>Simple et gratuit : organisez un vote à l'aide du Jugement Majoritaire.</h3></Col>
                </Row>
                <Row className="mt-2">
                    <Col xs="12" md="9" xl="6" className="offset-xl-2">
                            <Input placeholder="Saisissez ici la question de votre vote" autoFocus required className="mt-2" name="title" value={this.state.title?this.state.title:""} onChange={this.handleChangeTitle} />
                    </Col>
                    <Col xs="12" md="3" xl="2">
                        <Button type="submit" className="btn btn-block btn-secondary mt-2" ><FontAwesomeIcon icon={faRocket} className="mr-2"/>Lancer</Button>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col className="text-center"><p>Pas de publicité et pas de cookie publicitaire.</p></Col>
                </Row>
                </form>
            </Container>
        )
    }
}
export default Home;
