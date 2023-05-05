import React, { useEffect, useState } from "react";
import { Card, Table, Tabs, Image, Tag, DatePicker, Form, Button } from "antd";
import { StoreWithdrawcApi } from "../../../utils/api";
import { getstore_id } from "../../../utils/store_id";
import BankCardw from "../../../components/BankCardw";
import BankCardm from "../../../components/BankCardm";
const { Column } = Table;
const store_id = getstore_id();
export default function Withdrawals() {
  // 银行卡提现记录
  const [data, setData] = useState();
  useEffect(() => {
    StoreWithdrawcApi({ store_id }).then((res) => {
      setData(res.data.data);
      console.log(res.data);
    });
  }, []);
  const [dateStringdata, setDateStringdata] = useState("");
  const onChangetime = (_, dateString) => {
    setDateStringdata(dateString);
  };
  const onFinish = () => {
    StoreWithdrawcApi({
      store_id,
      time: dateStringdata,
    }).then((res) => {
      setData(res.data.data);
    });
  };
  // 银行卡管理

  // 银行卡提现
  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        // onChange={onChangeKey}
        items={[
          {
            label: `银行卡提现`,
            key: "1",
            children: <BankCardm />,
          },
          {
            label: `银行卡管理`,
            key: "2",
            children: <BankCardw />,
          },
          {
            label: `提现记录`,
            key: "3",
            children: (
              <>
                <Card>
                  <Form
                    name="horizontal_login"
                    layout="inline"
                    onFinish={onFinish}
                    style={{
                      width:0
                    }}
                  >
                    <Form.Item>
                      <DatePicker onChange={onChangetime} />
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
                <Card>
                  <Table pagination={false} dataSource={data}   scroll={{ x:1200 }}>
                    {/* <Column dataIndex="id" key="id" title="申请Id"></Column> */}
                    <Column
                      dataIndex="amount"
                      key="amount"
                      title="申请金额"
                    ></Column>

                    <Column
                      dataIndex="bank_fee"
                      key="bank_fee"
                      title="银行卡提现手续费"
                    ></Column>
                    <Column
                      dataIndex="ticket_fee"
                      key="ticket_fee"
                      title="代开发票费用"
                    ></Column>

                    <Column
                      dataIndex="actual_amount"
                      key="actual_amount"
                      title="实际到账金额"
                    ></Column>
                    <Column
                      dataIndex="apply_time"
                      key="apply_time"
                      title="	审核时间"
                    ></Column>
                    <Column
                      dataIndex="finish_time"
                      key="finish_time"
                      title="预计到账时间"
                    ></Column>
                    <Column
                      dataIndex="created_at"
                      key="created_at"
                      title="申请时间"
                    ></Column>
                    <Column
                      dataIndex="remark"
                      key="remark"
                      title="备注"
                    ></Column>
                    <Column
                      // https://l.src.xiaohuolongfujiankeji.com
                      dataIndex=<Image
                        width={60}
                        src={
                          "https://l.src.xiaohuolongfujiankeji.com" + "errimg"
                        }
                      />
                      key="errimg"
                      title="失败原因"
                    ></Column>
                    <Column
                      dataIndex="apply_status"
                      key="apply_status"
                      title="审核状态"
                      render={(_, recode) => (
                        <Tag color="#108ee9">{recode.apply_status}</Tag>
                      )}
                    ></Column>
                  </Table>
                </Card>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
