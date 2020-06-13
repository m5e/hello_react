import React, { Component } from "react";
import axios from "axios";

class Api extends Component {
  constructor(props) {
    super(props);

    this.state = { value: "" };

    this.saveImageSearchResults = this.saveImageSearchResults.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  saveImageSearchResults() {
    if (this.state.value === "") {
      console.log("入力欄が空欄です");
      return;
    } else {
      // 初期化
      let result = {};

      axios
        .post("http://example.com/", {
          params: {
            imagePath: this.state.value,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type",
            },
          },
        })
        .then((res) => {
          console.log("post method success");
          result = res;

          // result = {
          //   success: true,
          //   message: "success",
          //   estimated_data: {
          //     class: 3,
          //     confidence: 0.8683,
          //   },
          // };

          axios
            .get("http://localhost:3001/test", {
              params: {
                image_path: this.state.value,
                success: result.success,
                message: result.message,
                class:
                  result.estimated_data !== {}
                    ? result.estimated_data.class
                    : null,
                confidence:
                  result.estimated_data !== {}
                    ? result.estimated_data.confidence
                    : null,
              },
            })
            .catch((err) => {
              console.log("err", err.response);
            });
        })
        .catch((err) => {
          console.log("post method err", err.response);
          // return;

          // result = {
          //   image_path: this.state.value,
          //   success: false,
          //   message: "Error:E50012",
          //   estimated_data: {},
          // };

          axios
            .get("http://localhost:3001/test", {
              params: {
                image_path: this.state.value,
                success: result.success,
                message: result.message,
                class:
                  result.estimated_data !== {}
                    ? result.estimated_data.class
                    : null,
                confidence:
                  result.estimated_data !== {}
                    ? result.estimated_data.confidence
                    : null,
              },
            })
            .catch((err) => {
              console.log("err", err.response);
            });
        });
    }
  }

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        ></input>
        <button class="" onClick={this.saveImageSearchResults}>
          Click!
        </button>
      </div>
    );
  }
}

export default Api;
