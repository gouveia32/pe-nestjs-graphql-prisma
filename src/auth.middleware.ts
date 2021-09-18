import { Injectable, NestMiddleware, Request,Response,Headers } from '@nestjs/common';
import { AppLogger } from './app-logger/app-logger.module';
import { FirebaseService } from './firebase-admin/firebase.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly logger:AppLogger,
    private readonly app:FirebaseService,
    ){

  }
   async use(req:any, res:any, next: () => void) {
    
    const {headers} = req;
    if(headers&&headers.authorization){
      const [realm,token] = headers.authorization.split(' ');
     await this.app.admin.auth().verifySessionCookie(token,true)
      .then((claims)=>{
        req.auth = claims;
        this.logger.log(claims.uid,'AUTH')
      })
      .catch((e)=>{
        req.user=null;
      }).finally(()=>{
        next();
      })
    }else{
      next();
    }
 
  }
}
