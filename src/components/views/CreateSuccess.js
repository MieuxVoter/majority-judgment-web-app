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
            urlOfVote:"http://localhost/vote",
            urlOfResult:"http://localhost/result"
        };
        this.urlVoteField = React.createRef();
        this.urlResultField = React.createRef();
    }

    handleClickOnField=(event)=>{
        event.target.focus();
        event.target.select();
    };

    handleClickOnCopyVote=(event)=>{
        const input = this.urlVoteField.current;
        input.focus();
        input.select();
        document.execCommand("copy");
    };

    handleClickOnCopyResult=(event)=>{
        const input = this.urlResultField.current;
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
                        <p className="mt-4 mb-1">Vous pouvez maintenant partager le lien du vote aux participants :</p>


                            <div className="input-group  ">
                                <input type="text" className="form-control" ref={this.urlVoteField}
                                       value={this.state.urlOfVote} readOnly onClick={this.handleClickOnField} />

                                    <div className="input-group-append">
                                        <Button  className="btn btn-outline-light" onClick={this.handleClickOnCopyVote}
                                                type="button">
                                            <FontAwesomeIcon icon={faCopy} className="mr-2"/>Copier</Button>
                                    </div>

                            </div>

                            <p className="mt-4 mb-1">Voici le lien vers les résultats du vote en temps réel :</p>
                            <div className="input-group ">
                                <input type="text" className="form-control" ref={this.urlResultField}
                                       value={this.state.urlOfResult} readOnly onClick={this.handleClickOnField} />

                                <div className="input-group-append">
                                    <Button  className="btn btn-outline-light" onClick={this.handleClickOnCopyResult}
                                             type="button">
                                        <FontAwesomeIcon icon={faCopy} className="mr-2"/>Copier</Button>
                                </div>

                            </div>


                        </Col>
                    </Row>
                <Row className="mt-4 mb-4" >
                    <Col >
                        <div className=" bg-warning text-white p-2 "><p className="m-0 p-0 text-center">Conservez ces liens précieusements !</p>
                        <p className="small m-2 p-0"><b>ATTENTION</b> : Vous ne les retrouverez pas ailleurs et nous ne serons pas capable de vous les communiquer. Vous pouvez par exemple les enregistrer dans les favoris de votre
                            navigateur.</p></div>
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
