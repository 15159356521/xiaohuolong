import request from "./request";

// 登录模块
export const LoginApi = (params) =>
  request.post("/Home/login", params);

// 退出模块
export const Logout = () =>
  request.post(" /Home/logout");

// 上传图片
export const UploadApi = () =>
  request.post(
    " /common.Upload/uploadImage"
  );

// 个人信息模块
export const PersonalApi = (params) =>
  request.post(
    " /service.Servicec/personal",
    params
  );

// 修改密码
export const PasswordApi = (params) =>
  request.post(
    "/service.Servicec/setpwed",
    params
  );

//店家列表
export const StorelistApi = (params) =>
  request.post(
    " /shop.Shopc/sel",
    params
  );

// 店家报表
export const StoreReportApi = (params) =>
  request.post(
    "/shop.Shopc/statement",
    params
  );

// 设备列表
export const StoreDevicecApi = (params) =>
  request.post(
    " /device.Devicec/sel",
    params
  );

// 提现记录
export const StoreWithdrawcApi = (params) =>
  request.post(
    " /record.Withdrawc/sel",
    params
  );

// 银行卡管理
export const StoreBankCardwApi = (params) =>
  request.post(
    " /bank.Bankc/add",
    params
  );

// 收益记录
export const StoreDeviceStartcApi = (params) =>
  request.post(
    " /device.DeviceStartc/sel",
    params
  );

// 充值记录
export const StoreMinuteChangecApi = (params) =>
  request.post(
    " /record.MinuteChangec/sel",
    params
  );

//我的会员
export const StoreCustomercApi = (params) =>
  request.post(
    "/customer.Customerc/sel",
    params
  );

//充值分钟
export const StoreCustomercaddApi = (params) =>
  request.post(
    " /customer.Customerc/add",
    params
  );

//充值记录
export const StorerecordApi = (params) =>
  request.post(
    " /record.MinuteChangec/sel",
    params
  );

// 剩余分钟
export const StoreSelminApi = (params) =>
  request.post(
    " /customer.Customerc/selmin",
    params
  );

//主页
export const StoreHomeApi = (params) =>
  request.post(
    " /record.Home/index",
    params
  );

// 银行卡查询
export const StoreBankCardmApi = (params) =>
  request.post(
    " /record.Withdrawc/withdrawsel",
    params
  );

// 添加分组列表
export const StoreShopcgroupApi = (params) =>
  request.post(
    "/shop.Shopc/group",
    params
  );

// 店家报表
export const StoredeviceselApi = (params) =>
  request.post(
    " /device.Devicec/devicesel",
    params
  );

// 店家详情页
export const StoreshopselApi = (params) =>
  request.post(
    "/shop.Shopc/shopsel",
    params
  );

// 店家详情页表格
export const StoreShopbranchApi = (params) =>
  request.post(
    "/shop.Shopc/shopbranch",
    params
  );

// 店家详情页查看详情
export const StoreShopbranchselApi = (params) =>
  request.post(
    "/shop.Shopc/shopbranchsel",
    params
  );

// 店家分组上传数据给后端
export const StoregrouplistApi = (params) =>
  request.post(
    "/shop.ShopGroupc/grouplist",
    params
  );

// 分组列表查询
export const StoregroupselApi = (params) =>
  request.post(
    "/shop.ShopGroupc/sel",
    params
  );

// 分组列表编辑
export const StoregroupcompileApi = (params) =>
  request.post(
    "/shop.ShopGroupc/compile",
    params
  );

// 分组列表删除
export const StoregroupdelApi = (params) =>
  request.post(
    "/shop.ShopGroupc/del",
    params
  );

// 分组列表查看详情
export const StoreselgroupApi = (params) =>
  request.post(
    "/shop.ShopGroupc/selgroup",
    params
  );

// 设备分组
export const StoregroupDevicecApi = (params) =>
  request.post(
    "/device.Devicec/device",
    params
  );

// 设备分组列表
export const StoregroupdeviceselectApi = (params) =>
  request.post(
    "/device.Devicec/deviceselect",
    params
  );

// 设备分组列表详情
export const StoregrouplistxqApi = (params) =>
  request.post(
    "/device.Devicec/devsel",
    params
  );

// 设备分组列表详情删除
export const StoregrouplistxqdelApi = (params) =>
  request.post(
    "/device.Devicec/del",
    params
  );

// 注册
export const StoreregisterApi = (params) =>
  request.post(
    "/Home/register",
    params
  );
//  审核中店家
export const StorelistshopbrachApi = (params) =>
  request.post(" /shop.Shopc/shopbrach", params);


// 提现记录银行卡管理
export const StorelistshopbrachselApi = (params) =>
  request.post(" /bank.Bankc/sel", params);

//设备分组查看详情
export const StoregroupselselApi = (params) =>
  request.post("/device.Devicec/groupsel", params);

// 店家分组列表单个删除
export const StoregroupdeleteApi = (params) =>
  request.post("/shop.ShopGroupc/delete", params);

// 店家分组添加分组
export const StoregroupadddevApi = (params) =>
  request.post("/shop.ShopGroupc/adddev", params);



// 设备列表 添加设备分组
export const StoreaddgroupApi = (params) =>
  request.post("/device.DeviceGroupc/addgroup", params);

// 设备列表 设备分组查询
export const StoreselectgroupApi = (params) =>
  request.post("/device.DeviceGroupc/selectgroup", params);

// 设备列表 分组列表
export const StoredelgroupApi = (params) =>
  request.post("/device.DeviceGroupc/delgroup", params);

// 设备列表 分组列表编辑分组名称
export const StoreupdategroupApi = (params) =>
  request.post("/device.DeviceGroupc/updategroup", params);

// 设备分组 分组下拉的选择
export const StoregroupseltitleApi = (params) =>
  request.post("/device.DeviceGroupc/group", params);


// 分组列表添加
export const StoretitleaddgroupApi = (params) =>
  request.post("/shop.ShopGroupc/addgroup", params);

//  分组查询
export const StoreselectgroupstoreApi = (params) =>
  request.post("/shop.ShopGroupc/selectgroup", params);

// 分组删除
export const StoregroupdelgroupApi = (params) =>
  request.post("/shop.ShopGroupc/delgroup", params);

// 分组编辑
export const StoregroupupdategroupApi = (params) =>
  request.post("/shop.ShopGroupc/updategroup", params);

// 店家列表下拉
export const StoreegroupselstoreApi = (params) =>
  request.post("/shop.ShopGroupc/group", params);
