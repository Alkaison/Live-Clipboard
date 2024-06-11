import { useEffect } from "react";
import { userIdentifier } from "../scripts/userIdentifier";

function UserIdentification() {
  useEffect(() => {
    userIdentifier();
  }, []);

  return null;
}

export default UserIdentification;
