import ajax from "./ajax";

// 验证登录操作
export const reqLogin = (queryInfo) => ajax("/login", queryInfo, "POST");

// 获取商品分类列表
export const reqCategory = (parentId) =>
  ajax("/manage/category/list", { parentId });

// 更新商品类别名称
export const reqUpdateCate = (queryInfo) =>
  ajax("/manage/category/update", queryInfo, "POST");

// 添加商品类别
export const reqAddCate = (queryInfo) =>
  ajax("/manage/category/add", queryInfo, "POST");

// 获取商品分页列表
export const reqProductList = (queryInfo) =>
  ajax("/manage/product/list", queryInfo);

// 根据名称/描述鬼区商品分页信息
export const reqSearchProduct = (queryInfo) =>
  ajax("/manage/product/search", queryInfo);

// 对商品进行上架 / 下架处理
export const reqUpdateStatus = (productId, status) =>
  ajax("/manage/product/updateStatus", { productId, status }, "POST");

// 根据分类ID获取分类
export const reqProductName = (categoryId) =>
  ajax("/manage/category/info", { categoryId });

// 删除图片
export const reqDeleteImg = (name) =>
  ajax("/manage/img/delete", { name }, "POST");

// 添加和更新商品
export const reqAddUpdate = (product) =>
  ajax("/manage/product/" + (product._id ? "update" : "add"), product, "POST");

// 获取角色列表
export const reqRoleList = () => ajax("/manage/role/list");

// 添加角色
export const reqAddRole = (roleName) =>
  ajax("/manage/role/add", { roleName }, "POST");

// 更新角色(给角色设置权限)
export const reqUpdateRoleAuth = (queryInfo) =>
  ajax("/manage/role/update", queryInfo, "POST");
