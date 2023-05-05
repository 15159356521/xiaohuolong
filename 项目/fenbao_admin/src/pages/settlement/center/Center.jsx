
import React from 'react'

import { ProCard } from "@ant-design/pro-components";
import { Statistic, Button } from "antd";
import RcResizeObserver from "rc-resize-observer";
import { useState } from "react";
import styles from "./Center.module.scss";
import { Table } from "antd";
const { Divider } = ProCard;
const { ColumnGroup } = Table;

export default function Center() {
  const [responsive, setResponsive] = useState(false);
  return (
    <div className={styles.main}>
      <div>
        <RcResizeObserver
          // key="resize-observer"
          onResize={(offset) => {
            setResponsive(offset.width < 596);
          }}
        >
          <ProCard.Group title="提现" direction={responsive ? "column" : "row"}>
            <ProCard>
              <Statistic value={79.0} precision={2} />
              <p>可提现金额</p>
              <Button type="primary">提现</Button>
            </ProCard>
            <Divider type={responsive ? "horizontal" : "vertical"} />
            <ProCard>
              <Statistic value={112893.0} precision={2} />
              <p>已提现金额</p>
            </ProCard>
            <Divider type={responsive ? "horizontal" : "vertical"} />
            <ProCard>
              <Statistic value={112893.0} precision={2} />
              <p>总收益</p>
            </ProCard>
          </ProCard.Group>
          <div className="center">
            <ol
              style={{
                // backgroundColor: "#fff",
                textAlign: "left",
              }}
            >
              <li>1.提现要求：成功绑定银行卡，且可提现金额大于 100 元</li>
              <li>
                2.提现时间：每月2日， 3日， 4日（当月开通分成收益需次月提现）
              </li>
              <li>
                {" "}
                3.提现到账：个人用户到账金额为平台代扣代征税的税后金额，企业用户请查看{" "}
                &nbsp;&nbsp;&nbsp;<a href="https://www.baidu.com/">结算说明</a>
              </li>
            </ol>
          </div>
          <ProCard.Group
            title="提现记录"
            direction={responsive ? "column" : "row"}
          >
            <Table>
              <ColumnGroup title="提现日期"></ColumnGroup>
              <ColumnGroup title="金额"></ColumnGroup>
              <ColumnGroup title="结算单"></ColumnGroup>
              <ColumnGroup title="状态"></ColumnGroup>
            </Table>
          </ProCard.Group>
        </RcResizeObserver>
      </div>
    </div>
  );
}
