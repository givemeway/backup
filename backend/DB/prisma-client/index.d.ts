
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model File
 * 
 */
export type File = $Result.DefaultSelection<Prisma.$FilePayload>
/**
 * Model FileVersion
 * 
 */
export type FileVersion = $Result.DefaultSelection<Prisma.$FileVersionPayload>
/**
 * Model DeletedFile
 * 
 */
export type DeletedFile = $Result.DefaultSelection<Prisma.$DeletedFilePayload>
/**
 * Model DeletedFileVersion
 * 
 */
export type DeletedFileVersion = $Result.DefaultSelection<Prisma.$DeletedFileVersionPayload>
/**
 * Model Directory
 * 
 */
export type Directory = $Result.DefaultSelection<Prisma.$DirectoryPayload>
/**
 * Model DeletedDirectory
 * 
 */
export type DeletedDirectory = $Result.DefaultSelection<Prisma.$DeletedDirectoryPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Files
 * const files = await prisma.file.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Files
   * const files = await prisma.file.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.file`: Exposes CRUD operations for the **File** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Files
    * const files = await prisma.file.findMany()
    * ```
    */
  get file(): Prisma.FileDelegate<ExtArgs>;

  /**
   * `prisma.fileVersion`: Exposes CRUD operations for the **FileVersion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FileVersions
    * const fileVersions = await prisma.fileVersion.findMany()
    * ```
    */
  get fileVersion(): Prisma.FileVersionDelegate<ExtArgs>;

  /**
   * `prisma.deletedFile`: Exposes CRUD operations for the **DeletedFile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DeletedFiles
    * const deletedFiles = await prisma.deletedFile.findMany()
    * ```
    */
  get deletedFile(): Prisma.DeletedFileDelegate<ExtArgs>;

  /**
   * `prisma.deletedFileVersion`: Exposes CRUD operations for the **DeletedFileVersion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DeletedFileVersions
    * const deletedFileVersions = await prisma.deletedFileVersion.findMany()
    * ```
    */
  get deletedFileVersion(): Prisma.DeletedFileVersionDelegate<ExtArgs>;

  /**
   * `prisma.directory`: Exposes CRUD operations for the **Directory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Directories
    * const directories = await prisma.directory.findMany()
    * ```
    */
  get directory(): Prisma.DirectoryDelegate<ExtArgs>;

  /**
   * `prisma.deletedDirectory`: Exposes CRUD operations for the **DeletedDirectory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DeletedDirectories
    * const deletedDirectories = await prisma.deletedDirectory.findMany()
    * ```
    */
  get deletedDirectory(): Prisma.DeletedDirectoryDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.10.2
   * Query Engine version: 5a9203d0590c951969e85a7d07215503f4672eb9
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    File: 'File',
    FileVersion: 'FileVersion',
    DeletedFile: 'DeletedFile',
    DeletedFileVersion: 'DeletedFileVersion',
    Directory: 'Directory',
    DeletedDirectory: 'DeletedDirectory'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'file' | 'fileVersion' | 'deletedFile' | 'deletedFileVersion' | 'directory' | 'deletedDirectory'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      File: {
        payload: Prisma.$FilePayload<ExtArgs>
        fields: Prisma.FileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FileFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FileFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          findFirst: {
            args: Prisma.FileFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FileFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          findMany: {
            args: Prisma.FileFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FilePayload>[]
          }
          create: {
            args: Prisma.FileCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          createMany: {
            args: Prisma.FileCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.FileDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          update: {
            args: Prisma.FileUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          deleteMany: {
            args: Prisma.FileDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.FileUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.FileUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          aggregate: {
            args: Prisma.FileAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateFile>
          }
          groupBy: {
            args: Prisma.FileGroupByArgs<ExtArgs>,
            result: $Utils.Optional<FileGroupByOutputType>[]
          }
          count: {
            args: Prisma.FileCountArgs<ExtArgs>,
            result: $Utils.Optional<FileCountAggregateOutputType> | number
          }
        }
      }
      FileVersion: {
        payload: Prisma.$FileVersionPayload<ExtArgs>
        fields: Prisma.FileVersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FileVersionFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FileVersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FileVersionFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FileVersionPayload>
          }
          findFirst: {
            args: Prisma.FileVersionFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FileVersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FileVersionFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FileVersionPayload>
          }
          findMany: {
            args: Prisma.FileVersionFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FileVersionPayload>[]
          }
          create: {
            args: Prisma.FileVersionCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FileVersionPayload>
          }
          createMany: {
            args: Prisma.FileVersionCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.FileVersionDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FileVersionPayload>
          }
          update: {
            args: Prisma.FileVersionUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FileVersionPayload>
          }
          deleteMany: {
            args: Prisma.FileVersionDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.FileVersionUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.FileVersionUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FileVersionPayload>
          }
          aggregate: {
            args: Prisma.FileVersionAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateFileVersion>
          }
          groupBy: {
            args: Prisma.FileVersionGroupByArgs<ExtArgs>,
            result: $Utils.Optional<FileVersionGroupByOutputType>[]
          }
          count: {
            args: Prisma.FileVersionCountArgs<ExtArgs>,
            result: $Utils.Optional<FileVersionCountAggregateOutputType> | number
          }
        }
      }
      DeletedFile: {
        payload: Prisma.$DeletedFilePayload<ExtArgs>
        fields: Prisma.DeletedFileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeletedFileFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeletedFileFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFilePayload>
          }
          findFirst: {
            args: Prisma.DeletedFileFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeletedFileFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFilePayload>
          }
          findMany: {
            args: Prisma.DeletedFileFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFilePayload>[]
          }
          create: {
            args: Prisma.DeletedFileCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFilePayload>
          }
          createMany: {
            args: Prisma.DeletedFileCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.DeletedFileDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFilePayload>
          }
          update: {
            args: Prisma.DeletedFileUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFilePayload>
          }
          deleteMany: {
            args: Prisma.DeletedFileDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.DeletedFileUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.DeletedFileUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFilePayload>
          }
          aggregate: {
            args: Prisma.DeletedFileAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateDeletedFile>
          }
          groupBy: {
            args: Prisma.DeletedFileGroupByArgs<ExtArgs>,
            result: $Utils.Optional<DeletedFileGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeletedFileCountArgs<ExtArgs>,
            result: $Utils.Optional<DeletedFileCountAggregateOutputType> | number
          }
        }
      }
      DeletedFileVersion: {
        payload: Prisma.$DeletedFileVersionPayload<ExtArgs>
        fields: Prisma.DeletedFileVersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeletedFileVersionFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFileVersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeletedFileVersionFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFileVersionPayload>
          }
          findFirst: {
            args: Prisma.DeletedFileVersionFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFileVersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeletedFileVersionFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFileVersionPayload>
          }
          findMany: {
            args: Prisma.DeletedFileVersionFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFileVersionPayload>[]
          }
          create: {
            args: Prisma.DeletedFileVersionCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFileVersionPayload>
          }
          createMany: {
            args: Prisma.DeletedFileVersionCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.DeletedFileVersionDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFileVersionPayload>
          }
          update: {
            args: Prisma.DeletedFileVersionUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFileVersionPayload>
          }
          deleteMany: {
            args: Prisma.DeletedFileVersionDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.DeletedFileVersionUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.DeletedFileVersionUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedFileVersionPayload>
          }
          aggregate: {
            args: Prisma.DeletedFileVersionAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateDeletedFileVersion>
          }
          groupBy: {
            args: Prisma.DeletedFileVersionGroupByArgs<ExtArgs>,
            result: $Utils.Optional<DeletedFileVersionGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeletedFileVersionCountArgs<ExtArgs>,
            result: $Utils.Optional<DeletedFileVersionCountAggregateOutputType> | number
          }
        }
      }
      Directory: {
        payload: Prisma.$DirectoryPayload<ExtArgs>
        fields: Prisma.DirectoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DirectoryFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DirectoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DirectoryFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DirectoryPayload>
          }
          findFirst: {
            args: Prisma.DirectoryFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DirectoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DirectoryFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DirectoryPayload>
          }
          findMany: {
            args: Prisma.DirectoryFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DirectoryPayload>[]
          }
          create: {
            args: Prisma.DirectoryCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DirectoryPayload>
          }
          createMany: {
            args: Prisma.DirectoryCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.DirectoryDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DirectoryPayload>
          }
          update: {
            args: Prisma.DirectoryUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DirectoryPayload>
          }
          deleteMany: {
            args: Prisma.DirectoryDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.DirectoryUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.DirectoryUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DirectoryPayload>
          }
          aggregate: {
            args: Prisma.DirectoryAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateDirectory>
          }
          groupBy: {
            args: Prisma.DirectoryGroupByArgs<ExtArgs>,
            result: $Utils.Optional<DirectoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.DirectoryCountArgs<ExtArgs>,
            result: $Utils.Optional<DirectoryCountAggregateOutputType> | number
          }
        }
      }
      DeletedDirectory: {
        payload: Prisma.$DeletedDirectoryPayload<ExtArgs>
        fields: Prisma.DeletedDirectoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeletedDirectoryFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedDirectoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeletedDirectoryFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedDirectoryPayload>
          }
          findFirst: {
            args: Prisma.DeletedDirectoryFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedDirectoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeletedDirectoryFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedDirectoryPayload>
          }
          findMany: {
            args: Prisma.DeletedDirectoryFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedDirectoryPayload>[]
          }
          create: {
            args: Prisma.DeletedDirectoryCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedDirectoryPayload>
          }
          createMany: {
            args: Prisma.DeletedDirectoryCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.DeletedDirectoryDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedDirectoryPayload>
          }
          update: {
            args: Prisma.DeletedDirectoryUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedDirectoryPayload>
          }
          deleteMany: {
            args: Prisma.DeletedDirectoryDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.DeletedDirectoryUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.DeletedDirectoryUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DeletedDirectoryPayload>
          }
          aggregate: {
            args: Prisma.DeletedDirectoryAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateDeletedDirectory>
          }
          groupBy: {
            args: Prisma.DeletedDirectoryGroupByArgs<ExtArgs>,
            result: $Utils.Optional<DeletedDirectoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeletedDirectoryCountArgs<ExtArgs>,
            result: $Utils.Optional<DeletedDirectoryCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type FileCountOutputType
   */

  export type FileCountOutputType = {
    versionedFiles: number
  }

  export type FileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versionedFiles?: boolean | FileCountOutputTypeCountVersionedFilesArgs
  }

  // Custom InputTypes

  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileCountOutputType
     */
    select?: FileCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeCountVersionedFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileVersionWhereInput
  }



  /**
   * Count Type DeletedFileCountOutputType
   */

  export type DeletedFileCountOutputType = {
    deletedFileVersions: number
  }

  export type DeletedFileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deletedFileVersions?: boolean | DeletedFileCountOutputTypeCountDeletedFileVersionsArgs
  }

  // Custom InputTypes

  /**
   * DeletedFileCountOutputType without action
   */
  export type DeletedFileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFileCountOutputType
     */
    select?: DeletedFileCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * DeletedFileCountOutputType without action
   */
  export type DeletedFileCountOutputTypeCountDeletedFileVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeletedFileVersionWhereInput
  }



  /**
   * Count Type DirectoryCountOutputType
   */

  export type DirectoryCountOutputType = {
    files: number
  }

  export type DirectoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    files?: boolean | DirectoryCountOutputTypeCountFilesArgs
  }

  // Custom InputTypes

  /**
   * DirectoryCountOutputType without action
   */
  export type DirectoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DirectoryCountOutputType
     */
    select?: DirectoryCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * DirectoryCountOutputType without action
   */
  export type DirectoryCountOutputTypeCountFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileWhereInput
  }



  /**
   * Count Type DeletedDirectoryCountOutputType
   */

  export type DeletedDirectoryCountOutputType = {
    files: number
  }

  export type DeletedDirectoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    files?: boolean | DeletedDirectoryCountOutputTypeCountFilesArgs
  }

  // Custom InputTypes

  /**
   * DeletedDirectoryCountOutputType without action
   */
  export type DeletedDirectoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedDirectoryCountOutputType
     */
    select?: DeletedDirectoryCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * DeletedDirectoryCountOutputType without action
   */
  export type DeletedDirectoryCountOutputTypeCountFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeletedFileWhereInput
  }



  /**
   * Models
   */

  /**
   * Model File
   */

  export type AggregateFile = {
    _count: FileCountAggregateOutputType | null
    _avg: FileAvgAggregateOutputType | null
    _sum: FileSumAggregateOutputType | null
    _min: FileMinAggregateOutputType | null
    _max: FileMaxAggregateOutputType | null
  }

  export type FileAvgAggregateOutputType = {
    versions: number | null
    size: number | null
  }

  export type FileSumAggregateOutputType = {
    versions: number | null
    size: bigint | null
  }

  export type FileMinAggregateOutputType = {
    username: string | null
    device: string | null
    directory: string | null
    uuid: string | null
    origin: string | null
    filename: string | null
    last_modified: Date | null
    hashvalue: string | null
    enc_hashvalue: string | null
    versions: number | null
    size: bigint | null
    salt: string | null
    iv: string | null
    dirID: string | null
  }

  export type FileMaxAggregateOutputType = {
    username: string | null
    device: string | null
    directory: string | null
    uuid: string | null
    origin: string | null
    filename: string | null
    last_modified: Date | null
    hashvalue: string | null
    enc_hashvalue: string | null
    versions: number | null
    size: bigint | null
    salt: string | null
    iv: string | null
    dirID: string | null
  }

  export type FileCountAggregateOutputType = {
    username: number
    device: number
    directory: number
    uuid: number
    origin: number
    filename: number
    last_modified: number
    hashvalue: number
    enc_hashvalue: number
    versions: number
    size: number
    salt: number
    iv: number
    dirID: number
    _all: number
  }


  export type FileAvgAggregateInputType = {
    versions?: true
    size?: true
  }

  export type FileSumAggregateInputType = {
    versions?: true
    size?: true
  }

  export type FileMinAggregateInputType = {
    username?: true
    device?: true
    directory?: true
    uuid?: true
    origin?: true
    filename?: true
    last_modified?: true
    hashvalue?: true
    enc_hashvalue?: true
    versions?: true
    size?: true
    salt?: true
    iv?: true
    dirID?: true
  }

  export type FileMaxAggregateInputType = {
    username?: true
    device?: true
    directory?: true
    uuid?: true
    origin?: true
    filename?: true
    last_modified?: true
    hashvalue?: true
    enc_hashvalue?: true
    versions?: true
    size?: true
    salt?: true
    iv?: true
    dirID?: true
  }

  export type FileCountAggregateInputType = {
    username?: true
    device?: true
    directory?: true
    uuid?: true
    origin?: true
    filename?: true
    last_modified?: true
    hashvalue?: true
    enc_hashvalue?: true
    versions?: true
    size?: true
    salt?: true
    iv?: true
    dirID?: true
    _all?: true
  }

  export type FileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which File to aggregate.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationAndSearchRelevanceInput | FileOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Files
    **/
    _count?: true | FileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileMaxAggregateInputType
  }

  export type GetFileAggregateType<T extends FileAggregateArgs> = {
        [P in keyof T & keyof AggregateFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFile[P]>
      : GetScalarType<T[P], AggregateFile[P]>
  }




  export type FileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileWhereInput
    orderBy?: FileOrderByWithAggregationInput | FileOrderByWithAggregationInput[]
    by: FileScalarFieldEnum[] | FileScalarFieldEnum
    having?: FileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileCountAggregateInputType | true
    _avg?: FileAvgAggregateInputType
    _sum?: FileSumAggregateInputType
    _min?: FileMinAggregateInputType
    _max?: FileMaxAggregateInputType
  }

  export type FileGroupByOutputType = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint
    salt: string
    iv: string
    dirID: string
    _count: FileCountAggregateOutputType | null
    _avg: FileAvgAggregateOutputType | null
    _sum: FileSumAggregateOutputType | null
    _min: FileMinAggregateOutputType | null
    _max: FileMaxAggregateOutputType | null
  }

  type GetFileGroupByPayload<T extends FileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileGroupByOutputType[P]>
            : GetScalarType<T[P], FileGroupByOutputType[P]>
        }
      >
    >


  export type FileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    username?: boolean
    device?: boolean
    directory?: boolean
    uuid?: boolean
    origin?: boolean
    filename?: boolean
    last_modified?: boolean
    hashvalue?: boolean
    enc_hashvalue?: boolean
    versions?: boolean
    size?: boolean
    salt?: boolean
    iv?: boolean
    dirID?: boolean
    versionedFiles?: boolean | File$versionedFilesArgs<ExtArgs>
    directoryID?: boolean | DirectoryDefaultArgs<ExtArgs>
    _count?: boolean | FileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["file"]>

  export type FileSelectScalar = {
    username?: boolean
    device?: boolean
    directory?: boolean
    uuid?: boolean
    origin?: boolean
    filename?: boolean
    last_modified?: boolean
    hashvalue?: boolean
    enc_hashvalue?: boolean
    versions?: boolean
    size?: boolean
    salt?: boolean
    iv?: boolean
    dirID?: boolean
  }

  export type FileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versionedFiles?: boolean | File$versionedFilesArgs<ExtArgs>
    directoryID?: boolean | DirectoryDefaultArgs<ExtArgs>
    _count?: boolean | FileCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $FilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "File"
    objects: {
      versionedFiles: Prisma.$FileVersionPayload<ExtArgs>[]
      directoryID: Prisma.$DirectoryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      username: string
      device: string
      directory: string
      uuid: string
      origin: string
      filename: string
      last_modified: Date
      hashvalue: string
      enc_hashvalue: string
      versions: number
      size: bigint
      salt: string
      iv: string
      dirID: string
    }, ExtArgs["result"]["file"]>
    composites: {}
  }


  type FileGetPayload<S extends boolean | null | undefined | FileDefaultArgs> = $Result.GetResult<Prisma.$FilePayload, S>

  type FileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FileFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FileCountAggregateInputType | true
    }

  export interface FileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['File'], meta: { name: 'File' } }
    /**
     * Find zero or one File that matches the filter.
     * @param {FileFindUniqueArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FileFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, FileFindUniqueArgs<ExtArgs>>
    ): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one File that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {FileFindUniqueOrThrowArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends FileFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, FileFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first File that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindFirstArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FileFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, FileFindFirstArgs<ExtArgs>>
    ): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first File that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindFirstOrThrowArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends FileFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, FileFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Files that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Files
     * const files = await prisma.file.findMany()
     * 
     * // Get first 10 Files
     * const files = await prisma.file.findMany({ take: 10 })
     * 
     * // Only select the `username`
     * const fileWithUsernameOnly = await prisma.file.findMany({ select: { username: true } })
     * 
    **/
    findMany<T extends FileFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FileFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a File.
     * @param {FileCreateArgs} args - Arguments to create a File.
     * @example
     * // Create one File
     * const File = await prisma.file.create({
     *   data: {
     *     // ... data to create a File
     *   }
     * })
     * 
    **/
    create<T extends FileCreateArgs<ExtArgs>>(
      args: SelectSubset<T, FileCreateArgs<ExtArgs>>
    ): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Files.
     *     @param {FileCreateManyArgs} args - Arguments to create many Files.
     *     @example
     *     // Create many Files
     *     const file = await prisma.file.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends FileCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FileCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a File.
     * @param {FileDeleteArgs} args - Arguments to delete one File.
     * @example
     * // Delete one File
     * const File = await prisma.file.delete({
     *   where: {
     *     // ... filter to delete one File
     *   }
     * })
     * 
    **/
    delete<T extends FileDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, FileDeleteArgs<ExtArgs>>
    ): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one File.
     * @param {FileUpdateArgs} args - Arguments to update one File.
     * @example
     * // Update one File
     * const file = await prisma.file.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends FileUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, FileUpdateArgs<ExtArgs>>
    ): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Files.
     * @param {FileDeleteManyArgs} args - Arguments to filter Files to delete.
     * @example
     * // Delete a few Files
     * const { count } = await prisma.file.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends FileDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FileDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Files
     * const file = await prisma.file.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends FileUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, FileUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one File.
     * @param {FileUpsertArgs} args - Arguments to update or create a File.
     * @example
     * // Update or create a File
     * const file = await prisma.file.upsert({
     *   create: {
     *     // ... data to create a File
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the File we want to update
     *   }
     * })
    **/
    upsert<T extends FileUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, FileUpsertArgs<ExtArgs>>
    ): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileCountArgs} args - Arguments to filter Files to count.
     * @example
     * // Count the number of Files
     * const count = await prisma.file.count({
     *   where: {
     *     // ... the filter for the Files we want to count
     *   }
     * })
    **/
    count<T extends FileCountArgs>(
      args?: Subset<T, FileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a File.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FileAggregateArgs>(args: Subset<T, FileAggregateArgs>): Prisma.PrismaPromise<GetFileAggregateType<T>>

    /**
     * Group by File.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileGroupByArgs['orderBy'] }
        : { orderBy?: FileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the File model
   */
  readonly fields: FileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for File.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    versionedFiles<T extends File$versionedFilesArgs<ExtArgs> = {}>(args?: Subset<T, File$versionedFilesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileVersionPayload<ExtArgs>, T, 'findMany'> | Null>;

    directoryID<T extends DirectoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DirectoryDefaultArgs<ExtArgs>>): Prisma__DirectoryClient<$Result.GetResult<Prisma.$DirectoryPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the File model
   */ 
  interface FileFieldRefs {
    readonly username: FieldRef<"File", 'String'>
    readonly device: FieldRef<"File", 'String'>
    readonly directory: FieldRef<"File", 'String'>
    readonly uuid: FieldRef<"File", 'String'>
    readonly origin: FieldRef<"File", 'String'>
    readonly filename: FieldRef<"File", 'String'>
    readonly last_modified: FieldRef<"File", 'DateTime'>
    readonly hashvalue: FieldRef<"File", 'String'>
    readonly enc_hashvalue: FieldRef<"File", 'String'>
    readonly versions: FieldRef<"File", 'Int'>
    readonly size: FieldRef<"File", 'BigInt'>
    readonly salt: FieldRef<"File", 'String'>
    readonly iv: FieldRef<"File", 'String'>
    readonly dirID: FieldRef<"File", 'String'>
  }
    

  // Custom InputTypes

  /**
   * File findUnique
   */
  export type FileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where: FileWhereUniqueInput
  }


  /**
   * File findUniqueOrThrow
   */
  export type FileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where: FileWhereUniqueInput
  }


  /**
   * File findFirst
   */
  export type FileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationAndSearchRelevanceInput | FileOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Files.
     */
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }


  /**
   * File findFirstOrThrow
   */
  export type FileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationAndSearchRelevanceInput | FileOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Files.
     */
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }


  /**
   * File findMany
   */
  export type FileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which Files to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationAndSearchRelevanceInput | FileOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }


  /**
   * File create
   */
  export type FileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * The data needed to create a File.
     */
    data: XOR<FileCreateInput, FileUncheckedCreateInput>
  }


  /**
   * File createMany
   */
  export type FileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Files.
     */
    data: FileCreateManyInput | FileCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * File update
   */
  export type FileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * The data needed to update a File.
     */
    data: XOR<FileUpdateInput, FileUncheckedUpdateInput>
    /**
     * Choose, which File to update.
     */
    where: FileWhereUniqueInput
  }


  /**
   * File updateMany
   */
  export type FileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Files.
     */
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyInput>
    /**
     * Filter which Files to update
     */
    where?: FileWhereInput
  }


  /**
   * File upsert
   */
  export type FileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * The filter to search for the File to update in case it exists.
     */
    where: FileWhereUniqueInput
    /**
     * In case the File found by the `where` argument doesn't exist, create a new File with this data.
     */
    create: XOR<FileCreateInput, FileUncheckedCreateInput>
    /**
     * In case the File was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileUpdateInput, FileUncheckedUpdateInput>
  }


  /**
   * File delete
   */
  export type FileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter which File to delete.
     */
    where: FileWhereUniqueInput
  }


  /**
   * File deleteMany
   */
  export type FileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Files to delete
     */
    where?: FileWhereInput
  }


  /**
   * File.versionedFiles
   */
  export type File$versionedFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileVersion
     */
    select?: FileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileVersionInclude<ExtArgs> | null
    where?: FileVersionWhereInput
    orderBy?: FileVersionOrderByWithRelationAndSearchRelevanceInput | FileVersionOrderByWithRelationAndSearchRelevanceInput[]
    cursor?: FileVersionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileVersionScalarFieldEnum | FileVersionScalarFieldEnum[]
  }


  /**
   * File without action
   */
  export type FileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileInclude<ExtArgs> | null
  }



  /**
   * Model FileVersion
   */

  export type AggregateFileVersion = {
    _count: FileVersionCountAggregateOutputType | null
    _avg: FileVersionAvgAggregateOutputType | null
    _sum: FileVersionSumAggregateOutputType | null
    _min: FileVersionMinAggregateOutputType | null
    _max: FileVersionMaxAggregateOutputType | null
  }

  export type FileVersionAvgAggregateOutputType = {
    versions: number | null
    size: number | null
  }

  export type FileVersionSumAggregateOutputType = {
    versions: number | null
    size: bigint | null
  }

  export type FileVersionMinAggregateOutputType = {
    username: string | null
    device: string | null
    directory: string | null
    uuid: string | null
    origin: string | null
    filename: string | null
    last_modified: Date | null
    hashvalue: string | null
    enc_hashvalue: string | null
    versions: number | null
    size: bigint | null
    salt: string | null
    iv: string | null
  }

  export type FileVersionMaxAggregateOutputType = {
    username: string | null
    device: string | null
    directory: string | null
    uuid: string | null
    origin: string | null
    filename: string | null
    last_modified: Date | null
    hashvalue: string | null
    enc_hashvalue: string | null
    versions: number | null
    size: bigint | null
    salt: string | null
    iv: string | null
  }

  export type FileVersionCountAggregateOutputType = {
    username: number
    device: number
    directory: number
    uuid: number
    origin: number
    filename: number
    last_modified: number
    hashvalue: number
    enc_hashvalue: number
    versions: number
    size: number
    salt: number
    iv: number
    _all: number
  }


  export type FileVersionAvgAggregateInputType = {
    versions?: true
    size?: true
  }

  export type FileVersionSumAggregateInputType = {
    versions?: true
    size?: true
  }

  export type FileVersionMinAggregateInputType = {
    username?: true
    device?: true
    directory?: true
    uuid?: true
    origin?: true
    filename?: true
    last_modified?: true
    hashvalue?: true
    enc_hashvalue?: true
    versions?: true
    size?: true
    salt?: true
    iv?: true
  }

  export type FileVersionMaxAggregateInputType = {
    username?: true
    device?: true
    directory?: true
    uuid?: true
    origin?: true
    filename?: true
    last_modified?: true
    hashvalue?: true
    enc_hashvalue?: true
    versions?: true
    size?: true
    salt?: true
    iv?: true
  }

  export type FileVersionCountAggregateInputType = {
    username?: true
    device?: true
    directory?: true
    uuid?: true
    origin?: true
    filename?: true
    last_modified?: true
    hashvalue?: true
    enc_hashvalue?: true
    versions?: true
    size?: true
    salt?: true
    iv?: true
    _all?: true
  }

  export type FileVersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileVersion to aggregate.
     */
    where?: FileVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileVersions to fetch.
     */
    orderBy?: FileVersionOrderByWithRelationAndSearchRelevanceInput | FileVersionOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FileVersions
    **/
    _count?: true | FileVersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FileVersionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FileVersionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileVersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileVersionMaxAggregateInputType
  }

  export type GetFileVersionAggregateType<T extends FileVersionAggregateArgs> = {
        [P in keyof T & keyof AggregateFileVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFileVersion[P]>
      : GetScalarType<T[P], AggregateFileVersion[P]>
  }




  export type FileVersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileVersionWhereInput
    orderBy?: FileVersionOrderByWithAggregationInput | FileVersionOrderByWithAggregationInput[]
    by: FileVersionScalarFieldEnum[] | FileVersionScalarFieldEnum
    having?: FileVersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileVersionCountAggregateInputType | true
    _avg?: FileVersionAvgAggregateInputType
    _sum?: FileVersionSumAggregateInputType
    _min?: FileVersionMinAggregateInputType
    _max?: FileVersionMaxAggregateInputType
  }

  export type FileVersionGroupByOutputType = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint
    salt: string
    iv: string
    _count: FileVersionCountAggregateOutputType | null
    _avg: FileVersionAvgAggregateOutputType | null
    _sum: FileVersionSumAggregateOutputType | null
    _min: FileVersionMinAggregateOutputType | null
    _max: FileVersionMaxAggregateOutputType | null
  }

  type GetFileVersionGroupByPayload<T extends FileVersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileVersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileVersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileVersionGroupByOutputType[P]>
            : GetScalarType<T[P], FileVersionGroupByOutputType[P]>
        }
      >
    >


  export type FileVersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    username?: boolean
    device?: boolean
    directory?: boolean
    uuid?: boolean
    origin?: boolean
    filename?: boolean
    last_modified?: boolean
    hashvalue?: boolean
    enc_hashvalue?: boolean
    versions?: boolean
    size?: boolean
    salt?: boolean
    iv?: boolean
    LatestFile?: boolean | FileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fileVersion"]>

  export type FileVersionSelectScalar = {
    username?: boolean
    device?: boolean
    directory?: boolean
    uuid?: boolean
    origin?: boolean
    filename?: boolean
    last_modified?: boolean
    hashvalue?: boolean
    enc_hashvalue?: boolean
    versions?: boolean
    size?: boolean
    salt?: boolean
    iv?: boolean
  }

  export type FileVersionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    LatestFile?: boolean | FileDefaultArgs<ExtArgs>
  }


  export type $FileVersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FileVersion"
    objects: {
      LatestFile: Prisma.$FilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      username: string
      device: string
      directory: string
      uuid: string
      origin: string
      filename: string
      last_modified: Date
      hashvalue: string
      enc_hashvalue: string
      versions: number
      size: bigint
      salt: string
      iv: string
    }, ExtArgs["result"]["fileVersion"]>
    composites: {}
  }


  type FileVersionGetPayload<S extends boolean | null | undefined | FileVersionDefaultArgs> = $Result.GetResult<Prisma.$FileVersionPayload, S>

  type FileVersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FileVersionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FileVersionCountAggregateInputType | true
    }

  export interface FileVersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FileVersion'], meta: { name: 'FileVersion' } }
    /**
     * Find zero or one FileVersion that matches the filter.
     * @param {FileVersionFindUniqueArgs} args - Arguments to find a FileVersion
     * @example
     * // Get one FileVersion
     * const fileVersion = await prisma.fileVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FileVersionFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, FileVersionFindUniqueArgs<ExtArgs>>
    ): Prisma__FileVersionClient<$Result.GetResult<Prisma.$FileVersionPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one FileVersion that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {FileVersionFindUniqueOrThrowArgs} args - Arguments to find a FileVersion
     * @example
     * // Get one FileVersion
     * const fileVersion = await prisma.fileVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends FileVersionFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, FileVersionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__FileVersionClient<$Result.GetResult<Prisma.$FileVersionPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first FileVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileVersionFindFirstArgs} args - Arguments to find a FileVersion
     * @example
     * // Get one FileVersion
     * const fileVersion = await prisma.fileVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FileVersionFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, FileVersionFindFirstArgs<ExtArgs>>
    ): Prisma__FileVersionClient<$Result.GetResult<Prisma.$FileVersionPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first FileVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileVersionFindFirstOrThrowArgs} args - Arguments to find a FileVersion
     * @example
     * // Get one FileVersion
     * const fileVersion = await prisma.fileVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends FileVersionFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, FileVersionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__FileVersionClient<$Result.GetResult<Prisma.$FileVersionPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more FileVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileVersionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FileVersions
     * const fileVersions = await prisma.fileVersion.findMany()
     * 
     * // Get first 10 FileVersions
     * const fileVersions = await prisma.fileVersion.findMany({ take: 10 })
     * 
     * // Only select the `username`
     * const fileVersionWithUsernameOnly = await prisma.fileVersion.findMany({ select: { username: true } })
     * 
    **/
    findMany<T extends FileVersionFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FileVersionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileVersionPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a FileVersion.
     * @param {FileVersionCreateArgs} args - Arguments to create a FileVersion.
     * @example
     * // Create one FileVersion
     * const FileVersion = await prisma.fileVersion.create({
     *   data: {
     *     // ... data to create a FileVersion
     *   }
     * })
     * 
    **/
    create<T extends FileVersionCreateArgs<ExtArgs>>(
      args: SelectSubset<T, FileVersionCreateArgs<ExtArgs>>
    ): Prisma__FileVersionClient<$Result.GetResult<Prisma.$FileVersionPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many FileVersions.
     *     @param {FileVersionCreateManyArgs} args - Arguments to create many FileVersions.
     *     @example
     *     // Create many FileVersions
     *     const fileVersion = await prisma.fileVersion.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends FileVersionCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FileVersionCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a FileVersion.
     * @param {FileVersionDeleteArgs} args - Arguments to delete one FileVersion.
     * @example
     * // Delete one FileVersion
     * const FileVersion = await prisma.fileVersion.delete({
     *   where: {
     *     // ... filter to delete one FileVersion
     *   }
     * })
     * 
    **/
    delete<T extends FileVersionDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, FileVersionDeleteArgs<ExtArgs>>
    ): Prisma__FileVersionClient<$Result.GetResult<Prisma.$FileVersionPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one FileVersion.
     * @param {FileVersionUpdateArgs} args - Arguments to update one FileVersion.
     * @example
     * // Update one FileVersion
     * const fileVersion = await prisma.fileVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends FileVersionUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, FileVersionUpdateArgs<ExtArgs>>
    ): Prisma__FileVersionClient<$Result.GetResult<Prisma.$FileVersionPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more FileVersions.
     * @param {FileVersionDeleteManyArgs} args - Arguments to filter FileVersions to delete.
     * @example
     * // Delete a few FileVersions
     * const { count } = await prisma.fileVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends FileVersionDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FileVersionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FileVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FileVersions
     * const fileVersion = await prisma.fileVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends FileVersionUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, FileVersionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FileVersion.
     * @param {FileVersionUpsertArgs} args - Arguments to update or create a FileVersion.
     * @example
     * // Update or create a FileVersion
     * const fileVersion = await prisma.fileVersion.upsert({
     *   create: {
     *     // ... data to create a FileVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FileVersion we want to update
     *   }
     * })
    **/
    upsert<T extends FileVersionUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, FileVersionUpsertArgs<ExtArgs>>
    ): Prisma__FileVersionClient<$Result.GetResult<Prisma.$FileVersionPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of FileVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileVersionCountArgs} args - Arguments to filter FileVersions to count.
     * @example
     * // Count the number of FileVersions
     * const count = await prisma.fileVersion.count({
     *   where: {
     *     // ... the filter for the FileVersions we want to count
     *   }
     * })
    **/
    count<T extends FileVersionCountArgs>(
      args?: Subset<T, FileVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileVersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FileVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FileVersionAggregateArgs>(args: Subset<T, FileVersionAggregateArgs>): Prisma.PrismaPromise<GetFileVersionAggregateType<T>>

    /**
     * Group by FileVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileVersionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FileVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileVersionGroupByArgs['orderBy'] }
        : { orderBy?: FileVersionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FileVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FileVersion model
   */
  readonly fields: FileVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FileVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileVersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    LatestFile<T extends FileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FileDefaultArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the FileVersion model
   */ 
  interface FileVersionFieldRefs {
    readonly username: FieldRef<"FileVersion", 'String'>
    readonly device: FieldRef<"FileVersion", 'String'>
    readonly directory: FieldRef<"FileVersion", 'String'>
    readonly uuid: FieldRef<"FileVersion", 'String'>
    readonly origin: FieldRef<"FileVersion", 'String'>
    readonly filename: FieldRef<"FileVersion", 'String'>
    readonly last_modified: FieldRef<"FileVersion", 'DateTime'>
    readonly hashvalue: FieldRef<"FileVersion", 'String'>
    readonly enc_hashvalue: FieldRef<"FileVersion", 'String'>
    readonly versions: FieldRef<"FileVersion", 'Int'>
    readonly size: FieldRef<"FileVersion", 'BigInt'>
    readonly salt: FieldRef<"FileVersion", 'String'>
    readonly iv: FieldRef<"FileVersion", 'String'>
  }
    

  // Custom InputTypes

  /**
   * FileVersion findUnique
   */
  export type FileVersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileVersion
     */
    select?: FileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileVersionInclude<ExtArgs> | null
    /**
     * Filter, which FileVersion to fetch.
     */
    where: FileVersionWhereUniqueInput
  }


  /**
   * FileVersion findUniqueOrThrow
   */
  export type FileVersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileVersion
     */
    select?: FileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileVersionInclude<ExtArgs> | null
    /**
     * Filter, which FileVersion to fetch.
     */
    where: FileVersionWhereUniqueInput
  }


  /**
   * FileVersion findFirst
   */
  export type FileVersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileVersion
     */
    select?: FileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileVersionInclude<ExtArgs> | null
    /**
     * Filter, which FileVersion to fetch.
     */
    where?: FileVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileVersions to fetch.
     */
    orderBy?: FileVersionOrderByWithRelationAndSearchRelevanceInput | FileVersionOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileVersions.
     */
    cursor?: FileVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileVersions.
     */
    distinct?: FileVersionScalarFieldEnum | FileVersionScalarFieldEnum[]
  }


  /**
   * FileVersion findFirstOrThrow
   */
  export type FileVersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileVersion
     */
    select?: FileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileVersionInclude<ExtArgs> | null
    /**
     * Filter, which FileVersion to fetch.
     */
    where?: FileVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileVersions to fetch.
     */
    orderBy?: FileVersionOrderByWithRelationAndSearchRelevanceInput | FileVersionOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileVersions.
     */
    cursor?: FileVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileVersions.
     */
    distinct?: FileVersionScalarFieldEnum | FileVersionScalarFieldEnum[]
  }


  /**
   * FileVersion findMany
   */
  export type FileVersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileVersion
     */
    select?: FileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileVersionInclude<ExtArgs> | null
    /**
     * Filter, which FileVersions to fetch.
     */
    where?: FileVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileVersions to fetch.
     */
    orderBy?: FileVersionOrderByWithRelationAndSearchRelevanceInput | FileVersionOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FileVersions.
     */
    cursor?: FileVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileVersions.
     */
    skip?: number
    distinct?: FileVersionScalarFieldEnum | FileVersionScalarFieldEnum[]
  }


  /**
   * FileVersion create
   */
  export type FileVersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileVersion
     */
    select?: FileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileVersionInclude<ExtArgs> | null
    /**
     * The data needed to create a FileVersion.
     */
    data: XOR<FileVersionCreateInput, FileVersionUncheckedCreateInput>
  }


  /**
   * FileVersion createMany
   */
  export type FileVersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FileVersions.
     */
    data: FileVersionCreateManyInput | FileVersionCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * FileVersion update
   */
  export type FileVersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileVersion
     */
    select?: FileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileVersionInclude<ExtArgs> | null
    /**
     * The data needed to update a FileVersion.
     */
    data: XOR<FileVersionUpdateInput, FileVersionUncheckedUpdateInput>
    /**
     * Choose, which FileVersion to update.
     */
    where: FileVersionWhereUniqueInput
  }


  /**
   * FileVersion updateMany
   */
  export type FileVersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FileVersions.
     */
    data: XOR<FileVersionUpdateManyMutationInput, FileVersionUncheckedUpdateManyInput>
    /**
     * Filter which FileVersions to update
     */
    where?: FileVersionWhereInput
  }


  /**
   * FileVersion upsert
   */
  export type FileVersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileVersion
     */
    select?: FileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileVersionInclude<ExtArgs> | null
    /**
     * The filter to search for the FileVersion to update in case it exists.
     */
    where: FileVersionWhereUniqueInput
    /**
     * In case the FileVersion found by the `where` argument doesn't exist, create a new FileVersion with this data.
     */
    create: XOR<FileVersionCreateInput, FileVersionUncheckedCreateInput>
    /**
     * In case the FileVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileVersionUpdateInput, FileVersionUncheckedUpdateInput>
  }


  /**
   * FileVersion delete
   */
  export type FileVersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileVersion
     */
    select?: FileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileVersionInclude<ExtArgs> | null
    /**
     * Filter which FileVersion to delete.
     */
    where: FileVersionWhereUniqueInput
  }


  /**
   * FileVersion deleteMany
   */
  export type FileVersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileVersions to delete
     */
    where?: FileVersionWhereInput
  }


  /**
   * FileVersion without action
   */
  export type FileVersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileVersion
     */
    select?: FileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileVersionInclude<ExtArgs> | null
  }



  /**
   * Model DeletedFile
   */

  export type AggregateDeletedFile = {
    _count: DeletedFileCountAggregateOutputType | null
    _avg: DeletedFileAvgAggregateOutputType | null
    _sum: DeletedFileSumAggregateOutputType | null
    _min: DeletedFileMinAggregateOutputType | null
    _max: DeletedFileMaxAggregateOutputType | null
  }

  export type DeletedFileAvgAggregateOutputType = {
    versions: number | null
    size: number | null
  }

  export type DeletedFileSumAggregateOutputType = {
    versions: number | null
    size: bigint | null
  }

  export type DeletedFileMinAggregateOutputType = {
    username: string | null
    device: string | null
    directory: string | null
    uuid: string | null
    origin: string | null
    filename: string | null
    last_modified: Date | null
    hashvalue: string | null
    enc_hashvalue: string | null
    versions: number | null
    size: bigint | null
    salt: string | null
    iv: string | null
    deletion_date: Date | null
    deletion_type: string | null
    dirID: string | null
  }

  export type DeletedFileMaxAggregateOutputType = {
    username: string | null
    device: string | null
    directory: string | null
    uuid: string | null
    origin: string | null
    filename: string | null
    last_modified: Date | null
    hashvalue: string | null
    enc_hashvalue: string | null
    versions: number | null
    size: bigint | null
    salt: string | null
    iv: string | null
    deletion_date: Date | null
    deletion_type: string | null
    dirID: string | null
  }

  export type DeletedFileCountAggregateOutputType = {
    username: number
    device: number
    directory: number
    uuid: number
    origin: number
    filename: number
    last_modified: number
    hashvalue: number
    enc_hashvalue: number
    versions: number
    size: number
    salt: number
    iv: number
    deletion_date: number
    deletion_type: number
    dirID: number
    _all: number
  }


  export type DeletedFileAvgAggregateInputType = {
    versions?: true
    size?: true
  }

  export type DeletedFileSumAggregateInputType = {
    versions?: true
    size?: true
  }

  export type DeletedFileMinAggregateInputType = {
    username?: true
    device?: true
    directory?: true
    uuid?: true
    origin?: true
    filename?: true
    last_modified?: true
    hashvalue?: true
    enc_hashvalue?: true
    versions?: true
    size?: true
    salt?: true
    iv?: true
    deletion_date?: true
    deletion_type?: true
    dirID?: true
  }

  export type DeletedFileMaxAggregateInputType = {
    username?: true
    device?: true
    directory?: true
    uuid?: true
    origin?: true
    filename?: true
    last_modified?: true
    hashvalue?: true
    enc_hashvalue?: true
    versions?: true
    size?: true
    salt?: true
    iv?: true
    deletion_date?: true
    deletion_type?: true
    dirID?: true
  }

  export type DeletedFileCountAggregateInputType = {
    username?: true
    device?: true
    directory?: true
    uuid?: true
    origin?: true
    filename?: true
    last_modified?: true
    hashvalue?: true
    enc_hashvalue?: true
    versions?: true
    size?: true
    salt?: true
    iv?: true
    deletion_date?: true
    deletion_type?: true
    dirID?: true
    _all?: true
  }

  export type DeletedFileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeletedFile to aggregate.
     */
    where?: DeletedFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeletedFiles to fetch.
     */
    orderBy?: DeletedFileOrderByWithRelationAndSearchRelevanceInput | DeletedFileOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeletedFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeletedFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeletedFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DeletedFiles
    **/
    _count?: true | DeletedFileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DeletedFileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DeletedFileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeletedFileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeletedFileMaxAggregateInputType
  }

  export type GetDeletedFileAggregateType<T extends DeletedFileAggregateArgs> = {
        [P in keyof T & keyof AggregateDeletedFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeletedFile[P]>
      : GetScalarType<T[P], AggregateDeletedFile[P]>
  }




  export type DeletedFileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeletedFileWhereInput
    orderBy?: DeletedFileOrderByWithAggregationInput | DeletedFileOrderByWithAggregationInput[]
    by: DeletedFileScalarFieldEnum[] | DeletedFileScalarFieldEnum
    having?: DeletedFileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeletedFileCountAggregateInputType | true
    _avg?: DeletedFileAvgAggregateInputType
    _sum?: DeletedFileSumAggregateInputType
    _min?: DeletedFileMinAggregateInputType
    _max?: DeletedFileMaxAggregateInputType
  }

  export type DeletedFileGroupByOutputType = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint
    salt: string
    iv: string
    deletion_date: Date
    deletion_type: string
    dirID: string
    _count: DeletedFileCountAggregateOutputType | null
    _avg: DeletedFileAvgAggregateOutputType | null
    _sum: DeletedFileSumAggregateOutputType | null
    _min: DeletedFileMinAggregateOutputType | null
    _max: DeletedFileMaxAggregateOutputType | null
  }

  type GetDeletedFileGroupByPayload<T extends DeletedFileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeletedFileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeletedFileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeletedFileGroupByOutputType[P]>
            : GetScalarType<T[P], DeletedFileGroupByOutputType[P]>
        }
      >
    >


  export type DeletedFileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    username?: boolean
    device?: boolean
    directory?: boolean
    uuid?: boolean
    origin?: boolean
    filename?: boolean
    last_modified?: boolean
    hashvalue?: boolean
    enc_hashvalue?: boolean
    versions?: boolean
    size?: boolean
    salt?: boolean
    iv?: boolean
    deletion_date?: boolean
    deletion_type?: boolean
    dirID?: boolean
    directoryID?: boolean | DeletedDirectoryDefaultArgs<ExtArgs>
    deletedFileVersions?: boolean | DeletedFile$deletedFileVersionsArgs<ExtArgs>
    _count?: boolean | DeletedFileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deletedFile"]>

  export type DeletedFileSelectScalar = {
    username?: boolean
    device?: boolean
    directory?: boolean
    uuid?: boolean
    origin?: boolean
    filename?: boolean
    last_modified?: boolean
    hashvalue?: boolean
    enc_hashvalue?: boolean
    versions?: boolean
    size?: boolean
    salt?: boolean
    iv?: boolean
    deletion_date?: boolean
    deletion_type?: boolean
    dirID?: boolean
  }

  export type DeletedFileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    directoryID?: boolean | DeletedDirectoryDefaultArgs<ExtArgs>
    deletedFileVersions?: boolean | DeletedFile$deletedFileVersionsArgs<ExtArgs>
    _count?: boolean | DeletedFileCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $DeletedFilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DeletedFile"
    objects: {
      directoryID: Prisma.$DeletedDirectoryPayload<ExtArgs>
      deletedFileVersions: Prisma.$DeletedFileVersionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      username: string
      device: string
      directory: string
      uuid: string
      origin: string
      filename: string
      last_modified: Date
      hashvalue: string
      enc_hashvalue: string
      versions: number
      size: bigint
      salt: string
      iv: string
      deletion_date: Date
      deletion_type: string
      dirID: string
    }, ExtArgs["result"]["deletedFile"]>
    composites: {}
  }


  type DeletedFileGetPayload<S extends boolean | null | undefined | DeletedFileDefaultArgs> = $Result.GetResult<Prisma.$DeletedFilePayload, S>

  type DeletedFileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DeletedFileFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DeletedFileCountAggregateInputType | true
    }

  export interface DeletedFileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DeletedFile'], meta: { name: 'DeletedFile' } }
    /**
     * Find zero or one DeletedFile that matches the filter.
     * @param {DeletedFileFindUniqueArgs} args - Arguments to find a DeletedFile
     * @example
     * // Get one DeletedFile
     * const deletedFile = await prisma.deletedFile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends DeletedFileFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedFileFindUniqueArgs<ExtArgs>>
    ): Prisma__DeletedFileClient<$Result.GetResult<Prisma.$DeletedFilePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one DeletedFile that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {DeletedFileFindUniqueOrThrowArgs} args - Arguments to find a DeletedFile
     * @example
     * // Get one DeletedFile
     * const deletedFile = await prisma.deletedFile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends DeletedFileFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedFileFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__DeletedFileClient<$Result.GetResult<Prisma.$DeletedFilePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first DeletedFile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedFileFindFirstArgs} args - Arguments to find a DeletedFile
     * @example
     * // Get one DeletedFile
     * const deletedFile = await prisma.deletedFile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends DeletedFileFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedFileFindFirstArgs<ExtArgs>>
    ): Prisma__DeletedFileClient<$Result.GetResult<Prisma.$DeletedFilePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first DeletedFile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedFileFindFirstOrThrowArgs} args - Arguments to find a DeletedFile
     * @example
     * // Get one DeletedFile
     * const deletedFile = await prisma.deletedFile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends DeletedFileFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedFileFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__DeletedFileClient<$Result.GetResult<Prisma.$DeletedFilePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more DeletedFiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedFileFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DeletedFiles
     * const deletedFiles = await prisma.deletedFile.findMany()
     * 
     * // Get first 10 DeletedFiles
     * const deletedFiles = await prisma.deletedFile.findMany({ take: 10 })
     * 
     * // Only select the `username`
     * const deletedFileWithUsernameOnly = await prisma.deletedFile.findMany({ select: { username: true } })
     * 
    **/
    findMany<T extends DeletedFileFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedFileFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeletedFilePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a DeletedFile.
     * @param {DeletedFileCreateArgs} args - Arguments to create a DeletedFile.
     * @example
     * // Create one DeletedFile
     * const DeletedFile = await prisma.deletedFile.create({
     *   data: {
     *     // ... data to create a DeletedFile
     *   }
     * })
     * 
    **/
    create<T extends DeletedFileCreateArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedFileCreateArgs<ExtArgs>>
    ): Prisma__DeletedFileClient<$Result.GetResult<Prisma.$DeletedFilePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many DeletedFiles.
     *     @param {DeletedFileCreateManyArgs} args - Arguments to create many DeletedFiles.
     *     @example
     *     // Create many DeletedFiles
     *     const deletedFile = await prisma.deletedFile.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends DeletedFileCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedFileCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a DeletedFile.
     * @param {DeletedFileDeleteArgs} args - Arguments to delete one DeletedFile.
     * @example
     * // Delete one DeletedFile
     * const DeletedFile = await prisma.deletedFile.delete({
     *   where: {
     *     // ... filter to delete one DeletedFile
     *   }
     * })
     * 
    **/
    delete<T extends DeletedFileDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedFileDeleteArgs<ExtArgs>>
    ): Prisma__DeletedFileClient<$Result.GetResult<Prisma.$DeletedFilePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one DeletedFile.
     * @param {DeletedFileUpdateArgs} args - Arguments to update one DeletedFile.
     * @example
     * // Update one DeletedFile
     * const deletedFile = await prisma.deletedFile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends DeletedFileUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedFileUpdateArgs<ExtArgs>>
    ): Prisma__DeletedFileClient<$Result.GetResult<Prisma.$DeletedFilePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more DeletedFiles.
     * @param {DeletedFileDeleteManyArgs} args - Arguments to filter DeletedFiles to delete.
     * @example
     * // Delete a few DeletedFiles
     * const { count } = await prisma.deletedFile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends DeletedFileDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedFileDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeletedFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedFileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DeletedFiles
     * const deletedFile = await prisma.deletedFile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends DeletedFileUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedFileUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DeletedFile.
     * @param {DeletedFileUpsertArgs} args - Arguments to update or create a DeletedFile.
     * @example
     * // Update or create a DeletedFile
     * const deletedFile = await prisma.deletedFile.upsert({
     *   create: {
     *     // ... data to create a DeletedFile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DeletedFile we want to update
     *   }
     * })
    **/
    upsert<T extends DeletedFileUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedFileUpsertArgs<ExtArgs>>
    ): Prisma__DeletedFileClient<$Result.GetResult<Prisma.$DeletedFilePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of DeletedFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedFileCountArgs} args - Arguments to filter DeletedFiles to count.
     * @example
     * // Count the number of DeletedFiles
     * const count = await prisma.deletedFile.count({
     *   where: {
     *     // ... the filter for the DeletedFiles we want to count
     *   }
     * })
    **/
    count<T extends DeletedFileCountArgs>(
      args?: Subset<T, DeletedFileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeletedFileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DeletedFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedFileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeletedFileAggregateArgs>(args: Subset<T, DeletedFileAggregateArgs>): Prisma.PrismaPromise<GetDeletedFileAggregateType<T>>

    /**
     * Group by DeletedFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedFileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeletedFileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeletedFileGroupByArgs['orderBy'] }
        : { orderBy?: DeletedFileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeletedFileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeletedFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DeletedFile model
   */
  readonly fields: DeletedFileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DeletedFile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeletedFileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    directoryID<T extends DeletedDirectoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DeletedDirectoryDefaultArgs<ExtArgs>>): Prisma__DeletedDirectoryClient<$Result.GetResult<Prisma.$DeletedDirectoryPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    deletedFileVersions<T extends DeletedFile$deletedFileVersionsArgs<ExtArgs> = {}>(args?: Subset<T, DeletedFile$deletedFileVersionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeletedFileVersionPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the DeletedFile model
   */ 
  interface DeletedFileFieldRefs {
    readonly username: FieldRef<"DeletedFile", 'String'>
    readonly device: FieldRef<"DeletedFile", 'String'>
    readonly directory: FieldRef<"DeletedFile", 'String'>
    readonly uuid: FieldRef<"DeletedFile", 'String'>
    readonly origin: FieldRef<"DeletedFile", 'String'>
    readonly filename: FieldRef<"DeletedFile", 'String'>
    readonly last_modified: FieldRef<"DeletedFile", 'DateTime'>
    readonly hashvalue: FieldRef<"DeletedFile", 'String'>
    readonly enc_hashvalue: FieldRef<"DeletedFile", 'String'>
    readonly versions: FieldRef<"DeletedFile", 'Int'>
    readonly size: FieldRef<"DeletedFile", 'BigInt'>
    readonly salt: FieldRef<"DeletedFile", 'String'>
    readonly iv: FieldRef<"DeletedFile", 'String'>
    readonly deletion_date: FieldRef<"DeletedFile", 'DateTime'>
    readonly deletion_type: FieldRef<"DeletedFile", 'String'>
    readonly dirID: FieldRef<"DeletedFile", 'String'>
  }
    

  // Custom InputTypes

  /**
   * DeletedFile findUnique
   */
  export type DeletedFileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFile
     */
    select?: DeletedFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileInclude<ExtArgs> | null
    /**
     * Filter, which DeletedFile to fetch.
     */
    where: DeletedFileWhereUniqueInput
  }


  /**
   * DeletedFile findUniqueOrThrow
   */
  export type DeletedFileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFile
     */
    select?: DeletedFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileInclude<ExtArgs> | null
    /**
     * Filter, which DeletedFile to fetch.
     */
    where: DeletedFileWhereUniqueInput
  }


  /**
   * DeletedFile findFirst
   */
  export type DeletedFileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFile
     */
    select?: DeletedFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileInclude<ExtArgs> | null
    /**
     * Filter, which DeletedFile to fetch.
     */
    where?: DeletedFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeletedFiles to fetch.
     */
    orderBy?: DeletedFileOrderByWithRelationAndSearchRelevanceInput | DeletedFileOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeletedFiles.
     */
    cursor?: DeletedFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeletedFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeletedFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeletedFiles.
     */
    distinct?: DeletedFileScalarFieldEnum | DeletedFileScalarFieldEnum[]
  }


  /**
   * DeletedFile findFirstOrThrow
   */
  export type DeletedFileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFile
     */
    select?: DeletedFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileInclude<ExtArgs> | null
    /**
     * Filter, which DeletedFile to fetch.
     */
    where?: DeletedFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeletedFiles to fetch.
     */
    orderBy?: DeletedFileOrderByWithRelationAndSearchRelevanceInput | DeletedFileOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeletedFiles.
     */
    cursor?: DeletedFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeletedFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeletedFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeletedFiles.
     */
    distinct?: DeletedFileScalarFieldEnum | DeletedFileScalarFieldEnum[]
  }


  /**
   * DeletedFile findMany
   */
  export type DeletedFileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFile
     */
    select?: DeletedFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileInclude<ExtArgs> | null
    /**
     * Filter, which DeletedFiles to fetch.
     */
    where?: DeletedFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeletedFiles to fetch.
     */
    orderBy?: DeletedFileOrderByWithRelationAndSearchRelevanceInput | DeletedFileOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DeletedFiles.
     */
    cursor?: DeletedFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeletedFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeletedFiles.
     */
    skip?: number
    distinct?: DeletedFileScalarFieldEnum | DeletedFileScalarFieldEnum[]
  }


  /**
   * DeletedFile create
   */
  export type DeletedFileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFile
     */
    select?: DeletedFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileInclude<ExtArgs> | null
    /**
     * The data needed to create a DeletedFile.
     */
    data: XOR<DeletedFileCreateInput, DeletedFileUncheckedCreateInput>
  }


  /**
   * DeletedFile createMany
   */
  export type DeletedFileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DeletedFiles.
     */
    data: DeletedFileCreateManyInput | DeletedFileCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * DeletedFile update
   */
  export type DeletedFileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFile
     */
    select?: DeletedFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileInclude<ExtArgs> | null
    /**
     * The data needed to update a DeletedFile.
     */
    data: XOR<DeletedFileUpdateInput, DeletedFileUncheckedUpdateInput>
    /**
     * Choose, which DeletedFile to update.
     */
    where: DeletedFileWhereUniqueInput
  }


  /**
   * DeletedFile updateMany
   */
  export type DeletedFileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DeletedFiles.
     */
    data: XOR<DeletedFileUpdateManyMutationInput, DeletedFileUncheckedUpdateManyInput>
    /**
     * Filter which DeletedFiles to update
     */
    where?: DeletedFileWhereInput
  }


  /**
   * DeletedFile upsert
   */
  export type DeletedFileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFile
     */
    select?: DeletedFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileInclude<ExtArgs> | null
    /**
     * The filter to search for the DeletedFile to update in case it exists.
     */
    where: DeletedFileWhereUniqueInput
    /**
     * In case the DeletedFile found by the `where` argument doesn't exist, create a new DeletedFile with this data.
     */
    create: XOR<DeletedFileCreateInput, DeletedFileUncheckedCreateInput>
    /**
     * In case the DeletedFile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeletedFileUpdateInput, DeletedFileUncheckedUpdateInput>
  }


  /**
   * DeletedFile delete
   */
  export type DeletedFileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFile
     */
    select?: DeletedFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileInclude<ExtArgs> | null
    /**
     * Filter which DeletedFile to delete.
     */
    where: DeletedFileWhereUniqueInput
  }


  /**
   * DeletedFile deleteMany
   */
  export type DeletedFileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeletedFiles to delete
     */
    where?: DeletedFileWhereInput
  }


  /**
   * DeletedFile.deletedFileVersions
   */
  export type DeletedFile$deletedFileVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFileVersion
     */
    select?: DeletedFileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileVersionInclude<ExtArgs> | null
    where?: DeletedFileVersionWhereInput
    orderBy?: DeletedFileVersionOrderByWithRelationAndSearchRelevanceInput | DeletedFileVersionOrderByWithRelationAndSearchRelevanceInput[]
    cursor?: DeletedFileVersionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeletedFileVersionScalarFieldEnum | DeletedFileVersionScalarFieldEnum[]
  }


  /**
   * DeletedFile without action
   */
  export type DeletedFileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFile
     */
    select?: DeletedFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileInclude<ExtArgs> | null
  }



  /**
   * Model DeletedFileVersion
   */

  export type AggregateDeletedFileVersion = {
    _count: DeletedFileVersionCountAggregateOutputType | null
    _avg: DeletedFileVersionAvgAggregateOutputType | null
    _sum: DeletedFileVersionSumAggregateOutputType | null
    _min: DeletedFileVersionMinAggregateOutputType | null
    _max: DeletedFileVersionMaxAggregateOutputType | null
  }

  export type DeletedFileVersionAvgAggregateOutputType = {
    versions: number | null
    size: number | null
  }

  export type DeletedFileVersionSumAggregateOutputType = {
    versions: number | null
    size: bigint | null
  }

  export type DeletedFileVersionMinAggregateOutputType = {
    username: string | null
    device: string | null
    directory: string | null
    uuid: string | null
    origin: string | null
    filename: string | null
    last_modified: Date | null
    hashvalue: string | null
    enc_hashvalue: string | null
    versions: number | null
    size: bigint | null
    salt: string | null
    iv: string | null
    deletion_date: Date | null
    deletion_type: string | null
  }

  export type DeletedFileVersionMaxAggregateOutputType = {
    username: string | null
    device: string | null
    directory: string | null
    uuid: string | null
    origin: string | null
    filename: string | null
    last_modified: Date | null
    hashvalue: string | null
    enc_hashvalue: string | null
    versions: number | null
    size: bigint | null
    salt: string | null
    iv: string | null
    deletion_date: Date | null
    deletion_type: string | null
  }

  export type DeletedFileVersionCountAggregateOutputType = {
    username: number
    device: number
    directory: number
    uuid: number
    origin: number
    filename: number
    last_modified: number
    hashvalue: number
    enc_hashvalue: number
    versions: number
    size: number
    salt: number
    iv: number
    deletion_date: number
    deletion_type: number
    _all: number
  }


  export type DeletedFileVersionAvgAggregateInputType = {
    versions?: true
    size?: true
  }

  export type DeletedFileVersionSumAggregateInputType = {
    versions?: true
    size?: true
  }

  export type DeletedFileVersionMinAggregateInputType = {
    username?: true
    device?: true
    directory?: true
    uuid?: true
    origin?: true
    filename?: true
    last_modified?: true
    hashvalue?: true
    enc_hashvalue?: true
    versions?: true
    size?: true
    salt?: true
    iv?: true
    deletion_date?: true
    deletion_type?: true
  }

  export type DeletedFileVersionMaxAggregateInputType = {
    username?: true
    device?: true
    directory?: true
    uuid?: true
    origin?: true
    filename?: true
    last_modified?: true
    hashvalue?: true
    enc_hashvalue?: true
    versions?: true
    size?: true
    salt?: true
    iv?: true
    deletion_date?: true
    deletion_type?: true
  }

  export type DeletedFileVersionCountAggregateInputType = {
    username?: true
    device?: true
    directory?: true
    uuid?: true
    origin?: true
    filename?: true
    last_modified?: true
    hashvalue?: true
    enc_hashvalue?: true
    versions?: true
    size?: true
    salt?: true
    iv?: true
    deletion_date?: true
    deletion_type?: true
    _all?: true
  }

  export type DeletedFileVersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeletedFileVersion to aggregate.
     */
    where?: DeletedFileVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeletedFileVersions to fetch.
     */
    orderBy?: DeletedFileVersionOrderByWithRelationAndSearchRelevanceInput | DeletedFileVersionOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeletedFileVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeletedFileVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeletedFileVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DeletedFileVersions
    **/
    _count?: true | DeletedFileVersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DeletedFileVersionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DeletedFileVersionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeletedFileVersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeletedFileVersionMaxAggregateInputType
  }

  export type GetDeletedFileVersionAggregateType<T extends DeletedFileVersionAggregateArgs> = {
        [P in keyof T & keyof AggregateDeletedFileVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeletedFileVersion[P]>
      : GetScalarType<T[P], AggregateDeletedFileVersion[P]>
  }




  export type DeletedFileVersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeletedFileVersionWhereInput
    orderBy?: DeletedFileVersionOrderByWithAggregationInput | DeletedFileVersionOrderByWithAggregationInput[]
    by: DeletedFileVersionScalarFieldEnum[] | DeletedFileVersionScalarFieldEnum
    having?: DeletedFileVersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeletedFileVersionCountAggregateInputType | true
    _avg?: DeletedFileVersionAvgAggregateInputType
    _sum?: DeletedFileVersionSumAggregateInputType
    _min?: DeletedFileVersionMinAggregateInputType
    _max?: DeletedFileVersionMaxAggregateInputType
  }

  export type DeletedFileVersionGroupByOutputType = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint
    salt: string
    iv: string
    deletion_date: Date
    deletion_type: string
    _count: DeletedFileVersionCountAggregateOutputType | null
    _avg: DeletedFileVersionAvgAggregateOutputType | null
    _sum: DeletedFileVersionSumAggregateOutputType | null
    _min: DeletedFileVersionMinAggregateOutputType | null
    _max: DeletedFileVersionMaxAggregateOutputType | null
  }

  type GetDeletedFileVersionGroupByPayload<T extends DeletedFileVersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeletedFileVersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeletedFileVersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeletedFileVersionGroupByOutputType[P]>
            : GetScalarType<T[P], DeletedFileVersionGroupByOutputType[P]>
        }
      >
    >


  export type DeletedFileVersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    username?: boolean
    device?: boolean
    directory?: boolean
    uuid?: boolean
    origin?: boolean
    filename?: boolean
    last_modified?: boolean
    hashvalue?: boolean
    enc_hashvalue?: boolean
    versions?: boolean
    size?: boolean
    salt?: boolean
    iv?: boolean
    deletion_date?: boolean
    deletion_type?: boolean
    latest_deleted_file?: boolean | DeletedFileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deletedFileVersion"]>

  export type DeletedFileVersionSelectScalar = {
    username?: boolean
    device?: boolean
    directory?: boolean
    uuid?: boolean
    origin?: boolean
    filename?: boolean
    last_modified?: boolean
    hashvalue?: boolean
    enc_hashvalue?: boolean
    versions?: boolean
    size?: boolean
    salt?: boolean
    iv?: boolean
    deletion_date?: boolean
    deletion_type?: boolean
  }

  export type DeletedFileVersionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    latest_deleted_file?: boolean | DeletedFileDefaultArgs<ExtArgs>
  }


  export type $DeletedFileVersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DeletedFileVersion"
    objects: {
      latest_deleted_file: Prisma.$DeletedFilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      username: string
      device: string
      directory: string
      uuid: string
      origin: string
      filename: string
      last_modified: Date
      hashvalue: string
      enc_hashvalue: string
      versions: number
      size: bigint
      salt: string
      iv: string
      deletion_date: Date
      deletion_type: string
    }, ExtArgs["result"]["deletedFileVersion"]>
    composites: {}
  }


  type DeletedFileVersionGetPayload<S extends boolean | null | undefined | DeletedFileVersionDefaultArgs> = $Result.GetResult<Prisma.$DeletedFileVersionPayload, S>

  type DeletedFileVersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DeletedFileVersionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DeletedFileVersionCountAggregateInputType | true
    }

  export interface DeletedFileVersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DeletedFileVersion'], meta: { name: 'DeletedFileVersion' } }
    /**
     * Find zero or one DeletedFileVersion that matches the filter.
     * @param {DeletedFileVersionFindUniqueArgs} args - Arguments to find a DeletedFileVersion
     * @example
     * // Get one DeletedFileVersion
     * const deletedFileVersion = await prisma.deletedFileVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends DeletedFileVersionFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedFileVersionFindUniqueArgs<ExtArgs>>
    ): Prisma__DeletedFileVersionClient<$Result.GetResult<Prisma.$DeletedFileVersionPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one DeletedFileVersion that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {DeletedFileVersionFindUniqueOrThrowArgs} args - Arguments to find a DeletedFileVersion
     * @example
     * // Get one DeletedFileVersion
     * const deletedFileVersion = await prisma.deletedFileVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends DeletedFileVersionFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedFileVersionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__DeletedFileVersionClient<$Result.GetResult<Prisma.$DeletedFileVersionPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first DeletedFileVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedFileVersionFindFirstArgs} args - Arguments to find a DeletedFileVersion
     * @example
     * // Get one DeletedFileVersion
     * const deletedFileVersion = await prisma.deletedFileVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends DeletedFileVersionFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedFileVersionFindFirstArgs<ExtArgs>>
    ): Prisma__DeletedFileVersionClient<$Result.GetResult<Prisma.$DeletedFileVersionPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first DeletedFileVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedFileVersionFindFirstOrThrowArgs} args - Arguments to find a DeletedFileVersion
     * @example
     * // Get one DeletedFileVersion
     * const deletedFileVersion = await prisma.deletedFileVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends DeletedFileVersionFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedFileVersionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__DeletedFileVersionClient<$Result.GetResult<Prisma.$DeletedFileVersionPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more DeletedFileVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedFileVersionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DeletedFileVersions
     * const deletedFileVersions = await prisma.deletedFileVersion.findMany()
     * 
     * // Get first 10 DeletedFileVersions
     * const deletedFileVersions = await prisma.deletedFileVersion.findMany({ take: 10 })
     * 
     * // Only select the `username`
     * const deletedFileVersionWithUsernameOnly = await prisma.deletedFileVersion.findMany({ select: { username: true } })
     * 
    **/
    findMany<T extends DeletedFileVersionFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedFileVersionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeletedFileVersionPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a DeletedFileVersion.
     * @param {DeletedFileVersionCreateArgs} args - Arguments to create a DeletedFileVersion.
     * @example
     * // Create one DeletedFileVersion
     * const DeletedFileVersion = await prisma.deletedFileVersion.create({
     *   data: {
     *     // ... data to create a DeletedFileVersion
     *   }
     * })
     * 
    **/
    create<T extends DeletedFileVersionCreateArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedFileVersionCreateArgs<ExtArgs>>
    ): Prisma__DeletedFileVersionClient<$Result.GetResult<Prisma.$DeletedFileVersionPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many DeletedFileVersions.
     *     @param {DeletedFileVersionCreateManyArgs} args - Arguments to create many DeletedFileVersions.
     *     @example
     *     // Create many DeletedFileVersions
     *     const deletedFileVersion = await prisma.deletedFileVersion.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends DeletedFileVersionCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedFileVersionCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a DeletedFileVersion.
     * @param {DeletedFileVersionDeleteArgs} args - Arguments to delete one DeletedFileVersion.
     * @example
     * // Delete one DeletedFileVersion
     * const DeletedFileVersion = await prisma.deletedFileVersion.delete({
     *   where: {
     *     // ... filter to delete one DeletedFileVersion
     *   }
     * })
     * 
    **/
    delete<T extends DeletedFileVersionDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedFileVersionDeleteArgs<ExtArgs>>
    ): Prisma__DeletedFileVersionClient<$Result.GetResult<Prisma.$DeletedFileVersionPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one DeletedFileVersion.
     * @param {DeletedFileVersionUpdateArgs} args - Arguments to update one DeletedFileVersion.
     * @example
     * // Update one DeletedFileVersion
     * const deletedFileVersion = await prisma.deletedFileVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends DeletedFileVersionUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedFileVersionUpdateArgs<ExtArgs>>
    ): Prisma__DeletedFileVersionClient<$Result.GetResult<Prisma.$DeletedFileVersionPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more DeletedFileVersions.
     * @param {DeletedFileVersionDeleteManyArgs} args - Arguments to filter DeletedFileVersions to delete.
     * @example
     * // Delete a few DeletedFileVersions
     * const { count } = await prisma.deletedFileVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends DeletedFileVersionDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedFileVersionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeletedFileVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedFileVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DeletedFileVersions
     * const deletedFileVersion = await prisma.deletedFileVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends DeletedFileVersionUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedFileVersionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DeletedFileVersion.
     * @param {DeletedFileVersionUpsertArgs} args - Arguments to update or create a DeletedFileVersion.
     * @example
     * // Update or create a DeletedFileVersion
     * const deletedFileVersion = await prisma.deletedFileVersion.upsert({
     *   create: {
     *     // ... data to create a DeletedFileVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DeletedFileVersion we want to update
     *   }
     * })
    **/
    upsert<T extends DeletedFileVersionUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedFileVersionUpsertArgs<ExtArgs>>
    ): Prisma__DeletedFileVersionClient<$Result.GetResult<Prisma.$DeletedFileVersionPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of DeletedFileVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedFileVersionCountArgs} args - Arguments to filter DeletedFileVersions to count.
     * @example
     * // Count the number of DeletedFileVersions
     * const count = await prisma.deletedFileVersion.count({
     *   where: {
     *     // ... the filter for the DeletedFileVersions we want to count
     *   }
     * })
    **/
    count<T extends DeletedFileVersionCountArgs>(
      args?: Subset<T, DeletedFileVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeletedFileVersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DeletedFileVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedFileVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeletedFileVersionAggregateArgs>(args: Subset<T, DeletedFileVersionAggregateArgs>): Prisma.PrismaPromise<GetDeletedFileVersionAggregateType<T>>

    /**
     * Group by DeletedFileVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedFileVersionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeletedFileVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeletedFileVersionGroupByArgs['orderBy'] }
        : { orderBy?: DeletedFileVersionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeletedFileVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeletedFileVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DeletedFileVersion model
   */
  readonly fields: DeletedFileVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DeletedFileVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeletedFileVersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    latest_deleted_file<T extends DeletedFileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DeletedFileDefaultArgs<ExtArgs>>): Prisma__DeletedFileClient<$Result.GetResult<Prisma.$DeletedFilePayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the DeletedFileVersion model
   */ 
  interface DeletedFileVersionFieldRefs {
    readonly username: FieldRef<"DeletedFileVersion", 'String'>
    readonly device: FieldRef<"DeletedFileVersion", 'String'>
    readonly directory: FieldRef<"DeletedFileVersion", 'String'>
    readonly uuid: FieldRef<"DeletedFileVersion", 'String'>
    readonly origin: FieldRef<"DeletedFileVersion", 'String'>
    readonly filename: FieldRef<"DeletedFileVersion", 'String'>
    readonly last_modified: FieldRef<"DeletedFileVersion", 'DateTime'>
    readonly hashvalue: FieldRef<"DeletedFileVersion", 'String'>
    readonly enc_hashvalue: FieldRef<"DeletedFileVersion", 'String'>
    readonly versions: FieldRef<"DeletedFileVersion", 'Int'>
    readonly size: FieldRef<"DeletedFileVersion", 'BigInt'>
    readonly salt: FieldRef<"DeletedFileVersion", 'String'>
    readonly iv: FieldRef<"DeletedFileVersion", 'String'>
    readonly deletion_date: FieldRef<"DeletedFileVersion", 'DateTime'>
    readonly deletion_type: FieldRef<"DeletedFileVersion", 'String'>
  }
    

  // Custom InputTypes

  /**
   * DeletedFileVersion findUnique
   */
  export type DeletedFileVersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFileVersion
     */
    select?: DeletedFileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileVersionInclude<ExtArgs> | null
    /**
     * Filter, which DeletedFileVersion to fetch.
     */
    where: DeletedFileVersionWhereUniqueInput
  }


  /**
   * DeletedFileVersion findUniqueOrThrow
   */
  export type DeletedFileVersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFileVersion
     */
    select?: DeletedFileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileVersionInclude<ExtArgs> | null
    /**
     * Filter, which DeletedFileVersion to fetch.
     */
    where: DeletedFileVersionWhereUniqueInput
  }


  /**
   * DeletedFileVersion findFirst
   */
  export type DeletedFileVersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFileVersion
     */
    select?: DeletedFileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileVersionInclude<ExtArgs> | null
    /**
     * Filter, which DeletedFileVersion to fetch.
     */
    where?: DeletedFileVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeletedFileVersions to fetch.
     */
    orderBy?: DeletedFileVersionOrderByWithRelationAndSearchRelevanceInput | DeletedFileVersionOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeletedFileVersions.
     */
    cursor?: DeletedFileVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeletedFileVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeletedFileVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeletedFileVersions.
     */
    distinct?: DeletedFileVersionScalarFieldEnum | DeletedFileVersionScalarFieldEnum[]
  }


  /**
   * DeletedFileVersion findFirstOrThrow
   */
  export type DeletedFileVersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFileVersion
     */
    select?: DeletedFileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileVersionInclude<ExtArgs> | null
    /**
     * Filter, which DeletedFileVersion to fetch.
     */
    where?: DeletedFileVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeletedFileVersions to fetch.
     */
    orderBy?: DeletedFileVersionOrderByWithRelationAndSearchRelevanceInput | DeletedFileVersionOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeletedFileVersions.
     */
    cursor?: DeletedFileVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeletedFileVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeletedFileVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeletedFileVersions.
     */
    distinct?: DeletedFileVersionScalarFieldEnum | DeletedFileVersionScalarFieldEnum[]
  }


  /**
   * DeletedFileVersion findMany
   */
  export type DeletedFileVersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFileVersion
     */
    select?: DeletedFileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileVersionInclude<ExtArgs> | null
    /**
     * Filter, which DeletedFileVersions to fetch.
     */
    where?: DeletedFileVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeletedFileVersions to fetch.
     */
    orderBy?: DeletedFileVersionOrderByWithRelationAndSearchRelevanceInput | DeletedFileVersionOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DeletedFileVersions.
     */
    cursor?: DeletedFileVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeletedFileVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeletedFileVersions.
     */
    skip?: number
    distinct?: DeletedFileVersionScalarFieldEnum | DeletedFileVersionScalarFieldEnum[]
  }


  /**
   * DeletedFileVersion create
   */
  export type DeletedFileVersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFileVersion
     */
    select?: DeletedFileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileVersionInclude<ExtArgs> | null
    /**
     * The data needed to create a DeletedFileVersion.
     */
    data: XOR<DeletedFileVersionCreateInput, DeletedFileVersionUncheckedCreateInput>
  }


  /**
   * DeletedFileVersion createMany
   */
  export type DeletedFileVersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DeletedFileVersions.
     */
    data: DeletedFileVersionCreateManyInput | DeletedFileVersionCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * DeletedFileVersion update
   */
  export type DeletedFileVersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFileVersion
     */
    select?: DeletedFileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileVersionInclude<ExtArgs> | null
    /**
     * The data needed to update a DeletedFileVersion.
     */
    data: XOR<DeletedFileVersionUpdateInput, DeletedFileVersionUncheckedUpdateInput>
    /**
     * Choose, which DeletedFileVersion to update.
     */
    where: DeletedFileVersionWhereUniqueInput
  }


  /**
   * DeletedFileVersion updateMany
   */
  export type DeletedFileVersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DeletedFileVersions.
     */
    data: XOR<DeletedFileVersionUpdateManyMutationInput, DeletedFileVersionUncheckedUpdateManyInput>
    /**
     * Filter which DeletedFileVersions to update
     */
    where?: DeletedFileVersionWhereInput
  }


  /**
   * DeletedFileVersion upsert
   */
  export type DeletedFileVersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFileVersion
     */
    select?: DeletedFileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileVersionInclude<ExtArgs> | null
    /**
     * The filter to search for the DeletedFileVersion to update in case it exists.
     */
    where: DeletedFileVersionWhereUniqueInput
    /**
     * In case the DeletedFileVersion found by the `where` argument doesn't exist, create a new DeletedFileVersion with this data.
     */
    create: XOR<DeletedFileVersionCreateInput, DeletedFileVersionUncheckedCreateInput>
    /**
     * In case the DeletedFileVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeletedFileVersionUpdateInput, DeletedFileVersionUncheckedUpdateInput>
  }


  /**
   * DeletedFileVersion delete
   */
  export type DeletedFileVersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFileVersion
     */
    select?: DeletedFileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileVersionInclude<ExtArgs> | null
    /**
     * Filter which DeletedFileVersion to delete.
     */
    where: DeletedFileVersionWhereUniqueInput
  }


  /**
   * DeletedFileVersion deleteMany
   */
  export type DeletedFileVersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeletedFileVersions to delete
     */
    where?: DeletedFileVersionWhereInput
  }


  /**
   * DeletedFileVersion without action
   */
  export type DeletedFileVersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFileVersion
     */
    select?: DeletedFileVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileVersionInclude<ExtArgs> | null
  }



  /**
   * Model Directory
   */

  export type AggregateDirectory = {
    _count: DirectoryCountAggregateOutputType | null
    _min: DirectoryMinAggregateOutputType | null
    _max: DirectoryMaxAggregateOutputType | null
  }

  export type DirectoryMinAggregateOutputType = {
    uuid: string | null
    username: string | null
    device: string | null
    folder: string | null
    path: string | null
    created_at: Date | null
  }

  export type DirectoryMaxAggregateOutputType = {
    uuid: string | null
    username: string | null
    device: string | null
    folder: string | null
    path: string | null
    created_at: Date | null
  }

  export type DirectoryCountAggregateOutputType = {
    uuid: number
    username: number
    device: number
    folder: number
    path: number
    created_at: number
    _all: number
  }


  export type DirectoryMinAggregateInputType = {
    uuid?: true
    username?: true
    device?: true
    folder?: true
    path?: true
    created_at?: true
  }

  export type DirectoryMaxAggregateInputType = {
    uuid?: true
    username?: true
    device?: true
    folder?: true
    path?: true
    created_at?: true
  }

  export type DirectoryCountAggregateInputType = {
    uuid?: true
    username?: true
    device?: true
    folder?: true
    path?: true
    created_at?: true
    _all?: true
  }

  export type DirectoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Directory to aggregate.
     */
    where?: DirectoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Directories to fetch.
     */
    orderBy?: DirectoryOrderByWithRelationAndSearchRelevanceInput | DirectoryOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DirectoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Directories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Directories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Directories
    **/
    _count?: true | DirectoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DirectoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DirectoryMaxAggregateInputType
  }

  export type GetDirectoryAggregateType<T extends DirectoryAggregateArgs> = {
        [P in keyof T & keyof AggregateDirectory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDirectory[P]>
      : GetScalarType<T[P], AggregateDirectory[P]>
  }




  export type DirectoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DirectoryWhereInput
    orderBy?: DirectoryOrderByWithAggregationInput | DirectoryOrderByWithAggregationInput[]
    by: DirectoryScalarFieldEnum[] | DirectoryScalarFieldEnum
    having?: DirectoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DirectoryCountAggregateInputType | true
    _min?: DirectoryMinAggregateInputType
    _max?: DirectoryMaxAggregateInputType
  }

  export type DirectoryGroupByOutputType = {
    uuid: string
    username: string
    device: string
    folder: string
    path: string
    created_at: Date
    _count: DirectoryCountAggregateOutputType | null
    _min: DirectoryMinAggregateOutputType | null
    _max: DirectoryMaxAggregateOutputType | null
  }

  type GetDirectoryGroupByPayload<T extends DirectoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DirectoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DirectoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DirectoryGroupByOutputType[P]>
            : GetScalarType<T[P], DirectoryGroupByOutputType[P]>
        }
      >
    >


  export type DirectorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    uuid?: boolean
    username?: boolean
    device?: boolean
    folder?: boolean
    path?: boolean
    created_at?: boolean
    files?: boolean | Directory$filesArgs<ExtArgs>
    _count?: boolean | DirectoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["directory"]>

  export type DirectorySelectScalar = {
    uuid?: boolean
    username?: boolean
    device?: boolean
    folder?: boolean
    path?: boolean
    created_at?: boolean
  }

  export type DirectoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    files?: boolean | Directory$filesArgs<ExtArgs>
    _count?: boolean | DirectoryCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $DirectoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Directory"
    objects: {
      files: Prisma.$FilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      uuid: string
      username: string
      device: string
      folder: string
      path: string
      created_at: Date
    }, ExtArgs["result"]["directory"]>
    composites: {}
  }


  type DirectoryGetPayload<S extends boolean | null | undefined | DirectoryDefaultArgs> = $Result.GetResult<Prisma.$DirectoryPayload, S>

  type DirectoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DirectoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DirectoryCountAggregateInputType | true
    }

  export interface DirectoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Directory'], meta: { name: 'Directory' } }
    /**
     * Find zero or one Directory that matches the filter.
     * @param {DirectoryFindUniqueArgs} args - Arguments to find a Directory
     * @example
     * // Get one Directory
     * const directory = await prisma.directory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends DirectoryFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, DirectoryFindUniqueArgs<ExtArgs>>
    ): Prisma__DirectoryClient<$Result.GetResult<Prisma.$DirectoryPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Directory that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {DirectoryFindUniqueOrThrowArgs} args - Arguments to find a Directory
     * @example
     * // Get one Directory
     * const directory = await prisma.directory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends DirectoryFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DirectoryFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__DirectoryClient<$Result.GetResult<Prisma.$DirectoryPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Directory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectoryFindFirstArgs} args - Arguments to find a Directory
     * @example
     * // Get one Directory
     * const directory = await prisma.directory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends DirectoryFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, DirectoryFindFirstArgs<ExtArgs>>
    ): Prisma__DirectoryClient<$Result.GetResult<Prisma.$DirectoryPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Directory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectoryFindFirstOrThrowArgs} args - Arguments to find a Directory
     * @example
     * // Get one Directory
     * const directory = await prisma.directory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends DirectoryFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DirectoryFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__DirectoryClient<$Result.GetResult<Prisma.$DirectoryPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Directories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectoryFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Directories
     * const directories = await prisma.directory.findMany()
     * 
     * // Get first 10 Directories
     * const directories = await prisma.directory.findMany({ take: 10 })
     * 
     * // Only select the `uuid`
     * const directoryWithUuidOnly = await prisma.directory.findMany({ select: { uuid: true } })
     * 
    **/
    findMany<T extends DirectoryFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DirectoryFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DirectoryPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Directory.
     * @param {DirectoryCreateArgs} args - Arguments to create a Directory.
     * @example
     * // Create one Directory
     * const Directory = await prisma.directory.create({
     *   data: {
     *     // ... data to create a Directory
     *   }
     * })
     * 
    **/
    create<T extends DirectoryCreateArgs<ExtArgs>>(
      args: SelectSubset<T, DirectoryCreateArgs<ExtArgs>>
    ): Prisma__DirectoryClient<$Result.GetResult<Prisma.$DirectoryPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Directories.
     *     @param {DirectoryCreateManyArgs} args - Arguments to create many Directories.
     *     @example
     *     // Create many Directories
     *     const directory = await prisma.directory.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends DirectoryCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DirectoryCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Directory.
     * @param {DirectoryDeleteArgs} args - Arguments to delete one Directory.
     * @example
     * // Delete one Directory
     * const Directory = await prisma.directory.delete({
     *   where: {
     *     // ... filter to delete one Directory
     *   }
     * })
     * 
    **/
    delete<T extends DirectoryDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, DirectoryDeleteArgs<ExtArgs>>
    ): Prisma__DirectoryClient<$Result.GetResult<Prisma.$DirectoryPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Directory.
     * @param {DirectoryUpdateArgs} args - Arguments to update one Directory.
     * @example
     * // Update one Directory
     * const directory = await prisma.directory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends DirectoryUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, DirectoryUpdateArgs<ExtArgs>>
    ): Prisma__DirectoryClient<$Result.GetResult<Prisma.$DirectoryPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Directories.
     * @param {DirectoryDeleteManyArgs} args - Arguments to filter Directories to delete.
     * @example
     * // Delete a few Directories
     * const { count } = await prisma.directory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends DirectoryDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DirectoryDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Directories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Directories
     * const directory = await prisma.directory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends DirectoryUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, DirectoryUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Directory.
     * @param {DirectoryUpsertArgs} args - Arguments to update or create a Directory.
     * @example
     * // Update or create a Directory
     * const directory = await prisma.directory.upsert({
     *   create: {
     *     // ... data to create a Directory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Directory we want to update
     *   }
     * })
    **/
    upsert<T extends DirectoryUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, DirectoryUpsertArgs<ExtArgs>>
    ): Prisma__DirectoryClient<$Result.GetResult<Prisma.$DirectoryPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Directories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectoryCountArgs} args - Arguments to filter Directories to count.
     * @example
     * // Count the number of Directories
     * const count = await prisma.directory.count({
     *   where: {
     *     // ... the filter for the Directories we want to count
     *   }
     * })
    **/
    count<T extends DirectoryCountArgs>(
      args?: Subset<T, DirectoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DirectoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Directory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DirectoryAggregateArgs>(args: Subset<T, DirectoryAggregateArgs>): Prisma.PrismaPromise<GetDirectoryAggregateType<T>>

    /**
     * Group by Directory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DirectoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DirectoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DirectoryGroupByArgs['orderBy'] }
        : { orderBy?: DirectoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DirectoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDirectoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Directory model
   */
  readonly fields: DirectoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Directory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DirectoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    files<T extends Directory$filesArgs<ExtArgs> = {}>(args?: Subset<T, Directory$filesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the Directory model
   */ 
  interface DirectoryFieldRefs {
    readonly uuid: FieldRef<"Directory", 'String'>
    readonly username: FieldRef<"Directory", 'String'>
    readonly device: FieldRef<"Directory", 'String'>
    readonly folder: FieldRef<"Directory", 'String'>
    readonly path: FieldRef<"Directory", 'String'>
    readonly created_at: FieldRef<"Directory", 'DateTime'>
  }
    

  // Custom InputTypes

  /**
   * Directory findUnique
   */
  export type DirectoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Directory
     */
    select?: DirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DirectoryInclude<ExtArgs> | null
    /**
     * Filter, which Directory to fetch.
     */
    where: DirectoryWhereUniqueInput
  }


  /**
   * Directory findUniqueOrThrow
   */
  export type DirectoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Directory
     */
    select?: DirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DirectoryInclude<ExtArgs> | null
    /**
     * Filter, which Directory to fetch.
     */
    where: DirectoryWhereUniqueInput
  }


  /**
   * Directory findFirst
   */
  export type DirectoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Directory
     */
    select?: DirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DirectoryInclude<ExtArgs> | null
    /**
     * Filter, which Directory to fetch.
     */
    where?: DirectoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Directories to fetch.
     */
    orderBy?: DirectoryOrderByWithRelationAndSearchRelevanceInput | DirectoryOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Directories.
     */
    cursor?: DirectoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Directories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Directories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Directories.
     */
    distinct?: DirectoryScalarFieldEnum | DirectoryScalarFieldEnum[]
  }


  /**
   * Directory findFirstOrThrow
   */
  export type DirectoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Directory
     */
    select?: DirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DirectoryInclude<ExtArgs> | null
    /**
     * Filter, which Directory to fetch.
     */
    where?: DirectoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Directories to fetch.
     */
    orderBy?: DirectoryOrderByWithRelationAndSearchRelevanceInput | DirectoryOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Directories.
     */
    cursor?: DirectoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Directories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Directories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Directories.
     */
    distinct?: DirectoryScalarFieldEnum | DirectoryScalarFieldEnum[]
  }


  /**
   * Directory findMany
   */
  export type DirectoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Directory
     */
    select?: DirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DirectoryInclude<ExtArgs> | null
    /**
     * Filter, which Directories to fetch.
     */
    where?: DirectoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Directories to fetch.
     */
    orderBy?: DirectoryOrderByWithRelationAndSearchRelevanceInput | DirectoryOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Directories.
     */
    cursor?: DirectoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Directories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Directories.
     */
    skip?: number
    distinct?: DirectoryScalarFieldEnum | DirectoryScalarFieldEnum[]
  }


  /**
   * Directory create
   */
  export type DirectoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Directory
     */
    select?: DirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DirectoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Directory.
     */
    data: XOR<DirectoryCreateInput, DirectoryUncheckedCreateInput>
  }


  /**
   * Directory createMany
   */
  export type DirectoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Directories.
     */
    data: DirectoryCreateManyInput | DirectoryCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * Directory update
   */
  export type DirectoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Directory
     */
    select?: DirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DirectoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Directory.
     */
    data: XOR<DirectoryUpdateInput, DirectoryUncheckedUpdateInput>
    /**
     * Choose, which Directory to update.
     */
    where: DirectoryWhereUniqueInput
  }


  /**
   * Directory updateMany
   */
  export type DirectoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Directories.
     */
    data: XOR<DirectoryUpdateManyMutationInput, DirectoryUncheckedUpdateManyInput>
    /**
     * Filter which Directories to update
     */
    where?: DirectoryWhereInput
  }


  /**
   * Directory upsert
   */
  export type DirectoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Directory
     */
    select?: DirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DirectoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Directory to update in case it exists.
     */
    where: DirectoryWhereUniqueInput
    /**
     * In case the Directory found by the `where` argument doesn't exist, create a new Directory with this data.
     */
    create: XOR<DirectoryCreateInput, DirectoryUncheckedCreateInput>
    /**
     * In case the Directory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DirectoryUpdateInput, DirectoryUncheckedUpdateInput>
  }


  /**
   * Directory delete
   */
  export type DirectoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Directory
     */
    select?: DirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DirectoryInclude<ExtArgs> | null
    /**
     * Filter which Directory to delete.
     */
    where: DirectoryWhereUniqueInput
  }


  /**
   * Directory deleteMany
   */
  export type DirectoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Directories to delete
     */
    where?: DirectoryWhereInput
  }


  /**
   * Directory.files
   */
  export type Directory$filesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: FileInclude<ExtArgs> | null
    where?: FileWhereInput
    orderBy?: FileOrderByWithRelationAndSearchRelevanceInput | FileOrderByWithRelationAndSearchRelevanceInput[]
    cursor?: FileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }


  /**
   * Directory without action
   */
  export type DirectoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Directory
     */
    select?: DirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DirectoryInclude<ExtArgs> | null
  }



  /**
   * Model DeletedDirectory
   */

  export type AggregateDeletedDirectory = {
    _count: DeletedDirectoryCountAggregateOutputType | null
    _min: DeletedDirectoryMinAggregateOutputType | null
    _max: DeletedDirectoryMaxAggregateOutputType | null
  }

  export type DeletedDirectoryMinAggregateOutputType = {
    uuid: string | null
    username: string | null
    device: string | null
    folder: string | null
    path: string | null
    created_at: Date | null
    deleted: Date | null
    rel_path: string | null
    rel_name: string | null
  }

  export type DeletedDirectoryMaxAggregateOutputType = {
    uuid: string | null
    username: string | null
    device: string | null
    folder: string | null
    path: string | null
    created_at: Date | null
    deleted: Date | null
    rel_path: string | null
    rel_name: string | null
  }

  export type DeletedDirectoryCountAggregateOutputType = {
    uuid: number
    username: number
    device: number
    folder: number
    path: number
    created_at: number
    deleted: number
    rel_path: number
    rel_name: number
    _all: number
  }


  export type DeletedDirectoryMinAggregateInputType = {
    uuid?: true
    username?: true
    device?: true
    folder?: true
    path?: true
    created_at?: true
    deleted?: true
    rel_path?: true
    rel_name?: true
  }

  export type DeletedDirectoryMaxAggregateInputType = {
    uuid?: true
    username?: true
    device?: true
    folder?: true
    path?: true
    created_at?: true
    deleted?: true
    rel_path?: true
    rel_name?: true
  }

  export type DeletedDirectoryCountAggregateInputType = {
    uuid?: true
    username?: true
    device?: true
    folder?: true
    path?: true
    created_at?: true
    deleted?: true
    rel_path?: true
    rel_name?: true
    _all?: true
  }

  export type DeletedDirectoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeletedDirectory to aggregate.
     */
    where?: DeletedDirectoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeletedDirectories to fetch.
     */
    orderBy?: DeletedDirectoryOrderByWithRelationAndSearchRelevanceInput | DeletedDirectoryOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeletedDirectoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeletedDirectories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeletedDirectories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DeletedDirectories
    **/
    _count?: true | DeletedDirectoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeletedDirectoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeletedDirectoryMaxAggregateInputType
  }

  export type GetDeletedDirectoryAggregateType<T extends DeletedDirectoryAggregateArgs> = {
        [P in keyof T & keyof AggregateDeletedDirectory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeletedDirectory[P]>
      : GetScalarType<T[P], AggregateDeletedDirectory[P]>
  }




  export type DeletedDirectoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeletedDirectoryWhereInput
    orderBy?: DeletedDirectoryOrderByWithAggregationInput | DeletedDirectoryOrderByWithAggregationInput[]
    by: DeletedDirectoryScalarFieldEnum[] | DeletedDirectoryScalarFieldEnum
    having?: DeletedDirectoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeletedDirectoryCountAggregateInputType | true
    _min?: DeletedDirectoryMinAggregateInputType
    _max?: DeletedDirectoryMaxAggregateInputType
  }

  export type DeletedDirectoryGroupByOutputType = {
    uuid: string
    username: string
    device: string
    folder: string
    path: string
    created_at: Date
    deleted: Date
    rel_path: string
    rel_name: string
    _count: DeletedDirectoryCountAggregateOutputType | null
    _min: DeletedDirectoryMinAggregateOutputType | null
    _max: DeletedDirectoryMaxAggregateOutputType | null
  }

  type GetDeletedDirectoryGroupByPayload<T extends DeletedDirectoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeletedDirectoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeletedDirectoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeletedDirectoryGroupByOutputType[P]>
            : GetScalarType<T[P], DeletedDirectoryGroupByOutputType[P]>
        }
      >
    >


  export type DeletedDirectorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    uuid?: boolean
    username?: boolean
    device?: boolean
    folder?: boolean
    path?: boolean
    created_at?: boolean
    deleted?: boolean
    rel_path?: boolean
    rel_name?: boolean
    files?: boolean | DeletedDirectory$filesArgs<ExtArgs>
    _count?: boolean | DeletedDirectoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deletedDirectory"]>

  export type DeletedDirectorySelectScalar = {
    uuid?: boolean
    username?: boolean
    device?: boolean
    folder?: boolean
    path?: boolean
    created_at?: boolean
    deleted?: boolean
    rel_path?: boolean
    rel_name?: boolean
  }

  export type DeletedDirectoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    files?: boolean | DeletedDirectory$filesArgs<ExtArgs>
    _count?: boolean | DeletedDirectoryCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $DeletedDirectoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DeletedDirectory"
    objects: {
      files: Prisma.$DeletedFilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      uuid: string
      username: string
      device: string
      folder: string
      path: string
      created_at: Date
      deleted: Date
      rel_path: string
      rel_name: string
    }, ExtArgs["result"]["deletedDirectory"]>
    composites: {}
  }


  type DeletedDirectoryGetPayload<S extends boolean | null | undefined | DeletedDirectoryDefaultArgs> = $Result.GetResult<Prisma.$DeletedDirectoryPayload, S>

  type DeletedDirectoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DeletedDirectoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DeletedDirectoryCountAggregateInputType | true
    }

  export interface DeletedDirectoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DeletedDirectory'], meta: { name: 'DeletedDirectory' } }
    /**
     * Find zero or one DeletedDirectory that matches the filter.
     * @param {DeletedDirectoryFindUniqueArgs} args - Arguments to find a DeletedDirectory
     * @example
     * // Get one DeletedDirectory
     * const deletedDirectory = await prisma.deletedDirectory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends DeletedDirectoryFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedDirectoryFindUniqueArgs<ExtArgs>>
    ): Prisma__DeletedDirectoryClient<$Result.GetResult<Prisma.$DeletedDirectoryPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one DeletedDirectory that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {DeletedDirectoryFindUniqueOrThrowArgs} args - Arguments to find a DeletedDirectory
     * @example
     * // Get one DeletedDirectory
     * const deletedDirectory = await prisma.deletedDirectory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends DeletedDirectoryFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedDirectoryFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__DeletedDirectoryClient<$Result.GetResult<Prisma.$DeletedDirectoryPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first DeletedDirectory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedDirectoryFindFirstArgs} args - Arguments to find a DeletedDirectory
     * @example
     * // Get one DeletedDirectory
     * const deletedDirectory = await prisma.deletedDirectory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends DeletedDirectoryFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedDirectoryFindFirstArgs<ExtArgs>>
    ): Prisma__DeletedDirectoryClient<$Result.GetResult<Prisma.$DeletedDirectoryPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first DeletedDirectory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedDirectoryFindFirstOrThrowArgs} args - Arguments to find a DeletedDirectory
     * @example
     * // Get one DeletedDirectory
     * const deletedDirectory = await prisma.deletedDirectory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends DeletedDirectoryFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedDirectoryFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__DeletedDirectoryClient<$Result.GetResult<Prisma.$DeletedDirectoryPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more DeletedDirectories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedDirectoryFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DeletedDirectories
     * const deletedDirectories = await prisma.deletedDirectory.findMany()
     * 
     * // Get first 10 DeletedDirectories
     * const deletedDirectories = await prisma.deletedDirectory.findMany({ take: 10 })
     * 
     * // Only select the `uuid`
     * const deletedDirectoryWithUuidOnly = await prisma.deletedDirectory.findMany({ select: { uuid: true } })
     * 
    **/
    findMany<T extends DeletedDirectoryFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedDirectoryFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeletedDirectoryPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a DeletedDirectory.
     * @param {DeletedDirectoryCreateArgs} args - Arguments to create a DeletedDirectory.
     * @example
     * // Create one DeletedDirectory
     * const DeletedDirectory = await prisma.deletedDirectory.create({
     *   data: {
     *     // ... data to create a DeletedDirectory
     *   }
     * })
     * 
    **/
    create<T extends DeletedDirectoryCreateArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedDirectoryCreateArgs<ExtArgs>>
    ): Prisma__DeletedDirectoryClient<$Result.GetResult<Prisma.$DeletedDirectoryPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many DeletedDirectories.
     *     @param {DeletedDirectoryCreateManyArgs} args - Arguments to create many DeletedDirectories.
     *     @example
     *     // Create many DeletedDirectories
     *     const deletedDirectory = await prisma.deletedDirectory.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends DeletedDirectoryCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedDirectoryCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a DeletedDirectory.
     * @param {DeletedDirectoryDeleteArgs} args - Arguments to delete one DeletedDirectory.
     * @example
     * // Delete one DeletedDirectory
     * const DeletedDirectory = await prisma.deletedDirectory.delete({
     *   where: {
     *     // ... filter to delete one DeletedDirectory
     *   }
     * })
     * 
    **/
    delete<T extends DeletedDirectoryDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedDirectoryDeleteArgs<ExtArgs>>
    ): Prisma__DeletedDirectoryClient<$Result.GetResult<Prisma.$DeletedDirectoryPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one DeletedDirectory.
     * @param {DeletedDirectoryUpdateArgs} args - Arguments to update one DeletedDirectory.
     * @example
     * // Update one DeletedDirectory
     * const deletedDirectory = await prisma.deletedDirectory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends DeletedDirectoryUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedDirectoryUpdateArgs<ExtArgs>>
    ): Prisma__DeletedDirectoryClient<$Result.GetResult<Prisma.$DeletedDirectoryPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more DeletedDirectories.
     * @param {DeletedDirectoryDeleteManyArgs} args - Arguments to filter DeletedDirectories to delete.
     * @example
     * // Delete a few DeletedDirectories
     * const { count } = await prisma.deletedDirectory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends DeletedDirectoryDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DeletedDirectoryDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeletedDirectories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedDirectoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DeletedDirectories
     * const deletedDirectory = await prisma.deletedDirectory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends DeletedDirectoryUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedDirectoryUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DeletedDirectory.
     * @param {DeletedDirectoryUpsertArgs} args - Arguments to update or create a DeletedDirectory.
     * @example
     * // Update or create a DeletedDirectory
     * const deletedDirectory = await prisma.deletedDirectory.upsert({
     *   create: {
     *     // ... data to create a DeletedDirectory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DeletedDirectory we want to update
     *   }
     * })
    **/
    upsert<T extends DeletedDirectoryUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, DeletedDirectoryUpsertArgs<ExtArgs>>
    ): Prisma__DeletedDirectoryClient<$Result.GetResult<Prisma.$DeletedDirectoryPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of DeletedDirectories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedDirectoryCountArgs} args - Arguments to filter DeletedDirectories to count.
     * @example
     * // Count the number of DeletedDirectories
     * const count = await prisma.deletedDirectory.count({
     *   where: {
     *     // ... the filter for the DeletedDirectories we want to count
     *   }
     * })
    **/
    count<T extends DeletedDirectoryCountArgs>(
      args?: Subset<T, DeletedDirectoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeletedDirectoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DeletedDirectory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedDirectoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeletedDirectoryAggregateArgs>(args: Subset<T, DeletedDirectoryAggregateArgs>): Prisma.PrismaPromise<GetDeletedDirectoryAggregateType<T>>

    /**
     * Group by DeletedDirectory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeletedDirectoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeletedDirectoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeletedDirectoryGroupByArgs['orderBy'] }
        : { orderBy?: DeletedDirectoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeletedDirectoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeletedDirectoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DeletedDirectory model
   */
  readonly fields: DeletedDirectoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DeletedDirectory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeletedDirectoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    files<T extends DeletedDirectory$filesArgs<ExtArgs> = {}>(args?: Subset<T, DeletedDirectory$filesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeletedFilePayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the DeletedDirectory model
   */ 
  interface DeletedDirectoryFieldRefs {
    readonly uuid: FieldRef<"DeletedDirectory", 'String'>
    readonly username: FieldRef<"DeletedDirectory", 'String'>
    readonly device: FieldRef<"DeletedDirectory", 'String'>
    readonly folder: FieldRef<"DeletedDirectory", 'String'>
    readonly path: FieldRef<"DeletedDirectory", 'String'>
    readonly created_at: FieldRef<"DeletedDirectory", 'DateTime'>
    readonly deleted: FieldRef<"DeletedDirectory", 'DateTime'>
    readonly rel_path: FieldRef<"DeletedDirectory", 'String'>
    readonly rel_name: FieldRef<"DeletedDirectory", 'String'>
  }
    

  // Custom InputTypes

  /**
   * DeletedDirectory findUnique
   */
  export type DeletedDirectoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedDirectory
     */
    select?: DeletedDirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedDirectoryInclude<ExtArgs> | null
    /**
     * Filter, which DeletedDirectory to fetch.
     */
    where: DeletedDirectoryWhereUniqueInput
  }


  /**
   * DeletedDirectory findUniqueOrThrow
   */
  export type DeletedDirectoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedDirectory
     */
    select?: DeletedDirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedDirectoryInclude<ExtArgs> | null
    /**
     * Filter, which DeletedDirectory to fetch.
     */
    where: DeletedDirectoryWhereUniqueInput
  }


  /**
   * DeletedDirectory findFirst
   */
  export type DeletedDirectoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedDirectory
     */
    select?: DeletedDirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedDirectoryInclude<ExtArgs> | null
    /**
     * Filter, which DeletedDirectory to fetch.
     */
    where?: DeletedDirectoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeletedDirectories to fetch.
     */
    orderBy?: DeletedDirectoryOrderByWithRelationAndSearchRelevanceInput | DeletedDirectoryOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeletedDirectories.
     */
    cursor?: DeletedDirectoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeletedDirectories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeletedDirectories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeletedDirectories.
     */
    distinct?: DeletedDirectoryScalarFieldEnum | DeletedDirectoryScalarFieldEnum[]
  }


  /**
   * DeletedDirectory findFirstOrThrow
   */
  export type DeletedDirectoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedDirectory
     */
    select?: DeletedDirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedDirectoryInclude<ExtArgs> | null
    /**
     * Filter, which DeletedDirectory to fetch.
     */
    where?: DeletedDirectoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeletedDirectories to fetch.
     */
    orderBy?: DeletedDirectoryOrderByWithRelationAndSearchRelevanceInput | DeletedDirectoryOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeletedDirectories.
     */
    cursor?: DeletedDirectoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeletedDirectories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeletedDirectories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeletedDirectories.
     */
    distinct?: DeletedDirectoryScalarFieldEnum | DeletedDirectoryScalarFieldEnum[]
  }


  /**
   * DeletedDirectory findMany
   */
  export type DeletedDirectoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedDirectory
     */
    select?: DeletedDirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedDirectoryInclude<ExtArgs> | null
    /**
     * Filter, which DeletedDirectories to fetch.
     */
    where?: DeletedDirectoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeletedDirectories to fetch.
     */
    orderBy?: DeletedDirectoryOrderByWithRelationAndSearchRelevanceInput | DeletedDirectoryOrderByWithRelationAndSearchRelevanceInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DeletedDirectories.
     */
    cursor?: DeletedDirectoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeletedDirectories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeletedDirectories.
     */
    skip?: number
    distinct?: DeletedDirectoryScalarFieldEnum | DeletedDirectoryScalarFieldEnum[]
  }


  /**
   * DeletedDirectory create
   */
  export type DeletedDirectoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedDirectory
     */
    select?: DeletedDirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedDirectoryInclude<ExtArgs> | null
    /**
     * The data needed to create a DeletedDirectory.
     */
    data: XOR<DeletedDirectoryCreateInput, DeletedDirectoryUncheckedCreateInput>
  }


  /**
   * DeletedDirectory createMany
   */
  export type DeletedDirectoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DeletedDirectories.
     */
    data: DeletedDirectoryCreateManyInput | DeletedDirectoryCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * DeletedDirectory update
   */
  export type DeletedDirectoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedDirectory
     */
    select?: DeletedDirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedDirectoryInclude<ExtArgs> | null
    /**
     * The data needed to update a DeletedDirectory.
     */
    data: XOR<DeletedDirectoryUpdateInput, DeletedDirectoryUncheckedUpdateInput>
    /**
     * Choose, which DeletedDirectory to update.
     */
    where: DeletedDirectoryWhereUniqueInput
  }


  /**
   * DeletedDirectory updateMany
   */
  export type DeletedDirectoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DeletedDirectories.
     */
    data: XOR<DeletedDirectoryUpdateManyMutationInput, DeletedDirectoryUncheckedUpdateManyInput>
    /**
     * Filter which DeletedDirectories to update
     */
    where?: DeletedDirectoryWhereInput
  }


  /**
   * DeletedDirectory upsert
   */
  export type DeletedDirectoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedDirectory
     */
    select?: DeletedDirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedDirectoryInclude<ExtArgs> | null
    /**
     * The filter to search for the DeletedDirectory to update in case it exists.
     */
    where: DeletedDirectoryWhereUniqueInput
    /**
     * In case the DeletedDirectory found by the `where` argument doesn't exist, create a new DeletedDirectory with this data.
     */
    create: XOR<DeletedDirectoryCreateInput, DeletedDirectoryUncheckedCreateInput>
    /**
     * In case the DeletedDirectory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeletedDirectoryUpdateInput, DeletedDirectoryUncheckedUpdateInput>
  }


  /**
   * DeletedDirectory delete
   */
  export type DeletedDirectoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedDirectory
     */
    select?: DeletedDirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedDirectoryInclude<ExtArgs> | null
    /**
     * Filter which DeletedDirectory to delete.
     */
    where: DeletedDirectoryWhereUniqueInput
  }


  /**
   * DeletedDirectory deleteMany
   */
  export type DeletedDirectoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeletedDirectories to delete
     */
    where?: DeletedDirectoryWhereInput
  }


  /**
   * DeletedDirectory.files
   */
  export type DeletedDirectory$filesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedFile
     */
    select?: DeletedFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedFileInclude<ExtArgs> | null
    where?: DeletedFileWhereInput
    orderBy?: DeletedFileOrderByWithRelationAndSearchRelevanceInput | DeletedFileOrderByWithRelationAndSearchRelevanceInput[]
    cursor?: DeletedFileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeletedFileScalarFieldEnum | DeletedFileScalarFieldEnum[]
  }


  /**
   * DeletedDirectory without action
   */
  export type DeletedDirectoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeletedDirectory
     */
    select?: DeletedDirectorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: DeletedDirectoryInclude<ExtArgs> | null
  }



  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const FileScalarFieldEnum: {
    username: 'username',
    device: 'device',
    directory: 'directory',
    uuid: 'uuid',
    origin: 'origin',
    filename: 'filename',
    last_modified: 'last_modified',
    hashvalue: 'hashvalue',
    enc_hashvalue: 'enc_hashvalue',
    versions: 'versions',
    size: 'size',
    salt: 'salt',
    iv: 'iv',
    dirID: 'dirID'
  };

  export type FileScalarFieldEnum = (typeof FileScalarFieldEnum)[keyof typeof FileScalarFieldEnum]


  export const FileVersionScalarFieldEnum: {
    username: 'username',
    device: 'device',
    directory: 'directory',
    uuid: 'uuid',
    origin: 'origin',
    filename: 'filename',
    last_modified: 'last_modified',
    hashvalue: 'hashvalue',
    enc_hashvalue: 'enc_hashvalue',
    versions: 'versions',
    size: 'size',
    salt: 'salt',
    iv: 'iv'
  };

  export type FileVersionScalarFieldEnum = (typeof FileVersionScalarFieldEnum)[keyof typeof FileVersionScalarFieldEnum]


  export const DeletedFileScalarFieldEnum: {
    username: 'username',
    device: 'device',
    directory: 'directory',
    uuid: 'uuid',
    origin: 'origin',
    filename: 'filename',
    last_modified: 'last_modified',
    hashvalue: 'hashvalue',
    enc_hashvalue: 'enc_hashvalue',
    versions: 'versions',
    size: 'size',
    salt: 'salt',
    iv: 'iv',
    deletion_date: 'deletion_date',
    deletion_type: 'deletion_type',
    dirID: 'dirID'
  };

  export type DeletedFileScalarFieldEnum = (typeof DeletedFileScalarFieldEnum)[keyof typeof DeletedFileScalarFieldEnum]


  export const DeletedFileVersionScalarFieldEnum: {
    username: 'username',
    device: 'device',
    directory: 'directory',
    uuid: 'uuid',
    origin: 'origin',
    filename: 'filename',
    last_modified: 'last_modified',
    hashvalue: 'hashvalue',
    enc_hashvalue: 'enc_hashvalue',
    versions: 'versions',
    size: 'size',
    salt: 'salt',
    iv: 'iv',
    deletion_date: 'deletion_date',
    deletion_type: 'deletion_type'
  };

  export type DeletedFileVersionScalarFieldEnum = (typeof DeletedFileVersionScalarFieldEnum)[keyof typeof DeletedFileVersionScalarFieldEnum]


  export const DirectoryScalarFieldEnum: {
    uuid: 'uuid',
    username: 'username',
    device: 'device',
    folder: 'folder',
    path: 'path',
    created_at: 'created_at'
  };

  export type DirectoryScalarFieldEnum = (typeof DirectoryScalarFieldEnum)[keyof typeof DirectoryScalarFieldEnum]


  export const DeletedDirectoryScalarFieldEnum: {
    uuid: 'uuid',
    username: 'username',
    device: 'device',
    folder: 'folder',
    path: 'path',
    created_at: 'created_at',
    deleted: 'deleted',
    rel_path: 'rel_path',
    rel_name: 'rel_name'
  };

  export type DeletedDirectoryScalarFieldEnum = (typeof DeletedDirectoryScalarFieldEnum)[keyof typeof DeletedDirectoryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const FileOrderByRelevanceFieldEnum: {
    username: 'username',
    device: 'device',
    directory: 'directory',
    uuid: 'uuid',
    origin: 'origin',
    filename: 'filename',
    hashvalue: 'hashvalue',
    enc_hashvalue: 'enc_hashvalue',
    salt: 'salt',
    iv: 'iv',
    dirID: 'dirID'
  };

  export type FileOrderByRelevanceFieldEnum = (typeof FileOrderByRelevanceFieldEnum)[keyof typeof FileOrderByRelevanceFieldEnum]


  export const FileVersionOrderByRelevanceFieldEnum: {
    username: 'username',
    device: 'device',
    directory: 'directory',
    uuid: 'uuid',
    origin: 'origin',
    filename: 'filename',
    hashvalue: 'hashvalue',
    enc_hashvalue: 'enc_hashvalue',
    salt: 'salt',
    iv: 'iv'
  };

  export type FileVersionOrderByRelevanceFieldEnum = (typeof FileVersionOrderByRelevanceFieldEnum)[keyof typeof FileVersionOrderByRelevanceFieldEnum]


  export const DeletedFileOrderByRelevanceFieldEnum: {
    username: 'username',
    device: 'device',
    directory: 'directory',
    uuid: 'uuid',
    origin: 'origin',
    filename: 'filename',
    hashvalue: 'hashvalue',
    enc_hashvalue: 'enc_hashvalue',
    salt: 'salt',
    iv: 'iv',
    deletion_type: 'deletion_type',
    dirID: 'dirID'
  };

  export type DeletedFileOrderByRelevanceFieldEnum = (typeof DeletedFileOrderByRelevanceFieldEnum)[keyof typeof DeletedFileOrderByRelevanceFieldEnum]


  export const DeletedFileVersionOrderByRelevanceFieldEnum: {
    username: 'username',
    device: 'device',
    directory: 'directory',
    uuid: 'uuid',
    origin: 'origin',
    filename: 'filename',
    hashvalue: 'hashvalue',
    enc_hashvalue: 'enc_hashvalue',
    salt: 'salt',
    iv: 'iv',
    deletion_type: 'deletion_type'
  };

  export type DeletedFileVersionOrderByRelevanceFieldEnum = (typeof DeletedFileVersionOrderByRelevanceFieldEnum)[keyof typeof DeletedFileVersionOrderByRelevanceFieldEnum]


  export const DirectoryOrderByRelevanceFieldEnum: {
    uuid: 'uuid',
    username: 'username',
    device: 'device',
    folder: 'folder',
    path: 'path'
  };

  export type DirectoryOrderByRelevanceFieldEnum = (typeof DirectoryOrderByRelevanceFieldEnum)[keyof typeof DirectoryOrderByRelevanceFieldEnum]


  export const DeletedDirectoryOrderByRelevanceFieldEnum: {
    uuid: 'uuid',
    username: 'username',
    device: 'device',
    folder: 'folder',
    path: 'path',
    rel_path: 'rel_path',
    rel_name: 'rel_name'
  };

  export type DeletedDirectoryOrderByRelevanceFieldEnum = (typeof DeletedDirectoryOrderByRelevanceFieldEnum)[keyof typeof DeletedDirectoryOrderByRelevanceFieldEnum]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type FileWhereInput = {
    AND?: FileWhereInput | FileWhereInput[]
    OR?: FileWhereInput[]
    NOT?: FileWhereInput | FileWhereInput[]
    username?: StringFilter<"File"> | string
    device?: StringFilter<"File"> | string
    directory?: StringFilter<"File"> | string
    uuid?: StringFilter<"File"> | string
    origin?: StringFilter<"File"> | string
    filename?: StringFilter<"File"> | string
    last_modified?: DateTimeFilter<"File"> | Date | string
    hashvalue?: StringFilter<"File"> | string
    enc_hashvalue?: StringFilter<"File"> | string
    versions?: IntFilter<"File"> | number
    size?: BigIntFilter<"File"> | bigint | number
    salt?: StringFilter<"File"> | string
    iv?: StringFilter<"File"> | string
    dirID?: StringFilter<"File"> | string
    versionedFiles?: FileVersionListRelationFilter
    directoryID?: XOR<DirectoryRelationFilter, DirectoryWhereInput>
  }

  export type FileOrderByWithRelationAndSearchRelevanceInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
    dirID?: SortOrder
    versionedFiles?: FileVersionOrderByRelationAggregateInput
    directoryID?: DirectoryOrderByWithRelationAndSearchRelevanceInput
    _relevance?: FileOrderByRelevanceInput
  }

  export type FileWhereUniqueInput = Prisma.AtLeast<{
    origin?: string
    username_device_directory_filename?: FileUsernameDeviceDirectoryFilenameCompoundUniqueInput
    AND?: FileWhereInput | FileWhereInput[]
    OR?: FileWhereInput[]
    NOT?: FileWhereInput | FileWhereInput[]
    username?: StringFilter<"File"> | string
    device?: StringFilter<"File"> | string
    directory?: StringFilter<"File"> | string
    uuid?: StringFilter<"File"> | string
    filename?: StringFilter<"File"> | string
    last_modified?: DateTimeFilter<"File"> | Date | string
    hashvalue?: StringFilter<"File"> | string
    enc_hashvalue?: StringFilter<"File"> | string
    versions?: IntFilter<"File"> | number
    size?: BigIntFilter<"File"> | bigint | number
    salt?: StringFilter<"File"> | string
    iv?: StringFilter<"File"> | string
    dirID?: StringFilter<"File"> | string
    versionedFiles?: FileVersionListRelationFilter
    directoryID?: XOR<DirectoryRelationFilter, DirectoryWhereInput>
  }, "origin" | "username_device_directory_filename">

  export type FileOrderByWithAggregationInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
    dirID?: SortOrder
    _count?: FileCountOrderByAggregateInput
    _avg?: FileAvgOrderByAggregateInput
    _max?: FileMaxOrderByAggregateInput
    _min?: FileMinOrderByAggregateInput
    _sum?: FileSumOrderByAggregateInput
  }

  export type FileScalarWhereWithAggregatesInput = {
    AND?: FileScalarWhereWithAggregatesInput | FileScalarWhereWithAggregatesInput[]
    OR?: FileScalarWhereWithAggregatesInput[]
    NOT?: FileScalarWhereWithAggregatesInput | FileScalarWhereWithAggregatesInput[]
    username?: StringWithAggregatesFilter<"File"> | string
    device?: StringWithAggregatesFilter<"File"> | string
    directory?: StringWithAggregatesFilter<"File"> | string
    uuid?: StringWithAggregatesFilter<"File"> | string
    origin?: StringWithAggregatesFilter<"File"> | string
    filename?: StringWithAggregatesFilter<"File"> | string
    last_modified?: DateTimeWithAggregatesFilter<"File"> | Date | string
    hashvalue?: StringWithAggregatesFilter<"File"> | string
    enc_hashvalue?: StringWithAggregatesFilter<"File"> | string
    versions?: IntWithAggregatesFilter<"File"> | number
    size?: BigIntWithAggregatesFilter<"File"> | bigint | number
    salt?: StringWithAggregatesFilter<"File"> | string
    iv?: StringWithAggregatesFilter<"File"> | string
    dirID?: StringWithAggregatesFilter<"File"> | string
  }

  export type FileVersionWhereInput = {
    AND?: FileVersionWhereInput | FileVersionWhereInput[]
    OR?: FileVersionWhereInput[]
    NOT?: FileVersionWhereInput | FileVersionWhereInput[]
    username?: StringFilter<"FileVersion"> | string
    device?: StringFilter<"FileVersion"> | string
    directory?: StringFilter<"FileVersion"> | string
    uuid?: StringFilter<"FileVersion"> | string
    origin?: StringFilter<"FileVersion"> | string
    filename?: StringFilter<"FileVersion"> | string
    last_modified?: DateTimeFilter<"FileVersion"> | Date | string
    hashvalue?: StringFilter<"FileVersion"> | string
    enc_hashvalue?: StringFilter<"FileVersion"> | string
    versions?: IntFilter<"FileVersion"> | number
    size?: BigIntFilter<"FileVersion"> | bigint | number
    salt?: StringFilter<"FileVersion"> | string
    iv?: StringFilter<"FileVersion"> | string
    LatestFile?: XOR<FileRelationFilter, FileWhereInput>
  }

  export type FileVersionOrderByWithRelationAndSearchRelevanceInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
    LatestFile?: FileOrderByWithRelationAndSearchRelevanceInput
    _relevance?: FileVersionOrderByRelevanceInput
  }

  export type FileVersionWhereUniqueInput = Prisma.AtLeast<{
    username_device_directory_filename_uuid?: FileVersionUsernameDeviceDirectoryFilenameUuidCompoundUniqueInput
    AND?: FileVersionWhereInput | FileVersionWhereInput[]
    OR?: FileVersionWhereInput[]
    NOT?: FileVersionWhereInput | FileVersionWhereInput[]
    username?: StringFilter<"FileVersion"> | string
    device?: StringFilter<"FileVersion"> | string
    directory?: StringFilter<"FileVersion"> | string
    uuid?: StringFilter<"FileVersion"> | string
    origin?: StringFilter<"FileVersion"> | string
    filename?: StringFilter<"FileVersion"> | string
    last_modified?: DateTimeFilter<"FileVersion"> | Date | string
    hashvalue?: StringFilter<"FileVersion"> | string
    enc_hashvalue?: StringFilter<"FileVersion"> | string
    versions?: IntFilter<"FileVersion"> | number
    size?: BigIntFilter<"FileVersion"> | bigint | number
    salt?: StringFilter<"FileVersion"> | string
    iv?: StringFilter<"FileVersion"> | string
    LatestFile?: XOR<FileRelationFilter, FileWhereInput>
  }, "username_device_directory_filename_uuid">

  export type FileVersionOrderByWithAggregationInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
    _count?: FileVersionCountOrderByAggregateInput
    _avg?: FileVersionAvgOrderByAggregateInput
    _max?: FileVersionMaxOrderByAggregateInput
    _min?: FileVersionMinOrderByAggregateInput
    _sum?: FileVersionSumOrderByAggregateInput
  }

  export type FileVersionScalarWhereWithAggregatesInput = {
    AND?: FileVersionScalarWhereWithAggregatesInput | FileVersionScalarWhereWithAggregatesInput[]
    OR?: FileVersionScalarWhereWithAggregatesInput[]
    NOT?: FileVersionScalarWhereWithAggregatesInput | FileVersionScalarWhereWithAggregatesInput[]
    username?: StringWithAggregatesFilter<"FileVersion"> | string
    device?: StringWithAggregatesFilter<"FileVersion"> | string
    directory?: StringWithAggregatesFilter<"FileVersion"> | string
    uuid?: StringWithAggregatesFilter<"FileVersion"> | string
    origin?: StringWithAggregatesFilter<"FileVersion"> | string
    filename?: StringWithAggregatesFilter<"FileVersion"> | string
    last_modified?: DateTimeWithAggregatesFilter<"FileVersion"> | Date | string
    hashvalue?: StringWithAggregatesFilter<"FileVersion"> | string
    enc_hashvalue?: StringWithAggregatesFilter<"FileVersion"> | string
    versions?: IntWithAggregatesFilter<"FileVersion"> | number
    size?: BigIntWithAggregatesFilter<"FileVersion"> | bigint | number
    salt?: StringWithAggregatesFilter<"FileVersion"> | string
    iv?: StringWithAggregatesFilter<"FileVersion"> | string
  }

  export type DeletedFileWhereInput = {
    AND?: DeletedFileWhereInput | DeletedFileWhereInput[]
    OR?: DeletedFileWhereInput[]
    NOT?: DeletedFileWhereInput | DeletedFileWhereInput[]
    username?: StringFilter<"DeletedFile"> | string
    device?: StringFilter<"DeletedFile"> | string
    directory?: StringFilter<"DeletedFile"> | string
    uuid?: StringFilter<"DeletedFile"> | string
    origin?: StringFilter<"DeletedFile"> | string
    filename?: StringFilter<"DeletedFile"> | string
    last_modified?: DateTimeFilter<"DeletedFile"> | Date | string
    hashvalue?: StringFilter<"DeletedFile"> | string
    enc_hashvalue?: StringFilter<"DeletedFile"> | string
    versions?: IntFilter<"DeletedFile"> | number
    size?: BigIntFilter<"DeletedFile"> | bigint | number
    salt?: StringFilter<"DeletedFile"> | string
    iv?: StringFilter<"DeletedFile"> | string
    deletion_date?: DateTimeFilter<"DeletedFile"> | Date | string
    deletion_type?: StringFilter<"DeletedFile"> | string
    dirID?: StringFilter<"DeletedFile"> | string
    directoryID?: XOR<DeletedDirectoryRelationFilter, DeletedDirectoryWhereInput>
    deletedFileVersions?: DeletedFileVersionListRelationFilter
  }

  export type DeletedFileOrderByWithRelationAndSearchRelevanceInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
    deletion_date?: SortOrder
    deletion_type?: SortOrder
    dirID?: SortOrder
    directoryID?: DeletedDirectoryOrderByWithRelationAndSearchRelevanceInput
    deletedFileVersions?: DeletedFileVersionOrderByRelationAggregateInput
    _relevance?: DeletedFileOrderByRelevanceInput
  }

  export type DeletedFileWhereUniqueInput = Prisma.AtLeast<{
    origin?: string
    username_device_directory_filename?: DeletedFileUsernameDeviceDirectoryFilenameCompoundUniqueInput
    AND?: DeletedFileWhereInput | DeletedFileWhereInput[]
    OR?: DeletedFileWhereInput[]
    NOT?: DeletedFileWhereInput | DeletedFileWhereInput[]
    username?: StringFilter<"DeletedFile"> | string
    device?: StringFilter<"DeletedFile"> | string
    directory?: StringFilter<"DeletedFile"> | string
    uuid?: StringFilter<"DeletedFile"> | string
    filename?: StringFilter<"DeletedFile"> | string
    last_modified?: DateTimeFilter<"DeletedFile"> | Date | string
    hashvalue?: StringFilter<"DeletedFile"> | string
    enc_hashvalue?: StringFilter<"DeletedFile"> | string
    versions?: IntFilter<"DeletedFile"> | number
    size?: BigIntFilter<"DeletedFile"> | bigint | number
    salt?: StringFilter<"DeletedFile"> | string
    iv?: StringFilter<"DeletedFile"> | string
    deletion_date?: DateTimeFilter<"DeletedFile"> | Date | string
    deletion_type?: StringFilter<"DeletedFile"> | string
    dirID?: StringFilter<"DeletedFile"> | string
    directoryID?: XOR<DeletedDirectoryRelationFilter, DeletedDirectoryWhereInput>
    deletedFileVersions?: DeletedFileVersionListRelationFilter
  }, "origin" | "username_device_directory_filename">

  export type DeletedFileOrderByWithAggregationInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
    deletion_date?: SortOrder
    deletion_type?: SortOrder
    dirID?: SortOrder
    _count?: DeletedFileCountOrderByAggregateInput
    _avg?: DeletedFileAvgOrderByAggregateInput
    _max?: DeletedFileMaxOrderByAggregateInput
    _min?: DeletedFileMinOrderByAggregateInput
    _sum?: DeletedFileSumOrderByAggregateInput
  }

  export type DeletedFileScalarWhereWithAggregatesInput = {
    AND?: DeletedFileScalarWhereWithAggregatesInput | DeletedFileScalarWhereWithAggregatesInput[]
    OR?: DeletedFileScalarWhereWithAggregatesInput[]
    NOT?: DeletedFileScalarWhereWithAggregatesInput | DeletedFileScalarWhereWithAggregatesInput[]
    username?: StringWithAggregatesFilter<"DeletedFile"> | string
    device?: StringWithAggregatesFilter<"DeletedFile"> | string
    directory?: StringWithAggregatesFilter<"DeletedFile"> | string
    uuid?: StringWithAggregatesFilter<"DeletedFile"> | string
    origin?: StringWithAggregatesFilter<"DeletedFile"> | string
    filename?: StringWithAggregatesFilter<"DeletedFile"> | string
    last_modified?: DateTimeWithAggregatesFilter<"DeletedFile"> | Date | string
    hashvalue?: StringWithAggregatesFilter<"DeletedFile"> | string
    enc_hashvalue?: StringWithAggregatesFilter<"DeletedFile"> | string
    versions?: IntWithAggregatesFilter<"DeletedFile"> | number
    size?: BigIntWithAggregatesFilter<"DeletedFile"> | bigint | number
    salt?: StringWithAggregatesFilter<"DeletedFile"> | string
    iv?: StringWithAggregatesFilter<"DeletedFile"> | string
    deletion_date?: DateTimeWithAggregatesFilter<"DeletedFile"> | Date | string
    deletion_type?: StringWithAggregatesFilter<"DeletedFile"> | string
    dirID?: StringWithAggregatesFilter<"DeletedFile"> | string
  }

  export type DeletedFileVersionWhereInput = {
    AND?: DeletedFileVersionWhereInput | DeletedFileVersionWhereInput[]
    OR?: DeletedFileVersionWhereInput[]
    NOT?: DeletedFileVersionWhereInput | DeletedFileVersionWhereInput[]
    username?: StringFilter<"DeletedFileVersion"> | string
    device?: StringFilter<"DeletedFileVersion"> | string
    directory?: StringFilter<"DeletedFileVersion"> | string
    uuid?: StringFilter<"DeletedFileVersion"> | string
    origin?: StringFilter<"DeletedFileVersion"> | string
    filename?: StringFilter<"DeletedFileVersion"> | string
    last_modified?: DateTimeFilter<"DeletedFileVersion"> | Date | string
    hashvalue?: StringFilter<"DeletedFileVersion"> | string
    enc_hashvalue?: StringFilter<"DeletedFileVersion"> | string
    versions?: IntFilter<"DeletedFileVersion"> | number
    size?: BigIntFilter<"DeletedFileVersion"> | bigint | number
    salt?: StringFilter<"DeletedFileVersion"> | string
    iv?: StringFilter<"DeletedFileVersion"> | string
    deletion_date?: DateTimeFilter<"DeletedFileVersion"> | Date | string
    deletion_type?: StringFilter<"DeletedFileVersion"> | string
    latest_deleted_file?: XOR<DeletedFileRelationFilter, DeletedFileWhereInput>
  }

  export type DeletedFileVersionOrderByWithRelationAndSearchRelevanceInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
    deletion_date?: SortOrder
    deletion_type?: SortOrder
    latest_deleted_file?: DeletedFileOrderByWithRelationAndSearchRelevanceInput
    _relevance?: DeletedFileVersionOrderByRelevanceInput
  }

  export type DeletedFileVersionWhereUniqueInput = Prisma.AtLeast<{
    username_device_directory_filename_uuid?: DeletedFileVersionUsernameDeviceDirectoryFilenameUuidCompoundUniqueInput
    AND?: DeletedFileVersionWhereInput | DeletedFileVersionWhereInput[]
    OR?: DeletedFileVersionWhereInput[]
    NOT?: DeletedFileVersionWhereInput | DeletedFileVersionWhereInput[]
    username?: StringFilter<"DeletedFileVersion"> | string
    device?: StringFilter<"DeletedFileVersion"> | string
    directory?: StringFilter<"DeletedFileVersion"> | string
    uuid?: StringFilter<"DeletedFileVersion"> | string
    origin?: StringFilter<"DeletedFileVersion"> | string
    filename?: StringFilter<"DeletedFileVersion"> | string
    last_modified?: DateTimeFilter<"DeletedFileVersion"> | Date | string
    hashvalue?: StringFilter<"DeletedFileVersion"> | string
    enc_hashvalue?: StringFilter<"DeletedFileVersion"> | string
    versions?: IntFilter<"DeletedFileVersion"> | number
    size?: BigIntFilter<"DeletedFileVersion"> | bigint | number
    salt?: StringFilter<"DeletedFileVersion"> | string
    iv?: StringFilter<"DeletedFileVersion"> | string
    deletion_date?: DateTimeFilter<"DeletedFileVersion"> | Date | string
    deletion_type?: StringFilter<"DeletedFileVersion"> | string
    latest_deleted_file?: XOR<DeletedFileRelationFilter, DeletedFileWhereInput>
  }, "username_device_directory_filename_uuid">

  export type DeletedFileVersionOrderByWithAggregationInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
    deletion_date?: SortOrder
    deletion_type?: SortOrder
    _count?: DeletedFileVersionCountOrderByAggregateInput
    _avg?: DeletedFileVersionAvgOrderByAggregateInput
    _max?: DeletedFileVersionMaxOrderByAggregateInput
    _min?: DeletedFileVersionMinOrderByAggregateInput
    _sum?: DeletedFileVersionSumOrderByAggregateInput
  }

  export type DeletedFileVersionScalarWhereWithAggregatesInput = {
    AND?: DeletedFileVersionScalarWhereWithAggregatesInput | DeletedFileVersionScalarWhereWithAggregatesInput[]
    OR?: DeletedFileVersionScalarWhereWithAggregatesInput[]
    NOT?: DeletedFileVersionScalarWhereWithAggregatesInput | DeletedFileVersionScalarWhereWithAggregatesInput[]
    username?: StringWithAggregatesFilter<"DeletedFileVersion"> | string
    device?: StringWithAggregatesFilter<"DeletedFileVersion"> | string
    directory?: StringWithAggregatesFilter<"DeletedFileVersion"> | string
    uuid?: StringWithAggregatesFilter<"DeletedFileVersion"> | string
    origin?: StringWithAggregatesFilter<"DeletedFileVersion"> | string
    filename?: StringWithAggregatesFilter<"DeletedFileVersion"> | string
    last_modified?: DateTimeWithAggregatesFilter<"DeletedFileVersion"> | Date | string
    hashvalue?: StringWithAggregatesFilter<"DeletedFileVersion"> | string
    enc_hashvalue?: StringWithAggregatesFilter<"DeletedFileVersion"> | string
    versions?: IntWithAggregatesFilter<"DeletedFileVersion"> | number
    size?: BigIntWithAggregatesFilter<"DeletedFileVersion"> | bigint | number
    salt?: StringWithAggregatesFilter<"DeletedFileVersion"> | string
    iv?: StringWithAggregatesFilter<"DeletedFileVersion"> | string
    deletion_date?: DateTimeWithAggregatesFilter<"DeletedFileVersion"> | Date | string
    deletion_type?: StringWithAggregatesFilter<"DeletedFileVersion"> | string
  }

  export type DirectoryWhereInput = {
    AND?: DirectoryWhereInput | DirectoryWhereInput[]
    OR?: DirectoryWhereInput[]
    NOT?: DirectoryWhereInput | DirectoryWhereInput[]
    uuid?: StringFilter<"Directory"> | string
    username?: StringFilter<"Directory"> | string
    device?: StringFilter<"Directory"> | string
    folder?: StringFilter<"Directory"> | string
    path?: StringFilter<"Directory"> | string
    created_at?: DateTimeFilter<"Directory"> | Date | string
    files?: FileListRelationFilter
  }

  export type DirectoryOrderByWithRelationAndSearchRelevanceInput = {
    uuid?: SortOrder
    username?: SortOrder
    device?: SortOrder
    folder?: SortOrder
    path?: SortOrder
    created_at?: SortOrder
    files?: FileOrderByRelationAggregateInput
    _relevance?: DirectoryOrderByRelevanceInput
  }

  export type DirectoryWhereUniqueInput = Prisma.AtLeast<{
    uuid?: string
    username_device_folder_path?: DirectoryUsernameDeviceFolderPathCompoundUniqueInput
    AND?: DirectoryWhereInput | DirectoryWhereInput[]
    OR?: DirectoryWhereInput[]
    NOT?: DirectoryWhereInput | DirectoryWhereInput[]
    username?: StringFilter<"Directory"> | string
    device?: StringFilter<"Directory"> | string
    folder?: StringFilter<"Directory"> | string
    path?: StringFilter<"Directory"> | string
    created_at?: DateTimeFilter<"Directory"> | Date | string
    files?: FileListRelationFilter
  }, "uuid" | "username_device_folder_path">

  export type DirectoryOrderByWithAggregationInput = {
    uuid?: SortOrder
    username?: SortOrder
    device?: SortOrder
    folder?: SortOrder
    path?: SortOrder
    created_at?: SortOrder
    _count?: DirectoryCountOrderByAggregateInput
    _max?: DirectoryMaxOrderByAggregateInput
    _min?: DirectoryMinOrderByAggregateInput
  }

  export type DirectoryScalarWhereWithAggregatesInput = {
    AND?: DirectoryScalarWhereWithAggregatesInput | DirectoryScalarWhereWithAggregatesInput[]
    OR?: DirectoryScalarWhereWithAggregatesInput[]
    NOT?: DirectoryScalarWhereWithAggregatesInput | DirectoryScalarWhereWithAggregatesInput[]
    uuid?: StringWithAggregatesFilter<"Directory"> | string
    username?: StringWithAggregatesFilter<"Directory"> | string
    device?: StringWithAggregatesFilter<"Directory"> | string
    folder?: StringWithAggregatesFilter<"Directory"> | string
    path?: StringWithAggregatesFilter<"Directory"> | string
    created_at?: DateTimeWithAggregatesFilter<"Directory"> | Date | string
  }

  export type DeletedDirectoryWhereInput = {
    AND?: DeletedDirectoryWhereInput | DeletedDirectoryWhereInput[]
    OR?: DeletedDirectoryWhereInput[]
    NOT?: DeletedDirectoryWhereInput | DeletedDirectoryWhereInput[]
    uuid?: StringFilter<"DeletedDirectory"> | string
    username?: StringFilter<"DeletedDirectory"> | string
    device?: StringFilter<"DeletedDirectory"> | string
    folder?: StringFilter<"DeletedDirectory"> | string
    path?: StringFilter<"DeletedDirectory"> | string
    created_at?: DateTimeFilter<"DeletedDirectory"> | Date | string
    deleted?: DateTimeFilter<"DeletedDirectory"> | Date | string
    rel_path?: StringFilter<"DeletedDirectory"> | string
    rel_name?: StringFilter<"DeletedDirectory"> | string
    files?: DeletedFileListRelationFilter
  }

  export type DeletedDirectoryOrderByWithRelationAndSearchRelevanceInput = {
    uuid?: SortOrder
    username?: SortOrder
    device?: SortOrder
    folder?: SortOrder
    path?: SortOrder
    created_at?: SortOrder
    deleted?: SortOrder
    rel_path?: SortOrder
    rel_name?: SortOrder
    files?: DeletedFileOrderByRelationAggregateInput
    _relevance?: DeletedDirectoryOrderByRelevanceInput
  }

  export type DeletedDirectoryWhereUniqueInput = Prisma.AtLeast<{
    uuid?: string
    username_device_folder_path?: DeletedDirectoryUsernameDeviceFolderPathCompoundUniqueInput
    AND?: DeletedDirectoryWhereInput | DeletedDirectoryWhereInput[]
    OR?: DeletedDirectoryWhereInput[]
    NOT?: DeletedDirectoryWhereInput | DeletedDirectoryWhereInput[]
    username?: StringFilter<"DeletedDirectory"> | string
    device?: StringFilter<"DeletedDirectory"> | string
    folder?: StringFilter<"DeletedDirectory"> | string
    path?: StringFilter<"DeletedDirectory"> | string
    created_at?: DateTimeFilter<"DeletedDirectory"> | Date | string
    deleted?: DateTimeFilter<"DeletedDirectory"> | Date | string
    rel_path?: StringFilter<"DeletedDirectory"> | string
    rel_name?: StringFilter<"DeletedDirectory"> | string
    files?: DeletedFileListRelationFilter
  }, "uuid" | "username_device_folder_path">

  export type DeletedDirectoryOrderByWithAggregationInput = {
    uuid?: SortOrder
    username?: SortOrder
    device?: SortOrder
    folder?: SortOrder
    path?: SortOrder
    created_at?: SortOrder
    deleted?: SortOrder
    rel_path?: SortOrder
    rel_name?: SortOrder
    _count?: DeletedDirectoryCountOrderByAggregateInput
    _max?: DeletedDirectoryMaxOrderByAggregateInput
    _min?: DeletedDirectoryMinOrderByAggregateInput
  }

  export type DeletedDirectoryScalarWhereWithAggregatesInput = {
    AND?: DeletedDirectoryScalarWhereWithAggregatesInput | DeletedDirectoryScalarWhereWithAggregatesInput[]
    OR?: DeletedDirectoryScalarWhereWithAggregatesInput[]
    NOT?: DeletedDirectoryScalarWhereWithAggregatesInput | DeletedDirectoryScalarWhereWithAggregatesInput[]
    uuid?: StringWithAggregatesFilter<"DeletedDirectory"> | string
    username?: StringWithAggregatesFilter<"DeletedDirectory"> | string
    device?: StringWithAggregatesFilter<"DeletedDirectory"> | string
    folder?: StringWithAggregatesFilter<"DeletedDirectory"> | string
    path?: StringWithAggregatesFilter<"DeletedDirectory"> | string
    created_at?: DateTimeWithAggregatesFilter<"DeletedDirectory"> | Date | string
    deleted?: DateTimeWithAggregatesFilter<"DeletedDirectory"> | Date | string
    rel_path?: StringWithAggregatesFilter<"DeletedDirectory"> | string
    rel_name?: StringWithAggregatesFilter<"DeletedDirectory"> | string
  }

  export type FileCreateInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    versionedFiles?: FileVersionCreateNestedManyWithoutLatestFileInput
    directoryID: DirectoryCreateNestedOneWithoutFilesInput
  }

  export type FileUncheckedCreateInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    dirID: string
    versionedFiles?: FileVersionUncheckedCreateNestedManyWithoutLatestFileInput
  }

  export type FileUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    versionedFiles?: FileVersionUpdateManyWithoutLatestFileNestedInput
    directoryID?: DirectoryUpdateOneRequiredWithoutFilesNestedInput
  }

  export type FileUncheckedUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    dirID?: StringFieldUpdateOperationsInput | string
    versionedFiles?: FileVersionUncheckedUpdateManyWithoutLatestFileNestedInput
  }

  export type FileCreateManyInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    dirID: string
  }

  export type FileUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
  }

  export type FileUncheckedUpdateManyInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    dirID?: StringFieldUpdateOperationsInput | string
  }

  export type FileVersionCreateInput = {
    username: string
    device: string
    directory: string
    uuid: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    LatestFile: FileCreateNestedOneWithoutVersionedFilesInput
  }

  export type FileVersionUncheckedCreateInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
  }

  export type FileVersionUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    LatestFile?: FileUpdateOneRequiredWithoutVersionedFilesNestedInput
  }

  export type FileVersionUncheckedUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
  }

  export type FileVersionCreateManyInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
  }

  export type FileVersionUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
  }

  export type FileVersionUncheckedUpdateManyInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
  }

  export type DeletedFileCreateInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    deletion_date: Date | string
    deletion_type: string
    directoryID: DeletedDirectoryCreateNestedOneWithoutFilesInput
    deletedFileVersions?: DeletedFileVersionCreateNestedManyWithoutLatest_deleted_fileInput
  }

  export type DeletedFileUncheckedCreateInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    deletion_date: Date | string
    deletion_type: string
    dirID: string
    deletedFileVersions?: DeletedFileVersionUncheckedCreateNestedManyWithoutLatest_deleted_fileInput
  }

  export type DeletedFileUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    deletion_date?: DateTimeFieldUpdateOperationsInput | Date | string
    deletion_type?: StringFieldUpdateOperationsInput | string
    directoryID?: DeletedDirectoryUpdateOneRequiredWithoutFilesNestedInput
    deletedFileVersions?: DeletedFileVersionUpdateManyWithoutLatest_deleted_fileNestedInput
  }

  export type DeletedFileUncheckedUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    deletion_date?: DateTimeFieldUpdateOperationsInput | Date | string
    deletion_type?: StringFieldUpdateOperationsInput | string
    dirID?: StringFieldUpdateOperationsInput | string
    deletedFileVersions?: DeletedFileVersionUncheckedUpdateManyWithoutLatest_deleted_fileNestedInput
  }

  export type DeletedFileCreateManyInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    deletion_date: Date | string
    deletion_type: string
    dirID: string
  }

  export type DeletedFileUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    deletion_date?: DateTimeFieldUpdateOperationsInput | Date | string
    deletion_type?: StringFieldUpdateOperationsInput | string
  }

  export type DeletedFileUncheckedUpdateManyInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    deletion_date?: DateTimeFieldUpdateOperationsInput | Date | string
    deletion_type?: StringFieldUpdateOperationsInput | string
    dirID?: StringFieldUpdateOperationsInput | string
  }

  export type DeletedFileVersionCreateInput = {
    username: string
    device: string
    directory: string
    uuid: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    deletion_date: Date | string
    deletion_type: string
    latest_deleted_file: DeletedFileCreateNestedOneWithoutDeletedFileVersionsInput
  }

  export type DeletedFileVersionUncheckedCreateInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    deletion_date: Date | string
    deletion_type: string
  }

  export type DeletedFileVersionUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    deletion_date?: DateTimeFieldUpdateOperationsInput | Date | string
    deletion_type?: StringFieldUpdateOperationsInput | string
    latest_deleted_file?: DeletedFileUpdateOneRequiredWithoutDeletedFileVersionsNestedInput
  }

  export type DeletedFileVersionUncheckedUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    deletion_date?: DateTimeFieldUpdateOperationsInput | Date | string
    deletion_type?: StringFieldUpdateOperationsInput | string
  }

  export type DeletedFileVersionCreateManyInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    deletion_date: Date | string
    deletion_type: string
  }

  export type DeletedFileVersionUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    deletion_date?: DateTimeFieldUpdateOperationsInput | Date | string
    deletion_type?: StringFieldUpdateOperationsInput | string
  }

  export type DeletedFileVersionUncheckedUpdateManyInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    deletion_date?: DateTimeFieldUpdateOperationsInput | Date | string
    deletion_type?: StringFieldUpdateOperationsInput | string
  }

  export type DirectoryCreateInput = {
    uuid: string
    username: string
    device: string
    folder: string
    path: string
    created_at: Date | string
    files?: FileCreateNestedManyWithoutDirectoryIDInput
  }

  export type DirectoryUncheckedCreateInput = {
    uuid: string
    username: string
    device: string
    folder: string
    path: string
    created_at: Date | string
    files?: FileUncheckedCreateNestedManyWithoutDirectoryIDInput
  }

  export type DirectoryUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    folder?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: FileUpdateManyWithoutDirectoryIDNestedInput
  }

  export type DirectoryUncheckedUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    folder?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: FileUncheckedUpdateManyWithoutDirectoryIDNestedInput
  }

  export type DirectoryCreateManyInput = {
    uuid: string
    username: string
    device: string
    folder: string
    path: string
    created_at: Date | string
  }

  export type DirectoryUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    folder?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DirectoryUncheckedUpdateManyInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    folder?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeletedDirectoryCreateInput = {
    uuid: string
    username: string
    device: string
    folder: string
    path: string
    created_at: Date | string
    deleted: Date | string
    rel_path: string
    rel_name: string
    files?: DeletedFileCreateNestedManyWithoutDirectoryIDInput
  }

  export type DeletedDirectoryUncheckedCreateInput = {
    uuid: string
    username: string
    device: string
    folder: string
    path: string
    created_at: Date | string
    deleted: Date | string
    rel_path: string
    rel_name: string
    files?: DeletedFileUncheckedCreateNestedManyWithoutDirectoryIDInput
  }

  export type DeletedDirectoryUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    folder?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted?: DateTimeFieldUpdateOperationsInput | Date | string
    rel_path?: StringFieldUpdateOperationsInput | string
    rel_name?: StringFieldUpdateOperationsInput | string
    files?: DeletedFileUpdateManyWithoutDirectoryIDNestedInput
  }

  export type DeletedDirectoryUncheckedUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    folder?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted?: DateTimeFieldUpdateOperationsInput | Date | string
    rel_path?: StringFieldUpdateOperationsInput | string
    rel_name?: StringFieldUpdateOperationsInput | string
    files?: DeletedFileUncheckedUpdateManyWithoutDirectoryIDNestedInput
  }

  export type DeletedDirectoryCreateManyInput = {
    uuid: string
    username: string
    device: string
    folder: string
    path: string
    created_at: Date | string
    deleted: Date | string
    rel_path: string
    rel_name: string
  }

  export type DeletedDirectoryUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    folder?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted?: DateTimeFieldUpdateOperationsInput | Date | string
    rel_path?: StringFieldUpdateOperationsInput | string
    rel_name?: StringFieldUpdateOperationsInput | string
  }

  export type DeletedDirectoryUncheckedUpdateManyInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    folder?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted?: DateTimeFieldUpdateOperationsInput | Date | string
    rel_path?: StringFieldUpdateOperationsInput | string
    rel_name?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type FileVersionListRelationFilter = {
    every?: FileVersionWhereInput
    some?: FileVersionWhereInput
    none?: FileVersionWhereInput
  }

  export type DirectoryRelationFilter = {
    is?: DirectoryWhereInput
    isNot?: DirectoryWhereInput
  }

  export type FileVersionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FileOrderByRelevanceInput = {
    fields: FileOrderByRelevanceFieldEnum | FileOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type FileUsernameDeviceDirectoryFilenameCompoundUniqueInput = {
    username: string
    device: string
    directory: string
    filename: string
  }

  export type FileCountOrderByAggregateInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
    dirID?: SortOrder
  }

  export type FileAvgOrderByAggregateInput = {
    versions?: SortOrder
    size?: SortOrder
  }

  export type FileMaxOrderByAggregateInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
    dirID?: SortOrder
  }

  export type FileMinOrderByAggregateInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
    dirID?: SortOrder
  }

  export type FileSumOrderByAggregateInput = {
    versions?: SortOrder
    size?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type FileRelationFilter = {
    is?: FileWhereInput
    isNot?: FileWhereInput
  }

  export type FileVersionOrderByRelevanceInput = {
    fields: FileVersionOrderByRelevanceFieldEnum | FileVersionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type FileVersionUsernameDeviceDirectoryFilenameUuidCompoundUniqueInput = {
    username: string
    device: string
    directory: string
    filename: string
    uuid: string
  }

  export type FileVersionCountOrderByAggregateInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
  }

  export type FileVersionAvgOrderByAggregateInput = {
    versions?: SortOrder
    size?: SortOrder
  }

  export type FileVersionMaxOrderByAggregateInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
  }

  export type FileVersionMinOrderByAggregateInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
  }

  export type FileVersionSumOrderByAggregateInput = {
    versions?: SortOrder
    size?: SortOrder
  }

  export type DeletedDirectoryRelationFilter = {
    is?: DeletedDirectoryWhereInput
    isNot?: DeletedDirectoryWhereInput
  }

  export type DeletedFileVersionListRelationFilter = {
    every?: DeletedFileVersionWhereInput
    some?: DeletedFileVersionWhereInput
    none?: DeletedFileVersionWhereInput
  }

  export type DeletedFileVersionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DeletedFileOrderByRelevanceInput = {
    fields: DeletedFileOrderByRelevanceFieldEnum | DeletedFileOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type DeletedFileUsernameDeviceDirectoryFilenameCompoundUniqueInput = {
    username: string
    device: string
    directory: string
    filename: string
  }

  export type DeletedFileCountOrderByAggregateInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
    deletion_date?: SortOrder
    deletion_type?: SortOrder
    dirID?: SortOrder
  }

  export type DeletedFileAvgOrderByAggregateInput = {
    versions?: SortOrder
    size?: SortOrder
  }

  export type DeletedFileMaxOrderByAggregateInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
    deletion_date?: SortOrder
    deletion_type?: SortOrder
    dirID?: SortOrder
  }

  export type DeletedFileMinOrderByAggregateInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
    deletion_date?: SortOrder
    deletion_type?: SortOrder
    dirID?: SortOrder
  }

  export type DeletedFileSumOrderByAggregateInput = {
    versions?: SortOrder
    size?: SortOrder
  }

  export type DeletedFileRelationFilter = {
    is?: DeletedFileWhereInput
    isNot?: DeletedFileWhereInput
  }

  export type DeletedFileVersionOrderByRelevanceInput = {
    fields: DeletedFileVersionOrderByRelevanceFieldEnum | DeletedFileVersionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type DeletedFileVersionUsernameDeviceDirectoryFilenameUuidCompoundUniqueInput = {
    username: string
    device: string
    directory: string
    filename: string
    uuid: string
  }

  export type DeletedFileVersionCountOrderByAggregateInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
    deletion_date?: SortOrder
    deletion_type?: SortOrder
  }

  export type DeletedFileVersionAvgOrderByAggregateInput = {
    versions?: SortOrder
    size?: SortOrder
  }

  export type DeletedFileVersionMaxOrderByAggregateInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
    deletion_date?: SortOrder
    deletion_type?: SortOrder
  }

  export type DeletedFileVersionMinOrderByAggregateInput = {
    username?: SortOrder
    device?: SortOrder
    directory?: SortOrder
    uuid?: SortOrder
    origin?: SortOrder
    filename?: SortOrder
    last_modified?: SortOrder
    hashvalue?: SortOrder
    enc_hashvalue?: SortOrder
    versions?: SortOrder
    size?: SortOrder
    salt?: SortOrder
    iv?: SortOrder
    deletion_date?: SortOrder
    deletion_type?: SortOrder
  }

  export type DeletedFileVersionSumOrderByAggregateInput = {
    versions?: SortOrder
    size?: SortOrder
  }

  export type FileListRelationFilter = {
    every?: FileWhereInput
    some?: FileWhereInput
    none?: FileWhereInput
  }

  export type FileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DirectoryOrderByRelevanceInput = {
    fields: DirectoryOrderByRelevanceFieldEnum | DirectoryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type DirectoryUsernameDeviceFolderPathCompoundUniqueInput = {
    username: string
    device: string
    folder: string
    path: string
  }

  export type DirectoryCountOrderByAggregateInput = {
    uuid?: SortOrder
    username?: SortOrder
    device?: SortOrder
    folder?: SortOrder
    path?: SortOrder
    created_at?: SortOrder
  }

  export type DirectoryMaxOrderByAggregateInput = {
    uuid?: SortOrder
    username?: SortOrder
    device?: SortOrder
    folder?: SortOrder
    path?: SortOrder
    created_at?: SortOrder
  }

  export type DirectoryMinOrderByAggregateInput = {
    uuid?: SortOrder
    username?: SortOrder
    device?: SortOrder
    folder?: SortOrder
    path?: SortOrder
    created_at?: SortOrder
  }

  export type DeletedFileListRelationFilter = {
    every?: DeletedFileWhereInput
    some?: DeletedFileWhereInput
    none?: DeletedFileWhereInput
  }

  export type DeletedFileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DeletedDirectoryOrderByRelevanceInput = {
    fields: DeletedDirectoryOrderByRelevanceFieldEnum | DeletedDirectoryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type DeletedDirectoryUsernameDeviceFolderPathCompoundUniqueInput = {
    username: string
    device: string
    folder: string
    path: string
  }

  export type DeletedDirectoryCountOrderByAggregateInput = {
    uuid?: SortOrder
    username?: SortOrder
    device?: SortOrder
    folder?: SortOrder
    path?: SortOrder
    created_at?: SortOrder
    deleted?: SortOrder
    rel_path?: SortOrder
    rel_name?: SortOrder
  }

  export type DeletedDirectoryMaxOrderByAggregateInput = {
    uuid?: SortOrder
    username?: SortOrder
    device?: SortOrder
    folder?: SortOrder
    path?: SortOrder
    created_at?: SortOrder
    deleted?: SortOrder
    rel_path?: SortOrder
    rel_name?: SortOrder
  }

  export type DeletedDirectoryMinOrderByAggregateInput = {
    uuid?: SortOrder
    username?: SortOrder
    device?: SortOrder
    folder?: SortOrder
    path?: SortOrder
    created_at?: SortOrder
    deleted?: SortOrder
    rel_path?: SortOrder
    rel_name?: SortOrder
  }

  export type FileVersionCreateNestedManyWithoutLatestFileInput = {
    create?: XOR<FileVersionCreateWithoutLatestFileInput, FileVersionUncheckedCreateWithoutLatestFileInput> | FileVersionCreateWithoutLatestFileInput[] | FileVersionUncheckedCreateWithoutLatestFileInput[]
    connectOrCreate?: FileVersionCreateOrConnectWithoutLatestFileInput | FileVersionCreateOrConnectWithoutLatestFileInput[]
    createMany?: FileVersionCreateManyLatestFileInputEnvelope
    connect?: FileVersionWhereUniqueInput | FileVersionWhereUniqueInput[]
  }

  export type DirectoryCreateNestedOneWithoutFilesInput = {
    create?: XOR<DirectoryCreateWithoutFilesInput, DirectoryUncheckedCreateWithoutFilesInput>
    connectOrCreate?: DirectoryCreateOrConnectWithoutFilesInput
    connect?: DirectoryWhereUniqueInput
  }

  export type FileVersionUncheckedCreateNestedManyWithoutLatestFileInput = {
    create?: XOR<FileVersionCreateWithoutLatestFileInput, FileVersionUncheckedCreateWithoutLatestFileInput> | FileVersionCreateWithoutLatestFileInput[] | FileVersionUncheckedCreateWithoutLatestFileInput[]
    connectOrCreate?: FileVersionCreateOrConnectWithoutLatestFileInput | FileVersionCreateOrConnectWithoutLatestFileInput[]
    createMany?: FileVersionCreateManyLatestFileInputEnvelope
    connect?: FileVersionWhereUniqueInput | FileVersionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type FileVersionUpdateManyWithoutLatestFileNestedInput = {
    create?: XOR<FileVersionCreateWithoutLatestFileInput, FileVersionUncheckedCreateWithoutLatestFileInput> | FileVersionCreateWithoutLatestFileInput[] | FileVersionUncheckedCreateWithoutLatestFileInput[]
    connectOrCreate?: FileVersionCreateOrConnectWithoutLatestFileInput | FileVersionCreateOrConnectWithoutLatestFileInput[]
    upsert?: FileVersionUpsertWithWhereUniqueWithoutLatestFileInput | FileVersionUpsertWithWhereUniqueWithoutLatestFileInput[]
    createMany?: FileVersionCreateManyLatestFileInputEnvelope
    set?: FileVersionWhereUniqueInput | FileVersionWhereUniqueInput[]
    disconnect?: FileVersionWhereUniqueInput | FileVersionWhereUniqueInput[]
    delete?: FileVersionWhereUniqueInput | FileVersionWhereUniqueInput[]
    connect?: FileVersionWhereUniqueInput | FileVersionWhereUniqueInput[]
    update?: FileVersionUpdateWithWhereUniqueWithoutLatestFileInput | FileVersionUpdateWithWhereUniqueWithoutLatestFileInput[]
    updateMany?: FileVersionUpdateManyWithWhereWithoutLatestFileInput | FileVersionUpdateManyWithWhereWithoutLatestFileInput[]
    deleteMany?: FileVersionScalarWhereInput | FileVersionScalarWhereInput[]
  }

  export type DirectoryUpdateOneRequiredWithoutFilesNestedInput = {
    create?: XOR<DirectoryCreateWithoutFilesInput, DirectoryUncheckedCreateWithoutFilesInput>
    connectOrCreate?: DirectoryCreateOrConnectWithoutFilesInput
    upsert?: DirectoryUpsertWithoutFilesInput
    connect?: DirectoryWhereUniqueInput
    update?: XOR<XOR<DirectoryUpdateToOneWithWhereWithoutFilesInput, DirectoryUpdateWithoutFilesInput>, DirectoryUncheckedUpdateWithoutFilesInput>
  }

  export type FileVersionUncheckedUpdateManyWithoutLatestFileNestedInput = {
    create?: XOR<FileVersionCreateWithoutLatestFileInput, FileVersionUncheckedCreateWithoutLatestFileInput> | FileVersionCreateWithoutLatestFileInput[] | FileVersionUncheckedCreateWithoutLatestFileInput[]
    connectOrCreate?: FileVersionCreateOrConnectWithoutLatestFileInput | FileVersionCreateOrConnectWithoutLatestFileInput[]
    upsert?: FileVersionUpsertWithWhereUniqueWithoutLatestFileInput | FileVersionUpsertWithWhereUniqueWithoutLatestFileInput[]
    createMany?: FileVersionCreateManyLatestFileInputEnvelope
    set?: FileVersionWhereUniqueInput | FileVersionWhereUniqueInput[]
    disconnect?: FileVersionWhereUniqueInput | FileVersionWhereUniqueInput[]
    delete?: FileVersionWhereUniqueInput | FileVersionWhereUniqueInput[]
    connect?: FileVersionWhereUniqueInput | FileVersionWhereUniqueInput[]
    update?: FileVersionUpdateWithWhereUniqueWithoutLatestFileInput | FileVersionUpdateWithWhereUniqueWithoutLatestFileInput[]
    updateMany?: FileVersionUpdateManyWithWhereWithoutLatestFileInput | FileVersionUpdateManyWithWhereWithoutLatestFileInput[]
    deleteMany?: FileVersionScalarWhereInput | FileVersionScalarWhereInput[]
  }

  export type FileCreateNestedOneWithoutVersionedFilesInput = {
    create?: XOR<FileCreateWithoutVersionedFilesInput, FileUncheckedCreateWithoutVersionedFilesInput>
    connectOrCreate?: FileCreateOrConnectWithoutVersionedFilesInput
    connect?: FileWhereUniqueInput
  }

  export type FileUpdateOneRequiredWithoutVersionedFilesNestedInput = {
    create?: XOR<FileCreateWithoutVersionedFilesInput, FileUncheckedCreateWithoutVersionedFilesInput>
    connectOrCreate?: FileCreateOrConnectWithoutVersionedFilesInput
    upsert?: FileUpsertWithoutVersionedFilesInput
    connect?: FileWhereUniqueInput
    update?: XOR<XOR<FileUpdateToOneWithWhereWithoutVersionedFilesInput, FileUpdateWithoutVersionedFilesInput>, FileUncheckedUpdateWithoutVersionedFilesInput>
  }

  export type DeletedDirectoryCreateNestedOneWithoutFilesInput = {
    create?: XOR<DeletedDirectoryCreateWithoutFilesInput, DeletedDirectoryUncheckedCreateWithoutFilesInput>
    connectOrCreate?: DeletedDirectoryCreateOrConnectWithoutFilesInput
    connect?: DeletedDirectoryWhereUniqueInput
  }

  export type DeletedFileVersionCreateNestedManyWithoutLatest_deleted_fileInput = {
    create?: XOR<DeletedFileVersionCreateWithoutLatest_deleted_fileInput, DeletedFileVersionUncheckedCreateWithoutLatest_deleted_fileInput> | DeletedFileVersionCreateWithoutLatest_deleted_fileInput[] | DeletedFileVersionUncheckedCreateWithoutLatest_deleted_fileInput[]
    connectOrCreate?: DeletedFileVersionCreateOrConnectWithoutLatest_deleted_fileInput | DeletedFileVersionCreateOrConnectWithoutLatest_deleted_fileInput[]
    createMany?: DeletedFileVersionCreateManyLatest_deleted_fileInputEnvelope
    connect?: DeletedFileVersionWhereUniqueInput | DeletedFileVersionWhereUniqueInput[]
  }

  export type DeletedFileVersionUncheckedCreateNestedManyWithoutLatest_deleted_fileInput = {
    create?: XOR<DeletedFileVersionCreateWithoutLatest_deleted_fileInput, DeletedFileVersionUncheckedCreateWithoutLatest_deleted_fileInput> | DeletedFileVersionCreateWithoutLatest_deleted_fileInput[] | DeletedFileVersionUncheckedCreateWithoutLatest_deleted_fileInput[]
    connectOrCreate?: DeletedFileVersionCreateOrConnectWithoutLatest_deleted_fileInput | DeletedFileVersionCreateOrConnectWithoutLatest_deleted_fileInput[]
    createMany?: DeletedFileVersionCreateManyLatest_deleted_fileInputEnvelope
    connect?: DeletedFileVersionWhereUniqueInput | DeletedFileVersionWhereUniqueInput[]
  }

  export type DeletedDirectoryUpdateOneRequiredWithoutFilesNestedInput = {
    create?: XOR<DeletedDirectoryCreateWithoutFilesInput, DeletedDirectoryUncheckedCreateWithoutFilesInput>
    connectOrCreate?: DeletedDirectoryCreateOrConnectWithoutFilesInput
    upsert?: DeletedDirectoryUpsertWithoutFilesInput
    connect?: DeletedDirectoryWhereUniqueInput
    update?: XOR<XOR<DeletedDirectoryUpdateToOneWithWhereWithoutFilesInput, DeletedDirectoryUpdateWithoutFilesInput>, DeletedDirectoryUncheckedUpdateWithoutFilesInput>
  }

  export type DeletedFileVersionUpdateManyWithoutLatest_deleted_fileNestedInput = {
    create?: XOR<DeletedFileVersionCreateWithoutLatest_deleted_fileInput, DeletedFileVersionUncheckedCreateWithoutLatest_deleted_fileInput> | DeletedFileVersionCreateWithoutLatest_deleted_fileInput[] | DeletedFileVersionUncheckedCreateWithoutLatest_deleted_fileInput[]
    connectOrCreate?: DeletedFileVersionCreateOrConnectWithoutLatest_deleted_fileInput | DeletedFileVersionCreateOrConnectWithoutLatest_deleted_fileInput[]
    upsert?: DeletedFileVersionUpsertWithWhereUniqueWithoutLatest_deleted_fileInput | DeletedFileVersionUpsertWithWhereUniqueWithoutLatest_deleted_fileInput[]
    createMany?: DeletedFileVersionCreateManyLatest_deleted_fileInputEnvelope
    set?: DeletedFileVersionWhereUniqueInput | DeletedFileVersionWhereUniqueInput[]
    disconnect?: DeletedFileVersionWhereUniqueInput | DeletedFileVersionWhereUniqueInput[]
    delete?: DeletedFileVersionWhereUniqueInput | DeletedFileVersionWhereUniqueInput[]
    connect?: DeletedFileVersionWhereUniqueInput | DeletedFileVersionWhereUniqueInput[]
    update?: DeletedFileVersionUpdateWithWhereUniqueWithoutLatest_deleted_fileInput | DeletedFileVersionUpdateWithWhereUniqueWithoutLatest_deleted_fileInput[]
    updateMany?: DeletedFileVersionUpdateManyWithWhereWithoutLatest_deleted_fileInput | DeletedFileVersionUpdateManyWithWhereWithoutLatest_deleted_fileInput[]
    deleteMany?: DeletedFileVersionScalarWhereInput | DeletedFileVersionScalarWhereInput[]
  }

  export type DeletedFileVersionUncheckedUpdateManyWithoutLatest_deleted_fileNestedInput = {
    create?: XOR<DeletedFileVersionCreateWithoutLatest_deleted_fileInput, DeletedFileVersionUncheckedCreateWithoutLatest_deleted_fileInput> | DeletedFileVersionCreateWithoutLatest_deleted_fileInput[] | DeletedFileVersionUncheckedCreateWithoutLatest_deleted_fileInput[]
    connectOrCreate?: DeletedFileVersionCreateOrConnectWithoutLatest_deleted_fileInput | DeletedFileVersionCreateOrConnectWithoutLatest_deleted_fileInput[]
    upsert?: DeletedFileVersionUpsertWithWhereUniqueWithoutLatest_deleted_fileInput | DeletedFileVersionUpsertWithWhereUniqueWithoutLatest_deleted_fileInput[]
    createMany?: DeletedFileVersionCreateManyLatest_deleted_fileInputEnvelope
    set?: DeletedFileVersionWhereUniqueInput | DeletedFileVersionWhereUniqueInput[]
    disconnect?: DeletedFileVersionWhereUniqueInput | DeletedFileVersionWhereUniqueInput[]
    delete?: DeletedFileVersionWhereUniqueInput | DeletedFileVersionWhereUniqueInput[]
    connect?: DeletedFileVersionWhereUniqueInput | DeletedFileVersionWhereUniqueInput[]
    update?: DeletedFileVersionUpdateWithWhereUniqueWithoutLatest_deleted_fileInput | DeletedFileVersionUpdateWithWhereUniqueWithoutLatest_deleted_fileInput[]
    updateMany?: DeletedFileVersionUpdateManyWithWhereWithoutLatest_deleted_fileInput | DeletedFileVersionUpdateManyWithWhereWithoutLatest_deleted_fileInput[]
    deleteMany?: DeletedFileVersionScalarWhereInput | DeletedFileVersionScalarWhereInput[]
  }

  export type DeletedFileCreateNestedOneWithoutDeletedFileVersionsInput = {
    create?: XOR<DeletedFileCreateWithoutDeletedFileVersionsInput, DeletedFileUncheckedCreateWithoutDeletedFileVersionsInput>
    connectOrCreate?: DeletedFileCreateOrConnectWithoutDeletedFileVersionsInput
    connect?: DeletedFileWhereUniqueInput
  }

  export type DeletedFileUpdateOneRequiredWithoutDeletedFileVersionsNestedInput = {
    create?: XOR<DeletedFileCreateWithoutDeletedFileVersionsInput, DeletedFileUncheckedCreateWithoutDeletedFileVersionsInput>
    connectOrCreate?: DeletedFileCreateOrConnectWithoutDeletedFileVersionsInput
    upsert?: DeletedFileUpsertWithoutDeletedFileVersionsInput
    connect?: DeletedFileWhereUniqueInput
    update?: XOR<XOR<DeletedFileUpdateToOneWithWhereWithoutDeletedFileVersionsInput, DeletedFileUpdateWithoutDeletedFileVersionsInput>, DeletedFileUncheckedUpdateWithoutDeletedFileVersionsInput>
  }

  export type FileCreateNestedManyWithoutDirectoryIDInput = {
    create?: XOR<FileCreateWithoutDirectoryIDInput, FileUncheckedCreateWithoutDirectoryIDInput> | FileCreateWithoutDirectoryIDInput[] | FileUncheckedCreateWithoutDirectoryIDInput[]
    connectOrCreate?: FileCreateOrConnectWithoutDirectoryIDInput | FileCreateOrConnectWithoutDirectoryIDInput[]
    createMany?: FileCreateManyDirectoryIDInputEnvelope
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
  }

  export type FileUncheckedCreateNestedManyWithoutDirectoryIDInput = {
    create?: XOR<FileCreateWithoutDirectoryIDInput, FileUncheckedCreateWithoutDirectoryIDInput> | FileCreateWithoutDirectoryIDInput[] | FileUncheckedCreateWithoutDirectoryIDInput[]
    connectOrCreate?: FileCreateOrConnectWithoutDirectoryIDInput | FileCreateOrConnectWithoutDirectoryIDInput[]
    createMany?: FileCreateManyDirectoryIDInputEnvelope
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
  }

  export type FileUpdateManyWithoutDirectoryIDNestedInput = {
    create?: XOR<FileCreateWithoutDirectoryIDInput, FileUncheckedCreateWithoutDirectoryIDInput> | FileCreateWithoutDirectoryIDInput[] | FileUncheckedCreateWithoutDirectoryIDInput[]
    connectOrCreate?: FileCreateOrConnectWithoutDirectoryIDInput | FileCreateOrConnectWithoutDirectoryIDInput[]
    upsert?: FileUpsertWithWhereUniqueWithoutDirectoryIDInput | FileUpsertWithWhereUniqueWithoutDirectoryIDInput[]
    createMany?: FileCreateManyDirectoryIDInputEnvelope
    set?: FileWhereUniqueInput | FileWhereUniqueInput[]
    disconnect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    delete?: FileWhereUniqueInput | FileWhereUniqueInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    update?: FileUpdateWithWhereUniqueWithoutDirectoryIDInput | FileUpdateWithWhereUniqueWithoutDirectoryIDInput[]
    updateMany?: FileUpdateManyWithWhereWithoutDirectoryIDInput | FileUpdateManyWithWhereWithoutDirectoryIDInput[]
    deleteMany?: FileScalarWhereInput | FileScalarWhereInput[]
  }

  export type FileUncheckedUpdateManyWithoutDirectoryIDNestedInput = {
    create?: XOR<FileCreateWithoutDirectoryIDInput, FileUncheckedCreateWithoutDirectoryIDInput> | FileCreateWithoutDirectoryIDInput[] | FileUncheckedCreateWithoutDirectoryIDInput[]
    connectOrCreate?: FileCreateOrConnectWithoutDirectoryIDInput | FileCreateOrConnectWithoutDirectoryIDInput[]
    upsert?: FileUpsertWithWhereUniqueWithoutDirectoryIDInput | FileUpsertWithWhereUniqueWithoutDirectoryIDInput[]
    createMany?: FileCreateManyDirectoryIDInputEnvelope
    set?: FileWhereUniqueInput | FileWhereUniqueInput[]
    disconnect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    delete?: FileWhereUniqueInput | FileWhereUniqueInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    update?: FileUpdateWithWhereUniqueWithoutDirectoryIDInput | FileUpdateWithWhereUniqueWithoutDirectoryIDInput[]
    updateMany?: FileUpdateManyWithWhereWithoutDirectoryIDInput | FileUpdateManyWithWhereWithoutDirectoryIDInput[]
    deleteMany?: FileScalarWhereInput | FileScalarWhereInput[]
  }

  export type DeletedFileCreateNestedManyWithoutDirectoryIDInput = {
    create?: XOR<DeletedFileCreateWithoutDirectoryIDInput, DeletedFileUncheckedCreateWithoutDirectoryIDInput> | DeletedFileCreateWithoutDirectoryIDInput[] | DeletedFileUncheckedCreateWithoutDirectoryIDInput[]
    connectOrCreate?: DeletedFileCreateOrConnectWithoutDirectoryIDInput | DeletedFileCreateOrConnectWithoutDirectoryIDInput[]
    createMany?: DeletedFileCreateManyDirectoryIDInputEnvelope
    connect?: DeletedFileWhereUniqueInput | DeletedFileWhereUniqueInput[]
  }

  export type DeletedFileUncheckedCreateNestedManyWithoutDirectoryIDInput = {
    create?: XOR<DeletedFileCreateWithoutDirectoryIDInput, DeletedFileUncheckedCreateWithoutDirectoryIDInput> | DeletedFileCreateWithoutDirectoryIDInput[] | DeletedFileUncheckedCreateWithoutDirectoryIDInput[]
    connectOrCreate?: DeletedFileCreateOrConnectWithoutDirectoryIDInput | DeletedFileCreateOrConnectWithoutDirectoryIDInput[]
    createMany?: DeletedFileCreateManyDirectoryIDInputEnvelope
    connect?: DeletedFileWhereUniqueInput | DeletedFileWhereUniqueInput[]
  }

  export type DeletedFileUpdateManyWithoutDirectoryIDNestedInput = {
    create?: XOR<DeletedFileCreateWithoutDirectoryIDInput, DeletedFileUncheckedCreateWithoutDirectoryIDInput> | DeletedFileCreateWithoutDirectoryIDInput[] | DeletedFileUncheckedCreateWithoutDirectoryIDInput[]
    connectOrCreate?: DeletedFileCreateOrConnectWithoutDirectoryIDInput | DeletedFileCreateOrConnectWithoutDirectoryIDInput[]
    upsert?: DeletedFileUpsertWithWhereUniqueWithoutDirectoryIDInput | DeletedFileUpsertWithWhereUniqueWithoutDirectoryIDInput[]
    createMany?: DeletedFileCreateManyDirectoryIDInputEnvelope
    set?: DeletedFileWhereUniqueInput | DeletedFileWhereUniqueInput[]
    disconnect?: DeletedFileWhereUniqueInput | DeletedFileWhereUniqueInput[]
    delete?: DeletedFileWhereUniqueInput | DeletedFileWhereUniqueInput[]
    connect?: DeletedFileWhereUniqueInput | DeletedFileWhereUniqueInput[]
    update?: DeletedFileUpdateWithWhereUniqueWithoutDirectoryIDInput | DeletedFileUpdateWithWhereUniqueWithoutDirectoryIDInput[]
    updateMany?: DeletedFileUpdateManyWithWhereWithoutDirectoryIDInput | DeletedFileUpdateManyWithWhereWithoutDirectoryIDInput[]
    deleteMany?: DeletedFileScalarWhereInput | DeletedFileScalarWhereInput[]
  }

  export type DeletedFileUncheckedUpdateManyWithoutDirectoryIDNestedInput = {
    create?: XOR<DeletedFileCreateWithoutDirectoryIDInput, DeletedFileUncheckedCreateWithoutDirectoryIDInput> | DeletedFileCreateWithoutDirectoryIDInput[] | DeletedFileUncheckedCreateWithoutDirectoryIDInput[]
    connectOrCreate?: DeletedFileCreateOrConnectWithoutDirectoryIDInput | DeletedFileCreateOrConnectWithoutDirectoryIDInput[]
    upsert?: DeletedFileUpsertWithWhereUniqueWithoutDirectoryIDInput | DeletedFileUpsertWithWhereUniqueWithoutDirectoryIDInput[]
    createMany?: DeletedFileCreateManyDirectoryIDInputEnvelope
    set?: DeletedFileWhereUniqueInput | DeletedFileWhereUniqueInput[]
    disconnect?: DeletedFileWhereUniqueInput | DeletedFileWhereUniqueInput[]
    delete?: DeletedFileWhereUniqueInput | DeletedFileWhereUniqueInput[]
    connect?: DeletedFileWhereUniqueInput | DeletedFileWhereUniqueInput[]
    update?: DeletedFileUpdateWithWhereUniqueWithoutDirectoryIDInput | DeletedFileUpdateWithWhereUniqueWithoutDirectoryIDInput[]
    updateMany?: DeletedFileUpdateManyWithWhereWithoutDirectoryIDInput | DeletedFileUpdateManyWithWhereWithoutDirectoryIDInput[]
    deleteMany?: DeletedFileScalarWhereInput | DeletedFileScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type FileVersionCreateWithoutLatestFileInput = {
    username: string
    device: string
    directory: string
    uuid: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
  }

  export type FileVersionUncheckedCreateWithoutLatestFileInput = {
    username: string
    device: string
    directory: string
    uuid: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
  }

  export type FileVersionCreateOrConnectWithoutLatestFileInput = {
    where: FileVersionWhereUniqueInput
    create: XOR<FileVersionCreateWithoutLatestFileInput, FileVersionUncheckedCreateWithoutLatestFileInput>
  }

  export type FileVersionCreateManyLatestFileInputEnvelope = {
    data: FileVersionCreateManyLatestFileInput | FileVersionCreateManyLatestFileInput[]
    skipDuplicates?: boolean
  }

  export type DirectoryCreateWithoutFilesInput = {
    uuid: string
    username: string
    device: string
    folder: string
    path: string
    created_at: Date | string
  }

  export type DirectoryUncheckedCreateWithoutFilesInput = {
    uuid: string
    username: string
    device: string
    folder: string
    path: string
    created_at: Date | string
  }

  export type DirectoryCreateOrConnectWithoutFilesInput = {
    where: DirectoryWhereUniqueInput
    create: XOR<DirectoryCreateWithoutFilesInput, DirectoryUncheckedCreateWithoutFilesInput>
  }

  export type FileVersionUpsertWithWhereUniqueWithoutLatestFileInput = {
    where: FileVersionWhereUniqueInput
    update: XOR<FileVersionUpdateWithoutLatestFileInput, FileVersionUncheckedUpdateWithoutLatestFileInput>
    create: XOR<FileVersionCreateWithoutLatestFileInput, FileVersionUncheckedCreateWithoutLatestFileInput>
  }

  export type FileVersionUpdateWithWhereUniqueWithoutLatestFileInput = {
    where: FileVersionWhereUniqueInput
    data: XOR<FileVersionUpdateWithoutLatestFileInput, FileVersionUncheckedUpdateWithoutLatestFileInput>
  }

  export type FileVersionUpdateManyWithWhereWithoutLatestFileInput = {
    where: FileVersionScalarWhereInput
    data: XOR<FileVersionUpdateManyMutationInput, FileVersionUncheckedUpdateManyWithoutLatestFileInput>
  }

  export type FileVersionScalarWhereInput = {
    AND?: FileVersionScalarWhereInput | FileVersionScalarWhereInput[]
    OR?: FileVersionScalarWhereInput[]
    NOT?: FileVersionScalarWhereInput | FileVersionScalarWhereInput[]
    username?: StringFilter<"FileVersion"> | string
    device?: StringFilter<"FileVersion"> | string
    directory?: StringFilter<"FileVersion"> | string
    uuid?: StringFilter<"FileVersion"> | string
    origin?: StringFilter<"FileVersion"> | string
    filename?: StringFilter<"FileVersion"> | string
    last_modified?: DateTimeFilter<"FileVersion"> | Date | string
    hashvalue?: StringFilter<"FileVersion"> | string
    enc_hashvalue?: StringFilter<"FileVersion"> | string
    versions?: IntFilter<"FileVersion"> | number
    size?: BigIntFilter<"FileVersion"> | bigint | number
    salt?: StringFilter<"FileVersion"> | string
    iv?: StringFilter<"FileVersion"> | string
  }

  export type DirectoryUpsertWithoutFilesInput = {
    update: XOR<DirectoryUpdateWithoutFilesInput, DirectoryUncheckedUpdateWithoutFilesInput>
    create: XOR<DirectoryCreateWithoutFilesInput, DirectoryUncheckedCreateWithoutFilesInput>
    where?: DirectoryWhereInput
  }

  export type DirectoryUpdateToOneWithWhereWithoutFilesInput = {
    where?: DirectoryWhereInput
    data: XOR<DirectoryUpdateWithoutFilesInput, DirectoryUncheckedUpdateWithoutFilesInput>
  }

  export type DirectoryUpdateWithoutFilesInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    folder?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DirectoryUncheckedUpdateWithoutFilesInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    folder?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileCreateWithoutVersionedFilesInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    directoryID: DirectoryCreateNestedOneWithoutFilesInput
  }

  export type FileUncheckedCreateWithoutVersionedFilesInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    dirID: string
  }

  export type FileCreateOrConnectWithoutVersionedFilesInput = {
    where: FileWhereUniqueInput
    create: XOR<FileCreateWithoutVersionedFilesInput, FileUncheckedCreateWithoutVersionedFilesInput>
  }

  export type FileUpsertWithoutVersionedFilesInput = {
    update: XOR<FileUpdateWithoutVersionedFilesInput, FileUncheckedUpdateWithoutVersionedFilesInput>
    create: XOR<FileCreateWithoutVersionedFilesInput, FileUncheckedCreateWithoutVersionedFilesInput>
    where?: FileWhereInput
  }

  export type FileUpdateToOneWithWhereWithoutVersionedFilesInput = {
    where?: FileWhereInput
    data: XOR<FileUpdateWithoutVersionedFilesInput, FileUncheckedUpdateWithoutVersionedFilesInput>
  }

  export type FileUpdateWithoutVersionedFilesInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    directoryID?: DirectoryUpdateOneRequiredWithoutFilesNestedInput
  }

  export type FileUncheckedUpdateWithoutVersionedFilesInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    dirID?: StringFieldUpdateOperationsInput | string
  }

  export type DeletedDirectoryCreateWithoutFilesInput = {
    uuid: string
    username: string
    device: string
    folder: string
    path: string
    created_at: Date | string
    deleted: Date | string
    rel_path: string
    rel_name: string
  }

  export type DeletedDirectoryUncheckedCreateWithoutFilesInput = {
    uuid: string
    username: string
    device: string
    folder: string
    path: string
    created_at: Date | string
    deleted: Date | string
    rel_path: string
    rel_name: string
  }

  export type DeletedDirectoryCreateOrConnectWithoutFilesInput = {
    where: DeletedDirectoryWhereUniqueInput
    create: XOR<DeletedDirectoryCreateWithoutFilesInput, DeletedDirectoryUncheckedCreateWithoutFilesInput>
  }

  export type DeletedFileVersionCreateWithoutLatest_deleted_fileInput = {
    username: string
    device: string
    directory: string
    uuid: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    deletion_date: Date | string
    deletion_type: string
  }

  export type DeletedFileVersionUncheckedCreateWithoutLatest_deleted_fileInput = {
    username: string
    device: string
    directory: string
    uuid: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    deletion_date: Date | string
    deletion_type: string
  }

  export type DeletedFileVersionCreateOrConnectWithoutLatest_deleted_fileInput = {
    where: DeletedFileVersionWhereUniqueInput
    create: XOR<DeletedFileVersionCreateWithoutLatest_deleted_fileInput, DeletedFileVersionUncheckedCreateWithoutLatest_deleted_fileInput>
  }

  export type DeletedFileVersionCreateManyLatest_deleted_fileInputEnvelope = {
    data: DeletedFileVersionCreateManyLatest_deleted_fileInput | DeletedFileVersionCreateManyLatest_deleted_fileInput[]
    skipDuplicates?: boolean
  }

  export type DeletedDirectoryUpsertWithoutFilesInput = {
    update: XOR<DeletedDirectoryUpdateWithoutFilesInput, DeletedDirectoryUncheckedUpdateWithoutFilesInput>
    create: XOR<DeletedDirectoryCreateWithoutFilesInput, DeletedDirectoryUncheckedCreateWithoutFilesInput>
    where?: DeletedDirectoryWhereInput
  }

  export type DeletedDirectoryUpdateToOneWithWhereWithoutFilesInput = {
    where?: DeletedDirectoryWhereInput
    data: XOR<DeletedDirectoryUpdateWithoutFilesInput, DeletedDirectoryUncheckedUpdateWithoutFilesInput>
  }

  export type DeletedDirectoryUpdateWithoutFilesInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    folder?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted?: DateTimeFieldUpdateOperationsInput | Date | string
    rel_path?: StringFieldUpdateOperationsInput | string
    rel_name?: StringFieldUpdateOperationsInput | string
  }

  export type DeletedDirectoryUncheckedUpdateWithoutFilesInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    folder?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted?: DateTimeFieldUpdateOperationsInput | Date | string
    rel_path?: StringFieldUpdateOperationsInput | string
    rel_name?: StringFieldUpdateOperationsInput | string
  }

  export type DeletedFileVersionUpsertWithWhereUniqueWithoutLatest_deleted_fileInput = {
    where: DeletedFileVersionWhereUniqueInput
    update: XOR<DeletedFileVersionUpdateWithoutLatest_deleted_fileInput, DeletedFileVersionUncheckedUpdateWithoutLatest_deleted_fileInput>
    create: XOR<DeletedFileVersionCreateWithoutLatest_deleted_fileInput, DeletedFileVersionUncheckedCreateWithoutLatest_deleted_fileInput>
  }

  export type DeletedFileVersionUpdateWithWhereUniqueWithoutLatest_deleted_fileInput = {
    where: DeletedFileVersionWhereUniqueInput
    data: XOR<DeletedFileVersionUpdateWithoutLatest_deleted_fileInput, DeletedFileVersionUncheckedUpdateWithoutLatest_deleted_fileInput>
  }

  export type DeletedFileVersionUpdateManyWithWhereWithoutLatest_deleted_fileInput = {
    where: DeletedFileVersionScalarWhereInput
    data: XOR<DeletedFileVersionUpdateManyMutationInput, DeletedFileVersionUncheckedUpdateManyWithoutLatest_deleted_fileInput>
  }

  export type DeletedFileVersionScalarWhereInput = {
    AND?: DeletedFileVersionScalarWhereInput | DeletedFileVersionScalarWhereInput[]
    OR?: DeletedFileVersionScalarWhereInput[]
    NOT?: DeletedFileVersionScalarWhereInput | DeletedFileVersionScalarWhereInput[]
    username?: StringFilter<"DeletedFileVersion"> | string
    device?: StringFilter<"DeletedFileVersion"> | string
    directory?: StringFilter<"DeletedFileVersion"> | string
    uuid?: StringFilter<"DeletedFileVersion"> | string
    origin?: StringFilter<"DeletedFileVersion"> | string
    filename?: StringFilter<"DeletedFileVersion"> | string
    last_modified?: DateTimeFilter<"DeletedFileVersion"> | Date | string
    hashvalue?: StringFilter<"DeletedFileVersion"> | string
    enc_hashvalue?: StringFilter<"DeletedFileVersion"> | string
    versions?: IntFilter<"DeletedFileVersion"> | number
    size?: BigIntFilter<"DeletedFileVersion"> | bigint | number
    salt?: StringFilter<"DeletedFileVersion"> | string
    iv?: StringFilter<"DeletedFileVersion"> | string
    deletion_date?: DateTimeFilter<"DeletedFileVersion"> | Date | string
    deletion_type?: StringFilter<"DeletedFileVersion"> | string
  }

  export type DeletedFileCreateWithoutDeletedFileVersionsInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    deletion_date: Date | string
    deletion_type: string
    directoryID: DeletedDirectoryCreateNestedOneWithoutFilesInput
  }

  export type DeletedFileUncheckedCreateWithoutDeletedFileVersionsInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    deletion_date: Date | string
    deletion_type: string
    dirID: string
  }

  export type DeletedFileCreateOrConnectWithoutDeletedFileVersionsInput = {
    where: DeletedFileWhereUniqueInput
    create: XOR<DeletedFileCreateWithoutDeletedFileVersionsInput, DeletedFileUncheckedCreateWithoutDeletedFileVersionsInput>
  }

  export type DeletedFileUpsertWithoutDeletedFileVersionsInput = {
    update: XOR<DeletedFileUpdateWithoutDeletedFileVersionsInput, DeletedFileUncheckedUpdateWithoutDeletedFileVersionsInput>
    create: XOR<DeletedFileCreateWithoutDeletedFileVersionsInput, DeletedFileUncheckedCreateWithoutDeletedFileVersionsInput>
    where?: DeletedFileWhereInput
  }

  export type DeletedFileUpdateToOneWithWhereWithoutDeletedFileVersionsInput = {
    where?: DeletedFileWhereInput
    data: XOR<DeletedFileUpdateWithoutDeletedFileVersionsInput, DeletedFileUncheckedUpdateWithoutDeletedFileVersionsInput>
  }

  export type DeletedFileUpdateWithoutDeletedFileVersionsInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    deletion_date?: DateTimeFieldUpdateOperationsInput | Date | string
    deletion_type?: StringFieldUpdateOperationsInput | string
    directoryID?: DeletedDirectoryUpdateOneRequiredWithoutFilesNestedInput
  }

  export type DeletedFileUncheckedUpdateWithoutDeletedFileVersionsInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    deletion_date?: DateTimeFieldUpdateOperationsInput | Date | string
    deletion_type?: StringFieldUpdateOperationsInput | string
    dirID?: StringFieldUpdateOperationsInput | string
  }

  export type FileCreateWithoutDirectoryIDInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    versionedFiles?: FileVersionCreateNestedManyWithoutLatestFileInput
  }

  export type FileUncheckedCreateWithoutDirectoryIDInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    versionedFiles?: FileVersionUncheckedCreateNestedManyWithoutLatestFileInput
  }

  export type FileCreateOrConnectWithoutDirectoryIDInput = {
    where: FileWhereUniqueInput
    create: XOR<FileCreateWithoutDirectoryIDInput, FileUncheckedCreateWithoutDirectoryIDInput>
  }

  export type FileCreateManyDirectoryIDInputEnvelope = {
    data: FileCreateManyDirectoryIDInput | FileCreateManyDirectoryIDInput[]
    skipDuplicates?: boolean
  }

  export type FileUpsertWithWhereUniqueWithoutDirectoryIDInput = {
    where: FileWhereUniqueInput
    update: XOR<FileUpdateWithoutDirectoryIDInput, FileUncheckedUpdateWithoutDirectoryIDInput>
    create: XOR<FileCreateWithoutDirectoryIDInput, FileUncheckedCreateWithoutDirectoryIDInput>
  }

  export type FileUpdateWithWhereUniqueWithoutDirectoryIDInput = {
    where: FileWhereUniqueInput
    data: XOR<FileUpdateWithoutDirectoryIDInput, FileUncheckedUpdateWithoutDirectoryIDInput>
  }

  export type FileUpdateManyWithWhereWithoutDirectoryIDInput = {
    where: FileScalarWhereInput
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyWithoutDirectoryIDInput>
  }

  export type FileScalarWhereInput = {
    AND?: FileScalarWhereInput | FileScalarWhereInput[]
    OR?: FileScalarWhereInput[]
    NOT?: FileScalarWhereInput | FileScalarWhereInput[]
    username?: StringFilter<"File"> | string
    device?: StringFilter<"File"> | string
    directory?: StringFilter<"File"> | string
    uuid?: StringFilter<"File"> | string
    origin?: StringFilter<"File"> | string
    filename?: StringFilter<"File"> | string
    last_modified?: DateTimeFilter<"File"> | Date | string
    hashvalue?: StringFilter<"File"> | string
    enc_hashvalue?: StringFilter<"File"> | string
    versions?: IntFilter<"File"> | number
    size?: BigIntFilter<"File"> | bigint | number
    salt?: StringFilter<"File"> | string
    iv?: StringFilter<"File"> | string
    dirID?: StringFilter<"File"> | string
  }

  export type DeletedFileCreateWithoutDirectoryIDInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    deletion_date: Date | string
    deletion_type: string
    deletedFileVersions?: DeletedFileVersionCreateNestedManyWithoutLatest_deleted_fileInput
  }

  export type DeletedFileUncheckedCreateWithoutDirectoryIDInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    deletion_date: Date | string
    deletion_type: string
    deletedFileVersions?: DeletedFileVersionUncheckedCreateNestedManyWithoutLatest_deleted_fileInput
  }

  export type DeletedFileCreateOrConnectWithoutDirectoryIDInput = {
    where: DeletedFileWhereUniqueInput
    create: XOR<DeletedFileCreateWithoutDirectoryIDInput, DeletedFileUncheckedCreateWithoutDirectoryIDInput>
  }

  export type DeletedFileCreateManyDirectoryIDInputEnvelope = {
    data: DeletedFileCreateManyDirectoryIDInput | DeletedFileCreateManyDirectoryIDInput[]
    skipDuplicates?: boolean
  }

  export type DeletedFileUpsertWithWhereUniqueWithoutDirectoryIDInput = {
    where: DeletedFileWhereUniqueInput
    update: XOR<DeletedFileUpdateWithoutDirectoryIDInput, DeletedFileUncheckedUpdateWithoutDirectoryIDInput>
    create: XOR<DeletedFileCreateWithoutDirectoryIDInput, DeletedFileUncheckedCreateWithoutDirectoryIDInput>
  }

  export type DeletedFileUpdateWithWhereUniqueWithoutDirectoryIDInput = {
    where: DeletedFileWhereUniqueInput
    data: XOR<DeletedFileUpdateWithoutDirectoryIDInput, DeletedFileUncheckedUpdateWithoutDirectoryIDInput>
  }

  export type DeletedFileUpdateManyWithWhereWithoutDirectoryIDInput = {
    where: DeletedFileScalarWhereInput
    data: XOR<DeletedFileUpdateManyMutationInput, DeletedFileUncheckedUpdateManyWithoutDirectoryIDInput>
  }

  export type DeletedFileScalarWhereInput = {
    AND?: DeletedFileScalarWhereInput | DeletedFileScalarWhereInput[]
    OR?: DeletedFileScalarWhereInput[]
    NOT?: DeletedFileScalarWhereInput | DeletedFileScalarWhereInput[]
    username?: StringFilter<"DeletedFile"> | string
    device?: StringFilter<"DeletedFile"> | string
    directory?: StringFilter<"DeletedFile"> | string
    uuid?: StringFilter<"DeletedFile"> | string
    origin?: StringFilter<"DeletedFile"> | string
    filename?: StringFilter<"DeletedFile"> | string
    last_modified?: DateTimeFilter<"DeletedFile"> | Date | string
    hashvalue?: StringFilter<"DeletedFile"> | string
    enc_hashvalue?: StringFilter<"DeletedFile"> | string
    versions?: IntFilter<"DeletedFile"> | number
    size?: BigIntFilter<"DeletedFile"> | bigint | number
    salt?: StringFilter<"DeletedFile"> | string
    iv?: StringFilter<"DeletedFile"> | string
    deletion_date?: DateTimeFilter<"DeletedFile"> | Date | string
    deletion_type?: StringFilter<"DeletedFile"> | string
    dirID?: StringFilter<"DeletedFile"> | string
  }

  export type FileVersionCreateManyLatestFileInput = {
    username: string
    device: string
    directory: string
    uuid: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
  }

  export type FileVersionUpdateWithoutLatestFileInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
  }

  export type FileVersionUncheckedUpdateWithoutLatestFileInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
  }

  export type FileVersionUncheckedUpdateManyWithoutLatestFileInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
  }

  export type DeletedFileVersionCreateManyLatest_deleted_fileInput = {
    username: string
    device: string
    directory: string
    uuid: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    deletion_date: Date | string
    deletion_type: string
  }

  export type DeletedFileVersionUpdateWithoutLatest_deleted_fileInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    deletion_date?: DateTimeFieldUpdateOperationsInput | Date | string
    deletion_type?: StringFieldUpdateOperationsInput | string
  }

  export type DeletedFileVersionUncheckedUpdateWithoutLatest_deleted_fileInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    deletion_date?: DateTimeFieldUpdateOperationsInput | Date | string
    deletion_type?: StringFieldUpdateOperationsInput | string
  }

  export type DeletedFileVersionUncheckedUpdateManyWithoutLatest_deleted_fileInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    deletion_date?: DateTimeFieldUpdateOperationsInput | Date | string
    deletion_type?: StringFieldUpdateOperationsInput | string
  }

  export type FileCreateManyDirectoryIDInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
  }

  export type FileUpdateWithoutDirectoryIDInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    versionedFiles?: FileVersionUpdateManyWithoutLatestFileNestedInput
  }

  export type FileUncheckedUpdateWithoutDirectoryIDInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    versionedFiles?: FileVersionUncheckedUpdateManyWithoutLatestFileNestedInput
  }

  export type FileUncheckedUpdateManyWithoutDirectoryIDInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
  }

  export type DeletedFileCreateManyDirectoryIDInput = {
    username: string
    device: string
    directory: string
    uuid: string
    origin: string
    filename: string
    last_modified: Date | string
    hashvalue: string
    enc_hashvalue: string
    versions: number
    size: bigint | number
    salt: string
    iv: string
    deletion_date: Date | string
    deletion_type: string
  }

  export type DeletedFileUpdateWithoutDirectoryIDInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    deletion_date?: DateTimeFieldUpdateOperationsInput | Date | string
    deletion_type?: StringFieldUpdateOperationsInput | string
    deletedFileVersions?: DeletedFileVersionUpdateManyWithoutLatest_deleted_fileNestedInput
  }

  export type DeletedFileUncheckedUpdateWithoutDirectoryIDInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    deletion_date?: DateTimeFieldUpdateOperationsInput | Date | string
    deletion_type?: StringFieldUpdateOperationsInput | string
    deletedFileVersions?: DeletedFileVersionUncheckedUpdateManyWithoutLatest_deleted_fileNestedInput
  }

  export type DeletedFileUncheckedUpdateManyWithoutDirectoryIDInput = {
    username?: StringFieldUpdateOperationsInput | string
    device?: StringFieldUpdateOperationsInput | string
    directory?: StringFieldUpdateOperationsInput | string
    uuid?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    hashvalue?: StringFieldUpdateOperationsInput | string
    enc_hashvalue?: StringFieldUpdateOperationsInput | string
    versions?: IntFieldUpdateOperationsInput | number
    size?: BigIntFieldUpdateOperationsInput | bigint | number
    salt?: StringFieldUpdateOperationsInput | string
    iv?: StringFieldUpdateOperationsInput | string
    deletion_date?: DateTimeFieldUpdateOperationsInput | Date | string
    deletion_type?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use FileCountOutputTypeDefaultArgs instead
     */
    export type FileCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FileCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DeletedFileCountOutputTypeDefaultArgs instead
     */
    export type DeletedFileCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DeletedFileCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DirectoryCountOutputTypeDefaultArgs instead
     */
    export type DirectoryCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DirectoryCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DeletedDirectoryCountOutputTypeDefaultArgs instead
     */
    export type DeletedDirectoryCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DeletedDirectoryCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FileDefaultArgs instead
     */
    export type FileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FileDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FileVersionDefaultArgs instead
     */
    export type FileVersionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FileVersionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DeletedFileDefaultArgs instead
     */
    export type DeletedFileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DeletedFileDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DeletedFileVersionDefaultArgs instead
     */
    export type DeletedFileVersionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DeletedFileVersionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DirectoryDefaultArgs instead
     */
    export type DirectoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DirectoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DeletedDirectoryDefaultArgs instead
     */
    export type DeletedDirectoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DeletedDirectoryDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}