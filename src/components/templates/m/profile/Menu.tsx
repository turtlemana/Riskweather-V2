import React, { useState, useEffect } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import ProfileModal from "components/modals/m/ProfileModal";
import ToleranceModal from "components/modals/m/ToleranceModal";
import AskModal from "components/modals/m/AskModal";
function Menu({ userProfile, mutate }: any) {
  const router = useRouter();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isToleranceModalOpen, setIsToleranceModalOpen] = useState(false);
  const [isOpenAskModal, setIsOpenAskModal] = useState(false);
  useEffect(() => {
    if (userProfile && !userProfile.toleranceResult) {
      setIsOpenAskModal(true);
    }
  }, [userProfile]);

  return (
    <main className="w-full min-w-[360px] max-w-[800px] bg-white px-5 pt-2 pb-16">
      {userProfile && !userProfile.toleranceResult && isOpenAskModal && (
        <AskModal
          isOpenAskModal={isOpenAskModal}
          setIsOpenAskModal={setIsOpenAskModal}
          submitHandler={() => {
            setIsToleranceModalOpen(true);
            setIsOpenAskModal(false);
          }}
        />
      )}
      <div className="flex flex-col space-y-5">
        <p className="text-gray-400 ">내 정보</p>

        <div
          onClick={() => setIsToleranceModalOpen(true)}
          className="flex items-center justify-between"
        >
          <p className="font-bold text-lg">투자 성향 검사</p>
          <div className="flex items-center space-x-2">
            <p className=" text-blue-500 text-md mt-0.5">다시하기</p>
            <Image
              width={7}
              height={13}
              alt="arrow"
              src="/images/icons/arrowRight.svg"
            />
          </div>
        </div>
        <div
          onClick={() => setIsProfileModalOpen(true)}
          className="flex items-center justify-between"
        >
          <p className="font-bold text-lg">프로필 설정</p>
          <div className="flex items-center space-x-2">
            <Image
              width={7}
              height={13}
              alt="arrow"
              src="/images/icons/arrowRight.svg"
            />
          </div>
        </div>

        <p className="text-gray-400 pt-5">고객지원</p>
        <div className="flex items-center justify-between">
          <p
            onClick={() => {
              window.open("https://open.kakao.com/o/sU32v7ff", "_blank");
            }}
            className="font-bold text-lg"
          >
            1:1 문의
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p
            onClick={() => {
              signOut({ callbackUrl: `/login` });
            }}
            className="font-bold text-lg"
          >
            로그아웃
          </p>
        </div>
      </div>
      {isProfileModalOpen && (
        <ProfileModal
          mutate={mutate}
          userProfile={userProfile}
          setIsProfileModalOpen={setIsProfileModalOpen}
        />
      )}
      {isToleranceModalOpen && (
        <ToleranceModal
          setIsToleranceModalOpen={setIsToleranceModalOpen}
          mutate={mutate}
          userProfile={userProfile}
        />
      )}
    </main>
  );
}

export default Menu;
