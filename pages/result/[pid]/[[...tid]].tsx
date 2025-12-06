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

const Results = ({ token, pid }) => {
  const router = useRouter();
  const url = token
    ? new URL(`/result/${pid}/${token}`, URL_LEGACY)
    : new URL(`/result/${pid}`, URL_LEGACY);

  useEffect(() => {
    router.push(url.href);
  }, []);

  return <p>Redirecting to {url.href}</p>;
};

export default Results;
