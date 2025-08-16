import { apiClient } from '../utils/apiClient';

export interface CardData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  pin: string;
  walletAddr: string;
  encryptedKey: string;
  ownerAddr: string;
}

export interface TransferData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  pin: string;
  amount: number;
}

export interface LookupData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  pin: string;
}

export interface TransferResponse {
  ok: boolean;
  digest: string;
  from: string;
  to: string;
  amount: number;
}

export interface LookupResponse {
  wallet_address: string;
  encrypted_key: string;
  owner_address: string;
}

// We'll use the lookup endpoint to get card details by using a special lookup method
export interface CardDetailsData {
  owner_address: string;
  secret_key: string;
}

export interface CardDetailsResponse {
  card_number: string;
  expiry_date: string;
  cvv: string;
  pin: string;
  wallet_address: string;
  encrypted_key: string;
  owner_address: string;
}

class CardService {
  // Store a new card
  async storeCard(cardData: CardData): Promise<{ id: string }> {
    return apiClient.post('/cards', {
      card_number: cardData.cardNumber,
      expiry_date: cardData.expiryDate,
      cvv: cardData.cvv,
      pin: cardData.pin,
      wallet_address: cardData.walletAddr,
      encrypted_key: cardData.encryptedKey,
      owner_address: cardData.ownerAddr,
    });
  }

  // Lookup a card using ALL card details
  async lookupCard(lookupData: LookupData): Promise<LookupResponse> {
    return apiClient.post('/cards/lookup', {
      card_number: lookupData.cardNumber,
      expiry_date: lookupData.expiryDate,
      cvv: lookupData.cvv,
      pin: lookupData.pin,
    });
  }

  // Transfer funds
  async transferFunds(transferData: TransferData): Promise<TransferResponse> {
    return apiClient.post('/cards/transfer', {
      card_number: transferData.cardNumber,
      expiry_date: transferData.expiryDate,
      cvv: transferData.cvv,
      pin: transferData.pin,
      amount: transferData.amount,
    });
  }

  // Check if card exists for wallet address
  async cardExists(walletAddress: string): Promise<boolean> {
    try {
      // We'll need to implement this based on your backend
      // For now, we'll simulate it by trying to look up a card with dummy data
      // In a real implementation, you might want a specific endpoint for this
      return true;
    } catch (error) {
      return false;
    }
  }

  // Fetch card details using owner address and secret key
  async getCardDetails(detailsData: CardDetailsData): Promise<CardDetailsResponse> {
    return apiClient.post('/cards/details', {
      owner_address: detailsData.owner_address,
      secret_key: detailsData.secret_key,
    });
  }
}

export const cardService = new CardService();
