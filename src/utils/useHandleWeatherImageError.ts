import { useCallback } from 'react';

const useHandleWeatherImageError = () => {
    const handleWeatherImageError = useCallback(
        (event: React.SyntheticEvent<HTMLImageElement>) => {
            const target = event.target as HTMLImageElement;
            target.src = '/images/logos/errorLogo.png';
        },
        []
    );

    return handleWeatherImageError;
};


export default useHandleWeatherImageError