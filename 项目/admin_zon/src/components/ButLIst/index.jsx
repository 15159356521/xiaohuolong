import React from "react";
import {
    Switch,
    Card,
    Breadcrumb,
    Button,
    Table,
    Space,
    Modal,
    Form,
    message,
    Input,
    Image,
    Select,
    Radio,
    Tag,
  } from "antd";
// function but(value) {
//     setStatus(value + 1);
//     setTableData([]);
//     let up = { page: 1, limit: 10, status: value + 1, shop_branch_name: "" };
//     getAllList(up).then((res) => {
//       setTableData(res.data.data);
//       form.setFieldValue("shop_branch_name", "");
//       setPaginationPramas((preState) => ({
//         ...preState,
//         total: res.data.count,
//       }));
//     });
//   }
  const Btus = (props)=>{
    const {value,setStatus,setTableData,form,setPaginationPramas} = props
    return (
      <div className="filter">
        <Radio.Group
          onChange={(e) => {
            // but(e.target.value);
          }}
          className="filRight"
          defaultValue={0}
          buttonStyle="solid"
        >
          {props.butList.map((item, index) => {
            return (
              <Radio.Button key={index} value={index}>
                {item.value} <span style={{ color: "red" }}>({item.key})</span>
              </Radio.Button>
            );
          })}
        </Radio.Group>
      </div>
    );
  }
  export default Btus;