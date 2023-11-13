import { useEffect, useRef } from 'react';

const useModalClose = (isOpenModal: boolean, setIsOpenModal: (isOpen: boolean) => void) => {
    const ref = useRef<HTMLImageElement | HTMLDivElement | undefined | null>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpenModal(false);
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.keyCode === 27) {
                setIsOpenModal(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [isOpenModal, setIsOpenModal]);

    return ref as React.Ref<HTMLImageElement | HTMLDivElement | undefined | null>;
};

export default useModalClose;