import request from "../utils/request"
// export function pubUpVideo() {
//     console.log(5);
//       return post({
//         url: "/sub_admin/common.upload/uploadvideosign",
//       });
//     }
    export const pubUpVideo = () => {
        return request({
            url: "/common.upload/uploadvideosign",
            method: 'post',
 
        })
    }
