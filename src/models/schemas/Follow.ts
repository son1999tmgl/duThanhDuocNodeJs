import { ObjectId } from 'mongodb';
import { UserVerifyStatus } from '~/constants/enum';

interface FollowerType {
  _id?: ObjectId;
  user_id: ObjectId;
  follower_user_id: ObjectId;
  created_at?: Date;
  updated_at?: Date;
}
export class Follower {
  _id: ObjectId;
  created_at: Date;
  updated_at: Date;
  user_id: ObjectId;
  follower_user_id: ObjectId;

  constructor(user: FollowerType) {
    this._id = user._id || new ObjectId();
    this.user_id = user.user_id || new ObjectId();
    this.follower_user_id = user.follower_user_id || new ObjectId();
    this.created_at = user.created_at || new Date();
    this.updated_at = user.updated_at || new Date();
  }
}
