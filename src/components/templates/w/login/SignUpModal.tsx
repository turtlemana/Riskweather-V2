import React from "react";
import { useRouter } from "next/router";
import useModalClose from "utils/useModalClose";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, message }) => {
  const router = useRouter();
  const modalRef = useModalClose(isOpen, closeModal);

  return isOpen ? (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div
        //@ts-ignore
        ref={modalRef}
        className="bg-white p-5 rounded-lg shadow-lg w-96"
      >
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500"
        >
          &times;
        </button>
        <div className="text-center text-md">
          <p className="mb-4">{message}</p>
          <button
            onClick={closeModal}
            className="bg-blue-500  text-white px-4 py-2 rounded-md"
          >
            {router.locale === "ko" ? "확인" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
