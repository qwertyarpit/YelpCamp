// here is the  function in which we will be catching our async function 

module.exports = func => {
    return (req,res,next) =>{
        func(req,res,next).catch(next);
    }
}