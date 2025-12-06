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
import { faCopy, faDownload } from '@fortawesome/free-solid-svg-icons';
import { AppTypes, useAppContext } from '@services/context';
import { Urls } from '@services/utils';
import Papa from 'papaparse';

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

  useEffect(() => {
    const storedUrls = sessionStorage.getItem('generatedUrls');
    if (storedUrls) {
      try {
        const urls = JSON.parse(storedUrls);
        urls.emails.sort((a, b) => a.mail.localeCompare(b.mail));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUrls(urls);
        sessionStorage.removeItem('generatedUrls');
      } catch (e) {
        console.error('Failed to parse stored URLs', e);
      }
    }
  }, []);
  const [_, dispatchApp] = useAppContext();

  const hasUrl = () => {
    return urls != null && (
      urls.qrCodes.length > 0
      || urls.manual.length > 0
      || urls.emails.length > 0
    );
  }

  const handleDownloadAll = async() => {
    if (!hasUrl()) return;

    const csv = [
        ["Mode", "Url"],
        ...urls.manual.map(e => ["Manual", e]),
        ...urls.qrCodes.map(e => ["QR Code", e]),
        ...urls.emails.map(e => [e.mail, e.urlVote]),
    ]

    const csvContent = Papa.unparse(csv);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'election-model.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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
      <h4>{t('admin.generated-vote-urls-title')}</h4>
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
          <ReactstrapButton
            color="primary"
            onClick={handleDownloadAll}
            className="mb-3"
          >
            <FontAwesomeIcon icon={faDownload} className="me-2" />
            {t('admin.download-all-urls')}
          </ReactstrapButton>
          <Container className="mt-5 px-0">
            {urls.manual.length > 0 && (
              <>
                <Container className="mb-3 px-0">
                  <h4>Manual</h4>
                  <ListGroup flush>

                    {urls.manual.map((url, index) => (
                      <ListGroupItem key={`manual-${index}`} style={{ wordBreak: 'break-all' }}>
                        {url.toString()}
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                </Container>
              </>
            )}

            {urls.qrCodes.length > 0 && (
              <>
                  <Container className="mb-3 px-0">
                  <h4>QRCodes</h4>
                  <ListGroup flush>
                    {urls.qrCodes.map((url, index) => (
                    <ListGroupItem key={`qrcode-${index}`} style={{ wordBreak: 'break-all' }}>
                      {url.toString()}
                    </ListGroupItem>
                    ))}
                  </ListGroup>
                  </Container>

              </>
            )}

            {urls.emails.length > 0 && (
              <>
                <Container className="mb-3 px-0">
                <h4>Emails</h4>
                <ListGroup flush>
                  {urls.emails.map((url, index) => (
                    <ListGroupItem key={`emails-${index}`} style={{ wordBreak: 'break-all' }}>
                      {url.mail}: {url.urlVote.toString()}
                    </ListGroupItem>
                  ))}
                </ListGroup>
                </Container>
              </>
            )}
          </Container>
        </>
      ) : (
        <p>{t('admin.no-urls-generated')}</p>
      )}
    </Container>
  );
};

export default GeneratedUrlsPage;
