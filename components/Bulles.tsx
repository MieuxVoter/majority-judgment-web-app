import React from 'react';
// import Plot from 'react-plotly.js';

function Bulles(props) {

  // récupération des résultats de l'élection et stockage en tableau
  const votesBrut = (Object.values(props))[0];

  // déclaration et initialisation des mentions et couleurs
  const mentionsBrut = ['Passable', 'Assez bien', 'Bien', 'Très bien', 'Excellent'];
  const couleursBrut = ['#BB9C42', '#AABA44', '#DCDF44', '#B3D849', '#61AD45'];

  //----------- Traitement des données -----------//

  // fonction d'inversement des éléments de tableau
  function inverse(obj) {
    var retobj = {};
    for (var key in obj) {
      retobj[obj[key]] = key;
    }
    return retobj;
  }

  // fonction de réduction d'amplitude permettant de conserver une représentation ordinale du nombre de votes sans décalage visuel trop important
  /*
  Pattern de calcul :
  
  Soient Ai, Bi, Ci, Di, Ei les nombres de votes initiaux fournis dans le tableau classé par ordre mélioratif de mention (de Passable à Excellent). Il vient :
  A = 1
  B = <{[1 + (Bi/Ai)] / 40} * A>
  C = <{[1 + (Ci/Bi)] / 40} * B>
  D = <{[1 + (Di/Ci)] / 40} * C>
  E = <{[1 + (Ei/Di)] / 40} * D>
  */
  function redAmpli(tab) {
    var nvTab = [];
    nvTab[0] = 100;

    for (i = 1; i < tab.length; i++) {
      nvTab[i] = ((1 + ((tab[i] / tab[(i - 1)]) / 40)) * nvTab[(i - 1)]);
    }
    return nvTab;
  }


  // déclaration de l'objet votes-mention et votes-couleur
  var votesMentionNonOrdonnes = {};
  var votesCouleurNonOrdonnes = {};

  // initialisation votes-mention ordonnés croissants
  for (var i = 0; i < mentionsBrut.length; i++) {
    votesMentionNonOrdonnes[votesBrut[i]] = mentionsBrut[i];
    votesCouleurNonOrdonnes[votesBrut[i]] = couleursBrut[i];
  }

  // déclaration des mentions-votes par ordre croissant
  var votesMentionOrdonnes = inverse(votesMentionNonOrdonnes);
  var votesCouleurOrdonnes = inverse(votesCouleurNonOrdonnes);

  // vérification du nombre de votes classés par ordre croissant et passés initialement en propriétés au composant
  console.log("Les données transmises au composant concernant le nombre de votes par mention sont : ");
  console.log(votesBrut);

  // vérification des mentions destinées à être associées aux votes et ordonnées initialement par ordre mélioratif
  console.log("Les mentions des votes sont classées initialement par ordre mélioratif de la façon suivante :");
  console.log(mentionsBrut);

  // vérification du nombre de votes classés par ordre croissant
  console.log("Les mentions-votes classées par ordre croissant de votes sont : ");
  console.log(votesMentionOrdonnes);

  // séparation des mentions et des votes
  const mentions = Object.keys(votesMentionOrdonnes);
  const votes = Object.values(votesMentionOrdonnes);
  const couleurs = Object.keys(votesCouleurOrdonnes);

  // vérification des mentions et des votes prêts à être traités pour la représentation graphique
  console.log('La liste des mentions issue du classement par ordre croissant de votes est :');
  console.log(mentions);
  console.log('La liste du nombre de votes correspondant, classée par ordre croissant, est :');
  console.log(votes);

  // déclaration et initialisation des rayons de bulle pour la représentation graphique
  var rayons = [];
  rayons = redAmpli(votes)

  // vérification des rayons
  console.log('La liste des rayons à représenter graphiquement est la suivante :');
  console.log(rayons);

  // déclaration et initialisation des textes des bulles
  const texteBulle1 = (mentions[0] + "<br>" + votes[0] + " votes").toString();
  const texteBulle2 = (mentions[1] + "<br>" + votes[1] + " votes").toString();
  const texteBulle3 = (mentions[2] + "<br>" + votes[2] + " votes").toString();
  const texteBulle4 = (mentions[3] + "<br>" + votes[3] + " votes").toString();
  const texteBulle5 = (mentions[4] + "<br>" + votes[4] + " votes").toString();


  //---------------------------------------------//



  //----------- Affichage des données -----------//
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  })
  return (

    <div>TBD</div>

    // <div>
    // {!loading ? (
    //         <React.Fragment>
    // <Plot
    //   data={[
    //     {
    //       x: [0.7, 0.6, 0.5, 0.6, 0.7],
    //       y: [0.3, 0.4, 0.5, 0.6, 0.5],
    //       hovertemplate:
    //         '<b>%{text}</b>' +
    //         '<extra></extra>',
    //       text: [texteBulle1, texteBulle2, texteBulle3, texteBulle4, texteBulle5],
    //       showlegend: false,
    //       mode: 'markers',
    //       marker: {
    //         color: [couleurs[0], couleurs[1], couleurs[2], couleurs[3], couleurs[4]],
    //         size: rayons
    //       }
    //     }
    //   ]}
    //   layout={{
    //     width: 600,
    //     height: 600,
    //     title: 'Nombre de voix par candidat',
    //     xaxis: {
    //       showgrid: false,
    //       showticklabels: false,
    //       showline: false,
    //       zeroline: false,
    //       range: [0, 1]
    //     },
    //     yaxis: {
    //       showgrid: false,
    //       showticklabels: false,
    //       showline: false,
    //       zeroline: false,
    //       range: [0, 1]
    //     }
    //   }}
    //   config={{
    //     displayModeBar: false // this is the line that hides the bar.
    //   }}
    // />
    //  </React.Fragment>
    // ) : (
    //     <LoadingScreen />
    //   )}
    //     </div> 
  )
}

export default Bulles;
