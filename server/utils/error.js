//next middle ware its control all the error fucntion that if any error it goes to next and give the error
export const errorhandler=(statuscode,message)=>{
const error=new Error();
error.statuscode=statuscode;
error.message=message;
return error;
}