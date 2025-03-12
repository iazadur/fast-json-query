export type QueryOperators = {
  $gt?: number | string | Date;
  $lt?: number | string | Date;
  $gte?: number | string | Date;
  $lte?: number | string | Date;
  $in?: any[];
  $nin?: any[];
  $eq?: any;
  $ne?: any;
  $regex?: RegExp;
  $exists?: boolean;
  $type?: string;
  $size?: number;
  $contains?: any;
  $not?: QueryOperators;
};

export type QueryCondition = {
  [K: string]: QueryOperators | any;
  $or?: QueryCondition[];
  $and?: QueryCondition[];
}; 