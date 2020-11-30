import { URL } from "url"
const stringIsAValidUrl = (string: string) => {
    try {
        new URL(string);
        return true;
    } catch (err) {
        return false;
    }
};

export default stringIsAValidUrl