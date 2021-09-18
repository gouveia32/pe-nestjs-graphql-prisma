import {
  ResolveField,
  Resolver,
  Query,
  Mutation,
  Int,
  Args,
  Parent,
  Info,
  Context,
} from '@nestjs/graphql';
import { User, AuthInput, AuthResult, Role } from '../models/graphql';
import { UserService } from './user-service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(
    private readonly userService: UserService
    ) {}
  @Mutation((returns) => User)
  async signup(
    @Args('credentials', { type: () => AuthInput }) credentials: AuthInput,
    @Info() info,
    @Context() ctx
  ): Promise<AuthResult> {
   return this.userService.signup(credentials);
  }

  @Mutation((returns) => User)
  async signin(
    @Args('credentials', { type: () => AuthInput }) credentials: AuthInput,
  ): Promise<AuthResult> {
    return this.userService.signInWithEmail(credentials);
  }
}
