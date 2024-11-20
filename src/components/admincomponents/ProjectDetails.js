import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import config from "../../config";
import { BACKEND_SERVER_ADDRESS } from "../../data/variables/variables-1";
import WhatWeDo from "../WhatWeDo";
import FeaturedMedia from "../featured/FeaturedMedia";
import useBasic from "../../hooks/useBasics/useBasics";

function ProjectDetails() {
  const openModal = useBasic((state) => state.openModal);
  const setIdOfItemSelectedToBeDeleted = useBasic(
    (state) => state.setIdOfItemSelectedToBeDeleted
  );
  const { id } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null);
  const [bookings, setBookings] = useState([]); // State to hold bookings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteButtonStatus, setDeleteButtonStatus] = useState("INITIAL");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_SERVER_ADDRESS}/api/admin/get-project/${id}`
        );
        setProject(response.data); // Set the fetched project details
      } catch (err) {
        setError("Failed to fetch project details");
      } finally {
        setLoading(false);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_SERVER_ADDRESS}/api/admin/get-bookings/${id}`
        );
        setBookings(response.data); // Set the fetched bookings
      } catch (err) {
        setError("Failed to fetch bookings");
      }
    };

    fetchProjectDetails();
    fetchBookings();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${BACKEND_SERVER_ADDRESS}/api/admin/delete-project/${id}`
      );
      // Navigate back to the project list or show a success message
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Failed to delete the project");
    }
  };

  const handleDelete2 = () => {
    openModal();
    setIdOfItemSelectedToBeDeleted(id);
    // const dataForServer = { id };
    // setDeleteButtonStatus("LOADING");
    // axios
    //   .post(
    //     `${BACKEND_SERVER_ADDRESS}/api/admin/delete-project/v2`,
    //     dataForServer
    //   )
    //   .then((response) => {
    //     console.log(response);
    //     setDeleteButtonStatus("SUCCESS");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     setDeleteButtonStatus("FAILED");
    //   });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard project_detail_wrap">
      <div className="content-container">
        <h1 className="dash_title">Dashboard</h1>
        <div className="back_btn_wrap">
          <button className="back-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
        <div className="main-section">
          <div className="projects">
            <div className="projects-inner">
              <div className="detail_item">
                <h2>Project Title</h2>
                <div className="detail_item_inner">
                  <p>{project?.title}</p>
                </div>
              </div>
              <div className="detail_item">
                <h2>Project Description</h2>
                <div className="detail_item_inner">
                  <p>{project?.description}</p>
                </div>
              </div>
              <div className="detail_item">
                <h2>What we Do</h2>
                <div className="detail_item_inner">
                  <ul className="flex flex-col gap-2">
                    {project?.whatWeDo.map((data) => {
                      return (
                        <li key={Math.random()} className="text-sm">
                          {data}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="detail_item">
                <h2>Brand Direction</h2>
                <div className="detail_item_inner">
                  <p>{project?.brandDirection}</p>
                </div>
              </div>
              <div className="detail_item">
                <h2>Design Intro</h2>
                <div className="detail_item_inner">
                  <p>{project?.designIntro}</p>
                </div>
              </div>
              <div className="detail_item">
                <h2>Design Title</h2>
                <div className="detail_item_inner">
                  <p>{project?.designTitle}</p>
                </div>
              </div>
              <div className="detail_item">
                <h2>Design Description</h2>
                <div className="detail_item_inner">
                  <p>{project?.designDescription}</p>
                </div>
              </div>
              <div className="detail_item">
                <h2>Gallery Images</h2>
                <div className="detail_item_inner gallery_inner">
                  <div className="detail_img_grid">
                    {project?.galleryImages &&
                    project?.galleryImages.length > 0 ? (
                      project?.galleryImages.map((image, index) => (
                        <div className="detail_img_item" key={index}>
                          <FeaturedMedia featuredImage={image} />
                        </div>
                      ))
                    ) : (
                      <p>No images available.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="detail_item">
                <div className="detail_banner_wrap">
                  <div className="detail_img_grid">
                    {project?.bannerImage ? ( // No .length because it's a string
                      <div className="detail_img_item">
                        <h2>Banner Image</h2>
                        <div className="banner_img_wrap">
                          <FeaturedMedia featuredImage={project.bannerImage} />
                        </div>
                      </div>
                    ) : (
                      <p>No image available.</p>
                    )}

                    {project?.featuredImage ? ( // No .length because it's a string
                      <div className="detail_img_item">
                        <h2>Featured Image</h2>
                        <div className="banner_img_wrap">
                          <FeaturedMedia
                            featuredImage={project?.featuredImage}
                          />
                        </div>
                      </div>
                    ) : (
                      <p>No image available.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="detail_item">
                <div className="detail_banner_wrap">
                  <div className="detail_img_grid">
                    {project?.bannerImage ? ( // No .length because it's a string
                      <div className="detail_img_item">
                        <h2>Project Logo</h2>
                        <div className="bg-[black] px-5 py-3 rounded-lg">
                          <FeaturedMedia featuredImage={project?.projectLogo} />
                        </div>
                      </div>
                    ) : (
                      <p>No image available.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="detail_item">
                <h2>Desktop Images</h2>
                <div className="detail_item_inner gallery_inner">
                  <div className="detail_img_grid">
                    {project?.desktopImages &&
                    project?.desktopImages.length > 0 ? (
                      project?.desktopImages.map((image, index) => (
                        <div className="detail_img_item" key={index}>
                          <FeaturedMedia featuredImage={image} />
                        </div>
                      ))
                    ) : (
                      <p>No images available.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="detail_item">
                <h2>Mobile Images</h2>
                <div className="detail_item_inner gallery_inner">
                  <div className="detail_img_grid">
                    {project?.mobileImages &&
                    project?.mobileImages.length > 0 ? (
                      project?.mobileImages.map((image, index) => (
                        <div className="detail_img_item" key={index}>
                          <FeaturedMedia featuredImage={image} />
                        </div>
                      ))
                    ) : (
                      <p>No images available.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="detail_project_btn_wrap">
                <div className="detail_edit_del">
                  <div className="btn_item">
                    {deleteButtonStatus === "INITIAL" && (
                      <button className="detail_btns" onClick={handleDelete2}>
                        Delete
                      </button>
                    )}
                    {deleteButtonStatus === "LOADING" && (
                      <button className="detail_btns">
                        Deleting{" "}
                        <i className="fa-solid fa-spinner animate-spin"></i>
                      </button>
                    )}
                    {deleteButtonStatus === "SUCCESS" && (
                      <button className="detail_btns">
                        Deleted <i className="fa-solid fa-check"></i>
                      </button>
                    )}
                    {deleteButtonStatus === "FAILED" && (
                      <button className="detail_btns" onClick={handleDelete2}>
                        Failed, try again
                      </button>
                    )}
                  </div>
                  <div className="btn_item">
                    <Link
                      to={`/admin/update-project/${project?._id}`}
                      className="update_detail detail_btns"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>

              {/* New section to display bookings */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
