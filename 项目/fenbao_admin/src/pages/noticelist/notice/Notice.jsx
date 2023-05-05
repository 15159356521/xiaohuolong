import React from 'react'
import { useParams, Link } from "react-router-dom";
export default function Notice() {
  const { id,type } = useParams();
  console.log(id,type);
  return (
    <div>Notice</div>
  )
}
