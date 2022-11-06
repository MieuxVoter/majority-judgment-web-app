/**
 * This component manages the title of the election
 */
import { useElection, useElectionDispatch } from './ElectionContext';

const TitleField = () => {
  const election = useElection();
  const dispatch = useElectionDispatch();
};

export default TitleField;
