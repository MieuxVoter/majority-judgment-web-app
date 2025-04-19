import {useRouter} from 'next/router';
import Button from '@components/Button';
import {useTranslation} from 'next-i18next';
import {getElection, castBallot, apiErrors, ElectionPayload, CandidatePayload, GradePayload} from '@services/api';
import {getFormattedDatetime, getLocaleShort} from '@services/utils';
import {faCalendarDays} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';


interface TitleBarInterface {
  election: ElectionPayload;
}
const TitleBar = ({election}: TitleBarInterface) => {
  const {t} = useTranslation();
  const router = useRouter();
  const locale = getLocaleShort(router);

  if (!election.date_end) {
    return null;
  }


  return (
    <div className="w-100 bg-light p-2 text-black justify-content-center d-md-flex d-none ">
      <div className="me-2">
        <FontAwesomeIcon icon={faCalendarDays} />
      </div>
      <div>
        {` ${t("vote.open-until")} ${getFormattedDatetime(router.locale, election.date_end)}`}
      </div>
    </div>
  )
};

export default TitleBar
