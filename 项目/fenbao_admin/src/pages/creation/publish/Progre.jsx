import React from "react";
import { Progress } from "antd";

export default function Progre(props) {
  const { percent } = props;
//   console.log(percent, "percent");
  return (
    <Progress
      strokeColor={{
        "0%": "#108ee9",
        "100%": "#87d068",
      }}
      percent={percent}
    />
  );
}
