import {
  Button,
  Form,
  Input,
  DatePicker,
  Space,
  Table,
  Card,
  Image,
} from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StoreshopselApi } from "../../utils/api";
import { StoreShopbranchApi } from "../../utils/api";
import { StoreShopbranchselApi } from "../../utils/api";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";
import { scryRenderedComponentsWithType } from "react-dom/test-utils";
const { RangePicker } = DatePicker;
const Detail = () => {
  let params = useParams();
  console.log(params.id);
  let id = params.id;
  const onFinish = (values) => {
    console.log(values);
  };

  const [detaildata, setDetaildata] = useState({
    bus_license_phone: "",
    id_card_photo: [],
    address: "",
  });

  useEffect(() => {
    StoreshopselApi({ id }).then((res) => {
      console.log(res.data);
      let arrphone = res.data.data.id_card_photo.split(",");
      // let arrphonearr = [];
      // console.log("-------------------", arrphone.length);
      // for (let i = 0; i < 1; i++) {
      //   arrphonearr.push(arrphone[i]);
      // }
      setDetaildata((preState) => ({
        ...preState,
        bus_license_phone: res.data.data.bus_license_phone,
        id_card_photo: arrphone,
        address: res.data.data.address,
      }));
      // setDetaildata((preState) => ({
      //   ...preState,
      //   bus_license_phone: res.data.data.bus_license_phone,
      //   id_card_photo: res.data.data.id_card_photo,
      //   address: res.data.data.address,
      // }));
    });
  }, [id]);

  useEffect(() => {
    StoreShopbranchApi({ id }).then((res) => {
      console.log("-------------------------", res.data);
      setTabledata(res.data.data);
    });
  }, [id]);

  const [tabledata, setTabledata] = useState();

  const columns = [
    {
      title: "店名",
      dataIndex: "shop_branch_name",
      key: "nashop_branch_nameme",
    },
    {
      title: "分店面积",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "省",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "市",
      dataIndex: "province",
      key: "province",
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "申请时间",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "操作",
      dataIndex: "cz",
      key: "cz",
      render: (_, recode) => (
        <Link to={`/detail/list/${recode.id}`}>
          <Button
            type="link"
            onClick={() => {
              console.log(recode.id);
            }}
          >
            查看详情
          </Button>
        </Link>
      ),
    },
  ];
  return (
    <>
      <Card>
        <Form
          name="nest-messages"
          onFinish={onFinish}
          // layout="inline"
          className={styles.root}
          labelCol={{
            span: 8,
          }}
  
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
   
        >
          <Form.Item label="经营执照">
            <Image
              width={200}
              height={200}
              src={detaildata.bus_license_phone}
            />
          </Form.Item>
          <Form.Item label="身份证">
            <Image
              width={200}
              height={200}
              src={detaildata.id_card_photo[0]}
              alt="身份证正面"
            />
            <Image
              width={200}
              height={200}
              src={detaildata.id_card_photo[1]}
              alt="身份证反面"
            />
          </Form.Item>
        </Form>

        <Table dataSource={tabledata} columns={columns}   scroll={{ x:1200 }}/>
      </Card>
    </>
  );
};
export default Detail;
