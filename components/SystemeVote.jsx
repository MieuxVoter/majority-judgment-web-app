import React, {Fragment} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';


const Bulles = dynamic(import('./Bulles'), {
  ssr: false
})

const nbVotesPassables = 15;
const nbVotesAssezBien = 200;
const nbVotesBien = 389;
const nbVotesTresBien = 12;
const nbVotesExcellent = 2;

const resultats = [nbVotesPassables, nbVotesAssezBien, nbVotesBien, nbVotesTresBien, nbVotesExcellent];

var totalVotes = 0;

for(var i = 0; i < resultats.length; i++) {
  totalVotes += resultats[i];
}

function SystemeVote() { 
  

    return (
  <Fragment>
    
    <Bulles donnees={resultats} />
    <p style={{color: '#000000'}}>Le total des votes est de {totalVotes}.</p>
    
  </Fragment>
    );
}

export default SystemeVote;