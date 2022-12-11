import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { Row, Col } from 'reactstrap';
import twitter from '../public/twitter.svg';
import facebook from '../public/facebook.svg';

interface ShareInterface {
  title?: string;
}

const ShareRow = ({ title }: ShareInterface) => {
  const { t } = useTranslation('resource');
  return (
    <Row className="sharing justify-content-md-center">
      <Col className="col-md-auto col-12">{title || t('common.share')}</Col>
      <Col className="col-auto">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.facebook.com/mieuxvoter.fr/"
        >
          <Image height={22} width={22} src={facebook} alt="icon facebook" />
        </a>
      </Col>
      <Col className="col-auto">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://twitter.com/mieux_voter"
        >
          <Image height={22} width={22} src={twitter} alt="icon twitter" />
        </a>
      </Col>
    </Row>
  );
};

export default ShareRow;
