import { getCurrentUser, logout as appwriteLogout } from "@/lib/appwrite";
import { create } from "zustand";

interface StoreType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  fetchCurrentUser: () => void;
  logout: () => void;
  setDemoUser: () => void;
  isDemoUser: boolean;
}

interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

export const useAuthStore = create<StoreType>((set) => ({
  isAuthenticated: false,
  loading: false,
  user: null,
  isDemoUser: false,

  fetchCurrentUser: async () => {
    console.log("fetchCurrentUser store.....");
    set({ loading: true });
    try {
      const currentUser = await getCurrentUser();
      console.log("CurrentUser store... ", currentUser);
      set({
        user: currentUser,
        isAuthenticated: !!currentUser,
        loading: false,
        isDemoUser: false,
      });
    } catch (error) {
      console.log(error);
      set({ loading: false });
    }
  },
  setDemoUser: () => {
    console.log("Setting demo user...");
    const demoUser: User = {
      $id: "68d97350d49efc0067c0",
      avatar:
        "https://fra.cloud.appwrite.io/v1/avatars/initials?name=Aryna&project=678cf37a003e229fd1a8",
      email: "aryna4111314@gmail.com",
      name: "Aryna",
    };

    set({
      user: demoUser,
      isAuthenticated: true,
      loading: false,
      isDemoUser: true,
    });

    console.log("Demo user set successfully:", demoUser);
  },
  logout: async () => {
    try {
      const state = useAuthStore.getState();

      if (state.isDemoUser) {
        console.log("Logging out demo user");
        set({
          user: null,
          isAuthenticated: false,
          isDemoUser: false,
        });
      } else {
        await appwriteLogout();
        set({
          user: null,
          isAuthenticated: false,
          isDemoUser: false,
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
}));

useAuthStore.getState().fetchCurrentUser();
