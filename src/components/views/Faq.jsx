/* eslint react/prop-types: 0 */
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import logoLine from "../../logos/logo-line-white.svg";
import { Link } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { withTranslation } from "react-i18next";
import Paypal from "../banner/Paypal";

class Faq extends Component {
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
            <h1>{t("FAQ")}</h1>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <h4 className="bold mt-5">
              Qu’est-ce que le Jugement Majoritaire ?
            </h4>
            <p>
              Un principe simple et intuitif, qui change tout : l’électeur vote
              en donnant son avis sur toutes les candidatures présentées, leur
              attribuant la mention de son choix (par exemple. Très bien, Bien,
              Assez bien, Passable, Insuffisant, À Rejeter). La candidature
              retenue est celle jugée la plus méritante par la majorité de
              l’électorat (celui qui obtient la meilleure mention « majoritaire
              »).
            </p>
            <div style={{ maxWidth: "445px" }}>
              <video width="100%" height="250" controls="controls">
                <source
                  src="/video/Le_Jugement_Majoritaire_en_1_minute.mp4"
                  type="video/mp4"
                />
                <source
                  src="/video/Le_Jugement_Majoritaire_en_1_minute.webm"
                  type="video/webm"
                />
                <source
                  src="/video/Le_Jugement_Majoritaire_en_1_minute.3gpp"
                  type="video/3gpp"
                />
              </video>
            </div>

            <h4 className="bold mt-5">D’où vient le Jugement Majoritaire ?</h4>
            <p>
              Le jugement majoritaire est un mode de scrutin inventé par deux
              chercheurs Français du Centre National de la Recherche
              Scientifique (CNRS) en 2011, <u>Michel Balinski</u> et{" "}
              <u>Rida Laraki</u>.
            </p>

            <h4 className="bold mt-5">
              Quels sont les avantages du Jugement Majoritaire ?
            </h4>
            <p>
              Une mesure précise de l’opinion des participants au vote, à même
              d’éclairer la décision collective. En demandant aux électeurs leur
              opinion sur chaque option soumise au vote, on bénéficie de
              beaucoup plus d’informations que dans le cadre du scrutin
              uninominal qui, résumant l’opinion des électeurs à un choix,
              ignore l’essentiel de l’information quant à ce qu’ils pensent. En
              agrégeant un grand nombre d’informations, le Jugement Majoritaire
              ne produit pas « juste » un gagnant qui obtiendrait la majorité
              des voix. Il mesure précisément le crédit porté à chacune des
              options et permet d’affiner autant que de pacifier la prise de
              décision.
            </p>

            <h4 className="bold mt-5">
              Quand et comment utiliser le Jugement Majoritaire ?
            </h4>
            <p>
              Le Jugement majoritaire s’applique à tout type de votation
              collective, qu’il s’agisse d’élire un candidat, de retenir une ou
              plusieurs idées lors d’un atelier collaboratif, de choisir entre
              plusieurs projets, de classer les vins, etc. Il peut être utilisé
              à toutes les échelles (locale, nationale, internationale) et dans
              tous les milieux (écoles, entreprises, associations, coopératives,
              collectivités publiques…).
            </p>

            <h4 className="bold mt-5">Qui peut utiliser cette application ?</h4>
            <p>
              Cette application de Jugement Majoritaire est ouverte à toute
              personne désireuse de prendre une décision collective, entre amis,
              entre collègues, entre membres d’un groupe. Elle est libre d’accès
              et gratuite. Notre ambition est de vous proposer la meilleure
              expérience de prise de décision collective et démocratique.
            </p>

            <h4 className="bold mt-5">
              Comment organiser une élection avec plusieurs milliers de votants
              ?
            </h4>
            <p>
              Cette application ne convient pas pour les votes à plus de 1000
              votants. Si c’est votre cas, nous vous invitons à nous contacter
              par email à l’adresse{" "}
              <a href="mailto:contact@mieuxvoter.fr" className="text-light">
                contact@mieuxvoter.fr
              </a>
              . Dans le cas d’un vote sur invitation nous vous suggérons de ne
              pas dépasser 200 participants (le temps de création du vote peut
              prendre quelques minutes).
            </p>

            <h4 className="bold mt-5">
              Je rencontre un problème, comment obtenir de l’aide ?
            </h4>
            <p>
              Si vous rencontrez un problème en utilisant notre application,
              prenez contact avec nous par email à l’adresse «
              <a
                href="mailto:app@mieuxvoter.fr?subject=[HELP]"
                className="text-light"
              >
                app@mieuxvoter.fr
              </a>
              », et prenez soin de bien décrire le problème rencontré dans votre
              message. Ajoutez éventuellement dans votre description le lien de
              votre vote.
            </p>

            <h4 className="bold mt-5">
              Y-a t’il une limite de votants appliquée pour les votes sur
              invitation ?
            </h4>
            <p>
              Le nombre maximum de votants pour un vote sur invitation est de
              1000 personnes. Si toutefois votre besoin est supérieur à cette
              limite, nous vous invitons à nous envoyer un email à l’adresse «
              <a href="mailto:contact@mieuxvoter.fr" className="text-light">
                contact@mieuxvoter.fr
              </a>
              ».
            </p>

            <h4 className="bold mt-5">
              Combien de temps le lien vers la page de résultat reste-t-il actif
              ?
            </h4>
            <p>
              Les liens fournis lors de la création de votre vote n’ont pas de
              date d’expiration. Conservez-les précieusement afin de pouvoir
              consulter les résultat dans le futur.
            </p>

            <h4 className="bold mt-5">
              Comment puis-je m’assurer qu’une même personne ne vote pas deux
              fois?
            </h4>
            <p>
              Dans le cas d’un vote sur invitation, seules les personnes dont le
              courriel a été ajouté à la création du vote reçoivent une
              invitation et peuvent donc voter. Chacune des invitations dispose
              d’un lien unique auquel est associé un jeton à usage unique. Ce
              jeton est détruit aussitôt que la participation au vote de
              l’invité est enregistrée. Il garantit donc à l’organisateur que
              chaque participant n’a pu voter qu’une seule fois.
            </p>

            <p>
              Dans le cas d’un vote public, toute personne peut participer à
              l’élection s’il dispose du lien de l’élection. Il n’y a dans ce
              cas aucune limite de soumission d’un vote. Une même personne peut
              donc voter plusieurs fois.
            </p>

            <h4 className="bold mt-5">
              Lorsque j’organise une élection, puis-je connaître le nombre et
              l’identité des votants?
            </h4>
            <p>
              Le nombre de votants est indiqué sur la page de résultats de votre
              élection. L’identité des votants est quant à elle effacée, afin de
              respecter les conditions d’un vote démocratique où l’anonymat
              garantit la sincérité des électeurs.
            </p>

            <h4 className="bold mt-5">Puis-je modifier mon vote ?</h4>
            <p>
              Une fois votre vote enregistré, vous ne pouvez plus le modifier.
              En effet, votre vote étant anonymisé, ce qui nous empêche de faire
              le lien entre vous et votre vote.
            </p>

            <h4 className="bold mt-5">
              Comment puis-je récupérer un lien si je l’ai perdu ?
            </h4>
            <p>
              Vous ne pouvez pas récupérer un lien pour voter après qu’il vous
              soit communiquer. Gardez le précieusement. Cependant si vous avez
              le lien pour voter, nous pouvons vous transmettre le lien des
              résultats.
            </p>

            <h4 className="bold mt-5">
              Comment interpréter les résultats d’un vote au Jugement
              Majoritaire ?
            </h4>
            <p>
              Les candidats ou propositions sont triées de la mention
              majoritaire la plus favorable à la plus défavorable. En cas
              d’égalité, on calcule alors pour chaque candidat à départager: le
              pourcentage d’électeurs attribuant strictement plus que la mention
              majoritaire commune et le pourcentage d’électeurs attribuant
              strictement moins que la mention majoritaire commune. La plus
              grande des 4 valeurs détermine le résultat.
            </p>

            <h4 className="bold mt-5">Quelle sécurité pour mes données ?</h4>
            <p>
              Afin de garantir la sécurité de vos données, leur transmission est
              chiffrée et vos votes sont anonymisés.
            </p>

            <h4 className="bold mt-5">
              Que faites-vous des données collectées ?
            </h4>
            <p>
              L’application app.mieuxvoter.fr a pour seul et unique but de faire
              découvrir le vote au Jugement Majoritaire. Elle n’a pas de but
              politique, ni commercial. Mieux Voter attache la plus grande
              importance au strict respect de la vie privée, et utilise ces
              données uniquement de manière responsable et confidentielle, dans
              une finalité précise.
            </p>

            <h4 className="bold mt-5">Qui est Mieux Voter ?</h4>
            <p>
              « Mieux Voter » est une association loi 1901 qui promeut
              l’utilisation du Jugement Majoritaire, nouvelle théorie du choix
              social, comme un outil pour améliorer les décisions collectives et
              les exercices de démocratie participative à l’usage de tous.
            </p>

            <h4 className="bold mt-5">
              Comment nous aider à faire connaître le Jugement Majoritaire ?
            </h4>
            <p>
              Vous avez apprécié votre expérience de vote démocratique au
              Jugement Majoritaire ? <br />
              Nous en sommes ravis ! Vous pouvez nous aider en faisant un don à
              l’association ici :
            </p>
            <Paypal btnColor="btn-success" className="mt-1" />
          </Col>
        </Row>
        {/* <Row className="mt-4">
          <Col className="text-center">
            <Link to="/" className="btn btn-secondary">
              {t("Go back to homepage")}
            </Link>
          </Col>
        </Row> */}
      </Container>
    );
  }
}

export default withTranslation()(Faq);
