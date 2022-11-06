const Switch = ({ toggle, state, className = '' }) => {
  return (
    <div className={`${className} form-check form-switch`}>
      <input
        onChange={toggle}
        className="form-check-input"
        type="checkbox"
        role="switch"
        checked={state}
      />
    </div>
  );
};

export default Switch;
