import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';
import { User } from '~/models/schemas/User.schema';

class DatabaseService {
  private db: Db;
  private client: MongoClient;
  private uri: string;
  constructor() {
    this.uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@facebook.jhpjjkt.mongodb.net/?retryWrites=true&w=majority&appName=Facebook`;
    this.client = new MongoClient(this.uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });
    this.db = this.client.db(process.env.DB_NAME);
    this.connect();
  }

  async connect() {
    try {
      this.db = await this.client.db(process.env.DB_NAME);
      console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } finally {
      // await this.client.close();
    }
  }
  get users(): Collection<User> {
    return this.db.collection(process.env.USER_COLLECTION as string);
  }
}

export const databaseService = new DatabaseService();
