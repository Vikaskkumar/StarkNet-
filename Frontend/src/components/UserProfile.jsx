import React, { useEffect, useState } from "react";
import PostDetails from "../components/PostDetails";
import profilepic from "../assets/pics/images (13).jpeg";

export default function UserProfile({ userid }) {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!userid) return; 

    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then(res => res.json())
      .then(result => {
        setUser(result.user);
        setPosts(result.posts);
        setFollowing(result.user.followers?.includes(currentUser._id));
      })
      .catch(console.log);
  }, [userid]);

  if (!userid) return null;
  if (!user) return null;

  const followUser = () => {
    fetch("/follow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ followId: userid }),
    })
      .then(res => res.json())
      .then(() => {
        setFollowing(true);
        setUser(prev => ({
          ...prev,
          followers: [...(prev.followers || []), currentUser._id],
        }));
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ followId: userid }),
    })
      .then(res => res.json())
      .then(() => {
        setFollowing(false);
        setUser(prev => ({
          ...prev,
          followers: (prev.followers || []).filter(
            id => id !== currentUser._id
          ),
        }));
      });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-10 max-w-5xl mx-auto px-4">

        {/* PROFILE */}
        <div className="flex items-center gap-6 border-b border-gray-800 pb-6">
          {user.photo && (
            <img
              src={user.photo}
              className="h-28 w-28 rounded-full object-cover"
            />
          )}

          <div className="flex-1">
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <p className="text-gray-400 text-sm">Full-stack Developer</p>

            <div className="flex gap-6 mt-3 text-sm">
              <p><span className="font-semibold">{posts.length}</span> posts</p>
              <p><span className="font-semibold">{user.followers?.length || 0}</span> followers</p>
              <p><span className="font-semibold">{user.following?.length || 0}</span> following</p>
            </div>
          </div>

          {currentUser._id !== user._id && (
            following ? (
              <button
                onClick={unfollowUser}
                className="px-4 py-1 border rounded text-sm text-gray-300"
              >
                Following
              </button>
            ) : (
              <button
                onClick={followUser}
                className="px-4 py-1 bg-white text-black rounded text-sm"
              >
                Follow
              </button>
            )
          )}
        </div>

        {/* POSTS */}
        <div className="mt-8 grid grid-cols-3 gap-2">
          {posts.map(post => (
            <img
              key={post._id}
              src={post.photo}
              onClick={() => setSelectedPost(post)}
              className="aspect-square object-cover cursor-pointer"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
