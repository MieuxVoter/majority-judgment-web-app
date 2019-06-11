import React, {Component} from "react";

import {
    Container,
    Row,
    Col,
    Input,
    Label,
    InputGroup,
    InputGroupAddon,
    Button
} from 'reactstrap';

import {ToastContainer} from 'react-toastify';
import HelpButton from "../form/HelpButton";
import {arrayMove, sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc';
import ButtonWithConfirm from "../form/ButtonWithConfirm";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus, faTrashAlt, faCheck } from '@fortawesome/free-solid-svg-icons';



const DragHandle = sortableHandle(({children}) => <span className="input-group-text indexNumber">{children}</span>);

const SortableCandidate = sortableElement(({candidate, sortIndex, form}) => <li className="sortable">

        <Row key={"rowCandidate" + sortIndex}>
            <Col>
                <InputGroup >
                    <InputGroupAddon addonType="prepend"  >
                        <DragHandle  >
                            <span >{sortIndex + 1}</span>
                        </DragHandle>
                    </InputGroupAddon>
                    <Input type="text" value={candidate.label}
                           onChange={(event) => form.editCandidateLabel(event, sortIndex)}
                           onKeyPress={(event) => form.handleKeypressOnCandidateLabel(event, sortIndex)}
                           placeholder="Nom du candidat ou de la proposition ..."
                           tabIndex={ sortIndex + 1}
                           innerRef={(ref) => form.candidateInputs[sortIndex] = ref}
                           maxLength="250"/>
                    <ButtonWithConfirm className="btn btn-primary input-group-append border-light">
                        <div key="button"><FontAwesomeIcon icon={faTrashAlt} /></div>
                        <div key="modal-title">Suppression ?</div>
                        <div key="modal-body">Êtes-vous sûr de vouloir supprimer {(candidate.label!=="")?<b>"{candidate.label}"</b>:<span>la ligne {sortIndex+1}</span>} ?
                        </div>
                        <div key="modal-confirm" onClick={() => form.removeCandidate(sortIndex)}>Oui</div>
                        <div key="modal-cancel">Non</div>
                    </ButtonWithConfirm>
                </InputGroup>
            </Col>
            <Col xs="auto" className="align-self-center pl-0">
                <HelpButton>
                    Saisissez ici le nom de votre candidat ou de votre proposition (250 caractères max.)
                </HelpButton>
            </Col>
        </Row>

</li>);

const SortableCandidatesContainer = sortableContainer(({items, form}) => {
    return <ul className="sortable">{items.map((candidate, index) => (
        <SortableCandidate key={`item-${index}`} index={index} sortIndex={index} candidate={candidate} form={form}/>
    ))}</ul>;
});

class CreateElection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            candidates:[{label:""},{label:""}],
            title:null,
            isVisibleTipsDragAndDropCandidate:true

        };
        this.candidateInputs = [];
        this.focusInput= React.createRef();
    }


    handleChangeTitle= (event) => {
        this.setState({title: event.target.value});
    };

    addCandidate = (event) => {

        let candidates = this.state.candidates;
        if (candidates.length < 100) {
            candidates.push({label:""});
            this.setState({ candidates: candidates});
        }
        if(event.type === 'keypress'){
            setTimeout(()=>{ this.candidateInputs[this.state.candidates.length-1].focus()},250);
        }

    };

    removeCandidate = (index) => {
        let candidates = this.state.candidates;
        candidates.splice(index, 1);
        console.log(candidates.length);
        if(candidates.length===0){
            candidates=[{label:""}];
        }
        this.setState({candidates: candidates});
    };

    editCandidateLabel = (event, index) => {
        let candidates = this.state.candidates;
        candidates[index].label = event.currentTarget.value;
        this.setState({candidates: candidates});

    };

    handleKeypressOnCandidateLabel = (event, index) => {
        if(event.key === 'Enter'){
            event.preventDefault();
            if(index+1===this.state.candidates.length){
                this.addCandidate(event);
            }else{
               this.candidateInputs[index+1].focus();
            }

        }

    };

    onCandidatesSortEnd = ({oldIndex, newIndex}) => {
        let candidates = this.state.candidates;
        candidates = arrayMove(candidates, oldIndex, newIndex);
        this.setState({candidates: candidates});
    };

    handleSubmit= (event) => {
        event.preventDefault();
    };

    componentWillMount() {
        const params = new URLSearchParams(this.props.location.search);
        this.setState({title:params.get("title")?params.get("title"):""});

    }

    render(){

        const params = new URLSearchParams(this.props.location.search);
        return(
            <Container>
                <ToastContainer/>
                <form onSubmit={this.handleSubmit} autoComplete="off" >
                    <Row>
                        <Col ><h3>Démarrer un vote</h3></Col>
                    </Row>
                    <hr />
                    <Row className="mt-4">
                        <Col xs="12" >
                            <Label for="title">Question du vote :</Label>
                        </Col>
                        <Col>
                            <Input placeholder="Saisissez ici la question de votre vote" tabIndex="1" name="title" id="title" innerRef={this.focusInput} autoFocus  defaultValue={params.get("title")?params.get("title"):""} onChange={this.handleChangeTitle} maxLength="250" />
                        </Col>
                        <Col xs="auto" className="align-self-center pl-0">
                            <HelpButton>
                                Posez ici votre question ou introduisez simplement votre vote (250 caractères max.)
                                <br /><u>Par exemple :</u> <em>Pour être mon représentant, je juge ce candidat ...</em>
                            </HelpButton>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col xs="12" >
                            <Label for="title">Candidats / Propositions :</Label>
                        </Col>
                        <Col xs="12" >
                            <SortableCandidatesContainer items={this.state.candidates} onSortEnd={this.onCandidatesSortEnd}
                                                         form={this} useDragHandle/>
                        </Col>
                    </Row>
                    <Row className="mb-4" >
                        <Col className="text-right" >
                        <Button className="btn-secondary"
                                tabIndex={this.state.candidates.length+2}
                                type="button"
                                onClick={(event)=>this.addCandidate(event)}>
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />Ajouter une proposition</Button>
                        </Col>
                        <Col xs="auto" />
                    </Row>
                    <hr />
                    <Row className="mt-4 justify-content-md-center">
                        <Col xs="12"  md="3"   >
                            <ButtonWithConfirm className="btn btn-success float-right btn-block ">
                                <div key="button"><FontAwesomeIcon icon={faCheck} className="mr-2" />Valider</div>
                                <div key="modal-title">Confirmation</div>
                                <div key="modal-body">
                                    <div>Voici votre vote :</div>
                                    <div className="border border-primary p-2 mt-4 mb-4">
                                        <h4 className="m-0">{this.state.title}</h4>
                                        <ul className="m-0">
                                            {

                                                this.state.candidates.map((candidate,i) => {
                                                    if(candidate.label!==""){
                                                       return <li key={i}>{candidate.label}</li>
                                                    }else{
                                                        return <li key={i} className="d-none" />
                                                    }

                                                })
                                            }
                                        </ul>
                                    </div>
                                    <p>Une fois validé, vous ne pourrez plus le modifier, souhaitez-vous continuer ?</p>
                                </div>
                                <div key="modal-confirm" onClick={() => {}}>Oui</div>
                                <div key="modal-cancel">Non</div>
                            </ButtonWithConfirm>
                        </Col>
                    </Row>
                </form>
            </Container>
        )
    }
}
export default CreateElection;
