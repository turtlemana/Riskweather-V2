import React from "react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import close from "assets/icons/contact/close.svg";
import Image from "next/image";
import useModalClose from "utils/useModalClose";
import { toast } from "react-toastify";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
  const router = useRouter();
  const userEmail = useRef<HTMLInputElement>(null);
  const modalRef = useModalClose(isOpen, closeModal);
  const [message, setMessage] = useState("");
  let authResponse;

  const sendPasswordChange = async () => {
    if (userEmail.current) {
      const email = userEmail.current?.value as string;
      if (!email.includes("@") || email.length > 30 || email.length < 5) {
        setMessage(
          router.locale === "ko"
            ? "이메일 형식을 확인해주세요"
            : "Check your email format"
        );
        return;
      }

      const response = await fetch("/api/auth/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      authResponse = await response.json();
      if (authResponse.message === "user doesn't exists") {
        setMessage(
          router.locale === "ko"
            ? "존재하지 않는 계정입니다"
            : "Email doesn't exists"
        );

        return;
        // dispatch({ type: "SET_VALIDATION_MESSAGE", payload: "Hello" });
      }
      closeModal();
      toast(
        router.locale == "ko"
          ? `비밀번호 변경 이메일을 발송했습니다`
          : `Sucessfully sent password reset email`,
        {
          hideProgressBar: true,
          autoClose: 10000,
          type: "success",
          position: "top-center",
        }
      );
    }
  };

  return isOpen ? (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div
        //@ts-ignore
        ref={modalRef}
        className="bg-white p-5 rounded-lg shadow-lg w-5/6"
      >
        {/* <div className="flex justify-end mb-3">
          <button onClick={closeModal} className=" text-gray-500">
            <Image
              className=" text-gray-500"
              src={close}
              width={15}
              height={15}
              alt="close"
            />
          </button>
        </div> */}
        <div className="text-center ">
          <input
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            ref={userEmail}
            placeholder={router.locale === "ko" ? "이메일" : "Email"}
          />
          <p className="mt-1 mb-3 text-xs text-red-500 text-start ml-1">
            {message}
          </p>
          <button
            onClick={sendPasswordChange}
            className="bg-blue-500 w-full  text-white px-4 py-2 rounded-md"
          >
            {router.locale === "ko"
              ? "비밀번호 변경 이메일 받기"
              : "Send Password change email"}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
