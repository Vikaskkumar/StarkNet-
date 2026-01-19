import React, { useEffect, useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, Code2, X } from "lucide-react";
import UserProfile from "../components/UserProfile";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [data, setData] = useState([]);
  const [openUser, setOpenUser] = useState(null);
  const [openComments, setOpenComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/signup");
      return;
    }

    fetch("/allposts", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(result => setData(result))
      .catch(console.log);
  }, []);

  const likepost = (id) => {
    fetch("/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then(res => res.json())
      .then(result => {
        setData(prev =>
          prev.map(p => (p._id === result._id ? result : p))
        );
      });
  };

  const unlikepost = (id) => {
    fetch("/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then(res => res.json())
      .then(result => {
        setData(prev =>
          prev.map(p => (p._id === result._id ? result : p))
        );
      });
  };

  const makeComment = (text, id) => {
    if (!text) return;

    fetch("/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: id, text }),
    })
      .then(res => res.json())
      .then(updatedPost => {
        setData(prev =>
          prev.map(p => (p._id === updatedPost._id ? updatedPost : p))
        );
        setCommentText(prev => ({ ...prev, [id]: "" }));
      });
  };

  return (
    <div className="pt-20 min-h-screen bg-black flex justify-center">
      <div className="w-full max-w-xl px-3 space-y-6">

        {data.map(post => {
          const liked = post.likes.includes(currentUser._id);

          return (
            <div
              key={post._id}
              className="bg-[#0b0b0b] border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <img
                  src={post.postedBy?.photo}
                  className="h-9 w-9 rounded-full cursor-pointer"
                  onClick={() => setOpenUser(post.postedBy._id)}
                />

                <span
                  onClick={() => setOpenUser(post.postedBy._id)}
                  className="text-white text-sm font-semibold cursor-pointer hover:text-cyan-400"
                >
                  {post.postedBy.name}
                </span>
              </div>

              <img src={post.photo} className="w-full object-cover" />

              <div className="px-4 py-3 space-y-3">
                <div className="flex justify-between items-center text-slate-400">
                  <div className="flex gap-5">
                    <Heart
                      onClick={() => liked ? unlikepost(post._id) : likepost(post._id)}
                      className={`cursor-pointer ${
                        liked ? "text-red-500 fill-red-500" : ""
                      }`}
                    />
                    <MessageCircle
                      className="cursor-pointer"
                      onClick={() =>
                        setOpenComments(prev => ({
                          ...prev,
                          [post._id]: !prev[post._id],
                        }))
                      }
                    />
                    <Send className="cursor-pointer" />
                  </div>
                  <Bookmark className="cursor-pointer" />
                </div>

                <p className="text-white text-sm font-semibold">
                  {post.likes.length} developers liked this
                </p>

                <p className="text-slate-300 text-sm">
                  <span
                    className="text-white font-semibold mr-1 cursor-pointer"
                    onClick={() => setOpenUser(post.postedBy._id)}
                  >
                    {post.postedBy.name}
                  </span>
                  {post.body}
                </p>
              </div>

              {openComments[post._id] && (
                <div className="bg-black/70 border-t border-white/10 px-4 py-4 space-y-4">
                  {post.comments.map((c, i) => (
                    <div key={i} className="flex gap-3">
                      <p className="text-white text-sm font-semibold">
                        {c.postedBy?.name}
                      </p>
                      <p className="text-slate-300 text-sm">
                        {c.comment}
                      </p>
                    </div>
                  ))}

                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={commentText[post._id] || ""}
                      onChange={(e) =>
                        setCommentText(prev => ({
                          ...prev,
                          [post._id]: e.target.value,
                        }))
                      }
                      placeholder="Write a comment..."
                      className="flex-1 bg-transparent text-sm text-slate-200 outline-none border-b border-white/10"
                    />
                    <button
                      onClick={() =>
                        makeComment(commentText[post._id], post._id)
                      }
                      className="text-cyan-400 text-sm font-semibold"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {openUser && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
          <div className="bg-black w-full max-w-3xl h-[90vh] rounded-2xl relative overflow-y-auto">
            <button
              onClick={() => setOpenUser(null)}
              className="absolute top-3 right-3 text-white"
            >
              <X />
            </button>

            <UserProfile userid={openUser} />
          </div>
        </div>
      )}
    </div>
  );
}
