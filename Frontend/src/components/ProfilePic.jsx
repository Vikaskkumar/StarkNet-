import React, { useEffect, useRef, useState } from "react";

export default function ProfilePic({ close }) {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);

  const fileRef = useRef(null);

  // upload to cloudinary
  useEffect(() => {
    if (image) {
      postData();
    }
  }, [image]);

  // save url to backend
  useEffect(() => {
    if (url) {
      postPic();
    }
  }, [url]);

  const removePic = async () => {
    try {
      const res = await fetch("/removeProfilePic", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ pic: url }),
      });

      const data = await res.json();
      console.log("removed from   db", data);
      close(); 
    } catch (err) {
      console.log(err);
    }
  };
  const postPic = async () => {
    try {
      const res = await fetch("/uploadProfilePic", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ pic: url }),
      });

      const data = await res.json();
      console.log("saved in db", data);
      close(); // auto close modal
    } catch (err) {
      console.log(err);
    }
  };

  const postData = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "starknet");
    data.append("cloud_name", "debcictpi");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/debcictpi/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();
      setUrl(result.url);
    } catch (err) {
      console.log(err);
    }
  };

  

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white text-black w-72 rounded-lg overflow-hidden">
        <h2 className="text-center font-semibold py-3 border-b">
          Change Profile Photo
        </h2>

        <button
          onClick={() => fileRef.current?.click()}
          className="w-full py-3 hover:bg-gray-100"
        >
          Upload Photo
        </button>

        <button
          className="w-full py-3 text-red-500 hover:bg-gray-100"
          onClick={()=>{ setUrl(null);
            postPic()}}
        >
          Remove Photo
        </button>

        <button
          onClick={close}
          className="w-full py-3 text-gray-500 hover:bg-gray-100"
        >
          Cancel
        </button>

        <input
          type="file"
          hidden
          ref={fileRef}
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>
    </div>
  );
}
