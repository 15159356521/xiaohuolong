import request from "../utils/request";
// 获取待审核列表
export function getAllList(data) {
  return request({
    url: "/tdb/index/a/tdb.Thcshop/b/index",
    method: "post",
    data,
  });
}
export const getUp = (id) => {
  return request({
    url: `/tdb/index/a/tdb.Thcshop/b/beaudittoaudit?id=${id}`,
  });
};
export const getEdi = (id) => {

    return request({
      url: `/tdb/index/a/tdb.Thcshopbranch/b/edit?id=${id}`,
      method: "get",

  });
};

export const PostUp = (id, data) => {
  return request({
    url: `/tdb/index/a/tdb.Thcshop/b/beaudittoaudit?id=${id}`,
    method: "post",
    data,
  });
};
// 待签约
export function getSignAll(data) {
    return request({
      url: "/tdb/index/a/tdb.Thcshopbranch/b/besigntosign",
      method: "post",
      data,
    });
  }
  
  export const getSignUp = (id, data) => {
    return request({
      url: `/tdb/index/a/tdb.Thcshop/b/besigntosign?id=${id}`,
      method: "get",
   
    });
  };
  export const PostSignUp = (id, data) => {
      return request({
          url: `/tdb/index/a/tdb.Thcshop/b/besigntosign?${id}`,
          method: 'post',
          data
      })
  }
//   待培训
  
  export const PostTrainUp = (id, data) => {
    return request({
      url: `/tdb/index/a/tdb.Thcshop/b/betrainapprove?id=${id}`,
      method: "post",
      data
    });
  };
  export const GetTrainUp = (id) => {
    return request({
      url: `/tdb/index/a/tdb.Thcshop/b/betrainapprove?id=${id}`,
      method: "get",
      
    });
  };
// 待绑定
  

  export const getBindUp = (id) => {
    return request({
      url: `/tdb/index/a/tdb.Thcshopbranch/b/bebinding?id=${id}`,
      method: "get",
   
    });
  };
  export const PostBindUp = (id, data) => {
      return request({
          url: `/tdb/index/a/tdb.Thcshopbranch/b/bebinding?id=${id}`,
          method: 'post',
          data
      })
  }
//   待解绑
  export const DelBindUp = (id) => {
    return request({
      url: `/tdb/index/a/tdb.Thcshopbranch/b/beunbind?id=${id}`,
      method: "post",
   
    });
  }
//   回退
    export const PostBackUp = (id) => {
        return request({
            url: `/tdb/index/a/tdb.Thcshop/b/editbeaudit?id=${id}`,
            method: 'post',
          
        })
    }
    export const getBackUp = (id) => {
      return request({
          url: `/tdb/index/a/tdb.Thcshop/b/editbeaudit?id=${id}`,
          method: 'get',
        
      })
  }
