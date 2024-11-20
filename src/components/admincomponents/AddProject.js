import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import DesktopImagesInputField from "./add-projects/DesktopImagesInputField";
import DynamicInputField from "./add-projects/DynamicInputField";
import { BACKEND_SERVER_ADDRESS } from "../../data/variables/variables-1";

function AddNewProject() {
  const navigate = useNavigate();
  const [fetchStatus, setFetchStatus] = useState("INITIAL");
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    whatWeDo: "",
    brandDirection: "",
    images: null,
    featuredImage: null,
    bannerImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files : value, // Set files if they exist, otherwise set value
    }));
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("whatWeDo", formData.whatWeDo);
    data.append("brandDirection", formData.brandDirection);

    // Handle multiple file uploads for images
    if (formData.images) {
      for (let i = 0; i < formData.images.length; i++) {
        data.append("images", formData.images[i]);
      }
    }
    // Single file upload for featured image
    if (formData.featuredImage) {
      data.append("featuredImage", formData.featuredImage[0]);
    }
    // Single file upload for banner image
    if (formData.bannerImage) {
      data.append("bannerImage", formData.bannerImage[0]);
    }

    try {
      const response = await axios.post(
        `${config.BASE_URL}/api/admin/add-project`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const token = localStorage.getItem("token");
        if (token) {
          navigate("/admin/dashboard");
        } else {
          navigate("/admin/login");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add project");
    }
  };
  const handleAddProject2 = (e) => {
    e.preventDefault();
    setFetchStatus("LOADING");
    const formData = new FormData(e.currentTarget);
    axios
      .post(`${BACKEND_SERVER_ADDRESS}/api/admin/add-project/v2`, formData)
      .then((response) => {
        console.log(response);
        setFetchStatus("SUCCESS");
      })
      .catch((error) => {
        console.log(error);
        setFetchStatus("FAILED");
      });
  };

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="dash_title">Dashboard</h1>
        <div className="main-section">
          <div className="back_btn_wrap">
            <button className="back-btn" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
          {/* <div className="main-inner add_project_main">
            <form onSubmit={handleAddProject} encType="multipart/form-data">
              <div className="form-login">
                <div className="add_field">
                  <h2>Project Title</h2>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="add_field">
                  <h2>Project Description</h2>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="add_field">
                  <h2>What we do</h2>
                  <input
                    type="text"
                    name="whatWeDo"
                    value={formData.whatWeDo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="add_field">
                  <h2>Brand Direction</h2>
                  <input
                    type="text"
                    name="brandDirection"
                    value={formData.brandDirection}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="add_field">
                  <h2>Gallery Images</h2>
                  <div className="form-group">
                    <div className="file-upload">
                      <input
                        type="file"
                        className="form-control"
                        name="images"
                        multiple
                        onChange={handleInputChange}
                        required
                      />
                      <i className="fa fa-camera i-pic-upload"></i>
                    </div>
                  </div>
                </div>
                <div className="add_field">
                  <h2>Banner Image</h2>
                  <div className="form-group">
                    <div className="file-upload">
                      <input
                        type="file"
                        className="form-control"
                        name="bannerImage"
                        onChange={handleInputChange}
                        required
                      />
                      <i className="fa fa-camera i-pic-upload"></i>
                    </div>
                  </div>
                </div>
                <div className="add_field">
                  <h2>Featured Image</h2>
                  <div className="form-group">
                    <div className="file-upload">
                      <input
                        type="file"
                        className="form-control"
                        name="featuredImage"
                        onChange={handleInputChange}
                        required
                      />
                      <i className="fa fa-camera i-pic-upload"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="add_project">
                <button type="submit">Add Project</button>
              </div>
            </form>
            {error && <p className="error-message">{error}</p>}
          </div> */}
          <div className="mt-10">
            <form onSubmit={handleAddProject2}>
              <div className="bg-[#1F2937] px-10 py-10 rounded-lg flex flex-col gap-10">
                <div className="add_field">
                  <h2>Project Title</h2>
                  <input type="text" name="projectTitle" required />
                </div>
                <div className="add_field">
                  <h2>Project Description</h2>
                  <textarea
                    name="projectDescription"
                    className="w-full h-[10rem] rounded text-[black] text-sm px-3 py-3"
                    required
                  ></textarea>
                </div>
                <DynamicInputField
                  title={"What Do We Do"}
                  name="work"
                  inputType="text"
                  addAnotherButtonName="Add Another Work"
                />
                <div className="add_field">
                  <h2>Brand Direction</h2>
                  <input type="text" name="brandDirection" required />
                </div>
                <div className="add_field">
                  <h2>Banner Image</h2>
                  <div className="flex flex-col gap-5">
                    <div>
                      <input type="file" name="bannerImage" required />
                    </div>
                  </div>
                </div>
                <div className="add_field">
                  <h2>Featured Image</h2>
                  <div className="flex flex-col gap-5">
                    <div>
                      <input type="file" name="featuredImage" required />
                    </div>
                  </div>
                </div>
                <div className="add_field">
                  <h2>Gallery Images</h2>
                  <div className="flex flex-col gap-5">
                    <div>
                      <input type="file" name="galleryImage1" required />
                    </div>
                    <div>
                      <input type="file" name="galleryImage2" required />
                    </div>
                    <div>
                      <input type="file" name="galleryImage3" required />
                    </div>
                    <div>
                      <input type="file" name="galleryImage4" required />
                    </div>{" "}
                  </div>
                </div>
                <div className="add_field">
                  <h2>Project Logo</h2>
                  <input type="file" name="projectLogo" required />
                </div>

                <div className="add_field">
                  <h2>Design Intro</h2>
                  <input type="text" name="designIntro" required />
                </div>
                <div className="add_field">
                  <h2>Design Title</h2>
                  <input type="text" name="designTitle" required />
                </div>
                <div className="add_field">
                  <h2>Design Description</h2>
                  <textarea
                    name="designDescription"
                    className="w-full h-[10rem] rounded text-[black] text-sm px-3 py-3"
                  />
                </div>
                <DynamicInputField
                  title="Desktop Images"
                  name="desktopImage"
                  inputType="file"
                  addAnotherButtonName="Add Another Image"
                />
                <DynamicInputField
                  title="Mobile Images"
                  name="mobileImage"
                  inputType="file"
                  addAnotherButtonName="Add Another Image"
                />

                <div>
                  {fetchStatus === "INITIAL" && (
                    <button
                      type="submit"
                      className=" text-[black] w-full bg-[lawngreen] py-5 font-bold rounded-md"
                    >
                      Add Project
                    </button>
                  )}
                  {fetchStatus === "LOADING" && (
                    <button
                      type="button"
                      disabled
                      className=" text-[black] w-full bg-[lawngreen] py-5 font-bold rounded-md"
                    >
                      Loading <i class="fa-solid fa-spinner animate-spin"></i>
                    </button>
                  )}
                  {fetchStatus === "SUCCESS" && (
                    <button
                      type="button"
                      disabled
                      className=" text-[black] w-full bg-[lawngreen] py-5 font-bold rounded-md"
                    >
                      Project Added <i class="fa-solid fa-check"></i>
                    </button>
                  )}
                  {fetchStatus === "FAILED" && (
                    <button
                      type="submit"
                      className=" text-[black] w-full bg-[lawngreen] py-5 font-bold rounded-md"
                    >
                      Failed , try again !
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewProject;
