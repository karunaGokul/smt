export class Settings {
    public static ApiUrl: string = process.env.VUE_APP_APIBASEURL;
    public static ApiPath: string = process.env.VUE_APP_APIPATH;

    public static MockApiUrl: string = process.env.VUE_APP_MOCKAPIBASEURL;
    public static MockApiPath: string = process.env.VUE_APP_MOCKAPIPATH;

    public static AuthUserName: string = process.env.VUE_APP_AUTHUSERNAME;
    public static AuthPassword: string = process.env.VUE_APP_AUTHPASSWORD;

    public static GridPageSize: number = process.env.VUE_APP_GRIDPAGESIZE;

    public static PricingGridPageSize: number = process.env.VUE_APP_PRICING_GRIDPAGESIZE;

    public static ZohoUrl: string = process.env.VUE_APP_ZOHOURL;
    public static ZohoClientId: string = process.env.VUE_APP_ZOHOCLIENTID;
    public static ZohoRedirectUri: string = process.env.VUE_APP_ZOHOREDIRECTURI;
    public static DefaultTrialDays: number = process.env.VUE_APP_DEFAULTTRIALDAYS;


}