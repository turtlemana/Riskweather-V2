import React, { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import useModalClose from "utils/useModalClose";
interface Props {
  setIsOpenAskModal: Dispatch<SetStateAction<boolean>>;
  submitHandler: () => any;
  isOpenAskModal: boolean;
}

function AskModal({ isOpenAskModal, setIsOpenAskModal, submitHandler }: Props) {
  const router = useRouter();
  const deleteModalRef = useModalClose(isOpenAskModal, () =>
    setIsOpenAskModal(false)
  );
  return (
    <div className="z-50  fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-30 overflow-y-auto">
      <main
        //@ts-ignore
        ref={deleteModalRef}
        className="z-20 absolute text-start text-[#111111] bg-white py-6 px-5 rounded-20 top-1/2 left-1/2 translate-x-half translate-y-half border w-1/2 md:w-1/3  xl:w-1/5"
      >
        <h1 className="text-xl mb-3">{"투자 성향을 측정합니다"}</h1>
        <p className="mb-5 text-sm text-start">
          {"1분만에 투자 성향을 파악해보세요"}
        </p>
        <section className="flex gap-[15px]">
          <button
            className="bg-gray-200 p-3 rounded-xl text-black font-medium flex-1"
            onClick={() => setIsOpenAskModal(false)}
          >
            {"취소"}
          </button>
          <button
            className="bg-blue-500 p-3 rounded-xl text-white font-medium flex-1  disabled:bg-[#D1D5DB]"
            onMouseDown={submitHandler}
          >
            <p>{"확인하기"}</p>
          </button>
        </section>
      </main>
    </div>
  );
}

export default AskModal;
