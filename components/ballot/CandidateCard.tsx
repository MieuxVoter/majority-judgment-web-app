import Image from 'next/image';
import {useTranslation} from 'next-i18next';
import defaultAvatar from '../../public/avatarBlue.svg';
import {CandidatePayload} from '@services/api';

interface CandidateCardInterface {
  candidate: CandidatePayload;
}
const CandidateCard = ({candidate}: CandidateCardInterface) => {
  const {t} = useTranslation();
  return (<div className="d-flex align-items-center">
    <Image
      src={defaultAvatar}
      width={32}
      height={32}
      className="bg-light"
      alt={t('common.thumbnail')}
    />
    <div className="d-flex lh-sm flex-column justify-content-center ps-3">
      <span className="text-black fs-5 m-0 ">{candidate.name}</span>
      <br />
      <span className="text-muted fs-6 m-0 fw-normal">{t("vote.more-details")}</span>
    </div>
  </div>)
}


export default CandidateCard;
