/* eslint react/prop-types: 0 */
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import logoLine from "../../logos/logo-line-white.svg";
import { Link } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { withTranslation } from "react-i18next";

class PrivacyPolicy extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { t } = this.props;
    return (
      <Container>
        <Row>
          <Link to="/" className="d-block ml-auto mr-auto mb-4">
            <img src={logoLine} alt="logo" height="128" />
          </Link>
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <h1>{t("Privacy policy")}</h1>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <p className="text-center">
              Dernière mise à jour de notre politique de confidentialité
              effectuée le 27 avril 2020.
            </p>
            <h4 className="bold mt-5">Introduction</h4>
            <p>
              Dans le cadre de la mise à disposition de son application web de
              vote au jugement majoritaire, accessible sur Internet à l’adresse
              app.mieuxvoter.fr, ci-après l’Application, l’association loi 1901
              « Mieux Voter » , dont le siège social est situé au 59 rue saint
              andré des arts, à Paris (75006), ci-après l’Association, est
              amenée à collecter et à traiter des informations dont certaines
              sont qualifiées de « Données personnelles » . Mieux Voter attache
              la plus grande importance au respect de la vie privée, et utilise
              ces données uniquement de manière responsable et confidentielle et
              dans une finalité précise.
            </p>
            <h4 className="bold mt-5">Notre politique de confidentialité</h4>
            <p>
              La présente politique de confidentialité détaille les conditions
              d’utilisation et de traitement par l’Association des Données
              personnelles (ci-après définies) collectées via l’Application.
              L’Association s’engage à respecter les dispositions de la loi
              n°78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers
              et aux libertés modifiée et au Règlement (UE) 2016/679 du
              Parlement européen et du Conseil du 27 avril 2016 dit « RGPD » et
              prendre toute précaution nécessaire pour préserver la sécurité des
              Données personnelles confiées.
            </p>
            <h4 className="bold mt-5">Responsable de traitement</h4>
            <p>
              En qualité de responsable de traitement, l’Association peut
              traiter les Données personnelles.
            </p>
            <h4 className="bold mt-5">
              Données personnelles traitées et finalités de traitement
            </h4>
            <p>
              L’Association recueille sur l’Application les Données personnelles
              dans une finalité précise. Ces données sont nécessaires à la
              fourniture de notre service. Dans le cadre de la fourniture de ce
              service, l’Association traite uniquement les données personnelles
              suivantes (définies comme les « Données personnelles »)
              strictement nécessaires à la fourniture du service :
            </p>
            <ul>
              <li> Les emails des personnes invitées à un vote</li>
            </ul>

            <p>
              {" "}
              La finalité de traitement de ces données personnelles est de
              permettre à l’Association de fournir le service. Ces données sont
              traitées au moment de la création du vote pour envoyer les
              invitations et détruites aussitôt les invitations envoyées. Elles
              ne sont jamais stockées sur nos serveurs.
            </p>
            <h4 className="bold mt-5">Sécurité des Données personnelles</h4>
            <p>
              L’Association s’engage, au titre de son obligation de moyens, à
              prendre toutes les précautions utiles et met en œuvre des mesures
              techniques et organisationnelles appropriées en la matière pour
              garantir un niveau de sécurité adapté et pour protéger les Données
              personnelles contre les altérations, destructions et accès non
              autorisés.
            </p>
          </Col>
        </Row>
        {/*<Row className="mt-4">
                    <Col className="text-center">
                        <Link to="/" className="btn btn-secondary">
                            {t("Go back to homepage")}
                        </Link>
                    </Col>
                </Row>*/}
      </Container>
    );
  }
}

export default withTranslation()(PrivacyPolicy);
