/* eslint react/prop-types: 0 */
import { useState } from 'react';
import { Container, Row, Col, Nav, NavItem } from 'reactstrap';
import Link from 'next/link';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';

export default function HeaderResultResult() {
  return (
    <Container className="sectionHeaderResult">
      <Row>
        <Col className="col-md-3">
          <Row>
            <Col className="sectionHeaderResultSideCol">
              <img src="/calendar.svg" />
              <p>Clos il y a 2 jours</p>
            </Col>
          </Row>
          <Row>
            <Col className="sectionHeaderResultSideCol">
              <img src="/avatarBlue.svg" />
              <p>14 votants</p>
            </Col>
          </Row>
        </Col>

        <Col className="sectionHeaderResultMiddleCol col-md-6">
          <h3>
            Quel est le meilleur candidat pour les éléctions présidentielle ?
          </h3>
        </Col>

        <Col className="col-md-3">
          <Row>
            <Col className="sectionHeaderResultSideCol">
              <img src="/arrowUpload.svg" />
              <p>Télécharger les résultats</p>
            </Col>
          </Row>
          <Row>
            <Col className="sectionHeaderResultSideCol">
              <img src="/arrowL.svg" />
              <p>Partagez les résultats</p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
