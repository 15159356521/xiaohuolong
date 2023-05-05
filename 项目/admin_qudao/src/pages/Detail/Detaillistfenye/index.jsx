import { Card, Form, Table, Image } from "antd";
import React, { useEffect, useState } from "react";
import { StoreShopbranchselApi } from "../../../utils/api";
import { useParams } from "react-router-dom";

export default function Detaillistfenye() {
  let params = useParams();
  console.log(params.id);
  let id = params.id;
  const [data, setData] = useState();
  const [dataimg, setDataimg] = useState({
    operator_card_photo: [],
    shop_images: [],
  });
  useEffect(() => {
    StoreShopbranchselApi({ id }).then((res) => {
      console.log("=====================", res.data.data);
      // console.log("==============", res.data.data[0].shop_images);
      let arr = res.data.data[0].shop_images.split(",");
      let arr1 = res.data.data[0].operator_card_photo.split(",");
      console.log(arr);
      setData(res.data.data);
      setDataimg((preState) => ({
        ...preState,
        operator_card_photo: arr1,
        shop_images: arr,
      }));
    });
  }, []);

  const columns = [
    {
      title: "营业开始时间",
      key: "start_time",
      dataIndex: "start_time",
    },
    {
      title: "营业结束时间",
      key: "end_time",
      dataIndex: "end_time",
    },
    {
      title: "基础人流量",
      key: "base_flow_rate",
      dataIndex: "base_flow_rate",
    },
    {
      title: "店员人数",
      key: "employee_num",
      dataIndex: "employee_num",
    },
    {
      title: "店家累计总收益",
      key: "total_earnings",
      dataIndex: "total_earnings",
    },

    {
      title: "开业时间",
      key: "opening_date",
      dataIndex: "opening_date",
    },
    {
      title: "备注",
      key: "remark",
      dataIndex: "remark",
    },
  ];

  return (
    <div>
      <Card>
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item label="操作人员照照片">
            <Image
              width={200}
              height={200}
              src={dataimg.operator_card_photo[0]}
              alt="营业执照"
            />
            <Image
              width={200}
              height={200}
              src={dataimg.operator_card_photo[1]}
              alt="营业执照"
            />
          </Form.Item>

          <Form.Item label="分店内照片">
            <Image
              width={200}
              height={200}
              src={dataimg.shop_images[0]}
              alt="店内照片"
            />

            <Image
              width={200}
              height={200}
              src={dataimg.shop_images[1]}
              alt="店内照片"
            />
            <Image
              width={200}
              height={200}
              src={dataimg.shop_images[2]}
              alt="店内照片"
            />
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <Table dataSource={data} columns={columns} />
      </Card>
    </div>
  );
}
