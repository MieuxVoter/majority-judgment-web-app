import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Container,
  ListGroup,
  ListGroupItem,
  Button as ReactstrapButton,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { AppTypes, useAppContext } from '@services/context';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['resource'])),
    },
  };
}

const GeneratedUrlsPage = () => {
  const { t } = useTranslation();
  const [urls, setUrls] = useState<string[]>([]);
  const [_, dispatchApp] = useAppContext();

  useEffect(() => {
    const storedUrls = sessionStorage.getItem('generatedUrls');
    if (storedUrls) {
      try {
        setUrls(JSON.parse(storedUrls));
        sessionStorage.removeItem('generatedUrls');
      } catch (e) {
        console.error('Failed to parse stored URLs', e);
      }
    }
  }, []); // Empty array means effect will run once

  const handleCopyAll = async () => {
    if (urls.length === 0) return;
    try {
      await navigator.clipboard.writeText(urls.join('\n'));
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'success',
        message: t('success.urls-copied'),
      });
    } catch (err) {
      console.error('Failed to copy URLs: ', err);
      dispatchApp({
        type: AppTypes.TOAST_ADD,
        status: 'error',
        message: t('error.urls-copy-failed'),
      });
    }
  };

  return (
    <Container className="py-5 text-dark">
      <h1>{t('admin.generated-vote-urls-title')}</h1>
      <p>{t('admin.generated-vote-urls-description')}</p>
      {urls.length > 0 ? (
        <>
          <ReactstrapButton
            color="primary"
            onClick={handleCopyAll}
            className="mb-3"
          >
            <FontAwesomeIcon icon={faCopy} className="me-2" />
            {t('admin.copy-all-urls')}
          </ReactstrapButton>
          <ListGroup flush>
            {urls.map((url, index) => (
              <ListGroupItem key={index} style={{ wordBreak: 'break-all' }}>
                {url}
              </ListGroupItem>
            ))}
          </ListGroup>
        </>
      ) : (
        <p>{t('admin.no-urls-generated')}</p>
      )}
    </Container>
  );
};

export default GeneratedUrlsPage;
