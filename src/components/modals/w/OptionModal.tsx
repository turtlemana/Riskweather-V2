import { NowTrendingData } from "interfaces/main";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface OptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: any;
  onRemove: () => void;
  session: any;
  update: any;
  mutate: any;
  interestMutate: any;
}

export const OptionModal: React.FC<OptionModalProps> = ({
  session,
  isOpen,
  onClose,
  mutate,
  interestMutate,
  asset,
  onRemove,
  update,
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleModalClick = (e: React.MouseEvent) => {
    // 이벤트의 전파를 중단해서 모달 바깥의 onClick 이벤트가 발생하지 않도록 합니다.
    e.stopPropagation();
  };
  const handleDelete = async () => {
    if (!session || !session.user) {
      router.push("/login");
      return;
    } else {
      const enteredInput = {
        interest: {
          name: encodeURIComponent(asset.ITEM_ENG_NM),
          krName: encodeURIComponent(asset.ITEM_KR_NM),
          ticker: asset.ITEM_CD_DL,
        },
        action: "remove",
      };

      const data = await fetch(`/api/auth/user?session=${session.user.email}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ enteredInput }),
      }).then((res) => {
        if (res.ok) {
          toast(
            router.locale == "ko"
              ? "관심 자산이 삭제됐습니다"
              : "Successfully added",
            { hideProgressBar: true, autoClose: 2000, type: "success" }
          );
        } else {
          toast(
            router.locale == "ko"
              ? "관심 자산 삭제에 실패했습니다"
              : "Fetch Error",
            { hideProgressBar: true, autoClose: 2000, type: "error" }
          );
        }
      });
    }
    await mutate();
    await interestMutate();
    await update();
    onClose();
  };

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://riskweather.io/detail/${asset.ITEM_CD_DL}`
      );
      toast.success(
        router.locale === "ko"
          ? "공유 링크가 복사되었습니다."
          : "Share link copied!",
        {
          hideProgressBar: true,
          autoClose: 2000,
        }
      );
      onClose();
    } catch (err) {
      toast.error(
        router.locale === "ko"
          ? "링크 복사에 실패했습니다."
          : "Failed to copy the link!",
        {
          hideProgressBar: true,
          autoClose: 2000,
        }
      );
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed  inset-0 z-50 bg-black opacity-50 "
        onClick={onClose}
      ></div>
      <div
        className="fixed w-full max-w-[800px]  inset-y-0   z-50 flex justify-center items-end "
        onClick={onClose}
      >
        <div
          className="bg-white rounded-t-xl p-5 w-full pb-14"
          onClick={handleModalClick}
        >
          <h1 className="text-xl mb-6">관심자산</h1>
          <div
            className="flex items-center space-x-2 mb-6 cursor-pointer text-md"
            onClick={handleShareClick}
          >
            <Image
              src="/images/icons/share.svg"
              width={30}
              height={30}
              alt="share"
            />
            <p>친구에게 공유</p>
          </div>
          <div
            className="flex items-center space-x-2 cursor-pointer text-red-500 text-md"
            onClick={handleDelete}
          >
            <Image
              src="/images/icons/trash.svg"
              width={30}
              height={30}
              alt="trash"
            />
            <p>관심목록에서 삭제</p>
          </div>
        </div>
      </div>
    </>
  );
};
