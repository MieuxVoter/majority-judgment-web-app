import React, {Component} from "react";
import { Container, Row, Col, Input, Label, Card, CardHeader, CardBody, Collapse  } from 'reactstrap';
import {toast, ToastContainer} from 'react-toastify';
import HelpButton from "../form/HelpButton";
import {arrayMove, sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc';
import ButtonWithConfirm from "../form/ButtonWithConfirm";


const DragHandle = sortableHandle(({children}) => <span className="input-group-text indexNumber">{children}</span>);

const SortableCandidate = sortableElement(({candidate, sortIndex, form}) => <li className="sortable">
    <div key={"rowCandidate" + sortIndex}>
        <div className="row">
            <div className="col-12">
                <div className="input-group ">
                    <div className="input-group-prepend">
                        <DragHandle>
                            <span>{sortIndex + 1}</span>
                        </DragHandle>
                    </div>
                    <input type="text" className="form-control" value={candidate.label}
                           onChange={(event) => form.editCandidateLabel(event, sortIndex)}
                           maxLength="250"/>
                    <ButtonWithConfirm className="btn btn-outline-danger input-group-append">
                        <div key="button"><i className="fas fa-trash-alt"/></div>
                        <div key="modal-title">Suppression ?</div>
                        <div key="modal-body">Êtes-vous sûr de vouloir supprimer la
                            proposition <b>"{candidate.label}"</b> ?
                        </div>
                        <div key="modal-confirm" onClick={() => form.removeCandidate(sortIndex)}>Oui</div>
                        <div key="modal-cancel">Non</div>
                    </ButtonWithConfirm>
                </div>
            </div>
        </div>
    </div>
</li>);

const SortableCandidatesContainer = sortableContainer(({items, form}) => {
    return <ul className="sortable">{items.map((candidate, index) => (
        <SortableCandidate key={`item-${index}`} index={index} sortIndex={index} candidate={candidate} form={form}/>
    ))}</ul>;
});

class CreateBallot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            candidates:[]
        };
        this._candidateLabelInput = React.createRef();
        this._addCandidateButton = React.createRef();

        this.focusInput= React.createRef();
    }

    addCandidate = (evt) => {
        if (evt.type === "click" || (evt.type === "keydown" && evt.keyCode === 13)) {
            const candidateFieldLabel = this._candidateLabelInput.current.value;
            let candidates = this.state.candidates;
            if (candidates.length < 100) {
                candidates.push({label: candidateFieldLabel});
                this._candidateLabelInput.current.value = '';
                this.setState({isAddCandidateOpen: false, candidates: candidates});
            }

        }

    };

    removeCandidate = (index) => {
        let candidates = this.state.candidates;
        candidates.splice(index, 1);
        this.setState({candidates: candidates});
    };

    editCandidateLabel = (event, index) => {
        let candidates = this.state.candidates;
        candidates[index].label = event.currentTarget.value;
        this.setState({candidates: candidates});
    };

    toggleAddCandidate = () => {
        if (this.state.candidates.length >= 100) {
            toast.error("Vous ne pouvez plus ajouter de proposition ! (100 max.)", {
                position: toast.POSITION.TOP_CENTER
            });
        } else {
            this._candidateLabelInput.current.value = "";
            this.setState({
                isAddCandidateOpen: !this.state.isAddCandidateOpen
            });
        }


    };

    render(){
        const params = new URLSearchParams(this.props.location.search);


        return(
            <Container>
                <ToastContainer/>
                <form onSubmit={this.handleSubmit} autoComplete="off">
                    <Row>
                        <Col ><h3>Démarrer un vote</h3></Col>
                    </Row>
                    <Row>
                        <hr />
                    </Row>
                    <Row className="mt-4">
                        <Col xs="12" >
                            <Label for="title">Question du vote :</Label>
                        </Col>
                        <Col>
                            <Input placeholder="Saisissez ici la question de votre vote" name="title" id="title" innerRef={this.focusInput} autoFocus defaultValue={params.get("title")?params.get("title"):""} maxlength="250" />
                        </Col>
                        <Col xs="auto" className="align-self-center pl-0">
                            <HelpButton id="helpTitle">
                                Posez ici votre question ou introduisez simplement votre vote (250 caractères max.)
                                <br /><u>Par exemple :</u> <em>Pour être mon représentant, je juge ce candidat ...</em>
                            </HelpButton>
                        </Col>
                    </Row>


                    <div className="row mt-5">
                        <div className="col-12">
                            <b>{this.state.candidates.length}
                                {(this.state.candidates.length < 2) ? <span> Proposition soumise </span> :
                                    <span> Propositions soumises </span>}
                                au vote</b>
                        </div>
                    </div>


                    <div className="row mt-2">
                        <div className="col-12">
                            <SortableCandidatesContainer items={this.state.candidates} onSortEnd={this.onCandidatesSortEnd}
                                                         form={this} useDragHandle/>
                        </div>
                    </div>
                    {(this.state.candidates.length > 2 && this.state.isVisibleTipsDragndropCandidate === true) ?
                        <div className="row alert alert-info">
                            <div className="col pl-0 ">

                                <i className="fas fa-lightbulb mr-2"/><b>Astuce :</b> Vous pouvez changer l'ordre des
                                propositions par glisser-déposer du numéro !
                            </div>
                            <div className="col-auto">
                                <a className="text-info pointer" onClick={this.hideTipsDragndropCandidate}><i
                                    className="fas fa-window-close"/></a>
                            </div>
                        </div> : <div/>}
                    <div className="row mt-2">
                        <div className="col-12">
                            <Collapse isOpen={this.state.isAddCandidateOpen}
                                      onEntered={() => {
                                          this._candidateLabelInput.current.focus()
                                      }}
                                      onExited={() => {
                                          this._addCandidateButton.current.focus()
                                      }}>


                                <Card>
                                    <CardHeader>Ajout d'une proposition
                                        (100 max.) </CardHeader>
                                    <CardBody>
                                        <div className="row">
                                            <div className="col-12">
                                                <label htmlFor="candidate_label"><b>Libellé</b> <span
                                                    className="text-muted">(obligatoire)</span></label>
                                                <input type="text" className="form-control" name="candidate_label"
                                                       id="candidate_label" onKeyDown={evt => this.addCandidate(evt)}
                                                       ref={this._candidateLabelInput}
                                                       placeholder="Nom de la proposition, nom du candidat, etc..."
                                                       maxLength="250"/>
                                            </div>
                                        </div>
                                        <div className="row mt-4">
                                            <div className="col-md-12 text-right">
                                                <button type="button" className="btn btn-secondary mr-2"
                                                        onClick={this.toggleAddCandidate}>
                                                    <i className="fas fa-times mr-2"/>Annuler
                                                </button>
                                                <button type="button" className="btn btn-success "
                                                        onClick={evt => this.addCandidate(evt)}>
                                                    <i className="fas fa-plus mr-2"/>Ajouter
                                                </button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>


                            </Collapse>
                        </div>

                        <div className="col-12">
                            {this.state.isAddCandidateOpen ? null :
                                <button className="btn btn-secondary" tabIndex="3" ref={this._addCandidateButton}
                                        name="collapseAddCandidate"
                                        id="collapseAddCandidate" onClick={this.toggleAddCandidate}>
                                    <i className="fas fa-plus-square mr-2"/>Ajouter une proposition</button>}

                        </div>

                    </div>


                </form>
            </Container>
        )
    }
}
export default CreateBallot;
