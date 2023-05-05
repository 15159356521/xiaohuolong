import React, { useState, useEffect } from "react";
import styles from "./View.module.scss";
import { useParams, Link } from "react-router-dom";
import Herder from "./../../components/herder/Herder";
import { getTaskDetail } from "../../api/user";
import moment from "moment";
export default function View() {
  const { id } = useParams();
  const [data, setData] = useState({
    bonus: "",
    class: "",
    content: "",
    start_time: "",
    end_time: "",
    title: "",
    publish_time: "",
    duration: "",
    requirement: "",
    label: "",
    impose: "",
    img: "",
  });
  console.log(id);
  const jre = "https://docs.qq.com/doc/DT2VTR1NDeGdzaE5l";
  useEffect(() => {
    (async function () {
      try {
        const res = await getTaskDetail(id);
        // console.log(res);
        setData(res.data);
      }
      catch (err) {
        console.log(err);
      }
    })();
  
   
  
  }, []);
  return (
    <div className={styles.root}>
      <Herder />
      <div className="panel">
        <div className="content">
          <div className="noticecontainer">
            <h2>{data.title}</h2>
            <div className="cont">
              <div className="cent">
                {/* <img src={`http://sub.admin.xiaohuolongkeji.com/${data.img}`} alt="任务封面" /> */}
                <img
                  src={data.img}
                  alt="任务封面"
                />
              </div>
            </div>
            <div dangerouslySetInnerHTML={{__html:data.content}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
