export default interface Context { 
     user: {
       username: string | null;
       email: string | null;
       _id: string | null;
     } | null;
   }
   