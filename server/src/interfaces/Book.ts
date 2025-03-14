export default interface Book {
     bookId: string | null;
     title: string | null;
     authors?: string[] | null;
     description: string | null;
     image?: string | null;
     link?: string | null;
   }
   