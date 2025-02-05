const conf = {
    apiUrlPrefix: "http://localhost:1337/api",
    loginEndpoint: "/auth/local",
    jwtUserEndpoint: "/users/me?populate=role",
    jwtSessionStorageKey: "auth.jwt",
    userEndpoint: "/users/",
};

export default conf;
