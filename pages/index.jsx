
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Container, Row, Col, Button, Input } from "reactstrap";
import config from "../next-i18next.config.js";
import Footer from '@components/layouts/Footer';
import VoteBallot from './vote/[pid]/[[...tid]]';
import CandidatesField from '../components/form/CandidatesField';
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [], config)),
  },
});

const Home = () => {
  const [title, setTitle] = useState(null);
  const { t } = useTranslation();
  return (
   
    <Container className="homePage">
      <section>
        <form className="sectionOneHomeForm" autoComplete="off">
          <Row className="sectionOneHomeRowOne">
            <Col className="sectionOneHomeContent">
              <Row>
                <img
                  src="/logos/logo.svg"
                  alt="logo of Mieux Voter"
                  height="128"
                  className="d-block"
                />
              </Row>
              <Row>
                <h4>Simple et gratuit</h4>
              </Row>
              <Row>
                <h2>Organisez un vote avec le Jugement Majoritaire</h2>
              </Row>
              <Row>
                <Input
                  placeholder={t("resource.writeQuestion")}
                  autoFocus
                  required
                  className="mt-2 sectionOneHomeInput"
                  name="title"
                  value={title ? title : ""}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength="250"
                />
              </Row>
              <Row>
              <Link href={{ pathname: "/new/", query: { title: title } }}>
                <Button
                  type="submit"
                  className="btn btn-block btn-secondary mt-2"
                >
                  {t("resource.start")}
                  <img src="/arrow-white.svg" className="mr-2" />
                </Button>
                </Link>
              </Row>
              <Row className="noAds">
                <p>{t("resource.noAds")}</p>
              </Row>
            </Col>
            <Col></Col>
          </Row>
          <Row>

          </Row>
        </form>
      </section> 
      <section className="sectionTwoHome">
        <Row className="sectionTwoRowOne">
          <Col className="sectionTwoRowOneCol">
            <img
              src="/urne.svg"
              alt="icone d'urne"
              height="128"
              className="d-block mx-auto"
            />
            <h4>Simple</h4>
            <p>Créez un vote en moins d’une minute</p>
          </Col>
          <Col className="sectionTwoRowOneCol">
            <img
              src="/email.svg"
              alt="icone d'enveloppe"
              height="128"
              className="d-block mx-auto"
            />
            <h4>Gratuit</h4>
            <p>Envoyez des invitations par courriel sans limite d'envoi</p>
          </Col>
          <Col className="sectionTwoRowOneCol">
            <img
              src="/respect.svg"
              alt="icone de mains qui se serrent"
              height="128"
              className="d-block mx-auto"
            />
            <h4>Respect de votre vie privée</h4>
            <p>Aucune donnée personnelle n'est enregistrée</p>
          </Col>
        </Row>
        <Row className="sectionTwoRowTwo">
        <Row className="sectionTwoHomeImage">
            <img src="/vote.svg" />
        </Row>
          <Row className="sectionTwoRowTwoCol">
            <h3 className="col-md-7">Une expérience de vote démocratique et intuitive</h3>
          </Row>
          <Row className="sectionTwoRowTwoCol">
            <Col className="sectionTwoRowTwoColText col-md-4">
              <h5 className="">Exprimez toute votre opinion</h5>
              <p>Au jugement majoritaire, chaque candidat est évalué sur une grille de mention. Vous n’aurez plus besoin de faire un vote stratégique.</p>
            </Col>
            <Col className="sectionTwoRowTwoColText col-md-4 offset-md-1">
              <h5 className="">Obtenez le meilleur consensus</h5>
              <p>Le profil des mérites dresse un panorama précis de l’opinion des électeurs. Le gagnant du vote est celui qui est la meilleure mention majoritaire.</p>
            </Col>
          </Row>
          <Row className="sectionTwoRowThreeCol">
            <Button
              className="btn btn-block btn-secondary btn-sectionTwoHome"
            >
              Découvrez le jugement majoritaire
                  <img src="/arrow-white.svg" className="mr-2" />
            </Button>
          </Row>
        </Row>
        <Row className="sharing">
          <p>Partagez l’application Mieux voter</p>
          <Link href="https://www.facebook.com/mieuxvoter.fr/"><img src="/facebook.svg" className="mr-2" /></Link>
          <Link href="https://twitter.com/mieux_voter"><img src="/twitter.svg" className="mr-2" /></Link>
        </Row> 
      </section>
      <Footer />
    </Container>

  );
};

export default Home;
