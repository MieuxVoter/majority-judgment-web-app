/**
 * A field to set the privacy and add emails
 */
import { useTranslation } from 'next-i18next';
import { Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Switch from '@components/Switch';
import ListInput from '@components/ListInput';
import { ElectionTypes, useElection } from '@services/ElectionContext';
import { validateMail } from '@services/mail';
import { AppTypes, useAppContext } from '@services/context';
import QRCodeCountInput from '@components/QRCodeCountInput';
import { getTotalInvites } from '@services/utils';

const Private = () => {
  const { t } = useTranslation();

  const [_, dispatchApp] = useAppContext();
  const [election, dispatch] = useElection();

  const isCreating = !election.ref || election.ref === '';

  const toggle = () => {
    if (!isCreating) {
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'error',
        message: t('error.cant-set-ongoing'),
      });
      return;
    }
    dispatch({
      type: ElectionTypes.SET,
      field: 'restricted',
      value: !election.restricted,
    });
  };

  const handleQrCodes = (count: number) => {
    dispatch({
      type: ElectionTypes.SET,
      field: 'qrCodeCount',
      value: count,
    });
  };

  const handleUrlCount = (count: number) => {
    dispatch({
      type: ElectionTypes.SET,
      field: 'urlCount',
      value: count,
    });
  };

  const handleEmails = (emails: Array<string>) => {
    dispatch({
      type: ElectionTypes.SET,
      field: 'emails',
      value: emails,
    });
  };

  const totalInvites = getTotalInvites(election);

  return (
    <>
      <Container className="bg-white  p-3 p-md-4 mt-1">
        <div className="d-flex">
          <div className="me-auto d-flex flex-column justify-content-center">
            <h5 className="mb-0 text-dark d-flex align-items-center">
              {t('admin.private-title')}
              {election.restricted ? (
                <>
                  {' '}
                  <div
                    className={`${
                      totalInvites > 0 || !isCreating
                        ? 'text-bg-light text-black-50'
                        : 'text-bg-danger text-white'
                    } badge ms-2`}
                  >
                    {`${totalInvites} ${t('common.invites')}`}
                  </div>{' '}
                </>
              ) : null}
            </h5>
            <p className="text-muted d-none d-md-block">
              {isCreating
                ? t('admin.private-desc-creating')
                : t('admin.private-desc-editing')}
            </p>
          </div>
          <Switch toggle={toggle} state={election.restricted} />
        </div>
        {election.restricted ? (
          <>
            <ListInput
              onEdit={handleEmails}
              inputs={election.emails}
              validator={validateMail}
            />
          
            <div className="bg-light bt-3 p-2    text-muted fw-bold d-none d-md-flex align-items-center ">
              <FontAwesomeIcon icon={faCircleInfo} />
              <div className="ms-3">{t('admin.private-tip')}</div>
            </div>
            <p className='my-3 text-muted d-md-block'>{t('admin.private-title-qrcode')}</p>
            <QRCodeCountInput onEdit={handleQrCodes} value={election.qrCodeCount}/>
            <div className="mt-3">
               <p className='my-3 text-muted d-md-block'>{t('admin.or-generate-urls')}</p>
               <QRCodeCountInput onEdit={handleUrlCount} value={election.urlCount || 0}/>
            </div>
          </>
        ) : null}
      </Container>
      {election.restricted ? (
        <Container className="text-white d-md-none p-3">
          {t('admin.access-results-desc')}
        </Container>
      ) : null}
    </>
  );
};

export default Private;
