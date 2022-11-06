import { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CandidatesField from '@components/admin/CandidatesField';
import ParamsField from '@components/admin/ParamsField';
import ConfirmField from '@components/admin/ConfirmField';
import {
  ElectionProvider,
  useElection,
} from '@components/admin/ElectionContext';
import { ProgressSteps, creationSteps } from '@components/CreationSteps';
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
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

  const handleSubmit = () => {
    if (stepId < creationSteps.length - 1) {
      setStepId((i) => i + 1);
    } else {
      // TODO
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
