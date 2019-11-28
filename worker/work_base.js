
const TIME_THREAD_DO = 1000

const threadDo = async (  data ) => {
    console.log("work demo ...")
}

//执行定时进程
function init(){
    setInterval(() => {
        threadDo()
    }, TIME_THREAD_DO);

} 

//////////////////////////////////////
//初始化
init()
