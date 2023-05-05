import { message } from "antd"

// 生成列表的方法
export function tranListToTreeDate(list, rootValue) {
    let arr = []
    list.forEach(item => {
        if(item.pid === rootValue) {
            const children = tranListToTreeDate(list, item.id)
            if(children.length) {
                item.children = children
            }
            arr.push(item)
        }
    })

    return arr
}

// base64
export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
});

//  
export const mapTree = org => {
    const haveChildren = Array.isArray(org.children) && org.children.length > 0;
    return {
        ...org,
        key: org.id+'',
        children:haveChildren ? org.children.map(i => mapTree(i)) : [],
     }
};

export const getTree = org => {
    const haveChildren = Array.isArray(org.children) && org.children.length > 0;
    console.log("🚀 ~ file: index.js ~ line 42 ~ getTree ~ haveChildren", haveChildren)
    return {
        ...org,
        key: org.id+'',
        value: org.value,
        label: org.id,
        children:haveChildren ? org.children.map(i => mapTree(i)) : [],
     }
};

export const  getParentIds = (id, data) => {
    // 深度遍历查找
    function dfs(data, id, parents) {
      for(var i = 0;i<data.length;i++) {
        var item = data[i];
        // 找到id则返回父级id
        if(item.id === id) return parents;
        // children不存在或为空则不递归
        if(!item.children || !item.children.length) continue;
        // 往下查找时将当前id入栈
        parents.push(item.id);
        
        if(dfs(item.children, id, parents).length ) return parents;
        // 深度遍历查找未找到时当前id 出栈
        parents.pop()
      }
      // 未找到时返回空数组
      return [];
    }
    
    return dfs(data, id, []);
}


