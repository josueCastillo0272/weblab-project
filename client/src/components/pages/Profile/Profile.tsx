import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { get } from "../../../utilities";
import { User } from "../../../../../shared/types";
import Loading from "../Loading";
export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState<User | undefined>(undefined);
  useEffect(() => {
    if (username) {
      get(`/api/user/username/${username}`).then((userdata) => setUser(userdata));
    }
  }, [username]);

  if (!user) return <Loading />;
  return (
    <div>
      <p>{user.name}</p>
    </div>
  );
}
