import { Button, Form, DatePicker, Table, Pagination, Card } from "antd";
import React, { useState, useEffect } from "react";
import { StoredeviceselApi } from "../../../utils/api";
import { getstore_id } from "../../../utils/store_id";
import ExportJsonExcel from "js-export-excel";
const Device = (props) => {
  // const { data1 } = props;
  const store_id = getstore_id();
  const [dateStringdata, setDateStringdata] = useState("");
  const [data, setData] = useState([]);
  const [paginationPramas, setPaginationPramas] = useState({
    page: 1, //当前页码
  limit:10, // 每页数据条数
    total: 0, // 总条数
  });
  const handlePageChange = (page, limit) => {
    console.log(page, limit);
    setPaginationPramas((preState) => ({ ...preState, page, limit }));
    // getAllList({
    //   page: page,
    //   limit: limit,
    //  ...search,
    // }).then((res) => {
    //  console.log(res.data);
    //   if (res.data.code == 200) {
    //     setTableData(res.data.data);
    //     setPaginationPramas((preState) => ({
    //       ...preState,
    //       total: res.data.count,
    //     }));
    //   }
    // });

  };
  const onChange = (_, dateString) => {
    console.log(dateString);
    setDateStringdata(dateString);
  };
  const onFinish = () => {
    console.log(dateStringdata);
    StoredeviceselApi({ store_id, times: dateStringdata }).then((res) => {
      let arr = Object.values(res.data.data);
      console.log(arr);
      setData(arr);
    });
  };
  useEffect(() => {
    StoredeviceselApi({ store_id }).then((res) => {
      let arr = Object.values(res.data.data);
      console.log(arr);
      setData(arr);
    });
  }, [store_id]);

  const columns = [
    {
      title: "设备码",
      dataIndex: "device_code",
      key: "device_code",
    },
    {
      title: "店家名称",
      dataIndex: "shop_name",
      key: "shop_name",
    },
    {
      title: "店家住址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "开机次数",
      dataIndex: "num",
      key: "num",
    },
    {
      title: "开机时长",
      dataIndex: "minute",
      key: "minute",
    },
    {
      title: "设备收益",
      dataIndex: "money",
      key: "money",
    },
  ];

  // const handleExportCurrentExcel = (data) => {
  //   console.log(data);
  //   let sheetFilter = [
  //     "device_code",
  //     "shop_name",
  //     "address",
  //     "minute",
  //     "money",
  //     "num",
  //   ];
  //   let option = {};
  //   option.fileName = "本月设备数据";
  //   option.datas = [
  //     {
  //       sheetData: data,
  //       sheetName: "本月设备数据",
  //       sheetFilter: sheetFilter,
  //       sheetHeader: [
  //         "设备码",
  //         "所属店家",
  //         "店家住址",
  //         "开机次数",
  //         "开机时长",
  //         "设备收益",
  //       ],
  //       columnWidths: [10, 10, 10, 10, 10, 10],
  //     },
  //   ];
  //   let toExcel = new ExportJsonExcel(option); //new
  //   toExcel.saveExcel(); //保存
  // };
  return (
    <div>
      <div>
        <Card>
          <Form name="horizontal_login" layout="inline" onFinish={onFinish}>
            <Form.Item name="time">
              <DatePicker onChange={onChange} picker="month" />
            </Form.Item>
            <Form.Item shouldUpdate>
              <Button type="primary" htmlType="submit">
                查询
              </Button>{" "}
            </Form.Item>
            {/* <Button type="primary" onClick={handleExportCurrentExcel}>
              导出数据表
            </Button> */}
          </Form>
        </Card>
      </div>
      <div>
        <Card>
          <Table dataSource={data }  scroll={{ x:1200 }} columns={columns} pagination={{  hideOnSinglePage: false,
              showSizeChanger: true,total:paginationPramas.total,pageSize:paginationPramas.limit,current:paginationPramas.page,onChange:(page,pageSize)=>{
              handlePageChange(page,pageSize)
            }}}/>
          
        </Card>
      </div>
    </div>
  );
};
export default Device;
