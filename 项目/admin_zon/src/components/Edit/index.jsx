import React, {useEffect} from 'react';
import { message, Upload } from 'antd'
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // 主题样式
import 'quill/dist/quill.bubble.css'; // 主题样式
import { useState } from 'react';
import styles from './index.scss'
import { useRef } from 'react';
import { getBase64 } from '../../utils'
import ReactQuill from 'react-quill';

/** quill 简单使用 **/
const Edit = (props) => {
    const [content, setContet] = useState('')
    // 这里写你要上传的图片服务器地址
    const [serverUrl, setServreUrl] = useState('/common.upload/uploadImage')
   
    const reactQuillRef = useRef(null)
    const uploadRef = useRef(null)
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const onEditorBlur = () => {
        //失去焦点事件
    }
    const onEditorFocus = ()  =>{
        //获得焦点事件
    }
    const handleChange = (value) => {
        props.onEditOnchange(value)
    }

    const handlerImg = (value) => {
        if(value) {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.setAttribute('multiple', 'multiple');
            input.click();
            input.onchange = async () => {
                Array.from(input.files).forEach(async (item) => {
                    const formData = new FormData();
                    formData.append('file', item);
                    // 上传图片
                   const {data: {code, data, msg}} = await axios({
                        url:baseUrl + '/common.upload/uploadImage',
                        method: 'post',
                        data: formData
                    })
                    if(code === 200) {
                        let quill =this.quill;//获取到编辑器本身
                        const cursorPosition = quill.getSelection().index;//获取当前光标位置
                        const link = baseURL + data.url;
                        quill.insertEmbed(cursorPosition, "image", link);//插入图片
                        quill.setSelection(cursorPosition + 1);//光标位置加1
                    } 
                });
            };
        }else {

        }
    }
    
    return (
        <ReactQuill
            id="editor" 
            ref={reactQuillRef}  
            onBlur={(e) => onEditorBlur(e)} 
            onFocus={e => onEditorFocus(e)} 
            className={styles.root}
            value={props.content}
            onChange={(value) => handleChange(value) }
            modules={
                {
                    toolbar: {
                        container: [
                            ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
                            ["blockquote", "code-block"], // 引用  代码块
                            [{ header: 1 }, { header: 2 }], // 1、2 级标题
                            [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
                            [{ script: "sub" }, { script: "super" }], // 上标/下标
                            [{ indent: "-1" }, { indent: "+1" }], // 缩进
                            // [{'direction': 'rtl'}],                         // 文本方向
                            [{ size: ["small", false, "large", "huge"] }], // 字体大小
                            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
                            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
                            [{ font: [] }], // 字体种类
                            [{ align: [] }], // 对齐方式
                            ["clean"], // 清除文本格式
                            ["link", "image"] // 链接、图片、视频
                        ],
                        handlers: {
                            image: handlerImg
                        }
                    }
              
                }
        }
        />
    );
}

export default React.memo(Edit)