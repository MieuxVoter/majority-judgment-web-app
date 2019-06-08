import React, {Component} from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    } from 'reactstrap';

import logo from '../../logos/logo-color.svg';

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
                    <NavbarBrand href="/">
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
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="/create-ballot/">Démarrer un vote</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}
export default Header;