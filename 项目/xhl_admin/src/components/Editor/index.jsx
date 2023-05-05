// import '@wangeditor/editor/dist/css/style.css' // 引入 css
// import '@/wangeditor/editor/dist/css/style.css'
import './index.scss'

import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { baseIMgURL } from '../../utils/request'
import { message } from 'antd'

function MyEditor(props) {
    // editor 实例
    const [editor, setEditor] = useState(null)                   // JS 语法

    // 编辑器内容
    const [html, setHtml] = useState(props.content || '')

    // 模拟 ajax 请求，异步设置 html
   /*  useEffect(() => {
        setTimeout(() => {
            setHtml('<p>hello world</p>')
        }, 1500)
    }, []) */

    // 工具栏配置
    const toolbarConfig = { }                        // JS 语法

    // 编辑器配置
    const editorConfig = {   
        MENU_CONF: {},                      // JS 语法
        placeholder: '请输入内容...',
    }

    // http://sub.admin.xiaohuolongkeji.com/admin/common.upload/uploadImag
    // http://localhost:3000/admin/common.upload/uploadImage
    editorConfig.MENU_CONF['uploadImage'] = {
        server: '/admin/common.upload/uploadImage',
        fieldName: 'file',
    
        // 单个文件的最大体积限制，默认为 2M
        maxFileSize: 5 * 1024 * 1024, // 1M
    
        // 最多可上传几个文件，默认为 100
        maxNumberOfFiles: 10,
    
        // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
    
        // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
       /*  meta: {
            token: 'xxx',
            otherKey: 'yyy'
        }, */
    
        // 将 meta 拼接到 url 参数中，默认 false
        metaWithUrl: false,
    
        // 自定义增加 http  header
        /* headers: {
            Accept: 'text/x-json',
            otherKey: 'xxx'
        }, */
    
        // 跨域是否传递 cookie ，默认为 false
        withCredentials: true,
    
        // 超时时间，默认为 10 秒
        timeout: 5 * 1000, // 5 秒

        onBeforeUpload(file) {    // JS 语法
            // file 选中的文件，格式如 { key: file }
            return file

            // 可以 return
            // 1. return file 或者 new 一个 file ，接下来将上传
            // 2. return false ，不上传这个 file
        },

        onProgress(progress) {  // 上传进度条
            // progress 是 0-100 的数字
            console.log('progress', progress)
        },

        onSuccess(file, res) {  // 上传成功
            console.log(`${file.name} 上传成功`, res)
        },

        onFailed(file, res) {   // 上传失败
            console.log(`${file.name} 上传失败`, res)
            message.warning(`${file.name} 上传失败`, res)
        },

        onError(file, err, res) {  // 上传错误
            console.log(`${file.name} 上传出错`, err, res)
            message.warning('`${file.name} 上传出错`')
        },

        customInsert(res, insertFn) {  // 自定义上传视频
            console.log(res, 'customInsert')
            const {code, data, msg} = res

            // 从 res 中找到 url alt href ，然后插入图片
            insertFn(baseIMgURL+data.url)
        },
    }

    function findAllImgSrcsFromHtml(htmlData) {
        console.log("🚀 ~ file: index.jsx ~ line 108 ~ findAllImgSrcsFromHtml ~ htmlData", htmlData)
        let imgReg = /<img.*?(?:>|\/>)|<v:imagedata.*?(?:>|\/>)/gi; //匹配图片中的img标签
        let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配图片中的src
  
        let arr = htmlData.match(imgReg); //筛选出所有的img
        console.log("🚀 ~ file: index.jsx ~ line 112 ~ findAllImgSrcsFromHtml ~ arr", arr)
        if (!arr || (Array.isArray(arr) && !arr.length)) {
          return false;
        }
  
        let srcArr = [];
        for (let i = 0; i < arr.length; i++) {
          let src = arr[i].match(srcReg);
          // 获取图片地址
          srcArr.push(src[1]);
        }
  
        return srcArr;
      }
    function extractImageDataFromRtf(rtfData) {
    if (!rtfData) {
        return [];
    }

    const regexPictureHeader =
        /{\\pict[\s\S]+?({\\\*\\blipuid\s?[\da-fA-F]+)[\s}]*/;
    const regexPicture = new RegExp(
        "(?:(" + regexPictureHeader.source + "))([\\da-fA-F\\s]+)\\}",
        "g"
    );
    const images = rtfData.match(regexPicture);
    const result = [];

    if (images) {
        for (const image of images) {
        let imageType = false;

        if (image.includes("\\pngblip")) {
            imageType = "image/png";
        } else if (image.includes("\\jpegblip")) {
            imageType = "image/jpeg";
        }

        if (imageType) {
            result.push({
            hex: image
                .replace(regexPictureHeader, "")
                .replace(/[^\da-fA-F]/g, ""),
            type: imageType,
            });
        }
        }
    }

    return result;
    }

    function replaceImagesFileSourceWithInlineRepresentation(
    htmlData,
    imageSrcs,
    imagesHexSources,
    isBase64Data = true
    ) {
    if (imageSrcs.length === imagesHexSources.length) {
        for (let i = 0; i < imageSrcs.length; i++) {
        const newSrc = isBase64Data
            ? `data:${
                imagesHexSources[i].type
            };base64,${_convertHexToBase64(imagesHexSources[i].hex)}`
            : imagesHexSources[i];

        htmlData = htmlData.replace(imageSrcs[i], newSrc);
        }
    }

    return htmlData;
    }

    function _convertHexToBase64(hexString) {
    return btoa(
        hexString
        .match(/\w{2}/g)
        .map((char) => {
            return String.fromCharCode(parseInt(char, 16));
        })
        .join("")
    );
    }
  
    editorConfig.customPaste = (editor, event) => {  
        debugger
        console.log("ClipboardEvent 粘贴事件对象", event);
        console.log("🚀 ~ file: index.jsx ~ line 198 ~ MyEditor ~ html", html)      // 有<img, <v:imagedata
        let text = event.clipboardData.getData('text/plain') // 获取粘贴的纯文本
        let rtf = event.clipboardData.getData("text/rtf"); // 获取 rtf 数据（如从 word wsp 复制粘贴）
        console.log("🚀 ~ file: index.jsx ~ line 203 ~ MyEditor ~ rtf", rtf)
        if (html && rtf) {
          
          // 列表缩进会超出边框，直接过滤掉
          html = html.replace(/text\-indent:\-(.*?)pt/gi, "");      // 有<img, <v:imagedata
  
          // 从html内容中查找粘贴内容中是否有图片元素，并返回img标签的属性src值的集合
          const imgSrcs = findAllImgSrcsFromHtml(html);  
          console.log("🚀 ~ file: index.jsx ~ line 210 ~ MyEditor ~ imgSrcs", imgSrcs)
  
          // 如果有
          if (imgSrcs && Array.isArray(imgSrcs) && imgSrcs.length) {
            // 从rtf内容中查找图片数据
            const rtfImageData = extractImageDataFromRtf(rtf);
  
            // 如果找到
            if (rtfImageData.length) {
              // TODO：此处可以将图片上传到自己的服务器上
  
              // 执行替换：将html内容中的img标签的src替换成ref中的图片数据，如果上面上传了则为图片路径
              html = replaceImagesFileSourceWithInlineRepresentation(
                html,
                imgSrcs,
                rtfImageData
              );
              editor.dangerouslyInsertHtml(html);
            }
          }
  
          // 阻止默认的粘贴行为
          event.preventDefault();
          return false;
        } else {
          return true;
        }
    }

    const getEditContent = (editor) => {
        setHtml(editor.getHtml())
        console.log("🚀 ~ file: index.jsx ~ line 109 ~ getEditContent ~ editor.getHtml()", editor.getHtml())
        props.getContent( editor.getHtml())
    }


    // 及时销毁 editor ，重要！
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])
    return (
        <>
            <div style={{ border: '1px solid #ccc', zIndex: 100}}>
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{ borderBottom: '1px solid #ccc' }}
                />
                <Editor
                    defaultConfig={editorConfig}
                    value={props.content}
                    onCreated={setEditor}
                    // onChange={editor =>  setHtml(editor.getHtml())}
                    onChange={editor => getEditContent(editor)}
                    mode="default"
                    style={{ height: '500px', overflowY: 'hidden' }}
                />
            </div>
        </>
    )
}

export default MyEditor