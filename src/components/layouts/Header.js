import React, {Component} from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem
} from 'reactstrap'
import {Link} from "react-router-dom";

import logo from '../../logos/logo-color.svg';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRocket} from "@fortawesome/free-solid-svg-icons";

class Header extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render(){
        return (
            <header>
                <Navbar color="light" light expand="md">
                    <Link to="/" className="navbar-brand">
                    <div className="d-flex flex-row">
                        <div className="align-self-center">
                            <img src={logo} alt="logo" height="32"/>
                        </div>
                        <div className="align-self-center ml-2">
                            <div className="logo-text">
                                <h1>Plateforme de vote
                                    <small>Jugement Majoritaire</small>
                                </h1>

                            </div>
                        </div>
                    </div>
                    </Link>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <Link className="text-primary nav-link" to="/create-ballot/"><FontAwesomeIcon icon={faRocket} className="mr-2"/> Démarrer un vote</Link>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}
export default Header;