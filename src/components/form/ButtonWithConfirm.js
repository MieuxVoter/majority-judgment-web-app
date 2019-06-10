import React, {Component} from "react";
import ModalConfirm from "./ModalConfirm";


class ButtonWithConfirm extends Component {
    constructor(props) {
        super(props);
        this._modalConfirm=React.createRef();
        this.state={
            focused:false
        }
    }

    getComponent= (key) => {
        return this.props.children.filter( (comp) => {
            return comp.key === key;
        });
    };

    render() {
        const classNames=this.props.className.split(" ");

        let classNameForDiv="";
        let classNameForButton="";
        classNames.forEach(function(className){
                if(className==="input-group-prepend" || className==="input-group-append" ){
                    classNameForDiv+=" "+className;
                }else{
                    classNameForButton+=" "+className;
                }
            });



        return (
            <div className={classNameForDiv}>
                <button
                    className={classNameForButton}
                    onClick={() => { this._modalConfirm.current.toggle() }}
                    >{this.getComponent("button")}
                </button>
                 <ModalConfirm className={this.props.modalClassName}  ref={this._modalConfirm}>
                    <div key="title">{this.getComponent("modal-title")}</div>
                    <div key="body">{this.getComponent("modal-body")}</div>
                    <div key="confirm">{this.getComponent("modal-confirm")}</div>
                    <div key="cancel">{this.getComponent("modal-cancel")}</div>
                </ModalConfirm>
            </div>
        );
    }
}

export default ButtonWithConfirm;