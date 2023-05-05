import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Carousel,
} from "antd";
import {getNotice,getNoticeList,getJob,getTaskList} from "../../api/user";
import styles from "./OverView.module.scss";
import assets1 from "../../assets/1.png";
import assets2 from "../../assets/2.png";
import assets3 from "../../assets/3.png";



export default function OverView() {


  // 内容页面数据

  const [activity,setActivity]=useState([])
const [notice,setNotice]=useState([])

  useEffect(() => {
    getNotice().then(res=>{
  console.log(res);
      setNotice(res.data)
    }).catch(err=>{
      console.log(err+'err');
    })
    getNoticeList().then(res=>{
console.log(res.data);
   const arr=[]
   res.data.activity.map((item,index)=>{
    arr.push(item)

      })
      res.data.task.map((item,index)=>{
        arr.push(item)
          })

      setActivity(arr)
      console.log(activity);
    }).catch(err=>{
      console.log(err+'err');
    })
  }, []);
  // 模拟数据 接受后端
const [income]=useState(2051)
const [creation]=useState(2051)

const [hot]=useState(265)
 
function a(data) {
  // console.log(data);
  return data.map((item,index)=>{
    return <div key={index} className='list'>
      <div  onClick={()=>{
                      window.open(`#/view/${item.id}`)
              }} className="listLift">{item.title}</div>
      <div className="listRight">{item.start_time}</div>
    </div>
  }
  )
}
function b(data) {
  // console.log(data);
  return data.map((item,index)=>{
    return <div key={index} className='list'>
      <div  onClick={()=>{
                      window.open(`#/notice/not/${item.id}`)
              }} className="listLift">{item.title}</div>
      <div className="listRight">{item.add_time}</div>
    </div>
  }
  )
}
  return (
    <div className={styles.main}>
      {/* 头部页面 */}
      <div style={{width:1070}}>
        <div className="top">

      
          <div className="topLeft">
              <div className="topItem">
                <div className=" title">
                 <Link to='/settlement/center'> {income}</Link></div>
                <div className="num">累计收入(元)</div>
              </div>
              <div className="topItem">
                <div className=" title"><Link to='/manage'>{creation}</Link> </div>
                <div className="num">累计创作</div>
              </div>
              <div className="topItem">
                <div className=" title"><Link to='/analysis'>{hot}<span>万</span></Link> </div>
                <div className="num">累计热度值</div>
              </div>
          </div>
          <div className="topRight">
          <div className="num">小火龙感受美好生活</div>

          </div>
        </div>

        <div className="swiper">
          <Carousel autoplay>
            <div>
              <img src={assets1} alt="" />
            </div>
            <div>
              <img src={assets2} alt="" />
            </div>
            <div>
              <img src={assets3} alt="" />
            </div>
          </Carousel>
        </div>
      </div>

      {/* 内容页面 */}
      <div className="content">
      
        <div className="contentTop">
          <div className="contentHerd">
            <div className="HerdLift">公告</div>
            <Link to='/noticelist' className="HerdRight" style={{color:"rgb(22,119,255"}}>更多</Link>
          </div>
          <div className="contentList">
            {b(notice)}
            </div>
        </div>


        <div className="contentTop">
        <div className="contentHerd">
        <Link to='/activity' className="HerdLift">活动</Link>
            <Link to='/missions' className="HerdRight">任务</Link>
        </div>
        <div className="contentList">
      {a(activity)}
            </div>
        </div>

      </div>
    </div>
  );
}

