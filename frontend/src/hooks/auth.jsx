import { useQuery, useMutation } from "@tanstack/react-query";
import ax, { axData } from "@conf/ax";
import conf from "@conf/main";
import Cookies from "js-cookie";

export function useRole() {
    return useQuery({
        queryKey: ["role"],
        queryFn: async () => {
            const token = Cookies.get("token");
            if (!token) throw new Error("No token found");

            const response = await ax.get(conf.jwtUserEndpoint);
            return response.data.role.name;
        },
        enabled: false,
    });
}

export function useLogin() {
    return useMutation({
        mutationFn: async (data) => {
            const response = await ax.post(conf.loginEndpoint, data);
            axData.jwt = response.data.jwt;
            Cookies.set("token", axData.jwt, {
                expires: data.remember ? 30 : null,
                path: "/",
            });
            return response.data;
        },
    });
}

export function useRegister() {
    return useMutation({
        mutationFn: async (registerData) => {
            const response = await ax.post(conf.registerEndpoint, {
                email: registerData.email,
                username: registerData.email,
                password: registerData.password,
            });
            axData.jwt = response.data.jwt;
            Cookies.set("token", axData.jwt, {
                expires: null,
                path: "/",
            });
            return response.data;
        },
    });
}

export function useProfile() {
    return useMutation({
        mutationFn: async ({ userId, firstName, lastName, address }) => {
            const response = await ax.put(conf.userEndpoint + userId, {
                firstname: firstName,
                lastname: lastName,
                address: address,
            });
            return response.data;
        },
    });
}
