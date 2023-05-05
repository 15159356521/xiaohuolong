import React, { useState, useEffect } from "react";
import { getAllKey } from "../../api/yilanuser";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import aa from "../Yilanuser/logo.png";
import axios from "axios";
export default function Indsex() {
  const [tokey, setTokey] = useState("");
  const [upVideoList, setUpVideoList] = useState([]);
  const [videoStatus, setVideoStatus] = useState("+ 上传视频");
  useEffect(() => {
    (async () => {
      const { resData } = await getAllKey(1);
      console.log(upVideoList);
      setTokey(resData.info.token);
    })();
  }, []);
  useEffect(() => {
    console.log(upVideoList);
  }, [upVideoList]);

  let list = [];

  return (
    <div>
      {" "}
      <Upload
        accept="video/*"
        // action={`/openapi/upload/img${tokey}`}
        customRequest={(file) => {
          console.log(file, "file");

          // file.action = "https://data.xiaozhuyouban.com/upload";
          const formData = new FormData();

          // formData.append("filename", "abc");
          // formData.append("platform", 0);
          console.log(tokey);

          axios
            .get(
              `api/upload/video?filename=${file.file.name}&platform=0`,
              // `https://mp.yilan.tv/openapi/upload/video?filename=${file.file.name}&platform=0`,
              {
                headers: { Token: tokey },
              }
            )
            .then((res) => {
              setVideoStatus("上传视 频中");

              //   console.log(res.data.data, "res.data");
              const urImg = res.data.data;
              console.log(urImg, "urImg");
              formData.append("OSSAccessKeyId", urImg.ptk.accessid);
              formData.append("key", urImg.object_key);
              formData.append("callback", urImg.ptk.callback);
              formData.append("dir", urImg.ptk.dir);
              formData.append("expire", urImg.ptk.expire);
              formData.append("policy", urImg.ptk.policy);
              formData.append("signature", urImg.ptk.signature);
              formData.append("file", file.file);

              axios
                .post(`${urImg.ptk.host}`, formData)
                .then((res) => {
                  const imgs = {
                    uid: file.file.uid,
                    name: file.file.name,
                    status: "done",
                    url: `${aa}`,
                    src1: res.data.data.url,
                    src: res.data.data.object_key,
                  };
                  list.push(imgs);
                  console.log(list,2);
                  //   upVideoList.push(imgs);
                     setUpVideoList(list);
                //   setUpVideoList((list) => [...list, res]);
                  setVideoStatus("+ 上传视 频");
                //   return Promise.resolve(imgs);

                })
                .then((res) => {
                //   console.log(res, "res");
                //   //   console.log(imgs, "res.data.data.src");
                //   console.log(list,1);
                //   list.push(res);
                //   console.log(list,2);
                //   //   upVideoList.push(imgs);
                //     // setUpVideoList(list);
                //   setUpVideoList((list) => [...list, res]);
                //   setVideoStatus("+ 上传视 频");
                });
            });
        }}
        listType="picture-card"
        fileList={upVideoList}
        multiple={true}
        onRemove={(file) => {
          setVideoStatus("+ 上传视频");
          setUpVideoList([]);
        }}
      >
        {upVideoList.length < 3 && `${videoStatus}`}
      </Upload>
     
    </div>
  );
}
