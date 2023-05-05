import React, { useState, useEffect } from "react";
import styles from "./Watch.module.scss";
import {CommentOutlined } from '@ant-design/icons';
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import Herder from "../../../components/herder/Herder";
export default function View() {
  const { id } = useParams();
  console.log(id);
  return (
    <div className={styles.root}>
      <Herder />
      <div className="panel">
        <div className="video_play">
          <ReactPlayer
            url="https://data.xiaozhuyouban.com/src/kwpgvjdqzbloebjdwjdmlepayrmknwmr.mp4"
            className="react-player"
            playing={false}
            width="100%"
            controls={true}
            //   onPlay={e => console.log('onPlay')}
            height="100%"
          />
        </div>
        <header className="header">
          <h1 className="title">遍地书香：不信任的心情能否传递，村民会怎么选择，敬请期待</h1>
          <div className="desc">
            <span className="author">珍珍就是爱剪辑</span>
          </div>
        </header>
        <div className="content">
            <div className="icon">
            <CommentOutlined  />
        还没有人评论
            </div>
    
        </div>
      </div>
    </div>
  );
}
