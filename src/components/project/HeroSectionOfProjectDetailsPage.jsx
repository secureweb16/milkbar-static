import React from "react";
import { BACKEND_SERVER_ADDRESS } from "../../data/variables/variables-1";

const HeroSectionOfProjectDetailsPage = (props) => {
  const { project } = props;
  console.log("project",project)
  const { title, bannerImage, projectLogo } = project;
  return (
    <>
      <section className="md:mb-10">
       
        <div className="md:block">
          <div className="relative">
            <img
              src={`${BACKEND_SERVER_ADDRESS}${bannerImage}`}
              alt=""
              className="w-full h-[50rem] object-cover object-center"
            />
            <div className="bg-[black] bg-opacity-[0%] absolute top-0 h-full w-full d-flex project-detail-hero-section">
              <div className="m-auto project-header-logo">
                <div className="text-[28px] px-5 text-center mt-16 opacity-[0.65]">
                  {title}
                </div>
                <div className="d-flex justify-content-center mt-[24px]">
                  <img
                    src={`${BACKEND_SERVER_ADDRESS}${projectLogo}`}
                    alt=""
                    className="h-[45px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSectionOfProjectDetailsPage;
