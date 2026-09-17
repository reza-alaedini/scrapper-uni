import Routers from "./router/Router";
import GlobalToast from "./shared/components/toast/GlobalToast";

function App() {
  return (
    <>
      <Routers />
      <GlobalToast />
    </>
  );
}

export default App;
