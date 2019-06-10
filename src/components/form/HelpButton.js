import React, {Component} from "react";
import {Tooltip} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';


class HelpButton extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            tooltipOpen: false
        };
    }

    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }


    render(){
        return (<div>
            <FontAwesomeIcon icon={faQuestionCircle} id={this.props.id+"_"} />
        </div>);
    }

    badrender() {
        return (
            <div >
                <Tooltip placement="right" isOpen={this.state.tooltipOpen} target={this.props.id+"_"} toggle={this.toggle}>
                    {this.props.children}
                </Tooltip>
                <FontAwesomeIcon icon={faQuestionCircle} id={this.props.id+"_"} />
            </div>
        );
    }
}
export default HelpButton;