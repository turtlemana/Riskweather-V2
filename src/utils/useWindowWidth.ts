import { useState, useEffect, useLayoutEffect } from 'react';

function useWindowWidth() {
    const isClient = typeof window === 'object';
    const [windowWidth, setWindowWidth] = useState(isClient ? window.innerWidth : 0);

    useLayoutEffect(() => {
        if (!isClient) return;

        function handleResize() {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [isClient]);

    return windowWidth;
}

export default useWindowWidth;