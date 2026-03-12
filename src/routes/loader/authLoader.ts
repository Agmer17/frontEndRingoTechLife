import { redirect } from "react-router";
import axiosInstance from "../../lib/axios";
import { store } from "../../store/store";
import { setCredentials } from "../../store/slieces/authslice";

export const protectedLoader = async () => {
  const state = store.getState();

  // kalau sudah ada accessToken, lanjut
  if (state.auth.accessToken) {
    return null;
  }

  try {
    const res = await axiosInstance.get("/auth/refresh-session");

    console.log(res.data.data)

    const { id, role, access_token } = res.data.data;

    store.dispatch(
      setCredentials({
        accessToken: access_token,
        id: id,
        role: role,
      })
    );

    console.log("Redux token:", store.getState().auth.accessToken);

    return null;
  } catch (err) {
    throw redirect("/auth/login");
  }
};