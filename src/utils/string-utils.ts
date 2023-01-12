export class StringUtils {
  public static replaceAfterLastSlash(input: string, newPart: string): string {
    const selectAfterLastSlash = /([^\/]+$)/;
    const regex = new RegExp(selectAfterLastSlash);

    return input.replace(regex, newPart);
  }
}
