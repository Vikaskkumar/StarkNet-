import React, { useEffect, useState } from "react";
import profilepic from "../assets/pics/images (13).jpeg";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


export default function CreatePost() {

  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [url, seturl] = useState(null);

  const notifya = (msg) => toast.error(msg);
  const notifyb = (msg) => toast.success(msg);

  const navigate = useNavigate();


  useEffect(() => {
    if (url) {
    console.log("saving post")
      //saving post

      fetch("/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          body,
          pic: url
        })
      })
        .then(res => res.json())
        .then((data) => {
          notifyb("post created sucesfully");
          navigate("/");
        })
        .catch(err => notifya(err))
    }

  }, [url]);



  const postData = () => {
    console.log("button clicked")
    // console.log(body,image);
    const data = new FormData();

    data.append("file", image);
    data.append("upload_preset", "starknet");
    data.append("cloud_name", "debcictpi");

    fetch("https://api.cloudinary.com/v1_1/debcictpi/image/upload", {
      method: "post",
      body: data
    })
      .then(res => res.json())
      .then((data) => { console.log("saved in cludinary");seturl(data.url)})
      .catch(err => console.log(err));


  }

  return (
    <div className="min-h-screen bg-black flex justify-center pt-24 px-4">

      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-xl border border-zinc-700 overflow-hidden">

        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
          <h4 className="text-white font-semibold">Create new post</h4>
          <button onClick={() => { postData() }}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-1.5 rounded-lg text-white text-sm font-semibold transition">
            Share
          </button>
        </div>

        <div className="relative w-full h-72 bg-zinc-800 flex items-center justify-center overflow-hidden">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => { setImage(e.target.files[0]) }}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />

          {image ? (
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover"

            />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5V8.25A2.25 2.25 0 015.25 6h13.5A2.25 2.25 0 0121 8.25v8.25M3 16.5l3.72-3.72a2.25 2.25 0 013.18 0L15 18l3.72-3.72a2.25 2.25 0 013.18 0L21 16.5"
                />
              </svg>
              <p className="text-sm">Click to upload image</p>
            </div>
          )}
        </div>

        <div className="p-4 space-y-4">

          <div className="flex items-center gap-3">
            <img
              src={profilepic}
              alt=""
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
            />
            <h5 className="text-white font-medium">loki</h5>
          </div>

          <textarea
            placeholder="Write a caption..."
            value={body}
            onChange={(e) => { setBody(e.target.value) }}
            className="w-full h-28 bg-zinc-800 text-white p-3 rounded-xl resize-none outline-none border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
          ></textarea>

        </div>
      </div>
    </div>
  );
}
