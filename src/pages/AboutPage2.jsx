import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BannerImage from "../assets/images/about-banner-new.jpg"
import useBasic from "../hooks/useBasics/useBasics";

const AboutPage2 = () => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const screenSize = useBasic((state) => state.screenSize);

  return (
    <>
      <section>
        <div className="md:hidden">
          <div className="h-screen w-full relative">
          <img src={BannerImage} alt="" className="w-full h-full object-cover object-center"/>
          
            <div className=" absolute top-0 w-full h-full">
              <div className="w-full h-full flex items-end">
                <div className="bg-[black] bg-opacity-[65%] backdrop-blur-sm w-full h-[60%]">
                  <div className="px-5 py-10  h-full">
                    <div>
                      <div className="flex gap-3 items-center">
                        <div className="bg-[#a2bb3c] h-[0.8rem] w-[0.8rem] rounded-full"></div>
                        <div className="">Why Milkbar?</div>
                      </div>
                    </div>
                    <div className="text-sm mt-5 leading-loose">
                      Milkbar is 'Milkbar' because the my family immigrated from
                      a Greek village to Australia.
                    </div>
                    <div className="text-sm mt-5 leading-loose">
                      Many Greek immigrants opened corner shops, emulating the
                      greek cafe tradition, called "Milkbars". Milkbars became
                      cornerstones of a community in transition from immense
                      loss to prosperity while staying grounded in tradition.
                    </div>
                    <div className="text-sm mt-5 leading-loose">
                      Everything beautiful in life lies in the perpetual state
                      between the classic and the new.{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="h-screen w-full relative">
            {/* <video autoPlay muted loop playsInline className="w-full h-full object-cover object-center">
              <source
                src="/videos/AboutBackground.mp4"
                type="video/mp4"
              />
              <source
                src="/videos/AboutBackground.mov"
                type="video/quicktime"
              />
            </video> */}
            <div className="h-screen w-full relative">
              <img src={BannerImage} alt="" className="w-full h-full object-cover object-center"/>
              </div>
            <div className=" absolute top-0 w-full h-full">
              <div className="h-full">
                <div className="w-full h-full flex ">
                  <div className=" w-[60%] xl:w-[50%] bg-[black] bg-opacity-[65%] backdrop-blur-sm h-full ">
                    <div className="flex justify-end items-center h-full">
                      <div className="xl:pr-[175px] py-10 w-[90%] lg:w-[80%] xl:w-[80%]">
                        <div>
                          <div className="flex gap-3 items-center">
                            <div className="bg-[#a2bb3c] h-[0.8rem] w-[0.8rem] rounded-full"></div>
                            <div className=" lg:text-2xl">Why Milkbar?</div>
                          </div>
                        </div>
                        <div className="text-sm lg:text-base mt-5 lg:mt-16 leading-loose">
                          Milkbar is 'Milkbar' because the my family immigrated
                          from a Greek village to Australia.
                        </div>
                        <div className="text-sm lg:text-base mt-5 lg:mt-7 xl:mt-10 leading-loose">
                          Many Greek immigrants opened corner shops, emulating
                          the greek cafe tradition, called "Milkbars". Milkbars
                          became cornerstones of a community in transition from
                          immense loss to prosperity while staying grounded in
                          tradition.
                        </div>
                        <div className="text-sm lg:text-base mt-5 lg:mt-7 xl:mt-10  leading-loose">
                          Everything beautiful in life lies in the perpetual
                          state between the classic and the new.{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[40%] xl:w-[50%] h-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage2;
