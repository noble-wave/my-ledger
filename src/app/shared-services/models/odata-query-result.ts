export class ODataResult<T> {
  public '@odata.context': string;
  public '@odata.count': number;

  /**
   * The '@odata.context' variable returned by the OData service
   */
  public get context(): string {
    return this['@odata.context'];
  }

  /**
   * The '@odata.count' variable returned by the OData service
   */
  public get count(): number {
    return this['@odata.count'];
  }

  /**
   * The query result in an array
   */
  public value: T[] = [];
}
