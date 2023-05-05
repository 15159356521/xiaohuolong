import { Card, Space, Button } from "antd";
import React, { useEffect, useState } from "react";
import { StoreHomeApi } from "../../utils/api";
import { getstore_id } from "../../utils/store_id";
import styles from "./index.module.scss";
import { useNavigate } from "react-router-dom";
const gridStyle = {
  width: "25%",
  textAlign: "center",
};
const store_id = getstore_id();
console.log(store_id);
const View = () => {
  const [homedata, setHomedata] = useState({
    alldec: "",
    daydec: "",
    daymoney: "",
    daynum: "",
    daytime: "",
    hisdec: "",
    hismoney: "",
    hisnum: "",
    histime: "",
    mondec: "",
    money: "",
    monmoney: "",
    monnum: "",
    montime: "",
    shopnum: "",
    times: "",
  });

  useEffect(() => {
    StoreHomeApi({ store_id }).then((res) => {
      console.log("------------------------", res.data.data.times);
      setHomedata(res.data.data);
    });
  }, []);
  const navigate = useNavigate();
  console.log(store_id);
  function shopdataid() {
    if (store_id == 1) {
      return (
        <>
          <p>剩余充值分钟数</p>
          <div>{homedata.shopnum}</div>
        </>
      );
    } else {
      return (
        <>
          <p>店家数量</p>
          <div>{homedata.shopnum}</div>
        </>
      );
    }
  }
  return (
    <div className={styles.root}>
      <div style={{ marginRight: "20px" }}>
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <Card title="今日数据" bordered={false}>
            <Card.Grid style={gridStyle}>
              <p>今日我的收益</p>
              <spa>{homedata.daymoney}</spa>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <p>今日设备收益</p>
              <div>{homedata.daydec}</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <p>今日开机次数</p>
              <div>{homedata.daynum}</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <p>今日累计时长</p>
              <div>{homedata.daytime}</div>
            </Card.Grid>
          </Card>

          <Card
            title="本月数据"
            bordered={false}
            onClick={() => {
              navigate("/Management/storereport");
            }}
          >
            <Card.Grid style={gridStyle}>
              <p>本月开机次数</p>
              <div>{homedata.monnum}</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <p>本月设备收益</p>
              <div>{homedata.mondec}</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <p>本月我的收益</p>
              <div>{homedata.monmoney}</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <p>本月累计开机时长</p>
              <div>{homedata.montime}</div>
            </Card.Grid>
          </Card>
          <Card
            title="历史数据"
            bordered={false}
            onClick={() => {
              navigate("/Management/storelist");
            }}
          >
            <Card.Grid style={gridStyle}>
              <p>历史我的收益</p>
              <div>{homedata.hismoney}</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <p>历史设备收益</p>
              <div>{homedata.hisdec}</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <p>历史开机时长</p>
              <div>{homedata.hisnum}</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <p>历史累计开机时长</p>
              <div>{homedata.histime}</div>
            </Card.Grid>
          </Card>
          <Card title="个人数据" bordered={false}>
            <Card.Grid style={gridStyle}>
              <p>总设备数</p>
              <div>{homedata.alldec}</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              {/* {store_id == 1 ? (
                <>
                  <p>剩余充值分钟数</p>
                  <div>{homedata.shopnum}</div>
                </>
              ) : (
                <>
                  <p>店家数量</p>
                  <div>{homedata.shopnum}</div>
                </>
              )} */}
              {shopdataid()}
            </Card.Grid>
            <Card.Grid style={gridStyle}>
              <p>最后一次提现时间</p>
              <div>{homedata.times}</div>
            </Card.Grid>
            <Card.Grid style={gridStyle}>
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
            </Card.Grid>
          </Card>
        </Space>
      </div>
    </div>
  );
};
export default View;
