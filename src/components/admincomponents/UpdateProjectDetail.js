import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import config from "../../config";
import EditImagesGroups from "./edit-images-groups/EditImagesGroups";
import useUpdateValue from "../../hooks/update-project/useUpdateValue";
import EditWhatDoWeDo from "./edit-images-groups/EditWhatDoWeDo";
import { BACKEND_SERVER_ADDRESS } from "../../data/variables/variables-1";
import FeaturedMedia from "../featured/FeaturedMedia";

function UpdateProject() {
  const [loadingStatus, setLoadingStatus] = useState("INITIAL");
  const updateValue = useUpdateValue((state) => state);
  const setUpdatedValue = useUpdateValue((state) => state.setUpdatedValue);
  const { id } = useParams(); // Get the project ID from the URL
  const navigate = useNavigate();
  const [project, setProject] = useState({
    title: "",
    description: "",
    whatWeDo: "",
    brandDirection: "",
    images: [],
  });
  const [newImages, setNewImages] = useState([]);
  const [bannerImage, setBannerImage] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [removeImages, setRemoveImages] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);
  const bannerImageRef = useRef(null); // Reference for banner image input
  const featuredImageRef = useRef(null); // Reference for featured image input

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_SERVER_ADDRESS}/api/admin/get-project/${id}`
        );
        console.log(response);

        setProject(response.data); // Set the fetched project details
      } catch (err) {
        setError("Failed to fetch project details");
      }
    };
    // setProject({
    //   _id: {
    //     $oid: "67081ad82bb38efece918506",
    //   },
    //   title: "toronto-based architecture firm",
    //   description: "No description",
    //   whatWeDo: [
    //     "BRANDING & BRAND DIRECTION",
    //     "WEB AND APP DESIGN",
    //     "DEVELOPMENT",
    //   ],
    //   brandDirection:
    //     "Contempo Studio needed their website to function like a portfolio for their hundreds of completed and upcoming projects. We’ve built a system that can feature projects at any stage of build so the company’s growth is showcased and their latest work can be used as a sales tool despite the stage of completion. ",
    //   images: [
    //     "\\images\\uploads\\8842369879588561.png",
    //     "\\images\\uploads\\8427863216764757.png",
    //     "\\images\\uploads\\4518789379868526.png",
    //   ],
    //   bannerImage: "\\images\\uploads\\163414538855075.png",
    //   featuredImage: "\\images\\uploads\\8143574841016763.mp4",
    //   projectLogo: "\\images\\uploads\\1291971196229970.png",
    //   designIntro: "WEB DESIGN + DEVELOPMENT",
    //   designTitle: "cinematic project display",
    //   designDescription:
    //     "We wanted to display the renderings and professional photography of completed projects in a way that is both beautiful and functional for a growing portfolio of projects across various stages at completion and styles. ",
    //   galleryImages: [
    //     "\\images\\uploads\\8516941137486742.png",
    //     "\\images\\uploads\\233388019416223.png",
    //     "\\images\\uploads\\4024369385867639.png",
    //     "\\images\\uploads\\7337518749564802.png",
    //   ],
    //   desktopImages: [
    //     "\\images\\uploads\\8842369879588561.png",
    //     "\\images\\uploads\\8427863216764757.png",
    //     "\\images\\uploads\\4518789379868526.png",
    //   ],
    //   mobileImages: [
    //     "\\images\\uploads\\3654265375267547.png",
    //     "\\images\\uploads\\6935863046310917.png",
    //   ],
    //   __v: 0,
    // });
    fetchProjectDetails();
  }, [id]);

  const handleRemoveImage = async (imageName) => {
    try {
      const response = await axios.post(
        `${config.BASE_URL}/api/admin/remove-image`,
        {
          projectId: project._id,
          imageName,
        }
      );

      if (response.status === 200) {
        // Remove image from the project state and track it for removal
        setRemoveImages((prev) => [...prev, imageName]); // Add to removeImages array

        // Update project state
        setProject((prevProject) => {
          const updatedImages = prevProject.images.filter(
            (image) => image !== imageName
          );
          return {
            ...prevProject,
            images: updatedImages,
            // Check if the removed image was the banner or featured image
            bannerImage:
              prevProject.bannerImage === imageName
                ? null
                : prevProject.bannerImage,
            featuredImage:
              prevProject.featuredImage === imageName
                ? null
                : prevProject.featuredImage,
          };
        });
      } else {
        console.error("Failed to remove image");
      }
    } catch (err) {
      console.error("Error removing image:", err);
    }
  };

  const handleNewImageChange = (e) => {
    setNewImages(e.target.files); // Set new images to be uploaded
  };

  const handleBannerImageChange = (e) => {
    setBannerImage(e.target.files[0]); // Set the banner image
  };

  const handleFeaturedImageChange = (e) => {
    setFeaturedImage(e.target.files[0]); // Set the featured image
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", project.title);
    formData.append("description", project.description);
    formData.append("whatWeDo", project.whatWeDo);
    formData.append("brandDirection", project.brandDirection);

    // Send the images to remove, if any
    if (removeImages.length > 0) {
      formData.append("removeImages", JSON.stringify(removeImages));
    }

    // Add new images for gallery
    for (const image of newImages) {
      formData.append("images", image);
    }

    // Add the banner image if selected
    if (bannerImage) {
      formData.append("bannerImage", bannerImage);
    }

    // Add the featured image if selected
    if (featuredImage) {
      formData.append("featuredImage", featuredImage);
    }

    try {
      const response = await axios.put(
        `${config.BASE_URL}/api/admin/update-project/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // Update the project state with the response data
      if (Array.isArray(response.data)) {
        setProject(response.data.project); // Assuming the response includes the updated project
      } else {
        setError("Unexpected response format");
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input for new images
      }
      if (bannerImageRef.current) {
        bannerImageRef.current.value = ""; // Clear the banner image input
      }
      if (featuredImageRef.current) {
        featuredImageRef.current.value = ""; // Clear the featured image input
      }
      setBannerImage(null); // Reset banner image state
      setFeaturedImage(null); // Reset featured image state
      setSuccessMessage("Project updated successfully!");
    } catch (err) {
      setError("Failed to update project");
    }
  };
  const handleFormSubmit2 = (e) => {
    setLoadingStatus("LOADING");
    e.preventDefault();
    const form = e.currentTarget;
    const myFormData = new FormData();

    Array.from(form.elements).forEach((element) => {
      if (element.type === "file") {
        const files = element.files;
        if (files.length > 0 && files[0].size > 0) {
          // Append only non-empty files to FormData
          myFormData.append(element.name, files[0]);
        }
      } else if (element.name) {
        // Append other non-file form fields as usual
        myFormData.append(element.name, element.value);
      }
    });

    const whatWeDoInputs = Array.from(
      document.getElementsByClassName("whatDoWeDoEditUl")[0].children
    );
    const work = [];
    for (let i = 0; i < whatWeDoInputs.length; i++) {
      const value = whatWeDoInputs[i].children[0].value;
      work.push(value);
    }
    const processedWorkData = JSON.stringify(work);
    myFormData.append("whatWeDo", processedWorkData);

    const {
      title,
      description,

      brandDirection,
      designIntro,
      designTitle,
      designDescription,
      changedBannerImageFieldName,
      changedFeatureImageFieldName,
      changedProjectLogoFieldName,
      srcOfRemovedGallaryImages,
      fieldNameOfAddedGalleryImages,
      srcOfRemovedMobileImages,
      fieldNameOfAddedMobileImages,
      srcOfRemovedDesktopImages,
      fieldNameOfAddedDesktopImages,
      srcOfRemovedImages,
      fieldNameOfAddedImages,
    } = updateValue;
    const { _id } = project;
    myFormData.append("_id", id);
    myFormData.append("title", title);
    myFormData.append("description", description);
    myFormData.append("brandDirection", brandDirection);
    myFormData.append("designIntro", designIntro);
    myFormData.append("designTitle", designTitle);
    myFormData.append("designDescription", designDescription);
    myFormData.append(
      "changedBannerImageFieldName",
      changedBannerImageFieldName
    );
    myFormData.append(
      "changedFeatureImageFieldName",
      changedFeatureImageFieldName
    );
    myFormData.append(
      "changedProjectLogoFieldName",
      changedProjectLogoFieldName
    );
    myFormData.append(
      "srcOfRemovedGallaryImages",
      JSON.stringify(srcOfRemovedGallaryImages)
    );
    myFormData.append(
      "fieldNameOfAddedGalleryImages",
      JSON.stringify(fieldNameOfAddedGalleryImages)
    );
    myFormData.append(
      "srcOfRemovedMobileImages",
      JSON.stringify(srcOfRemovedMobileImages)
    );
    myFormData.append(
      "fieldNameOfAddedMobileImages",
      JSON.stringify(fieldNameOfAddedMobileImages)
    );
    myFormData.append(
      "srcOfRemovedDesktopImages",
      JSON.stringify(srcOfRemovedDesktopImages)
    );
    myFormData.append(
      "fieldNameOfAddedDesktopImages",
      JSON.stringify(fieldNameOfAddedDesktopImages)
    );
    myFormData.append("srcOfRemovedImages", JSON.stringify(srcOfRemovedImages));
    myFormData.append(
      "fieldNameOfAddedImages",
      JSON.stringify(fieldNameOfAddedImages)
    );

    axios
      .post(
        `${BACKEND_SERVER_ADDRESS}/api/admin/update-project/v2/${_id}`,
        myFormData
      )
      .then((response) => {
        setLoadingStatus("SUCCESS");
        console.log(response);
      })
      .catch((error) => {
        setLoadingStatus("FAILED");
        console.log(error);
      });
    console.log(changedBannerImageFieldName);
  };
  // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const initializeUpdateValueOnRefresh = () => {
    const {
      title,
      brandDirection,
      description,
      designDescription,
      designIntro,
      designTitle,
      whatWeDo,
    } = project;
    const newUpdatedValue = {
      ...updateValue,
      title,
      brandDirection,
      description,
      designDescription,
      designIntro,
      designTitle,
      whatWeDo,
    };

    setUpdatedValue(newUpdatedValue);
  };
  const handleProjectTitleChange = (e) => {
    const value = e.currentTarget.value;
    setUpdatedValue({ title: value });
  };
  const handleProjectDescriptionChange = (e) => {
    const value = e.currentTarget.value;
    setUpdatedValue({ description: value });
  };
  const handleBrandDirectionChange = (e) => {
    const value = e.currentTarget.value;
    setUpdatedValue({ brandDirection: value });
  };
  const handleDesignIntroChange = (e) => {
    const value = e.currentTarget.value;
    setUpdatedValue({ designIntro: value });
  };
  const handleDesignTitleChange = (e) => {
    const value = e.currentTarget.value;
    setUpdatedValue({ designTitle: value });
  };
  const handleDesignDescriptionChange = (e) => {
    const value = e.currentTarget.value;
    setUpdatedValue({ designDescription: value });
  };
  const handleChangeBannerImage = (e) => {
    const fieldName = e.currentTarget.name;
    console.log(fieldName);
    setUpdatedValue({ changedBannerImageFieldName: fieldName });
  };
  const handleChangeFeaturedImage = (e) => {
    const fieldName = e.currentTarget.name;
    setUpdatedValue({ changedFeatureImageFieldName: fieldName });
  };
  const handleChangeProjectLogo = (e) => {
    const fieldName = e.currentTarget.name;
    setUpdatedValue({
      changedProjectLogoFieldName: fieldName,
    });
  };
  useEffect(() => {
    initializeUpdateValueOnRefresh();
  }, [project]);
  return (
    <div className="dashboard update_detail_wrap">
      <div className="container">
        <h1 className="dash_title">Edit Project</h1>
        <div className="back_btn_wrap">
          <button className="back-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
        <form onSubmit={handleFormSubmit2} encType="multipart/form-data">
          <div className="update_details_wrap">
            <div className="form-group">
              <label>Project Title</label>
              <input
                type="text"
                value={updateValue.title}
                onChange={handleProjectTitleChange}
              />
            </div>
            <div className="form-group">
              <label>Project description</label>
              <textarea
                value={updateValue.description}
                onChange={handleProjectDescriptionChange}
                className="text-[black] w-full h-[7rem] px-5 py-5 text-sm font-medium rounded-md"
              />
            </div>
            <EditWhatDoWeDo />
            <div className="form-group">
              <label>Brand Direction</label>
              <input
                type="text"
                value={updateValue.brandDirection}
                onChange={handleBrandDirectionChange}
              />
            </div>
            <div className="form-group">
              <label>Design Intro</label>
              <input
                type="text"
                value={updateValue.designIntro}
                onChange={handleDesignIntroChange}
              />
            </div>
            <div className="form-group">
              <label>Design Title</label>
              <input
                type="text"
                value={updateValue.designTitle}
                onChange={handleDesignTitleChange}
              />
            </div>
            <div className="form-group">
              <label>Design Description</label>
              <textarea
                value={updateValue.designDescription}
                onChange={handleDesignDescriptionChange}
                className="text-[black] w-full h-[7rem] px-5 py-5 text-sm font-medium rounded-md"
              />
            </div>
            <div className="form-group">
              <EditImagesGroups
                project={project}
                name="galleryImages"
                title="Edit Gallery Images"
              />
            </div>
            <div className="form-group">
              <EditImagesGroups
                project={project}
                name="desktopImages"
                title="Edit Desktop Images"
              />
            </div>
            <div className="form-group">
              <EditImagesGroups
                project={project}
                name="mobileImages"
                title="Edit Mobile Images"
              />
            </div>
            <div className="form-group">
              <div className="detail_banner_wrap">
                <div className="detail_img_grid">
                  <div className="upload_item">
                    <label>Banner Image</label>

                    <input
                      type="file"
                      name="bannerImage"
                      onChange={handleChangeBannerImage}
                      ref={bannerImageRef}
                    />
                  </div>
                  {project?.bannerImage ? (
                    <div className="detail_img_item">
                      <div className="banner_img_wrap">
                        <FeaturedMedia featuredImage={project?.bannerImage} />
                      </div>
                    </div>
                  ) : (
                    <p>No image available.</p>
                  )}
                </div>
                <div className="detail_img_grid">
                  <div className="upload_item">
                    <label>Featured Image</label>
                    <input
                      type="file"
                      name="featuredImage"
                      onChange={handleChangeFeaturedImage}
                      ref={featuredImageRef}
                    />
                  </div>
                  <div className="detail_img_grid">
                    {project?.featuredImage ? (
                      <div className="detail_img_item">
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
            </div>
            <div className="form-group">
              <div className="detail_banner_wrap">
                <div className="detail_img_grid">
                  <div className="upload_item">
                    <label>Project Logo</label>

                    <input
                      type="file"
                      name="bannerImage"
                      onChange={handleChangeProjectLogo}
                      ref={bannerImageRef}
                    />
                  </div>
                  {project?.projectLogo ? (
                    <div className="detail_img_item">
                      <div className="bg-[black] px-5 py-5 rounded-md">
                        <FeaturedMedia featuredImage={project?.projectLogo} />
                      </div>
                    </div>
                  ) : (
                    <p>No image available.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="update_btn_wrap">
              {loadingStatus === "INITIAL" && (
                <button className="update_btn" type="submit">
                  Update Project
                </button>
              )}
              {loadingStatus === "LOADING" && (
                <button type="button" disabled className="update_btn">
                  LOADING <i className="fa-solid fa-spinner animate-spin"></i>
                </button>
              )}
              {loadingStatus === "SUCCESS" && (
                <button className="update_btn" type="submit">
                  Uploaded <i className="fa-solid fa-check"></i>
                </button>
              )}
              {loadingStatus === "FAILED" && (
                <button className="update_btn" type="submit">
                  FAILED, Try again
                </button>
              )}
            </div>
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
            {error && <p className="error-message">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProject;
