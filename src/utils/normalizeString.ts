// Current version of Formisch is adding [""] around the field names, this function removes them to improve accessibility features
export function normalizeString(input: string): string {
    if (input.startsWith('["') && input.endsWith('"]')) {
        return input.slice(2, -2);
    }
    return input;
}