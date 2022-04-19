import { DividedText } from "@simulate-exchange/components";
import { useFullLoader, useRandomImage } from "@simulate-exchange/hooks";
import { useEffect, useState } from "react";
import Link from 'next/link'
import cx from "classnames";

const color = "bg-emerald-600 hover:bg-emerald-500 transition-colors";
export function Index() {
  const { randomImage, isLoading } = useRandomImage();
  const [urlLoading, setUrlLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    const finishLoading = () => setUrlLoading(false);
    img.addEventListener("load", finishLoading);
    img.src = randomImage;
    return () => img.removeEventListener("load", finishLoading);
  }, [setUrlLoading, randomImage]);

  useFullLoader(isLoading || urlLoading);

  return (
    <>
      <div 
      className="h-screen w-screen justify-center items-center flex flex-col bg-cover bg-center bg-no-repeat bg-blend-multiply"  
      style={{backgroundImage: 
        "linear-gradient(to top, rgba(23, 23, 23, 1), rgba(195, 195, 195, 0.3)), url('https://images.unsplash.com/photo-1643101810111-d364a77127b7?ixlib=rb-1.2.1)"

      }}
      >
        <h1 className="text-3xl lg:text-7xl md:text-5xl text-white  font-bold">
          Simulate.Exchange
          </h1>
        <div className="my-2"></div>
        <DividedText text="Create an exchange NOW" className="lg:text-2xl md:text-1xl text-gray-200" />
        <div className="my-2"></div>
        <Link href="/auth" passHref>
          <button
            className={cx(
              color,
              "text-white font-bold py-2 px-10 rounded focus:outline-none focus:shadow-outline",
            )}
            type="button"
          >
            Get started
          </button>
        </Link>
      </div>
    </>
  );
}

export default Index;
