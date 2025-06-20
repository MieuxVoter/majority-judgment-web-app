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
import { Urls } from '@services/utils';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['resource'])),
    },
  };
}

const GeneratedUrlsPage = () => {
  const { t } = useTranslation();
  const [urls, setUrls] = useState<Urls | null>(null);
  const [_, dispatchApp] = useAppContext();

  const hasUrl = () => {
    return urls != null && (
      urls.qrCodes.length > 0
      || urls.manual.length > 0
      || urls.emails.length > 0
    );
  }

  useEffect(() => {
    const storedUrls = sessionStorage.getItem('generatedUrls');
    if (storedUrls) {
      try {
        const urls = JSON.parse(storedUrls);
        urls.emails.sort((a, b) => a.mail.localeCompare(b.mail));
        setUrls(JSON.parse(storedUrls));
        sessionStorage.removeItem('generatedUrls');
      } catch (e) {
        console.error('Failed to parse stored URLs', e);
      }
    }
  }, []); // Empty array means effect will run once

  const handleCopyAll = async () => {
    if (!hasUrl()) return;
    try {
      await navigator.clipboard.writeText(
        urls.manual.map(e => `Manual: ${e}`)
        .concat(urls.qrCodes.map(e => `QR Code: ${e}`))
        .concat(urls.emails.map(e => `${e.mail}: ${e.urlVote}`))
        .join('\n')
      );
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
      {hasUrl() ? (
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
            {urls.manual.length > 0 && (
              <>
                <h1>Manual</h1>
                {urls.manual.map((url, index) => (
                  <ListGroupItem key={`manual-${index}`} style={{ wordBreak: 'break-all' }}>
                    {url.toString()}
                  </ListGroupItem>
                ))}
              </>
            )}

            {urls.qrCodes.length > 0 && (
              <>
                <h1>QRCodes</h1>
                {urls.qrCodes.map((url, index) => (
                  <ListGroupItem key={`qrcode-${index}`} style={{ wordBreak: 'break-all' }}>
                    {url.toString()}
                  </ListGroupItem>
                ))}
              </>
            )}

            {urls.emails.length > 0 && (
              <>
                <h1>Emails</h1>
                {urls.emails.map((url, index) => (
                  <ListGroupItem key={`emails-${index}`} style={{ wordBreak: 'break-all' }}>
                    {url.mail}: {url.urlVote.toString()}
                  </ListGroupItem>
                ))}
              </>
            )}
          </ListGroup>
        </>
      ) : (
        <p>{t('admin.no-urls-generated')}</p>
      )}
    </Container>
  );
};

export default GeneratedUrlsPage;
