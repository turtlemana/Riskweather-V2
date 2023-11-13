import { useCallback } from 'react';

const useHandleImageError = () => {
    const handleImageError = useCallback(
        (event: React.SyntheticEvent<HTMLImageElement>, exchange: string) => {
            const target = event.target as HTMLImageElement;

            if (exchange === "KOSPI") {
                target.src = '/images/logos/KOSPI.svg';
            } else if (exchange === "KOSDAQ") {
                target.src = '/images/logos/KOSDAQ.svg';
            } else {
                target.src = '/images/logos/errorLogo.png';
            }
        },
        []
    );

    return handleImageError;
};


export default useHandleImageError