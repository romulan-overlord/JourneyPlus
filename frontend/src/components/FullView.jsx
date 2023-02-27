import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

function FullView(props) {
  const dataIndex = props.compartments.indexOf(props.marker.type);
  const renData = props.compartmentData[dataIndex];
  const mark = props.marker.index;

  const type = props.marker.type;
  const id_name = "#f" + type;

  return (
    <div className="container-fluid full-view-container">
      <CloseIcon
        className="close-full-view"
        fontSize="large"
        sx={{ color: "white" }}
        onClick={props.close}
      />
      <table className="height-100 width-100">
        <tbody>
          <tr>
            <td>
              <div id={"f" + type} className="carousel slide">
                <div className="carousel-indicators">
                  {renData.map((file, index) => {
                    if (index === parseInt(mark))
                      return (
                        <button
                          type="button"
                          data-bs-target={id_name}
                          data-bs-slide-to={index}
                          className="active"
                          key={index}
                        ></button>
                      );
                    return (
                      <button
                        type="button"
                        data-bs-target={id_name}
                        data-bs-slide-to={index}
                        key={index}
                      ></button>
                    );
                  })}
                </div>
                <div className="carousel-inner">
                  {renData.map((file, index) => {
                    if (index === parseInt(mark)) {
                      return (
                        <div
                          className="carousel-item active"
                          key={index}
                          id={"f" + index}
                        >
                          {type === "image" ? (
                            <img
                              src={file}
                              className="d-block full-image"
                              alt="..."
                              id={"f" + index}
                            />
                          ) : (
                            <video className="full-video" controls>
                              <source
                                src={file}
                                type="video/mp4"
                                id={"f" + index}
                              ></source>
                            </video>
                          )}
                        </div>
                      );
                    }
                    return (
                      <div
                        className="carousel-item"
                        key={index}
                        id={"f" + index}
                      >
                        {type === "image" ? (
                          <img
                            src={file}
                            className="d-block full-image"
                            alt="..."
                            id={"f" + index}
                          />
                        ) : (
                          <video className="full-video mx-auto" controls>
                            <source
                              src={file}
                              type="video/mp4"
                              id={"f" + index}
                            ></source>
                          </video>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target={id_name}
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target={id_name}
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default FullView;
