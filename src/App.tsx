import { Provider } from "react-redux";
import { store } from "./app/store";
import MainWindow from "./components/MainWindow";

const App = () => {
  return (
    <Provider store={store}>
      <MainWindow />
    </Provider>
  );
};

export default App;
