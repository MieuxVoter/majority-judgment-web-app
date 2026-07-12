import {useState, useEffect} from 'react';
import {
  INCIDENT_PAGE_LINK,
  INCIDENT_BANNER_EXPIRY,
} from '@services/constants';

const DISMISS_KEY = 'incident-2026-06-banner-dismissed';

const IncidentBanner = () => {
  // Rendu masqué au SSR : on n'affiche qu'après montage côté client pour
  // éviter tout décalage d'hydratation (date et localStorage sont client-only).
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const expired = new Date() > new Date(INCIDENT_BANNER_EXPIRY);
    const dismissed = window.localStorage.getItem(DISMISS_KEY) === 'true';
    if (!expired && !dismissed) {
      setVisible(true); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, []);

  if (!visible) {
    return null;
  }

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, 'true');
    setVisible(false);
  };

  return (
    <div className="incident-banner shadow" role="alert">
      <div className="d-flex align-items-start justify-content-between gap-3">
        <span>
          Un incident de sécurité a affecté notre infrastructure fin juin 2026.{' '}
          <a
            href={INCIDENT_PAGE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white fw-bold text-decoration-underline"
          >
            En savoir plus
          </a>
        </span>
        <button
          type="button"
          className="btn-close btn-close-white flex-shrink-0"
          aria-label="Fermer"
          onClick={dismiss}
        />
      </div>
    </div>
  );
};

export default IncidentBanner;
