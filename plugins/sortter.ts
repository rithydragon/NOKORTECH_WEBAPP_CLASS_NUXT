
// plugins/sorter.ts

export default defineNuxtPlugin((nuxtApp) => {
  /**
   * sortData function sorts an array of objects based on a specified column/key.
   * It supports sorting strings, numbers, and date values.
   *
   * @param {T[]} array - The array of objects to be sorted.
   * @param {keyof T} column - The key/column on which the array should be sorted.
   * @param {boolean} [isAscending=true] - Sort order, true for ascending, false for descending.
   * @returns {T[]} - The sorted array.
   */
  const sortData = <T>(array: T[], column: keyof T, isAscending: boolean = true): T[] => {
    return array.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      // String sorting
      if (typeof valA === 'string' && typeof valB === 'string') {
        return isAscending ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      // Number sorting
      else if (typeof valA === 'number' && typeof valB === 'number') {
        return isAscending ? valA - valB : valB - valA;
      }
      // Date sorting (check if values are Date objects or valid date strings)
      else if (
        (valA instanceof Date || !isNaN(Date.parse(valA as unknown as string))) &&
        (valB instanceof Date || !isNaN(Date.parse(valB as unknown as string)))
      ) {
        const dateA = new Date(valA as unknown as string).getTime();
        const dateB = new Date(valB as unknown as string).getTime();
        return isAscending ? dateA - dateB : dateB - dateA;
      }

      // Default return if values are not comparable
      return 0;
    });
  };

  // Provide the sortData function globally so it can be used anywhere in the app
  nuxtApp.provide('sortData', sortData);
});
