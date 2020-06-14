import React, { Component } from "react";
import axios from "axios";

class Api extends Component {
  constructor(props) {
    super(props);

    this.state = { value: "" };

    this.searchImagePath = this.searchImagePath.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  searchImagePath() {
    let reqestTimeStamp = 0;
    let responseTimeStamp = 0;

    if (this.state.value === "") {
      console.log("入力欄が空欄です");
      return;
    } else {
      // 初期化
      let result = {};

      // タイムスタンプ取得
      // 年のみ下二桁表示
      // 例：2020年6月13日10時30分の場合 ⇒ 2006131030
      const date = new Date();
      reqestTimeStamp = `${date.getFullYear() % 100}${
        date.getMonth() + 1 > 9 ? date.getMonth() : "0" + (date.getMonth() + 1)
      }${date.getDate() > 9 ? date.getDate() : "0" + date.getDate()}${
        date.getHours() > 9 ? date.getHours() : "0" + date.getHours()
      }${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}`;

      axios
        .post("http://example.com/", {
          // .post("http://localhost:3001/test2", {
          params: {
            imagePath: this.state.value,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type",
            },
          },
        })
        .then((res) => {
          result = res;

          //✖
          // result = {
          //   image_path: this.state.value,
          //   success: false,
          //   message: "Error:E50012",
          //   estimated_data: {},
          // };

          //〇
          // result = {
          //   success: true,
          //   message: "success",
          //   estimated_data: {
          //     class: 3,
          //     confidence: 0.8683,
          //   },
          // };

          // タイムスタンプ取得
          // 年のみ下二桁表示
          // 例：2020年6月13日10時30分の場合 ⇒ 2006131030
          const date = new Date();
          responseTimeStamp = `${date.getFullYear() % 100}${
            date.getMonth() + 1 > 9
              ? date.getMonth()
              : "0" + (date.getMonth() + 1)
          }${date.getDate() > 9 ? date.getDate() : "0" + date.getDate()}${
            date.getHours() > 9 ? date.getHours() : "0" + date.getHours()
          }${
            date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()
          }`;

          const isEstimated_dataChildren =
            Object.keys(result.estimated_data).length > 0;

          const desidedClass = isEstimated_dataChildren
            ? result.estimated_data.class
            : null;
          const desidedConfidence = isEstimated_dataChildren
            ? result.estimated_data.confidence
            : null;

          axios
            .get("http://localhost:3001/test", {
              params: {
                image_path: this.state.value,
                success: result.success,
                message: result.message,
                class: desidedClass,
                confidence: desidedConfidence,
                request_timestamp: reqestTimeStamp,
                response_timestamp: responseTimeStamp,
              },
            })
            .catch((err) => {
              console.log("err", err.response);
            });
        })
        .catch((err) => {
          console.log("err", JSON.stringify(err.response));
          return;
        });
    }
  }

  render() {
    return (
      <div>
        <input
          type="text"
          class="inputItem"
          value={this.state.value}
          onChange={this.handleChange}
          placeholder="ここに画像のパスを入力してください"
        ></input>
        <button onClick={this.searchImagePath}>Click Me</button>
      </div>
    );
  }
}

export default Api;
