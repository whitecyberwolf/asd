export interface Glass {
    _id: string;
    title: string;
    price: number;
    originalPrice?: number;
    salePercentage?: number;
    metalColors: string[];
    description: string;
    details: {
      diamond: string;
      material: string;
      diamondTesterPass: boolean;
      note: string;
    };
    images: string[];
    video?: string;
  }