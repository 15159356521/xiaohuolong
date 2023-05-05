import { Card, Space } from "antd";
import React, { useEffect, useState } from "react";
// import  {getstore_id}  from "@/utils/store_id";
import styles from './index.module.scss'
import {  getAllList, } from "../../api/home";

// const store_id = getstore_id();
const Index = () => {
  const [homedata, setHomedata] = useState({

  });

  useEffect(() => {
 
     getAllList().then((res) => {
      console.log(res.data);
      setHomedata(res.data.data);
    });

   

  }, []);
  return (
    <div>
      <div style={{ marginRight: "20px" } }  className={styles.root}>
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <Card title="会员数据" bordered={false}>
            <Card.Grid className="gridStyle">
              <p>总会员人数</p>
              <div>{homedata.member_num}</div>
            </Card.Grid>
            <Card.Grid className="gridStyle">
              <p>龙垚会员</p>
              <div>{homedata.long_member}</div>
            </Card.Grid>
            {/* <Card.Grid className="gridStyle">
              <p>影视会员</p>
              <div>10</div>
            </Card.Grid> */}
            <Card.Grid className="gridStyle">
              <p>商城会员</p>
              <div>{homedata.shop_member}</div>
            </Card.Grid>
          </Card>

          <Card
            title="龙垚健康"
            bordered={false}
            // onClick={() => { 
            //   navigate("/tdb/index/a/tdb.Thcshopbranch/b/beauditindex");
            // }}
          >
            <Card.Grid className="gridStyle">
              <p>本月收益</p>
              <div>{homedata.month_my_money}</div>
            </Card.Grid>
            <Card.Grid className="gridStyle">
              <p>本月开机次数</p>
              <div>{homedata.month_device_num}</div>
            </Card.Grid>
            <Card.Grid className="gridStyle">
              <p>店家情况</p>
              <div>{homedata.shop}家</div>
            </Card.Grid>
            <Card.Grid className="gridStyle">
              <p>服务商情况</p>
              <div>{homedata.bussiness}家</div>
            </Card.Grid>
          </Card>
          <Card
            title="商城数据"
            bordered={false}
            // onClick={() => {
            //   navigate("/Management/storelist");
            // }}
          >
            <Card.Grid className="gridStyle">
              <p>历史我的收益</p>
              <div>{homedata.history_month}元</div>
            </Card.Grid>
            <Card.Grid className="gridStyle">
              <p>历史订单数据</p>
              <div>{homedata.order_num}单</div>
            </Card.Grid>
            <Card.Grid className="gridStyle">
              <p>本月收益</p>
              <div>{homedata.shop_month}元</div>
            </Card.Grid>
            <Card.Grid className="gridStyle">
              <p>本月订单数据</p>
              <div>{homedata.shoporder_num}单</div>
            </Card.Grid>
          </Card>
          {/* <Card title="视频数据" bordered={false}>
            <Card.Grid className="gridStyle">
              <p>版权数据</p>
              <div>900家</div>
            </Card.Grid>
            <Card.Grid className="gridStyle">
              <p>历史收益</p>
              <div>4000元</div>
            </Card.Grid>
            <Card.Grid className="gridStyle">
              <p>本月收益</p>
              <div>70元</div>
            </Card.Grid>
            <Card.Grid className="gridStyle">
              <p>本月播放量</p>
              <div>6000次</div>
            </Card.Grid>
            {/* <Card.Grid className="gridStyle">
              <p>金额(不包含本月收益)</p>
              <div>{homedata.money}</div>
              <Button
                type="primary"
                danger
                onClick={() => {
                  navigate("/Operation/withdrawals");
                }}
              >
                提现
              </Button>
            </Card.Grid> */}
          {/* </Card> */} 
        </Space>
      </div>
    </div>
  );
};
export default Index;
