import React, {Component} from "react";
import {Button, Col, Container,  Row} from "reactstrap";
import logoLine from "../../logos/logo-line-white.svg";
import {Link} from 'react-router-dom';
import { faCopy, faUsers } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


class UnknownView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            urlOfVote:"http://localhost",
        };
        this.urlField = React.createRef();
    }

    handleClickOnUrl=(event)=>{
        event.target.focus();
        event.target.select();
    };

    handleClickOnCopy=(event)=>{
        const input = this.urlField.current;
        input.focus();
        input.select();
        document.execCommand("copy");

    };

    render(){
        return(
            <Container>
                    <Row>
                        <Link  to="/" className="d-block ml-auto mr-auto mb-4"><img src={logoLine} alt="logo" height="128" /></Link>
                    </Row>
                    <Row className="mt-4">
                        <Col className="text-center offset-lg-3" lg="6"><h2>Vote créé avec succès !</h2>
                        <p>Vous pouvez maintenant partager le lien du vote aux participants :</p>


                            <div className="input-group  ">
                                <input type="text" className="form-control" ref={this.urlField}
                                       value={this.state.urlOfVote} readOnly onClick={this.handleClickOnUrl} />

                                    <div className="input-group-append">
                                        <Button  className="btn btn-outline-light" onClick={this.handleClickOnCopy}
                                                type="button">
                                            <FontAwesomeIcon icon={faCopy} className="mr-2"/>Copier</Button>
                                    </div>

                            </div>
                            <small className="text-white">Pensez a enregistrer ce lien dans les favoris de votre
                                navigateur !</small>

                        </Col>
                    </Row>

                    <Row className="mt-4 mb-4" >
                        <Col className="text-center">
                            <Link to={this.state.urlOfVote} className="btn btn-success"><FontAwesomeIcon icon={faUsers} className="mr-2"/>Participer maintenant !</Link>
                        </Col>
                    </Row>
            </Container>
        )
    }
}
export default UnknownView;
