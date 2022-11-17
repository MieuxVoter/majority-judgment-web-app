/**
 * This component manages the title of the election
 */
import {useElection, useElectionDispatch} from '../../services/ElectionContext';

const TitleField = () => {
  const election = useElection();
  const dispatch = useElectionDispatch();
};

export default TitleField;
