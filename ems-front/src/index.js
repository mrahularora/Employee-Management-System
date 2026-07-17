import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ApolloWrapper from "./apolloFront";

ReactDOM.render(
  <ApolloWrapper>
    <App />
  </ApolloWrapper>,
  document.getElementById("root")
);
