import { Separator } from "@heroui/react";
import Link from "next/link";

const Banner = () => {
  return (
    <div className="max-w-7xl mx-auto my-1">
<div className="bg-[url('/assets/Banner.jpg')] text-white  flex justify-between flex-col items-center  gap-5 h-150">
      <div className="p-10 text-center flex justify-center flex-col items-center gap-3.5 flex-1">
        <h1 className="text-7xl">
          Discover Your <br /> Products
        </h1>

        <p className="text-2xl">
          Explore our wide range of high-quality products and find exactly what you're looking for.
        </p>

        <div className="flex gap-5">
<Link href="/products">
          <button className="uppercase px-5 py-3 bg-white/50 cursor-pointer rounded-2xl">
            View Products
          </button> </Link>
        </div>
      </div>

      
      
    </div>
    </div>
  );
};

export default Banner;