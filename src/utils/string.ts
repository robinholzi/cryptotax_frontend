
export function stringIsEmpty (str: string) {
    return (!str || str.length === 0 );
}

export function processDateTimeString (dateTime: Date) {
    return JSON.stringify(dateTime)
        .replaceAll('Z', '').replaceAll('"', '');
}