import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { refreshSession } from "./../authThunk";

interface AuthState {
  accessToken: string | null;
  id: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

const loadFromLocalStorage = (): AuthState => {
  const data = localStorage.getItem("auth");

  if (!data) {
    return {
      accessToken: null,
      id: null,
      role: null,
      isAuthenticated: false,
    };
  }

  const parsed = JSON.parse(data);

  return {
    ...parsed,
    isAuthenticated: true,
  };
};

const initialState: AuthState = loadFromLocalStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        id: string;
        role: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.id = action.payload.id;
      state.role = action.payload.role;
      state.isAuthenticated = true;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          accessToken: state.accessToken,
          id: state.id,
          role: state.role,
        })
      );
    },

    logout: (state) => {
      state.accessToken = null;
      state.id = null;
      state.role = null;
      state.isAuthenticated = false;

      localStorage.removeItem("auth");
    },
  },

  extraReducers: (builder) => {
    builder.addCase(refreshSession.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.id = action.payload.id;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    });

    builder.addCase(refreshSession.rejected, (state) => {
      state.accessToken = null;
      state.id = null;
      state.role = null;
      state.isAuthenticated = false;
    });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;