// TODO use bootstrap modal
//  https://getbootstrap.com/docs/5.0/components/modal/
//
const Modal = ({ show, onClose, children, title }) => {
  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <div className="vh-100 modal overlay">
      <div className="modal body">
        <div className="modal header">
          <a href="#" onClick={handleCloseClick}>
            x
          </a>
        </div>
        {title && <div>{title}</div>}
        <div className="pt-5">{children}</div>
      </div>
    </div>
  ) : null;

  return modalContent;
};

export default Modal;
