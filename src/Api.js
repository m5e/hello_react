import React, { Component } from "react";
import axios from "axios";

class Api extends Component {
  constructor(props) {
    super(props);

    this.state = { value: "" };

    this.searchImagePath = this.searchImagePath.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getTimestamp = this.getTimestamp.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  // タイムスタンプ取得
  // 年のみ下二桁表示
  // 例：2020年6月13日10時30分の場合 ⇒ 2006131030
  getTimestamp() {
    const date = new Date();
    const currentTimeStamp = `${date.getFullYear() % 100}${
      date.getMonth() + 1 > 9 ? date.getMonth() : "0" + (date.getMonth() + 1)
    }${date.getDate() > 9 ? date.getDate() : "0" + date.getDate()}${
      date.getHours() > 9 ? date.getHours() : "0" + date.getHours()
    }${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}`;

    return currentTimeStamp;
  }

  /**
   * 特定の画像ファイルパスをもとにその画像が所属するClassを返却するAPIにリクエストを投げます。\
   * そして、そのレスポンスをDBに保存する処理を行うメソッドです。
   *
   * チェックアウト直後のソースは本番用の実装になっており、動作確認を行う際には事前準備として下記操作が必要になります。\
   * 1. 64 行目をコメントアウトし、65 行目のコメントアウトを外す (動作確認用のAPIのURLに変更)\
   * 2. レスポンスが成功していた場合と失敗していた場合でコメントアウトのつけ外しを行う。\
   * 　 * レスポンスが成功していた場合の処理を確認する場合\
   *      ⇒ 86 ~ 93 行目のコメントアウトを外す。\
   *         78 ~ 83 行目をコメントアウトする。
   *
   *   * レスポンスが失敗していた場合の処理を確認する場合\
   *      ⇒ 78 ~ 83 行目のコメントアウトを外す。\
   *         86 ~ 93 行目をコメントアウトする。
   */
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
      reqestTimeStamp = this.getTimestamp();

      // 画像ファイルの所属有無を検索するAPIの実行
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

          // リクエストが失敗していた場合のレスポンス
          // result = {
          //   image_path: this.state.value,
          //   success: false,
          //   message: "Error:E50012",
          //   estimated_data: {},
          // };

          // リクエストが成功していた場合のレスポンス
          // result = {
          //   success: true,
          //   message: "success",
          //   estimated_data: {
          //     class: 3,
          //     confidence: 0.8683,
          //   },
          // };

          // タイムスタンプ取得
          responseTimeStamp = this.getTimestamp();

          const isEstimated_dataChildren =
            Object.keys(result.estimated_data).length > 0;

          const desidedClass = isEstimated_dataChildren
            ? result.estimated_data.class
            : null;
          const desidedConfidence = isEstimated_dataChildren
            ? result.estimated_data.confidence
            : null;

          // レスポンスをDBに保存するAPIの実行
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
