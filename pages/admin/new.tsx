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
import {ElectionPayload} from '@services/api';
import {getUrlConfirm} from '@services/utils';
import {useRouter} from 'next/router';

export const getStaticProps: GetStaticProps = async ({locale}) => ({
  props: {
    ...(await serverSideTranslations(locale, ['resource'])),
  },
});

const CreateElectionForm = () => {
  /**
   * Manage the steps for creating an election
   */
  const [wait, setWait] = useState(true);

  const router = useRouter();

  const handleSubmit = () => {
    if (stepId < creationSteps.length - 1) {
      setStepId((i) => i + 1);
    } else {
      setWait(true);
    }
  };

  const onCreatedElection = (election: ElectionPayload) => {
    console.log("ready");
    // router.push(getUrlConfirm(election.id.toString()))
  }

  if (wait) {
    return <PatternedBackground>
      <WaitingBallot />;
    </PatternedBackground>
  }

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
        onCreatedElection={onCreatedElection}
        goToCandidates={() => setStepId(0)}
        goToParams={() => setStepId(1)}
      />
    );
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
