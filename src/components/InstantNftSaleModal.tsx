import React, { useEffect, useState } from "react";

interface InstantNftSaleModalProps {
  open: boolean;
  onClose: () => void;
}

// Mock NFT data (replace with real fetch logic)
const mockNfts = [
  {
    id: "nft1",
    name: "Sui NFT #1",
    image: "https://placehold.co/100x100?text=NFT+1",
  },
  {
    id: "nft2",
    name: "Sui NFT #2",
    image: "https://placehold.co/100x100?text=NFT+2",
  },
  {
    id: "nft3",
    name: "Sui NFT #3",
    image: "https://placehold.co/100x100?text=NFT+3",
  },
];

const InstantNftSaleModal: React.FC<InstantNftSaleModalProps> = ({
  open,
  onClose,
}) => {
  const [nfts, setNfts] = useState<typeof mockNfts>([]);
  const [selectedNft, setSelectedNft] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      // Replace with real fetch logic
      setNfts(mockNfts);
      setSelectedNft(null);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-2 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          Select NFT to Sell Instantly
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className={`border rounded-lg p-2 flex flex-col items-center cursor-pointer transition-all duration-200 ${
                selectedNft === nft.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() => setSelectedNft(nft.id)}
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="w-20 h-20 object-cover rounded mb-2"
              />
              <span className="text-sm font-medium text-center">
                {nft.name}
              </span>
            </div>
          ))}
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-50"
          disabled={!selectedNft}
          onClick={() => {
            // TODO: Trigger instant sale logic
            alert(`NFT ${selectedNft} will be sold instantly!`);
            onClose();
          }}
        >
          Sell Instantly
        </button>
      </div>
    </div>
  );
};

export default InstantNftSaleModal;
