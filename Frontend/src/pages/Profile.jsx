import React, { useEffect, useState } from "react";
import PostDetails from "../components/PostDetails";
import ProfilePic from "../components/ProfilePic";

export default function Profile() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [changePic, setChangePic] = useState(false);

  const headers = {
    Authorization: "Bearer " + localStorage.getItem("jwt"),
  };

  const fetchProfile = async () => {
    const res = await fetch("/myprofile", { headers });
    const data = await res.json();
    setUser(data);
  };

  const fetchPosts = async () => {
    const res = await fetch("/myposts", { headers });
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-24 max-w-5xl mx-auto px-4">

        {/* PROFILE */}
        <div className="flex items-center gap-6 border-b border-gray-800 pb-6">
          <img
            src={user?.Photo }
            alt="profile"
            onClick={() => setChangePic(true)}
            className="h-28 w-28 rounded-full object-cover cursor-pointer hover:opacity-90"
          />

          <div>
            <h1 className="text-2xl font-semibold">{user?.name}</h1>
            <p className="text-gray-400 text-sm">Full-stack Developer</p>

            <div className="flex gap-6 mt-3 text-sm">
              <p><span className="font-semibold">{posts.length}</span> posts</p>
              <p><span className="font-semibold">{user?.followers?.length || 0}</span> followers</p>
              <p><span className="font-semibold">{user?.following?.length || 0}</span> following</p>
            </div>

            <button className="mt-3 px-4 py-1 border rounded text-sm">
              Edit profile
            </button>
          </div>
        </div>

        {/* POSTS */}
        <div className="mt-8">
          <div className="grid grid-cols-3 gap-2">
            {posts.map(post => (
              <img
                key={post._id}
                src={post.photo}
                onClick={() => setSelectedPost(post)}
                className="aspect-square object-cover cursor-pointer hover:opacity-80"
              />
            ))}
          </div>
        </div>

        {/* POST MODAL */}
        {selectedPost && (
          <PostDetails
            post={selectedPost}
            close={() => setSelectedPost(null)}
            setPosts={setPosts}
          />
        )}

        {/* PROFILE PIC MODAL */}
        {changePic && (
          <ProfilePic
            close={() => {
              setChangePic(false);
              fetchProfile(); // 🔥 refresh after upload
            }}
          />
        )}
      </div>
    </div>
  );
}
