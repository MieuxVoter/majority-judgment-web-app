/**
 * A toggle button using bootstrap
 */


const Toggle = ({active, children}) => {


  return (<button
    type="button"
    className={`btn btn-toggle ${active ? 'active' : ''}`}
    data-toggle="button"
    aria-pressed="false"
    autocomplete="off"
  >
    {children}
  </button>
  )
}

Toggle.defaultProps = {
  'active': false
}

export default Toggle;
