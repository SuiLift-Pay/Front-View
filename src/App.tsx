import './App.css';
import Myroute from './Myroute';
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import RegisterEnokiWallets from './components/RegisterEnokiWallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork='testnet'>
          <RegisterEnokiWallets />
          <WalletProvider autoConnect>
            <Myroute />
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
