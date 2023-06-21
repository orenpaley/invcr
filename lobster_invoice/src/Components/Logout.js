import { useNavigate } from "react-router-dom";
import LobsterApi from "../API/api";
import { initialValuesClear } from "./Invoice/initialValues";
import { useContext } from "react";
import userContext from "../userContext";

const Logout = () => {
  const [context, setContext] = useContext(userContext);
  const navigate = useNavigate();
  localStorage.clear();
  LobsterApi.token = null;
  setContext({});
  navigate("/", { state: initialValuesClear });
};

export default Logout;
