import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import store from "./redux/store";
import { AuthProvider } from "./components/AuthContext";
import { CartProvider } from "./context/CartContext";
import App from "./App";
import "./styles/app.css";

ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode><Provider store={store}><BrowserRouter><SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}><AuthProvider><CartProvider><App /></CartProvider></AuthProvider></SnackbarProvider></BrowserRouter></Provider></React.StrictMode>);
