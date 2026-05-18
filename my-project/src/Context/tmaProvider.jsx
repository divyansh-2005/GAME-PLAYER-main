import React, { useState, useEffect, createContext, useContext } from "react";
import { retrieveLaunchParams } from "@tma.js/sdk-react";
import axios from "axios";

// Create a context
const TmaContext = createContext();

// Create a provider component
export const TmaProvider = ({ children }) => {
  const [telegramUser, setTelegramUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchTelegramUserData();
  }, []);

  const fetchTelegramUserData = async () => {
    setIsLoading(true);
    try {
      const launchParams = retrieveLaunchParams();
      const user = launchParams?.initData?.user;
      if (!user) {
        throw new Error("User not found");
      }
      setTelegramUser(user);
      await fetchTelegramUserfromDatabes(user);
      
      // Fetch full user record from DB to get the saved points
      const dbUserResponse = await axios.get(
        `${apiUrl}user/fetch?telegramId=${user.id}`
      );
      if (dbUserResponse.data) {
        setTelegramUser((prevUser) => ({
          ...prevUser,
          ...dbUserResponse.data,
        }));
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const apiUrl = import.meta.env.VITE_API_KEY;
  const fetchTelegramUserfromDatabes = async (user) => {
    try {
      await axios.post(
        `${apiUrl}user/save`,
        {
          name: user.firstName + " " + user.lastName,
          telegramId: user.id,
          username: user.firstName.toLowerCase() + user.lastName.toLowerCase(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          maxBodyLength: Infinity,
        }
      );
    } catch (error) {
      setIsError(true);
      console.error("Error saving user to database:", error);
    }
  };

  const updateUserPoints = async (pointsToAdd) => {
    const tid = telegramUser?.telegramId || telegramUser?.id;
    if (!tid) return;
    try {
      const response = await axios.post(
        `${apiUrl}user/update-points`,
        {
          telegramId: String(tid),
          points: pointsToAdd,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data && response.data.points !== undefined) {
        setTelegramUser((prevUser) => ({
          ...prevUser,
          points: response.data.points,
        }));
        console.log(`Successfully updated points in DB. New total: ${response.data.points}`);
      }
    } catch (error) {
      console.error("Error updating user points in database:", error);
    }
  };

  return (
    <TmaContext.Provider
      value={{ user: telegramUser, isLoading, isError, setIsLoading, updateUserPoints }}
    >
      {children}
    </TmaContext.Provider>
  );
};

// Custom hook to use the TmaContext
export const useTma = () => useContext(TmaContext);