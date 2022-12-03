/**
 * A field to set the privacy and add emails
 */
import {useTranslation} from 'next-i18next';
import {Container} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleInfo} from '@fortawesome/free-solid-svg-icons';
import Switch from '@components/Switch';
import ListInput from '@components/ListInput';
import {ElectionTypes, useElection} from '@services/ElectionContext';
import {validateMail} from '@services/mail';

const Private = () => {
  const {t} = useTranslation();

  const [election, dispatch] = useElection();

  const isEditable = !election.ref || election.ref === "";

  const toggle = () => {
    if (!isEditable) {
      return;
    }
    dispatch({
      type: ElectionTypes.SET,
      field: 'restricted',
      value: !election.restricted,
    });
  };

  const handleEmails = (emails: Array<string>) => {
    dispatch({
      type: ElectionTypes.SET,
      field: 'emails',
      value: emails,
    });
  };


  return (
    <>
      <Container className="bg-white  p-3 p-md-4 mt-1">
        <div className="d-flex">
          <div className="me-auto">
            <h4 className="mb-0 text-dark">
              {t('admin.private-title')}
              {election.restricted ? (
                <>
                  {' '}
                  <div className={`${election.emails.length > 0 ? "text-bg-light text-black-50" : "text-bg-danger text-white"} badge ms-2`}>
                    {`${election.emails.length} ${t(
                      'common.invites'
                    )}`}
                  </div>{' '}
                </>
              ) : null}
            </h4>
            <p className="text-muted d-none d-md-block">
              {t('admin.private-desc')}
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
          </>
        ) : null}
      </Container>
      {
        election.restricted ? (
          <Container className="text-white d-md-none p-3">
            {t('admin.access-results-desc')}
          </Container>
        ) : null
      }
    </>
  );
};

export default Private;
