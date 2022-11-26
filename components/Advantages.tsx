import {useTranslation} from 'next-i18next';
import Image from 'next/image';
import {Row, Col} from 'reactstrap';
import ballotBox from '../public/urne.svg';
import email from '../public/email.svg';
import respect from '../public/respect.svg';

const AdvantagesRow = () => {
  const {t} = useTranslation('resource');
  const resources = [
    {
      src: ballotBox,
      alt: t('home.alt-icon-ballot-box'),
      name: t('home.advantage-1-name'),
      desc: t('home.advantage-1-desc'),
    },
    {
      src: email,
      alt: t('home.alt-icon-envelop'),
      name: t('home.advantage-2-name'),
      desc: t('home.advantage-2-desc'),
    },
    {
      src: respect,
      alt: t('home.alt-icon-respect'),
      name: t('home.advantage-3-name'),
      desc: t('home.advantage-3-desc'),
    },
  ];
  return (
    <Row className="sectionTwoRowOne">
      {resources.map((item, i) => (
        <Col key={i} className="sectionTwoRowOneCol">
          <Image
            src={item.src}
            alt={item.alt}
            height="128"
            className="d-block mx-auto"
          />
          <h4>{item.name}</h4>
          <p>{item.desc}</p>
        </Col>
      ))}
    </Row>
  );
};

export default AdvantagesRow
