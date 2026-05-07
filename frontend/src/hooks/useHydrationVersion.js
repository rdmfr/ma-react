import { useEffect, useState } from "react";
import { subscribeDataHydrated } from "../data/mockData";

export function useHydrationVersion(scope) {
    const [v, setV] = useState(0);
    useEffect(() => {
        return subscribeDataHydrated((s) => {
            if (!scope || s === scope) setV((x) => x + 1);
        });
    }, [scope]);
    return v;
}

