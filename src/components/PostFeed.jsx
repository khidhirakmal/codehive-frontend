import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllPosts } from "../stores/authSlice";
import PostWidget from "./PostWidget";

export default function PostFeed({ userId, isProfile = false }) {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  console.log("ProfilePage?", isProfile);

  const getPosts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      console.log("All posts:", data);
      dispatch(setAllPosts({ posts: data }));
    } catch (err) {
      console.log("Error retrieving posts:", err);
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/posts/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data;
      console.log("User's post:", data);
      dispatch(setAllPosts({ posts: data }));
    } catch (err) {
      console.log("Error retrieving user posts:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isProfile) {
          await getUserPosts();
        } else {
          await getPosts();
        }
      } catch (err) {
        console.log("Error:", err);
      }
    };

    fetchData();
  }, [isProfile, dispatch, token, userId]);

  console.log("Getting PostFeed:", posts[0]);

  return (
    <>
      {Array.isArray(posts[0]) &&
        posts[0].map(
          ({
            _id,
            userId,
            name,
            description,
            likes,
            comments,
            likeCount,
            picturePath,
            // userPicturePath,
          }) => {
            return (
              <PostWidget
                key={_id}
                postId={_id}
                postUserId={userId}
                name={name}
                description={description}
                likes={likes}
                comments={comments}
                likeCount={likeCount}
                picturePath={picturePath}
                // userPicturePath={userPicturePath}
              />
            );
          }
        )}
    </>
  );
}
