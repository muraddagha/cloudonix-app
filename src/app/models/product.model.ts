export interface IProduct {
    id: number,
    name: string,
    description: string
    sku: string,
    cost: number,
    profile: IProfile
}

export interface IProfile {
    type: string
}