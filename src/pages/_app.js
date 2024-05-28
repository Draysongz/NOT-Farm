import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ToastContainer} from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';






const manifestUrl =
  "https://raw.githubusercontent.com/Draysongz/NOT-Farm/main/public/manifest.json";

export default function App({ Component, pageProps }) {
  return (
    <>
     <TonConnectUIProvider manifestUrl={manifestUrl}>
      
      <ChakraProvider>
        <Component {...pageProps} />
        <ToastContainer />
      </ChakraProvider>
      </TonConnectUIProvider>
    </>
  );
}
