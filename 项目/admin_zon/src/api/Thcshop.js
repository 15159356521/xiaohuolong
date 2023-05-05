import request from "../utils/request";
// 获取用户列表
export function getAllList(data) {
  return request({
    url: "/tdb/index/a/tdb.Thcshop/b/index",
    method: "post",
    data,
  });
}
// 查未审核
export const getUp = (id) => {
  return request({
    url: `/tdb/index/a/tdb.Thcshop/b/info?id=${id}`,
  });
};

// 改
export const getEdi = (id) => {
  return request({
    url: `/tdb/index/a/tdb.Thcshop/b/edit?id=${id}`,
    method: "get",
  
  });
}
export const PostUp = (id, data) => {
  return request({
    url: `/tdb/index/a/tdb.Thcshop/b/edit?id=${id}`,
    method: "post",
    data,
  });
};
// 增
export const PostAdd = (data) => {
  return request({
    url: "/tdb/index/a/tdb.Thcshop/b/add",
    method: "post",
    data,
  });
};
// 解除绑定
export const PostDel = (id) => {
  return request({
    url: `/tdb/index/a/tdb.Thcshop/b/beunbind?id=${id}`,
    method: "post",
  });
};
export const getDel = (id) => {
    return request({
        url: `/tdb/index/a/tdb.Thcshop/b/beunbind?id=${id}`,
        method: 'get'
    })
}
// 修改签约文件
export const PostFile = (id, data) => {
  return request({
    url: `/tdb/index/a/tdb.Thcshop/b/editsign?id=${id}`,
    method: "post",
    data,
  });
}

// 绑定设备
export const getBind = (id,) => {
  return request({
    url: `/tdb/index/a/tdb.Thcshop/b/bebinding?id=${id}`,
    method: "get"
  });
}
export const PostBind = (id, data) => {
  return request({
    url: `/tdb/index/a/tdb.Thcshop/b/bebinding?id=${id}`,
    method: "post",
    data,
  });
}
// 解除绑定
export const DelBindUp = (id,data) => {
  return request({
    url: `/tdb/index/a/tdb.Thcshop/b/beunbind?id=${id}`,
    method: "post",
    data,
  });

}
// 更改套餐
export const getPackage = (id) => {
  return request({
    url: `/tdb/index/a/tdb.Thcshop/b/editpack?id=${id}`,
    method: "get"
  });
}
export const PostUpPackage = (id, data) => {

  return request({
    url: `/tdb/index/a/tdb.Thcshop/b/editpack?id=${id}`,
    method: "post",
    data,
  });
}
// 回退审核
export const PostBack = (id,) => {
  return request({
    url: `/tdb/index/a/tdb.Thcshop/b/editbeaudit?id=${id}`,
    method: "post"
  });
}
// 编辑分店
export const getEditBranch = (id,data) => {
  return request({
    url: `/tdb/index/a/tdb.Thcshopbranch/b/edit?id=${id}`,
    method: "post",
    data,
  });

}
// 添加
export const AddBranch = (id,data) => {
  return request({
    url: `/tdb/index/a/tdb.Thcshopbranch/b/add?shop_id=${id}`,
    method: "post",
    data,
  });

}
// 查看详情
export const getShop = (id,data) => {
  console.log(id,data);
  return request({
      url: `/tdb/index/a/tdb.Thcshop/b/minlog?id=${id}`,
      method: 'post',
      data
  })
}