import {useState} from 'react';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import CandidatesField from '@components/admin/CandidatesField';
import ParamsField from '@components/admin/ParamsField';
import ConfirmField from '@components/admin/ConfirmField';
import WaitingBallot from '@components/WaitingBallot';
import PatternedBackground from '@components/PatternedBackground';
import {
  ElectionProvider,
  useElection,
} from '@services/ElectionContext';
import {ProgressSteps, creationSteps} from '@components/CreationSteps';
import {GetStaticProps} from 'next';
import {createElection, ElectionPayload} from '@services/api';
import {getUrlVote, getUrlResult} from '@services/routes';
import {GradeItem, CandidateItem} from '@services/type';
import {sendInviteMails} from '@services/mail';

export const getStaticProps: GetStaticProps = async ({locale}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['resource'])),
  },
});

/**
 * Manage the steps for creating an election
 */
const CreateElectionForm = () => {
  // load the election
  const election = useElection();
  const [wait, setWait] = useState(false);

  const handleSubmit = () => {
    if (stepId < creationSteps.length - 1) {
      setStepId((i) => i + 1);
    } else {
      setWait(true);

      createElection(
        election.name,
        election.candidates.map((c: CandidateItem) => ({name: c.name, description: c.description, image: c.image})),
        election.grades.map((g: GradeItem, i: number) => ({name: g.name, value: i})),
        election.description,
        election.emails.length,
        election.hideResults,
        election.forceClose,
        election.restricted,
        (payload: ElectionPayload) => {
          const id = payload.id;
          const tokens = payload.tokens;
          if (typeof election.emails !== 'undefined' && election.emails.length > 0) {
            if (typeof payload.tokens === 'undefined' || payload.tokens.length === election.emails.length) {
              throw Error('Can not send invite emails');
            }
            const urlVotes = election.tokens.map((token: string) => getUrlVote(id.toString(), token));
            const urlResult = getUrlResult(id.toString());
            sendInviteMails(
              election.emails,
              tokens,
              election.name,
              urlVotes,
              urlResult,
            );
          }
        }

      )
    }
  };

  // at which creation step are we?
  const [stepId, setStepId] = useState(0);
  const step = creationSteps[stepId];

  let Step: JSX.Element;
  if (step == 'candidate') {
    Step = <CandidatesField onSubmit={handleSubmit} />;
  } else if (step == 'params') {
    Step = <ParamsField onSubmit={handleSubmit} />;
  } else if (step == 'confirm') {
    Step = (
      <ConfirmField
        onSubmit={handleSubmit}
        goToCandidates={() => setStepId(0)}
        goToParams={() => setStepId(1)}
      />
    );
  } else if (step == 'waiting') {
    return <PatternedBackground>
      <WaitingBallot />;
    </PatternedBackground>
  } else {
    throw Error(`Unknown step ${step}`);
  }

  return (
    <ElectionProvider>
      <ProgressSteps
        step={step}
        goToCandidates={() => setStepId(0)}
        goToParams={() => setStepId(1)}
      />
      {Step}
    </ElectionProvider>
  );
};

export default CreateElectionForm;
