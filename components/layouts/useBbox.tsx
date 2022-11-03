/* eslint react/prop-types: 0 */
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';

export const useBbox = () => {
    const ref = useRef();
    const [bbox, setBbox] = useState({});

    const set = () =>
        setBbox(ref && ref.current ? ref.current.getBoundingClientRect() : {});

    useEffect(() => {
        set();
        window.addEventListener('resize', set);
        return () => window.removeEventListener('resize', set);
    }, []);

    return [bbox, ref];
};