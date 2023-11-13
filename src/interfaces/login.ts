interface Asset {
    HR_ITEM_NM: string;
    ITEM_ENG_NM: string;
    ITEM_CD_DL: string;
    ITEM_KR_NM: string;
}

interface CoinSelect {
    name: string;
    ticker: string;
    krName: string;
}

interface DefaultUser {
    uid?: string;
    username?: string;

}

interface User {
    accessLevel: number;
    email: string;
    image: string;
    membership: number;
    name: string;
    interestedAssets: string[] | [];
    portfolio: string[] | [];
    interest: string[] | [];
}

interface Session {
    user: User
    expires: string;
}

interface Provider {
    callbackUrl: string;
    id: string;
    name: string;
    signinUrl: string;
    type: string;
}

type Providers = Record<string, Provider>

interface InterestedAssetsList {
    ITEM_ENG_NM: string;
    ITEM_CD_DL: string;
    ITEM_KR_NM: string;
    HR_ITEM_NM: string;
}

// interface UserSession {
//     name:string;
//     email:string;
//     image:string;
//     accessLevel:number;
//     membership:number;
// }


export type { Asset, CoinSelect, Session, InterestedAssetsList, Providers }