import { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CandidatesField from '@components/admin/CandidatesField';
import ParamsField from '@components/admin/ParamsField';
import ConfirmField from '@components/admin/ConfirmField';
import WaitingElection from '@components/WaitingElection';
import PatternedBackground from '@components/PatternedBackground';
import {
  defaultCandidate,
  defaultElection,
  ElectionProvider,
} from '@services/ElectionContext';
import { ProgressSteps, creationSteps } from '@components/CreationSteps';
import Blur from '@components/Blur';
import { GetStaticProps } from 'next';
import { ElectionCreatedPayload, ErrorPayload } from '@services/api';
import { popCopiedElectionParams } from '@services/electionCopy';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['resource'])),
  },
});

const CreateElectionForm = () => {
  /**
   * Manage the steps for creating an election
   */
  const [wait, setWait] = useState(false);
  const [payload, setPayload] = useState<ElectionCreatedPayload | null>(null);
  const [error, setError] = useState<ErrorPayload | null>(null);
  // Pre-fill the form when we land here from the "copy vote parameters"
  // button on a results page. Read once, on mount, then forget: a page
  // refresh should not keep re-injecting the same copied election.
  const [copiedParams] = useState(() => popCopiedElectionParams());

  const handleSubmit = () => {
    if (stepId < creationSteps.length - 1) {
      setStepId((i) => i + 1);
    } else {
      setWait(true);
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
        onSuccess={setPayload}
        onFailure={setError}
      />
    );
  } else {
    throw new Error(`Unknown step ${step}`);
  }

  if (wait) {
    return (
      <>
        {' '}
        <Blur />
        <PatternedBackground>
          <WaitingElection election={payload} error={error} />
        </PatternedBackground>
      </>
    );
  }

  return (
    <ElectionProvider
      initialValue={
        copiedParams
          ? {
              ...defaultElection,
              ...copiedParams,
              // Keep a trailing blank candidate, as the rest of the form
              // expects one to offer an "add candidate" affordance.
              candidates: [...copiedParams.candidates, {...defaultCandidate}],
            }
          : undefined
      }
    >
      <Blur />
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
