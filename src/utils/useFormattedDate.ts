import { useMemo } from 'react';

interface DateItem {
    [key: string]: any;
}

function formatDate(dateStr: string): string {
    const date: Date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString();
    const day = date.getDate() >= 10 ? date.getDate().toString() : '0' + date.getDate().toString();
    const hour = date.getHours() >= 10 ? date.getHours().toString() : '0' + date.getHours().toString();
    const minute = date.getMinutes() >= 10 ? date.getMinutes().toString() : '0' + date.getMinutes().toString();
    const second = date.getSeconds() >= 10 ? date.getSeconds().toString() : '0' + date.getSeconds().toString();

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function useUdtDate(data: DateItem[] | string, isValidating: boolean, isDirectDate: boolean = false, datePropName: string = 'UDT_DT'): string {
    return useMemo(() => {
        if (Array.isArray(data) && data.length > 0 && !isValidating) {
            const firstData = data[0];
            const dateStr = isDirectDate ? firstData : firstData[datePropName];
            return formatDate(dateStr);
        } else if (!Array.isArray(data) && !isValidating) {
            return formatDate(data);
        } else {
            return '';
        }
    }, [data, isValidating, isDirectDate, datePropName]);
}

export default useUdtDate