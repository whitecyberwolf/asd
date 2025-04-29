// src/component/navbar/UserStatus.tsx
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const UserStatus: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  if (user) {
    return <div className="text-sm text-gray-700">Welcome, {user.email}</div>;
  }
  return null;
};

export default UserStatus;
