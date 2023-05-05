import React, { useEffect, useState } from "react";
import styles from "./Message.module.scss";
import { List } from "antd";
import { getMessage } from "../../../src/api/user";
export default function Message() {
  const [messagedata, setMessagedata] = useState();
  useEffect(() => {
    getMessage()
      .then((res) => {
        console.log(res);
        setMessagedata(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className={styles.root}>
      <List
        style={{ marginLeft: "40px" }}
        itemLayout="horizontal"
        dataSource={messagedata}
        renderItem={(item) => (
          <List.Item>
            <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
            <div style={{ marginRight: "20px", color: "#b2b2b2" }}>
              {item.add_time}{" "}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}
