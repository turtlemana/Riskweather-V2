import React, { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import useModalClose from "utils/useModalClose";
interface Props {
  setIsOpenDeleteModal: Dispatch<SetStateAction<boolean>>;
  deleteHandler: () => Promise<void>;
  isOpenDeleteModal: boolean;
  title: string;
  subTitle: string;
}

function DeleteModal({
  isOpenDeleteModal,
  setIsOpenDeleteModal,
  deleteHandler,
  title,
  subTitle,
}: Props) {
  const router = useRouter();
  const deleteModalRef = useModalClose(isOpenDeleteModal, () =>
    setIsOpenDeleteModal(false)
  );
  return (
    <div className="z-50  fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-30 overflow-y-auto">
      <main
        //@ts-ignore
        ref={deleteModalRef}
        className="z-20 absolute text-start text-[#111111] bg-white py-6 px-5 rounded-20 top-1/2 left-1/2 translate-x-half translate-y-half border  w-1/3"
      >
        <h1 className="text-xl mb-3">{title}</h1>
        <p className="mb-5 text-sm text-start">{subTitle}</p>
        <section className="flex gap-[15px]">
          <button
            className="bg-gray-200 p-3 rounded-xl text-black font-medium flex-1"
            onClick={() => setIsOpenDeleteModal(false)}
          >
            {"취소"}
          </button>
          <button
            className="bg-red-500 p-3 rounded-xl text-white font-medium flex-1  disabled:bg-[#D1D5DB]"
            onMouseDown={deleteHandler}
          >
            <p>{"삭제하기"}</p>
          </button>
        </section>
      </main>
    </div>
  );
}

export default DeleteModal;
