import Image from 'next/image';
import urne from '../public/urne.svg'

export default () => {
  return (<div className="d-flex h-100 w-100 justify-content-center align-items-middle">
    <Image
      src={urne}
      width={22}
      height={22}
      className="align-self-center"
      alt="urne"
    />
  </div>)
}
