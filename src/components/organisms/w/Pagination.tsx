import Image from "next/image";

interface Props {
  total: number;
  page: number;
  setPage: (e: number) => void;
  views?: number;
}

const Pagination = ({ total, page, setPage, views }: Props) => {
  const listLimit = views || 10;
  const pageLimit = 9;
  const startPage =
    parseInt((page - 1) / (pageLimit + 1) + "") * (pageLimit + 1) + 1;
  const numPages = Math.ceil(total / listLimit);
  const endPage =
    startPage + pageLimit > numPages ? numPages : startPage + pageLimit;
  const pageArray = [];
  for (let i = startPage; i <= endPage; i++) {
    pageArray.push(i);
  }
  const handlePrev = () => page !== 1 && setPage(page - 1);
  const handleNext = () => page !== numPages && setPage(page + 1);

  return (
    <main className="w-full flex justify-center">
      <div className="flex items-center min-w-[350px] mt-10 mx-auto">
        <Image
          src={"/images/icons/pagination/arrow.svg"}
          alt=""
          onClick={handlePrev}
          className={`cursor-pointer rotate-180 mr-5 ${
            page === 1 && "opacity-30 cursor-default"
          }`}
        />
        <div className="flex justify-around mx-auto gap-2">
          {pageArray.map((i) => (
            <div
              key={i}
              onClick={() => setPage(i)}
              className={`flex justify-center items-center w-10 h-10 rounded-20 text-gray-600 text-sm bg-white border cursor-pointer ${
                page === i && "bg-[#E6F5FF] border-[#0198FF] text-[#0198FF]"
              }`}
            >
              <p className="h-4">{i}</p>
            </div>
          ))}
        </div>
        <Image
          src={"/images/icons/pagination/arrow.svg"}
          alt=""
          onClick={handleNext}
          className={`cursor-pointer ml-5 ${
            page === numPages && "opacity-30 cursor-default"
          }`}
        />
      </div>
    </main>
  );
};

export default Pagination;
