import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { CONTACTS, MENUS } from "data/footer";
import useHandleWeatherImageError from "utils/useHandleWeatherImageError";

const Footer = () => {
  const router = useRouter();
  const handleImageError = useHandleWeatherImageError();

  return (
    <footer className="min-w-[360px] pt-7 pb-10 border-t px-5 bg-gray-50">
      <div>
        <Image
          onError={handleImageError}
          unoptimized
          quality={100}
          width={65}
          height={60}
          src={`/images/icons/footer/logo.png`}
          alt="logo"
          className=" mb-5"
        />
        <h1 className="text-gray-500 mb-4 text-sm">
          {router.locale == "ko" ? "(주)지엔이테크홀딩스" : "Customer Service"}
        </h1>
        <ul className="mb-[20px]">
          {CONTACTS.map(({ id, title, koreanTitle, content }) => (
            <li key={id} className="flex items-center gap-2 mb-2.5 text-xs">
              <p className="text-gray-400 w-[56px]">
                {router.locale == "ko" ? koreanTitle : title}
              </p>
              <p className="text-gray-800">{content}</p>
            </li>
          ))}
          <li className="flex items-center gap-2 mb-2.5 text-xs">
            <p className="text-gray-400 w-[56px]">데이터 제공</p>
            <p className="font-bold">{">koscom"}</p>
            <Image
              quality={100}
              unoptimized
              src="/images/icons/footer/yahoo.svg"
              width={45}
              height={15}
              alt="yahoo"
            />
            <Image
              quality={100}
              unoptimized
              src="/images/icons/footer/coinmarketcap.svg"
              width={93}
              height={18}
              alt="yahoo"
            />
          </li>
        </ul>
        <p className="text-sm text-gray-500 font-bold">개인정보처리방침</p>
        {/* <ul className="flex gap-4 text-gray-600 font-medium text-sm ">
          {MENUS.map(({ id, title, koreanTitle, path }) => (
            <li key={id} className={"flex items-center text-[10px]"}>
              <Link href={path}>
                {router.locale == "ko" ? koreanTitle : title}
              </Link>
              {title != "Privacy policy" && (
                <div className="h-3 w-px border border-solid border-gray-200 ml-3" />
              )}
            </li>
          ))}
        </ul> */}
      </div>
    </footer>
  );
};

export default Footer;
