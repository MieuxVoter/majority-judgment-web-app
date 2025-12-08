import { useRouter } from 'next/router';
import { URL_LEGACY } from '@services/constants';
import { useEffect } from 'react';

export async function getServerSideProps({ query }) {
  const { pid, tid: token } = query;

  return {
    props: {
      token: token || null,
      pid,
    },
  };
}

const Votes = ({ token, pid }) => {
  const router = useRouter();
  const url = token
    ? new URL(`/vote/${pid}/${token}`, URL_LEGACY)
    : new URL(`/vote/${pid}`, URL_LEGACY);

  useEffect(() => {
    router.push(url.href);
  }, [router, url.href]);

  return <p>Redirecting to {url.href}</p>;
};

export default Votes;
