import React, {Component} from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ModalConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    getComponent= (key) => {
        return this.props.children.filter( (comp) => {
            return comp.key === key;
        });
    };

    render() {
        return (
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className+" modal-dialog-centered"} >
                    <ModalHeader toggle={this.toggle}>{this.getComponent("title")}</ModalHeader>
                    <ModalBody>
                        {this.getComponent("body")}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle}>{this.getComponent("confirm")}</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>{this.getComponent("cancel")}</Button>
                    </ModalFooter>
                </Modal>
        );
    }
}

export default ModalConfirm;