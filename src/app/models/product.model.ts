export interface IProduct {
    id: number,
    name: string,
    description: string
    sku: string,
    cost: number,
    profile: any;
}

export interface IProfile {
    type: string
}