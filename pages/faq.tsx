import Link from 'next/link';
import {Container, Row, Col} from 'reactstrap';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {GetStaticProps} from 'next';
import Logo from '@components/Logo';

export const getStaticProps: GetStaticProps = async ({locale}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['resource'])),
  },
});


const FAQ = () => {
  const {t} = useTranslation();
  return (
    <div className="min-vw-100 min-vh-100 bg-secondary py-4">
      <Container className="">
        <Logo />
        <div className="mt-4 text-center">
          <h1>{t('faq.title')}</h1>
        </div>
        <div className="d-flex w-100 justify-content-center">
          <video width="100%" height="250" controls={true}>
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
        {[...Array(19)].map((i) => (<>
          <h4 className="bold mt-5">{t(`faq.sec-${i}-title`)}</h4>
          <p>{t(`faq.sec-${i}-desc`)}</p>
        </>))}

        <h4 className="bold mt-5">
          Y-a t’il une limite de votants appliquée pour les votes sur
          invitation ?
        </h4>
        <p>
          Le nombre maximum de votants pour un vote sur invitation est de 1000
          personnes. Si toutefois votre besoin est supérieur à cette limite,
          nous vous invitons à nous envoyer un email à l’adresse «
          <a href="mailto:contact@mieuxvoter.fr" className="text-light">
            contact@mieuxvoter.fr
          </a>
          ».
        </p>

        <h4 className="bold mt-5">
          Combien de temps le lien vers la page de résultat reste-t-il actif ?
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
          courriel a été ajouté à la création du vote reçoivent une invitation
          et peuvent donc voter. Chacune des invitations dispose d’un lien
          unique auquel est associé un jeton à usage unique. Ce jeton est
          détruit aussitôt que la participation au vote de l’invité est
          enregistrée. Il garantit donc à l’organisateur que chaque
          participant n’a pu voter qu’une seule fois.
        </p>

        <p>
          Dans le cas d’un vote public, toute personne peut participer à
          l’élection s’il dispose du lien de l’élection. Il n’y a dans ce cas
          aucune limite de soumission d’un vote. Une même personne peut donc
          voter plusieurs fois.
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
          Une fois votre vote enregistré, vous ne pouvez plus le modifier. En
          effet, votre vote étant anonymisé, ce qui nous empêche de faire le
          lien entre vous et votre vote.
        </p>

        <h4 className="bold mt-5">
          Comment puis-je récupérer un lien si je l’ai perdu ?
        </h4>
        <p>
          Vous ne pouvez pas récupérer un lien pour voter après qu’il vous
          soit communiquer. Gardez le précieusement. Cependant si vous avez le
          lien pour voter, nous pouvons vous transmettre le lien des
          résultats.
        </p>

        <h4 className="bold mt-5">
          Comment interpréter les résultats d’un vote au jugement majoritaire
          ?
        </h4>
        <p>
          Les candidats ou propositions sont triées de la mention majoritaire
          la plus favorable à la plus défavorable. En cas d’égalité, on
          calcule alors pour chaque candidat à départager: le pourcentage
          d’électeurs attribuant strictement plus que la mention majoritaire
          commune et le pourcentage d’électeurs attribuant strictement moins
          que la mention majoritaire commune. La plus grande des 4 valeurs
          détermine le résultat.
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
          découvrir le vote au jugement majoritaire. Elle n’a pas de but
          politique, ni commercial. Mieux Voter attache la plus grande
          importance au strict respect de la vie privée, et utilise ces
          données uniquement de manière responsable et confidentielle, dans
          une finalité précise.
        </p>

        <h4 className="bold mt-5">Qui est Mieux Voter ?</h4>
        <p>
          « Mieux Voter » est une association loi 1901 qui promeut
          l’utilisation du jugement majoritaire, nouvelle théorie du choix
          social, comme un outil pour améliorer les décisions collectives et
          les exercices de démocratie participative à l’usage de tous.
        </p>

        <h4 className="bold mt-5">
          Comment nous aider à faire connaître le jugement majoritaire ?
        </h4>
        <p>
          Vous avez apprécié votre expérience de vote démocratique au Jugement
          Majoritaire ? <br />
          Nous en sommes ravis ! Vous pouvez nous aider en faisant un don à
          l’association ici :
        </p>
      </Container >
    </div >
  );
};

export default FAQ;
