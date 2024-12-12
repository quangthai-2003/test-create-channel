import { AxiosResponse } from "axios";

export const convertError = (error: any) => {
    return (error as any).response as AxiosResponse;
}