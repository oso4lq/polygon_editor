export const environment = {
    production: false,
    mapbox: {
        accessToken: 'pk.eyJ1IjoibWFyb29uZWRpb25lIiwiYSI6ImNqdmp0MzB1azBpcDAzem1naHZwMjNndGIifQ.65nvvRg9QeFUV2c6b9W4Vw'
    }
};

export const setAccessToken = (accessToken: string) => {
    environment.mapbox.accessToken = accessToken;
};

export const getAccessToken = () => environment.mapbox.accessToken;
