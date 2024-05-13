export interface TokenMetadata {
    name: string;
    symbol: string;
    decimals: number;
    logoUrl: string;
    mint: string;
  }
  
  export interface MintsData {
    [key: string]: TokenMetadata;
  }
  
  export interface ShdwData {
    [key: string]: TokenMetadata;
  }
  
  const mintsData: MintsData = {
    EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      logoUrl:
        "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FEPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v%2Flogo.png",
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    },
    So11111111111111111111111111111111111111112: {
      name: "Solana",
      symbol: "SOL",
      decimals: 9,
      logoUrl:
        "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png",
      mint: "So11111111111111111111111111111111111111112",
    },
    SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y: {
      name: "Shadow Token",
      symbol: "SHDW",
      decimals: 9,
      logoUrl:
        "https://img.fotofolio.xyz/?url=https%3A%2F%2Fshdw-drive.genesysgo.net%2FFDcC9gn12fFkSU2KuQYH4TUjihrZxiTodFRWNF4ns9Kt%2F250x250_with_padding.png",
      mint: "SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y",
    },
  };
  
  export const shdwData: ShdwData = {
    SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y: {
      name: "Shadow Token",
      symbol: "SHDW",
      decimals: 9,
      logoUrl:
        "https://img.fotofolio.xyz/?url=https%3A%2F%2Fshdw-drive.genesysgo.net%2FFDcC9gn12fFkSU2KuQYH4TUjihrZxiTodFRWNF4ns9Kt%2F250x250_with_padding.png",
      mint: "SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y",
    },
  };
  
  export default mintsData; 
  
  
  