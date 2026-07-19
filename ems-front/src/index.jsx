import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import ApolloWrapper from "./apolloFront";

createRoot(document.getElementById("root")).render(
  <ApolloWrapper>
    <App />
  </ApolloWrapper>
);
