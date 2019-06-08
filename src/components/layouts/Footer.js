import React, {Component} from "react";

class Footer extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render(){
        return(
            <footer className="text-center">
                <a href="https://github.com/MieuxVoter">Code source</a>
                <span className="m-2">-</span>
                <a href="https://mieuxvoter.fr/">Qui sommes nous ?</a>
                <div className="mt-2">
                    MieuxVoter &copy;
                </div>
            </footer>
        )
    }
}
export default Footer;