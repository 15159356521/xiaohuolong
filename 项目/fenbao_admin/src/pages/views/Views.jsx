import React, { useState, useEffect } from "react";
import styles from "./Views.module.scss";
import { useParams, Link } from "react-router-dom";
import Herder from "../../components/herder/Herder";
import { getTaskDetailList } from "../../api/user";
import moment from "moment";
export default function View() {
  const { id } = useParams();
  const [data, setData] = useState({

  });
  console.log(id);
  const jre = "https://docs.qq.com/doc/DT2VTR1NDeGdzaE5l";
  useEffect(() => {
    (async function () {
      try {
        const res = await getTaskDetailList(id);
        console.log(res.data);
        setData(res.data);
      } catch (err) {
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
