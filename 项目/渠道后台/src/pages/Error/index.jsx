import React from "react";
import { Result, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
export default function Error() {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title=<p style={{ color: "red" }}>404</p>
      subTitle=<p style={{ color: "red" }}>页面走丢了@</p>
      extra={
        // <Link to={"/view"}>
        //   {" "}
        //   <Button type="primary">回到首页</Button>
        // </Link>
        <Button
          type="primary"
          onClick={() => {
            navigate(-1);
          }}
        >
          返回
        </Button>
      }
    />
  );
}
