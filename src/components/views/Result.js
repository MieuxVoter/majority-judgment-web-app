import React, {Component} from "react";
import {Container,Row,Col,Collapse,  Card, CardHeader, CardBody, Table} from "reactstrap";

//TODO : variable de config dans un fichier à part (avec les mentions, le min/max de mentions, le nombre max de candidats, les maxlength,l'url api, etc ...)
const mentions = [
    {label:"Excellent", color:"#015411"},
    {label:"Trés Bien", color:"#019812"},
    {label:"Bien", color:"#6bca24"},
    {label:"Assez Bien", color:"#ffb200"},
    {label:"Passable", color:"#ff5d00"},
    {label:"Insuffisant", color:"#b20616"},
    {label:"A Rejeter", color:"#6f0214"},
];


class Result extends Component {

    constructor(props) {
        super(props);
        this.state = {
            candidates:[],
            title:null,
            nbMentions:0,
            colSizeCandidateLg:4,
            colSizeCandidateMd:6,
            colSizeCandidateXs:12,
            colSizeMentionLg:1,
            colSizeMentionMd:1,
            colSizeMentionXs:1,
            collapseGraphics:false,
            collapseProfiles:false

        };

    }

    componentDidMount() {
        //todo fetch data from API
        let fetchedData={
            title:"Merci d'évaluer les candidats suivants",
            candidates:[
                {id:0, label:"Mme ABCD", mention: 2, profile: [20,20,20,10,10,20,0], score: "55.28"},
                {id:2, label:"M. EFGH",  mention: 3, profile: [0,20,20,10,10,30,10], score: "43.10"},
                {id:3, label:"M. IJKL",  mention: 4, profile: [0,0,20,25,15,20,20], score: "22.82"},
                {id:4, label:"M. MNOP",  mention: 4, profile: [0,0,15,15,30,10,30], score: "12.72"}
                ],//ordered by result
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
        this.setState(data);
    }


   toggleGraphics = () => {
        this.setState(state => ({ collapseGraphics: !state.collapseGraphics }));
    };

   toggleProfiles = () => {
        this.setState(state => ({ collapseProfiles: !state.collapseProfiles }));
    };

    render(){
        return(
            <Container>
                <Row>
                    <Col xs="12"><h1>{this.state.title}</h1></Col>
                </Row>

                <Row className="mt-5">
                    <Col><h1>Résultat du vote :</h1>
                    <ol>
                        { this.state.candidates.map((candidate,i) => {
                            return (<li key={i} className="mt-2">{candidate.label} <span className="badge badge-dark mr-2 mt-2">{candidate.score}%</span><span  className="badge badge-light mr-2 mt-2" style={{backgroundColor:mentions[candidate.mention].color,color:"#fff"}}>{mentions[candidate.mention].label} </span></li>);
                        })}
                    </ol>
                    </Col>
                </Row>

                <Row className="mt-5">
                    <Col>
                        <Card className="bg-light text-primary">
                            <CardHeader className="pointer" onClick={this.toggleGraphics}>
                                <h4 className={"m-0 panel-title "+(this.state.collapseGraphics?"collapsed":"")}>Graphique</h4>
                            </CardHeader>
                            <Collapse isOpen={this.state.collapseGraphics}>
                                <CardBody className="pt-5">
                                    <div >
                                        <div className="median" style={{height:(this.state.candidates.length*28)+30}} />
                                    <table style={{width:"100%"}}>
                                    { this.state.candidates.map((candidate,i) => {
                                        return ( <tr key={i}><td style={{width:"30px"}}>{i+1}</td> {/*candidate.label*/}
                                           <td> <table style={{width:"100%"}}><tr>
                                            { candidate.profile.map((value,i) => {
                                                if(value>0){
                                                    let percent=value+"%";
                                                    if(i===0){
                                                        percent="auto";
                                                    }
                                                    return (<td key={i} style={{width:percent,backgroundColor:mentions[i].color}} >&nbsp;</td>);
                                                }

                                            })}</tr></table>
                                           </td>
                                        </tr>)
                                    })}</table>

                                    </div>
                                    <div className="mt-4">
                                        <small >
                                            { this.state.candidates.map((candidate,i) => {
                                                return (<span key={i}>{(i>0)?", ":""}<b>{i+1}</b>: {candidate.label}</span>);
                                            })}
                                        </small>
                                    </div>
                                    <div className="mt-2">
                                        <small >
                                            { mentions.map((mention,i) => {
                                                return (i<this.state.nbMentions)?<span key={i} className="badge badge-light mr-2 mt-2" style={{backgroundColor:mention.color,color:"#fff"}}>{mention.label}</span>:<span key={i}/>
                                            })
                                            }
                                        </small>
                                    </div>
                                </CardBody>
                            </Collapse>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Card className="bg-light text-primary">
                            <CardHeader className="pointer" onClick={this.toggleProfiles}>
                                <h4 className={"m-0 panel-title "+(this.state.collapseProfiles?"collapsed":"")}>Profils de mérites</h4>
                            </CardHeader>
                            <Collapse isOpen={this.state.collapseProfiles}>

                                <CardBody >
                                    <div className="table-responsive">
                                    <Table className="profiles">
                                        <thead >
                                        <tr>
                                            <th>#</th>
                                            { mentions.map((mention,i) => {
                                                return (<th key={i} ><span  className="badge badge-light" style={{backgroundColor:mention.color,color:"#fff"}}>{mention.label} </span></th>);
                                            })}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        { this.state.candidates.map((candidate,i) => {
                                            return ( <tr key={i}>
                                                    <td>{i+1}</td> {/*candidate.label*/}
                                                    { candidate.profile.map((value,i) => {
                                                        return (<td key={i} >{value}%</td>);
                                                    })}
                                                </tr>)
                                        })}

                                        </tbody>
                                    </Table>
                                    </div>
                                    <small>
                                        { this.state.candidates.map((candidate,i) => {
                                            return (<span key={i}>{(i>0)?", ":""}<b>{i+1}</b>: {candidate.label}</span>);
                                        })}
                                    </small>
                                </CardBody>
                            </Collapse>
                        </Card>
                    </Col>
                </Row>


            </Container>
        )
    }
}
export default Result;
