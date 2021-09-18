
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    ORGANIZATION = "ORGANIZATION"
}

export enum State {
    PENDING = "PENDING",
    REVIEW = "REVIEW",
    REJECTED = "REJECTED",
    APPROVED = "APPROVED",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED"
}

export class BidCreateInput {
    amount: number;
    timeflame: number;
    message?: string;
    attachments?: FileWhereUniqueInput[];
    order?: OrderWhereUniqueInput;
    state: State;
    job: JobWhereUniqueInput;
    author: UserWhereUniqueInput;
}

export class BidUpdateDataInput {
    amount?: number;
    timeflame?: number;
    message?: string;
    attachments?: FileUpdateOneInput[];
    order?: OrderUpdateOneInput;
    state?: State;
    job?: JobUpdateOneInput;
    author?: UserUpdateOneInput;
}

export class BidUpdateOneInput {
    create?: BidCreateInput;
    update?: BidUpdateDataInput;
    delete?: boolean;
    disconnect?: boolean;
    connect?: BidWhereUniqueInput;
}

export class BidWhereUniqueInput {
    id?: string;
}

export class InInput {
    in: number[];
}

export class WhereInput {
    id: string;
}

export class ExpertiseCreateInput {
    name: string;
    weight: number;
    picture?: FileWhereUniqueInput;
}

export class ExpertiseUpdateDataInput {
    name?: string;
    weight?: number;
    picture?: FileUpdateOneInput;
}

export class ExpertiseUpdateOneInput {
    create?: ExpertiseCreateInput;
    update?: ExpertiseUpdateDataInput;
    delete?: boolean;
    disconnect?: boolean;
    connect?: ExpertiseWhereUniqueInput;
}

export class ExpertiseWhereUniqueInput {
    id?: string;
    name?: string;
}

export class FileCreateInput {
    id?: string;
    path: string;
    filename: string;
    mimetype: string;
    encoding: string;
}

export class FileCreateOneInput {
    create?: FileCreateInput;
    connect?: FileWhereUniqueInput;
}

export class FileUpdateDataInput {
    path?: string;
    filename?: string;
    mimetype?: string;
    encoding?: string;
}

export class FileUpdateInput {
    path?: string;
    filename?: string;
    mimetype?: string;
    encoding?: string;
}

export class FileUpdateManyMutationInput {
    path?: string;
    filename?: string;
    mimetype?: string;
    encoding?: string;
}

export class FileUpdateOneInput {
    create?: FileCreateInput;
    update?: FileUpdateDataInput;
    upsert?: FileUpsertNestedInput;
    delete?: boolean;
    disconnect?: boolean;
    connect?: FileWhereUniqueInput;
}

export class FileUpdateOneRequiredInput {
    create?: FileCreateInput;
    update?: FileUpdateDataInput;
    upsert?: FileUpsertNestedInput;
    connect?: FileWhereUniqueInput;
}

export class FileUpsertNestedInput {
    update: FileUpdateDataInput;
    create: FileCreateInput;
}

export class FileWhereInput {
    id?: string;
    path?: string;
    filename?: string;
    mimetype?: string;
    encoding?: string;
    AND?: FileWhereInput[];
    OR?: FileWhereInput[];
    NOT?: FileWhereInput[];
}

export class FileWhereUniqueInput {
    id?: string;
    path?: string;
}

export class JobCreateInput {
    title: string;
    timeflame: number;
    body: string;
    attachments?: FileWhereUniqueInput[];
    expertise?: ExpertiseWhereUniqueInput[];
    author?: UserWhereUniqueInput;
    Bids?: BidWhereUniqueInput[];
}

export class JobUpdateDataInput {
    title?: string;
    timeflame?: number;
    body?: string;
    attachments?: FileUpdateOneInput[];
    expertise?: ExpertiseUpdateOneInput[];
    author?: UserUpdateOneInput;
    Bids?: BidUpdateOneInput[];
}

export class JobUpdateOneInput {
    create?: JobCreateInput;
    update?: JobUpdateDataInput;
    delete?: boolean;
    disconnect?: boolean;
    connect?: JobWhereUniqueInput;
}

export class JobWhereUniqueInput {
    id: string;
}

export class ChatCreateInput {
    subject?: string;
    published: boolean;
    author: UserWhereUniqueInput;
    members: UserWhereUniqueInput[];
    messages?: MessageWhereUniqueInput[];
}

export class ChatUpdateDataInput {
    subject?: string;
    published?: boolean;
    author?: UserUpdateOneInput;
    members?: UserUpdateOneInput[];
    messages?: MessageUpdateOneInput[];
}

export class ChatUpdateOneInput {
    create?: ChatCreateInput;
    update?: ChatUpdateDataInput;
    delete?: boolean;
    disconnect?: boolean;
    connect?: ChatWhereUniqueInput;
}

export class ChatWhereUniqueInput {
    id: string;
}

export class MessageCreateInput {
    published: boolean;
    isReply: boolean;
    body: string;
    author?: UserWhereUniqueInput;
    replies?: MessageWhereUniqueInput[];
    attachments?: FileWhereUniqueInput[];
}

export class MessageUpdateDataInput {
    published?: boolean;
    isReply?: boolean;
    body?: string;
    author?: UserUpdateOneInput;
    replies?: MessageUpdateOneInput[];
    attachments?: FileUpdateOneInput[];
}

export class MessageUpdateOneInput {
    create?: MessageCreateInput;
    update?: MessageUpdateDataInput;
    delete?: boolean;
    disconnect?: boolean;
    connect?: MessageWhereUniqueInput;
}

export class MessageWhereUniqueInput {
    id: string;
}

export class OrderCreateInput {
    item?: BidWhereUniqueInput;
    tokens: number;
    state?: State;
}

export class OrderUpdateDataInput {
    item?: BidUpdateOneInput;
    tokens?: number;
    state?: State;
}

export class OrderUpdateOneInput {
    create?: OrderCreateInput;
    update?: OrderUpdateDataInput;
    delete?: boolean;
    disconnect?: boolean;
    connect?: OrderWhereUniqueInput;
}

export class OrderWhereUniqueInput {
    id: string;
}

export class TokenOrderCreateInput {
    owner: UserWhereUniqueInput;
    transaction?: TransactionWhereUniqueInput;
    tokens: number;
    state?: State;
}

export class TokenOrderUpdateDataInput {
    owner?: UserUpdateOneInput;
    transaction?: TransactionUpdateOneInput;
    tokens?: number;
    state?: State;
}

export class TokenOrderUpdateOneInput {
    create?: TokenOrderCreateInput;
    update?: TokenOrderUpdateDataInput;
    delete?: boolean;
    disconnect?: boolean;
    connect?: TokenOrderWhereUniqueInput;
}

export class TokenOrderWhereUniqueInput {
    id: string;
}

export class TransactionCreateInput {
    state: State;
    externalTransRefId?: string;
    transRefId: string;
    amount: number;
    TokenOrder?: TokenOrderWhereUniqueInput;
}

export class TransactionUpdateDataInput {
    state?: State;
    externalTransRefId?: string;
    transRefId?: string;
    amount?: number;
    TokenOrder?: TokenOrderUpdateOneInput;
}

export class TransactionUpdateOneInput {
    create?: TransactionCreateInput;
    update?: TransactionUpdateDataInput;
    delete?: boolean;
    disconnect?: boolean;
    connect?: TransactionWhereUniqueInput;
}

export class TransactionWhereUniqueInput {
    id?: string;
    externalTransRefId?: string;
    transRefId?: string;
}

export class AuthInput {
    email: string;
    password: string;
    displayName?: string;
}

export class UserWhereUniqueInput {
    id?: string;
    email?: string;
    uid?: string;
}

export class UserUpdateDataInput {
    email?: string;
    displayName?: string;
    phoneNumber?: string;
    emailVerified?: boolean;
    disabled?: boolean;
    avator?: FileUpdateOneInput;
    role?: Role;
    expertise?: ExpertiseUpdateOneInput[];
    jobs?: JobUpdateOneInput[];
    bids?: BidUpdateOneInput[];
    chats?: ChatUpdateOneInput[];
    TokenOrder?: TokenOrderUpdateOneInput[];
}

export class UserUpdateOneInput {
    update?: UserUpdateDataInput;
    delete?: boolean;
    disconnect?: boolean;
    connect?: UserWhereUniqueInput;
}

export class Bid {
    id: string;
    amount: number;
    timeflame: number;
    message?: string;
    attachments: File[];
    order: Order;
    state: State;
    job: Job;
    author: User;
    createdAt: string;
    updatedAt: string;
}

export class Expertise {
    id: string;
    name: string;
    weight: number;
    picture?: File;
    jobs: Job[];
    users: User[];
    createdAt: string;
    updatedAt: string;
}

export class File {
    id: string;
    path: string;
    filename: string;
    mimetype: string;
    encoding: string;
    createdAt: string;
    updatedAt: string;
}

export class Job {
    id: string;
    title: string;
    timeflame: number;
    body: string;
    attachments?: File[];
    expertise: Expertise[];
    author: User;
    Bids: Bid[];
    createdAt: string;
    updatedAt: string;
}

export class Chat {
    id: string;
    subject?: string;
    published: boolean;
    author: User;
    members: User[];
    messages: Message[];
    createdAt: string;
    updatedAt: string;
}

export class Message {
    id: string;
    published: boolean;
    isReply: boolean;
    body: string;
    author: User;
    replies?: Message[];
    attachments: File[];
    createdAt: string;
    updatedAt: string;
}

export class Order {
    id: string;
    item: Bid;
    tokens: number;
    state: State;
    createdAt: string;
    updatedAt: string;
}

export class TokenOrder {
    id: string;
    owner: User;
    transaction: Transaction;
    tokens: number;
    state: State;
    updatedAt: string;
    createdAt: string;
}

export class Transaction {
    id: string;
    state: State;
    externalTransRefId?: string;
    transRefId: string;
    TokenOrder?: TokenOrder;
    amount: number;
    updatedAt: string;
    createdAt: string;
}

export abstract class IQuery {
    abstract version(): string | Promise<string>;

    abstract me(): User | Promise<User>;
}

export abstract class IMutation {
    abstract version(): string | Promise<string>;

    abstract signup(credentials?: AuthInput): AuthResult | Promise<AuthResult>;

    abstract signin(credentials?: AuthInput): AuthResult | Promise<AuthResult>;

    abstract editProfile(data?: UserUpdateDataInput): User | Promise<User>;
}

export abstract class ISubscription {
    abstract version(): string | Promise<string>;

    abstract message(userId: string): Message | Promise<Message>;
}

export class User {
    id?: number;
    uid: string;
    email: string;
    displayName: string;
    phoneNumber?: string;
    emailVerified: boolean;
    disabled: boolean;
    avator?: File;
    role: Role;
    expertise: Expertise[];
    jobs: Job[];
    bids: Bid[];
    chats: Chat[];
    TokenOrder: TokenOrder[];
    createdAt: string;
    updatedAt: string;
}

export class AuthResult {
    token?: string;
    error?: string;
    message?: string;
    user?: User;
}
