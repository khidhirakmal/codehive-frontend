import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import FriendsList from "../components/FriendsList"; // FriendsListWidget
import PostBox from "../components/PostBox"; // MyPostWidget
import PostFeed from "../components/PostFeed"; // PostsWidget
import UserBox from "../components/UserBox"; // UserWidget
import UserProjects from "components/UserProjects";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const nonMobile = useMediaQuery("(min-width:1000px)");
  const loggedInUserId = useSelector((state) => state.user._id);

  const getUser = async () => {
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={nonMobile ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={nonMobile ? "26%" : undefined}>
          <UserBox userId={userId} picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <FriendsList userId={userId} />
        </Box>
        <Box
          flexBasis={nonMobile ? "42%" : undefined}
          mt={nonMobile ? undefined : "2rem"}
        >
          {userId === loggedInUserId && (
            <PostBox picturePath={user.picturePath} />
          )}
          <PostFeed isProfile userId={userId} picturePath={user.picturePath} />
        </Box>
        {/* (RIGHT SECTION) UserProjects */}
        {nonMobile && (
          <Box flexBasis="26%">
            <UserProjects />
            <Box m="2rem 0" />
          </Box>
        )}
      </Box>
    </Box>
  );
}
