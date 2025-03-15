// TODO use bootstrap modal
//  https://getbootstrap.com/docs/5.0/components/modal/
//

type ModalProps = {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};

const Modal = ({ show, onClose, children, title }:ModalProps) => {
  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <div className="vh-100 modal fade show" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            {title && <h5>{title}</h5>}
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseClick}></button>
          </div>
          <div className="modal-body">
            <div className="pt-5">{children}</div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return modalContent;
};

export default Modal;
