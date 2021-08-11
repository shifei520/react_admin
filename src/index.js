import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import userInfo from "@/utils/userUtils";
import userStorage from "@/utils/localstorageUtils.js";

// 将localstorage里面的用户信息保存在内存中
userInfo.user = userStorage.getUser();

ReactDOM.render(<App />, document.getElementById("root"));
