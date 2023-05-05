import React, { useState } from "react";
import { Modal } from "antd";

export default function PreviewImage(props) {
  const {preview,previewOpen,handlePicCancel} = props

  const clickHandler = ()=>{
    handlePicCancel&&handlePicCancel()
}
console.log(preview,previewOpen);
  return (
    <Modal
      open={previewOpen}
      title="预览"
      footer={null}
      zIndex={1000}
      onCancel={clickHandler}
    >
      <img
        alt="example"
        style={{
          width: "100%",
        }}
        src={preview}
      />
    </Modal>
  );
}
