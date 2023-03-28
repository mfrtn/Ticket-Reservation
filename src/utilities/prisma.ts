export function exclude(dbObj: object, excludedFields: string[]): any {
  for (let key of excludedFields) {
    delete dbObj[key];
  }
  return dbObj;
}
