/* eslint react/prop-types: 0 */
import { useState } from "react";
import { Container, Row, Col, Nav, NavItem } from "reactstrap";
import Link from "next/link";
import Head from "next/head";
import { useTranslation } from 'next-i18next'


export default function HeaderMobileResult() {

    ;
    return (

        <Container className="sectionHeaderResult">

            <Row className="sectionHeaderResultMiddleCol">
                <h3>Quel est le meilleur candidat pour les éléctions présidentielle ?</h3>
            </Row>
            <Row>
                <Col className="sectionHeaderResultSideCol">
                    <img src="/calendar.svg" />
                    <p>Clos il y a 2 jours</p>
                </Col>
                
                <Col className="sectionHeaderResultSideCol">
                    <img src="/avatarBlue.svg" />
                    <p>14 votants</p>
                </Col>
            </Row>





        </Container >
    );
}

