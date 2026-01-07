import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Page from "./page"

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>
    </>
  );
}

export default App;
