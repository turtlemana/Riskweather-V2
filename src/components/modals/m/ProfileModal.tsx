import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import useHandleImageError from "utils/useHandleImageError";
import useHandleWeatherImageError from "utils/useHandleWeatherImageError";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";

interface props {
  setIsProfileModalOpen: Dispatch<SetStateAction<boolean>>;
  userProfile: any;
  mutate: any;
}
const BUCKET_URL = "https://riskweather.s3.ap-northeast-2.amazonaws.com/";

function ProfileModal({ setIsProfileModalOpen, userProfile, mutate }: props) {
  const router = useRouter();
  const imageInput = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const [defaultImage, setDefaultImage] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [uploadingStatus, setUploadingStatus] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const defaultImageClick = (i: number) => {
    if (defaultImage === i) {
      setDefaultImage(0);
    } else {
      setDefaultImage(i);
    }
    // setDefaultImage(i)
  };
  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);

      setUploadingStatus("Uploading the file to AWS S3");
      let { data } = await axios.post(
        `/api/auth/profileImage?session=${userProfile.email}`,
        {
          name: e.target.files[0].name,
          type: e.target.files[0].type,
          imageUrl: BUCKET_URL + e.target.files[0].name,
        }
      );

      const url = data.url;
      let { data: newData } = await axios.put(url, e.target.files[0], {
        headers: {
          "Content-type": e.target.files[0].type,
          "Access-Control-Allow-Origin": "*",
        },
      });

      setUploadedFile(BUCKET_URL + e.target.files[0].name);
      setFile(null);
      toast(
        router.locale == "ko"
          ? "프로필 이미지 변경이 완료됐습니다"
          : "Successfully Changed your profile image",
        { hideProgressBar: true, autoClose: 2000, type: "success" }
      );
      mutate();
      // sessionUpdate()
    }
  };
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const imageButtonClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    imageInput.current?.click();
  };

  const saveClick = async () => {
    const userName = nameInput.current?.value;

    if (
      (userName == "" || userName == userProfile?.name) &&
      defaultImage == 0
    ) {
      setIsProfileModalOpen(false);
    } else if (userName && userName.length > 49) {
      return toast(
        router.locale == "ko"
          ? "이름은 50자 이내여야 합니다"
          : "Your name should be lesser than 50 words",
        { hideProgressBar: true, autoClose: 2000, type: "error" }
      );
    } else {
      let enteredInput;

      if (defaultImage == 0) {
        enteredInput = {
          name: userName,
        };
      } else {
        enteredInput = {
          name: userName,
          profileImage: `/images/users/default${defaultImage}.svg`,
        };
      }

      const data = await fetch(`/api/auth/user?session=${userProfile.email}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ enteredInput }),
      }).then((res) => {
        if (res.ok) {
          toast(
            router.locale == "ko"
              ? "프로필 변경이 완료됐습니다"
              : "Successfully Changed your Profile Name",
            { hideProgressBar: true, autoClose: 2000, type: "success" }
          );
          mutate();
          setIsProfileModalOpen(false);
        } else {
          toast(
            router.locale == "ko"
              ? "네트워크 에러가 발생했습니다"
              : "Fetch Error",
            { hideProgressBar: true, autoClose: 2000, type: "error" }
          );
        }
      });
      mutate();
      // sessionUpdate()
    }
  };

  const handleImageError = useHandleWeatherImageError();

  return (
    <main className="z-50 fixed pb-16  bg-white left-0 top-0 w-full h-screen overflow-y-auto">
      <div className="flex flex-col  space-y-3">
        <div className="mt-5 px-5 space-x-4 py-3 flex justify-between items-center">
          <Image
            src={"/images/icons/arrowLeft.svg"}
            alt="arrow"
            width={11}
            height={6}
            onClick={() => setIsProfileModalOpen(false)}
          />
          <p className="text-lg font-bold">프로필 설정</p>
          <div></div>
        </div>
        <section className={""}>
          <div className={"flex justify-center items-center"}>
            <article className="relative w-[100px]  mb-6  ">
              <Image
                src={userProfile?.profileImage || "/images/logos/errorLogo.png"}
                onError={handleImageError}
                width={10}
                height={10}
                unoptimized
                referrerPolicy="no-referrer"
                loading="eager"
                className="w-[100px] h-[100px] rounded-full"
                alt=""
              />
              <input
                type="file"
                accept="image/*"
                ref={imageInput}
                style={{ display: "none" }}
                onChange={uploadFile}
              />

              {/* <Image
          onClick={imageButtonClick}
            src={camera}
            alt=""
            className="absolute right-0 bottom-0 cursor-pointer"
          /> */}
            </article>
          </div>
          <article
            className={"flex gap-2 mb-5 items-center justify-center px-3 "}
          >
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={"relative"}>
                <Image
                  key={i}
                  src={`/images/users/default${i}.svg`}
                  onError={handleImageError}
                  onClick={() => defaultImageClick(i)}
                  width={60}
                  height={60}
                  unoptimized
                  referrerPolicy="no-referrer"
                  loading="eager"
                  className={`
                  ${
                    defaultImage == i ? " border border-blue-400 " : " "
                  }  rounded-full cursor-pointer`}
                  alt=""
                />
              </div>
            ))}
            <Image
              onClick={imageButtonClick}
              src={"/images/icons/portfolio/camera.svg"}
              width={60}
              height={60}
              alt=""
              className="rounded-full cursor-pointer"
            />
          </article>
          <div className="px-5 space-y-2">
            <p className="ml-5 text-sm  text-gray-500 font-medium">이름</p>

            <article className="mb-4 px-5">
              <input
                type="text"
                className="bg-white border border-gray-200 w-full  rounded-20 px-3 py-2.5 text-sm h-10 text-gray-500"
                ref={nameInput}
                defaultValue={userProfile?.name}
              />
            </article>
          </div>
        </section>
        <div className="px-10 fixed bottom-10 w-full">
          <button
            className="bg-[#0198FF] mt-5 p-2 rounded-xl text-white font-bold w-full mb-6 hover:bg-[#0085E6] disabled:bg-[#D1D5DB]"
            onClick={saveClick}
          >
            {"완료"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default ProfileModal;
