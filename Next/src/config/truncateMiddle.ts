export const truncateMiddle = (str: string, maxLength: number) => {
    if (str.length <= maxLength) return str
    const halfLength = Math.floor(maxLength / 2)
    return `${str.substring(0, halfLength)}...${str.substring(str.length - halfLength)}`
}