const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias,
} = require("customize-cra");
const path = require("path");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: { "@primary-color": "#1DA57A" },
    },
  }),
  addWebpackAlias({
    ["@"]: path.join(__dirname, "./src"),
  })
);
