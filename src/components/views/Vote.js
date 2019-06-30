import React, {Component} from "react";
import {Button, Col, Container, Row} from "reactstrap";
import {ToastContainer} from "react-toastify";
import ButtonWithConfirm from "../form/ButtonWithConfirm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";

//TODO : variable de config dans un fichier à part (avec les mentions, le min/max de mentions, le nombre max de candidats, les maxlength,l'url api, etc ...)
const mentions = ["Excellent","Trés Bien","Bien","Assez Bien","Passable","Insuffisant","A Rejeter"];

class Vote extends Component {

    constructor(props) {
        super(props);
        this.state = {
            candidates:[],
            title:null,
            nbMentions:0,
            ratedCandidates:[],
            colSizeCandidateLg:4,
            colSizeCandidateMd:6,
            colSizeCandidateXs:12,
            colSizeMentionLg:1,
            colSizeMentionMd:1,
            colSizeMentionXs:1,

        };

    }

    componentDidMount() {
        //todo fetch data from API
        let fetchedData={
            title:"Merci d'évaluer les candidats suivants : ",
            candidates:[ {id:0, label:"Mme ABCD"}, {id:2, label:"M. EFGH"}, {id:3, label:"M. IJKL"}, {id:4, label:"M. MNOP"} ],
            nbMentions:7,
        };
        let data={
            title:fetchedData.title,
            candidates:fetchedData.candidates,
            nbMentions:fetchedData.nbMentions,
            colSizeCandidateLg:0,
            colSizeCandidateMd:0,
            colSizeCandidateXs:0,
            colSizeMentionLg:Math.floor((12-this.state.colSizeCandidateLg)/fetchedData.nbMentions),
            colSizeMentionMd:Math.floor((12-this.state.colSizeCandidateMd)/fetchedData.nbMentions),
            colSizeMentionXs:Math.floor((12-this.state.colSizeCandidateXs)/fetchedData.nbMentions),
        };
        data.colSizeCandidateLg=((12-data.colSizeMentionLg*data.nbMentions)>0)?(12-data.colSizeMentionLg*data.nbMentions):12;
        data.colSizeCandidateMd=((12-data.colSizeMentionMd*data.nbMentions)>0)?(12-data.colSizeMentionMd*data.nbMentions):12;
        data.colSizeCandidateXs=((12-data.colSizeMentionXs*data.nbMentions)>0)?(12-data.colSizeMentionXs*data.nbMentions):12;

        //shuffle candidates
       let i,
            j,
            temp;
       for (i = data.candidates.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = data.candidates[i];
            data.candidates[i] = data.candidates[j];
            data.candidates[j] = temp;
        }
        this.setState(data);
    }





handleSubmit= (event) => {
        event.preventDefault();
    };


    render(){
        return(
            <Container>
                <ToastContainer/>
                <form onSubmit={this.handleSubmit} autoComplete="off" >
                    <Row>
                        <Col ><h3>{ this.state.title }</h3></Col>
                    </Row>
                    <Row className="cardVote d-none d-lg-flex" >
                        <Col xs={this.state.colSizeCandidateXs} md={this.state.colSizeCandidateMd} lg={this.state.colSizeCandidateLg}  ><h5 >&nbsp;</h5></Col>
                        { mentions.map((mention,j) => {
                            return (j<this.state.nbMentions)?<Col xs={this.state.colSizeMentionXs} md={this.state.colSizeMentionMd} lg={this.state.colSizeMentionLg} key={j} className="text-center"><h6><small className="nowrap">{mention}</small></h6></Col>:null
                        })
                        }
                    </Row>

                    {

                        this.state.candidates.map((candidate,i) => {
                            return <Row key={i} className="cardVote">
                                        <Col xs={this.state.colSizeCandidateXs} md={this.state.colSizeCandidateMd} lg={this.state.colSizeCandidateLg}  ><h5 >{candidate.label}</h5><hr className="d-lg-none" /></Col>
                                        { mentions.map((mention,j) => {
                                            return (j<this.state.nbMentions)?<Col xs={this.state.colSizeMentionXs} md={this.state.colSizeMentionMd} lg={this.state.colSizeMentionLg} key={j} className="text-lg-center"><input type="radio" name={"candidate"+i} id={"candidateMention"+i+"-"+j} /><label
                                                htmlFor={"candidateMention"+i+"-"+j}>
                                                <small className="nowrap d-lg-none ml-2">{mention}</small>
                                            </label></Col>:null
                                        })
                                        }
                                    </Row>
                        })

                    }

                    <Row>
                        <Col className="text-center" ><Button type="button" className="btn btn-dark "><FontAwesomeIcon icon={faCheck} className="mr-2" />Valider</Button></Col>
                    </Row>

                </form>
            </Container>
        )
    }
}
export default Vote;
