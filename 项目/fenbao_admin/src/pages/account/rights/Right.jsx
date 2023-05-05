import React from "react";
import styles from "./rights.module.scss";
import chaitiao1 from "../../../assets/chaitiao1.png";
import icons from "../../../assets/step0-failed.png";
import { Steps } from "antd";
const { Step } = Steps;
export default function Right() {
  return (
    <div className={styles.root}>
      <div className="main">
        <div className="main-top">
          <img src={chaitiao1} alt="拆条" />

          <Steps labelPlacement="vertical" className="content-main">
            <Step title="LV.0" icon={<img sizes="10" src={icons} alt="" />} />

            <Step title="LV.1" icon={<img src={icons} alt="" />} />
            <Step title="LV.2" icon={<img src={icons} alt="" />} />
            <Step title="LV.3" icon={<img src={icons} alt="" />} />
          </Steps>
        </div>
      </div>
    </div>
  );
}
