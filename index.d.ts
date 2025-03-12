declare type QueryOperators = {
    $gt?: number | string | Date;
    $lt?: number | string | Date;
    $gte?: number | string | Date;
    $lte?: number | string | Date;
    $in?: any[];
    $nin?: any[];
    $eq?: any;
    $ne?: any;
    $regex?: RegExp;
};

declare type QueryCondition = {
    [K: string]: QueryOperators | any;
};

declare function queryJSON<T>(data: T[], query: QueryCondition): T[];

export = queryJSON; 